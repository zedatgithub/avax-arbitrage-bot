//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
interface IWETH9 is IERC20 {

    function deposit() external payable;

    function withdraw(uint wad) external;

}