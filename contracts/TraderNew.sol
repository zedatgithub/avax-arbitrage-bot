//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./LowGasSafeMath.sol";

contract TraderNew {
    using LowGasSafeMath for uint;

   function arbTradeFlash(
       uint inputNeededForFirstTrade,
       uint[] calldata inputs,
       address[] calldata pools,
       uint[] calldata reserves,
       address outToken
   )
       external returns (uint256)
   {
        for (uint i; i < pools.length;i++) {
            (uint r0, uint r1,) = IUniswapV2Pair(pools[i]).getReserves();
            require(reserves[i] == r0 * r1, "FAIL:N");
        }
        bytes memory encoded = abi.encode(inputs, pools, inputNeededForFirstTrade);
        IUniswapV2Pair(pools[0]).swap(inputs[0], inputs[1], address(this), encoded);
        uint256 out = ERC20(outToken).balanceOf(address(this));
        ERC20(outToken).transfer(msg.sender, out);
        return out;
   }

   function cbInner(uint amount0, uint amount1, bytes calldata data) internal {
        (uint[] memory inputs, address[] memory pools, uint inputNeededForFirstTrade) = abi.decode(data, (uint[], address[], uint));
        (address startToken, address endToken) = amount0 != 0 ? (IUniswapV2Pair(msg.sender).token0(), IUniswapV2Pair(msg.sender).token1()) :
                                                                (IUniswapV2Pair(msg.sender).token1(), IUniswapV2Pair(msg.sender).token0());
        ERC20(startToken).transfer(pools[1], amount0 + amount1);
        for (uint i = 1; i < pools.length; i++) {
           IUniswapV2Pair pair = IUniswapV2Pair(pools[i]);
           pair.swap(inputs[i * 2], inputs[i * 2 + 1], i == pools.length - 1 ? address(this) : pools[i + 1], new bytes(0));
        }

        ERC20(endToken).transfer(msg.sender, inputNeededForFirstTrade);
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