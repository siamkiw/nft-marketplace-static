// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;


interface INFT{

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function createToken(string memory tokenURI) external;

    function burnToken(uint tokenId) external;
}

