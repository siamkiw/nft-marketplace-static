// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./INFT.sol";
import "./NFT.sol";

contract NFTFusion is ReentrancyGuard {
    address payable owner;

    NFT nftContract;

    struct fusionDetail {
        uint256 baseItemId;
        uint256 ingredientItemId;
        address owner;
        address nftContract;
        uint256 itemId;
    }

    mapping(uint256 => fusionDetail) public fusionDetails;
    uint256 public fusionIndex;

    constructor(NFT _nftContract) {
        owner = payable(msg.sender);
        nftContract = _nftContract;
    }

    event FusionNFT(
        uint256 baseItemId,
        uint256 ingredientItemId,
        address owner,
        address nftContract,
        uint256 itemId
    );

    function fusionNFT(
        uint256 baseItemId,
        uint256 ingredientItemId,
        string memory tokenURI
    ) public returns (uint256) {
        nftContract.burnToken(baseItemId);
        nftContract.burnToken(ingredientItemId);
        uint256 itemId = nftContract.createToken(tokenURI);
        nftContract.transferFrom(address(this), msg.sender, itemId);
        // INFT(nftContract).burnToken(baseItemId);
        // INFT(nftContract).burnToken(ingredientItemId);

        // INFT(nftContract).createToken(tokenURI);

        fusionDetails[fusionIndex] = fusionDetail(
            baseItemId,
            ingredientItemId,
            msg.sender,
            address(nftContract),
            itemId
        );
        fusionIndex++;

        emit FusionNFT(
            baseItemId,
            ingredientItemId,
            msg.sender,
            address(nftContract),
            itemId
        );

        return itemId;
    }
}
