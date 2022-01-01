//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./LowGasSafeMath.sol";

/**
* Trading contract for trading on uniswap-like pools.
* This version will trace out and exact execution plan, and the user will use the TraderExecutor
* To run the trace. This is a much more gas efficient way of executing trades, but is not always feasible because
* of time constraints
*/

contract TraderSimulator {
    using LowGasSafeMath for uint;

    struct Call {
        address target;
        bytes data;
    }

    Call[16] private calls;
    uint private ptr = 0;

    function traceCall(address target, bytes memory data) internal {
        calls[ptr++] = Call(target, data);
        (bool success, bytes memory out) = target.call(data);
        require(success, string(out));
    }


   function getAllReserves(address[] memory path, uint directions) internal view returns (uint[] memory out) {
       out = new uint[](path.length * 2);
       for (uint i; i < path.length; i++) {
           (uint reserve0, uint reserve1,) = IUniswapV2Pair(path[i]).getReserves();
           if ((directions & (1 << i)) != 0) {
               out[i * 2] = reserve0;
               out[i * 2 + 1] = reserve1;
           } else {
               out[i * 2] = reserve1;
               out[i * 2 + 1] = reserve0;
           }
       }
   }

   function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

   function getOptimalAmountRes(uint[] memory reserves) internal pure returns (uint optimal) {
       (uint Ea, uint Eb) = (0, 0);
       {
           (uint Ra, uint Rb) = (reserves[0], reserves[1]);
           (uint Rb1, uint Rc) = (reserves[2], reserves[3]);
           Ea = (1000*Ra*Rb1)/(1000*Rb1+997*Rb);
           Eb = (997*Rb*Rc)/(1000*Rb1+997*Rb);
       }
       for (uint i=4; i < reserves.length; i+=2) {
           uint Rb = Eb;
           (uint Rb1, uint Rc) = (reserves[i], reserves[i + 1]);
           Ea = (1000*Ea*Rb1)/(1000*Rb1+997*Rb);
           Eb = (997*Rb*Rc)/(1000*Rb1+997*Rb);
       }
    
       if (Ea > Eb) {
           optimal = 0;
       } else {
           optimal = Ea * Eb * 997 * 1000;
           uint z = (optimal + 1) / 2;
           uint y = optimal;
           while (z < y) {
               y = z;
               z = (optimal / z + z) / 2;
           }
           optimal = (y - Ea * 1000) / 997;
       }
   }

   function arbTradeFlash(
       uint directions,
       address[] calldata path,
       address outToken
   )
       external returns (uint256, Call[16] memory)
   {
        uint[] memory reserves = getAllReserves(path, directions);
        uint inputNeededForFirstTrade = getOptimalAmountRes(reserves);
        (uint ina, uint outa) = directions & 1 != 0 ?
            (uint(0), getAmountOut(inputNeededForFirstTrade, reserves[0], reserves[1])) :
            (getAmountOut(inputNeededForFirstTrade, reserves[0], reserves[1]), uint(0));
        {
            bytes memory encoded = abi.encode(reserves, directions, path, inputNeededForFirstTrade);

            traceCall(path[0], abi.encodeWithSelector(IUniswapV2Pair(path[0]).swap.selector, ina, outa, address(this), encoded));
        }
        uint256 out = ERC20(outToken).balanceOf(address(this));
        traceCall(outToken, abi.encodeWithSelector(ERC20(outToken).transfer.selector, msg.sender, out));
        return (out, calls);
   }

   function cbInner(uint amount0, uint amount1, bytes calldata data) internal {
        (uint[] memory reserves, uint directions, address[] memory path, uint amountToRepay) = abi.decode(data, (uint[], uint, address[], uint));
        (address startToken, address endToken) = amount0 != 0 ? (IUniswapV2Pair(msg.sender).token0(), IUniswapV2Pair(msg.sender).token1()) :
                                                                (IUniswapV2Pair(msg.sender).token1(), IUniswapV2Pair(msg.sender).token0());
        traceCall(startToken, abi.encodeWithSelector(ERC20(startToken).transfer.selector, path[1], amount0 + amount1));
        for (uint i = 1; i < path.length; i++) {
           IUniswapV2Pair pair = IUniswapV2Pair(path[i]);
           uint amountInput;
           uint amountOutput;
           {
            address input = (directions & (1 << i)) != 0 ? pair.token0() : pair.token1();
            (uint reserveInput, uint reserveOutput) = (reserves[i * 2], reserves[i * 2 + 1]);
            amountInput = IERC20(input).balanceOf(path[i]).sub(reserveInput);
            amountOutput = getAmountOut(amountInput, reserveInput, reserveOutput);
           }
           (uint amount0Out, uint amount1Out) = (directions & (1 << i)) != 0 ? (uint(0), amountOutput) : (amountOutput, uint(0));
           address to = i == path.length - 1 ? address(this) : path[i + 1];

           traceCall(path[i], abi.encodeWithSelector(pair.swap.selector, amount0Out, amount1Out, to, new bytes(0)));
        }
        traceCall(endToken, abi.encodeWithSelector(ERC20(endToken).transfer.selector, msg.sender, amountToRepay));
    }
    function pangolinCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function uniswapV2Call(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function joeCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function partyCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function lydiaCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function canaryCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function baguetteCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function yetiswapCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function oliveCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
    function elkCall(address, uint amount0, uint amount1, bytes calldata data) external {
        cbInner(amount0, amount1, data);
    }
}