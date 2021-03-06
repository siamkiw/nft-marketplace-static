// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./Owner.sol";

contract NFTMarket is ReentrancyGuard, Owner {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsDelete;

    address payable ownerAddress;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        ownerAddress = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable ownerAddress;
        uint256 price;
        bool sold;
        bool isDelete;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address ownerAddress,
        uint256 price,
        bool sold,
        bool isDelete
    );

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Places an item for sale on the marketplace */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false,
            false
        );
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownerAddressship of the item, as well as funds between parties */
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].ownerAddress = payable(msg.sender);
        idToMarketItem[itemId].sold = true;

        deleteMarketItem(nftContract, itemId);

        _itemsSold.increment();
        payable(ownerAddress).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].ownerAddress == address(0) &&
                idToMarketItem[i + 1].isDelete == false
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].ownerAddress == address(0) &&
                idToMarketItem[i + 1].isDelete == false
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns onlyl items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].ownerAddress == msg.sender &&
                idToMarketItem[i + 1].isDelete == false
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].ownerAddress == msg.sender &&
                idToMarketItem[i + 1].isDelete == false
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has created */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].seller == msg.sender &&
                idToMarketItem[i + 1].isDelete == false
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].seller == msg.sender &&
                idToMarketItem[i + 1].isDelete == false
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    event DeleteMarketItem(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address ownerAddress,
        uint256 price,
        bool sold,
        bool isDelete
    );

    function isMarketItem(uint256 tokenId) public view returns (bool) {
        uint256 totalItemCount = _itemIds.current();

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                if (idToMarketItem[i + 1].isDelete == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    function deleteMarketItem(address nftContract, uint256 itemId)
        public
        returns (uint256)
    {
        require(
            idToMarketItem[itemId].ownerAddress == msg.sender ||
                isApproved(msg.sender) == true,
            "This item is not your."
        );
        require(idToMarketItem[itemId].sold == true, "This item is not sold.");
        require(
            idToMarketItem[itemId].isDelete == false,
            "This item is already deleted."
        );

        idToMarketItem[itemId].isDelete = true;

        _itemsDelete.increment();
        emit DeleteMarketItem(
            idToMarketItem[itemId].itemId,
            nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].seller,
            idToMarketItem[itemId].ownerAddress,
            idToMarketItem[itemId].price,
            idToMarketItem[itemId].sold,
            idToMarketItem[itemId].isDelete
        );

        return idToMarketItem[itemId].itemId;
    }

    function getMarketIdByToken(uint256 tokenId) public view returns (uint256) {
        uint256 totalItemCount = _itemIds.current();
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                return idToMarketItem[i + 1].itemId;
            }
        }
        return 0;
    }
}
