// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

interface INFT {

    function createToken(string memory tokenURI) external;

    function burnToken(uint tokenId) external;
}

