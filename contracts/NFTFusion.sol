// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./INFT.sol";

contract NFTFusion is ReentrancyGuard {
    address payable owner;

    struct fusionDetail {
        uint baseItemId;
        uint ingredientItemId;
        address owner;
        address nftContract;
    }

    mapping(uint => fusionDetail) public fusionDetails;
    uint public fusionIndex;

    constructor() {
        owner = payable(msg.sender);
    }

    function fusionNFT(address nftContract, uint baseItemId, uint ingredientItemId, string memory tokenURI) public {
        INFT(nftContract).burnToken(baseItemId);
        INFT(nftContract).burnToken(ingredientItemId);

        INFT(nftContract).createToken(tokenURI);

        fusionDetails[fusionIndex] = fusionDetail(
            baseItemId,
            ingredientItemId,
            msg.sender,
            nftContract
        );

        fusionIndex++ ;
    }

}