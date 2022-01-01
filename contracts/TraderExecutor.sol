//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "./interfaces/IUniswapV2Pair.sol";

contract TraderExecutor {
    struct Call {
        address target;
        bytes data;
    }

    function arbTradeFlash(
        address firstPool,
        uint amount0,
        uint amount1,
        Call[] calldata calls
    ) external {
        IUniswapV2Pair(firstPool).swap(amount0, amount1, address(this), abi.encode(calls));
    }

    function execute(Call[] memory calls) internal {
        for(uint256 i; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(calls[i].data);
            require(success, string(ret));
        }
    }

    function pangolinCall(address, uint, uint, bytes calldata data) external {
        execute(abi.decode(data, (Call[])));
    }
    function uniswapV2Call(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function joeCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function partyCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function lydiaCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function canaryCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function baguetteCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function yetiswapCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function oliveCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
    function elkCall(address, uint, uint, bytes calldata data) external  {
        execute(abi.decode(data, (Call[])));
    }
}