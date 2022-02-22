// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./INFT.sol";
import "./NFT.sol";
import "./NFTMarket.sol";

contract NFTFusion is ReentrancyGuard {
    address payable owner;

    NFT nftContract;
    address nftContractAddress;

    NFTMarket nftMarketContract;
    address nftMarketContractAddress;

    struct fusionDetail {
        uint256 baseItemId;
        uint256 ingredientItemId;
        address owner;
        address nftContract;
        uint256 itemId;
    }

    mapping(uint256 => fusionDetail) public fusionDetails;
    uint256 public fusionIndex;

    constructor(NFT _nftContract, NFTMarket _nftMarketContract) {
        owner = payable(msg.sender);
        nftContract = _nftContract;
        nftContractAddress = address(_nftContract);
        nftMarketContract = _nftMarketContract;
        nftMarketContractAddress = address(_nftMarketContract);
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
        require(
            nftContract.ownerOf(baseItemId) == msg.sender,
            "You are not owner of item."
        );
        require(
            nftContract.ownerOf(ingredientItemId) == msg.sender,
            "You are not owner of item."
        );

        nftContract.burnToken(baseItemId);
        nftContract.burnToken(ingredientItemId);

        uint256 baseItemMarketId = nftMarketContract.getMarketIdByToken(
            baseItemId
        );
        uint256 ingredientItemMarketId = nftMarketContract.getMarketIdByToken(
            ingredientItemId
        );

        if (baseItemId != 0) {
            nftMarketContract.deleteMarketItem(
                nftMarketContractAddress,
                baseItemMarketId
            );
        }

        if (ingredientItemMarketId != 0) {
            nftMarketContract.deleteMarketItem(
                nftMarketContractAddress,
                ingredientItemMarketId
            );
        }

        uint256 itemId = nftContract.createToken(tokenURI);
        nftContract.transferFrom(address(this), msg.sender, itemId);

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
