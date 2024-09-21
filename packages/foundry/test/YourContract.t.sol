// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Lending.sol";

contract YourContractTest is Test {
    Lending public lending;

    function setUp() public {
        lending = new Lending();
    }

    function testMessageOnDeployment() public view {}

    function testSetNewMessage() public {}
}
