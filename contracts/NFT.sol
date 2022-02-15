// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    mapping(uint256 => bool) public _burnToken;

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
        setApprovalForAll(contractAddress, true);
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function burnToken(uint256 tokenId) public returns (uint256) {
        _burn(tokenId);

        _burnToken[tokenId] = true;

        return tokenId;
    }

    function fetchMyNFTs() public view returns (uint256[] memory) {
        uint256 currentIndex = 0;
        uint256 totalItemCount = _tokenIds.current();
        uint256 myItmeCount = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (!_burnToken[i + 1]) {
                if (ownerOf(i + 1) == msg.sender) {
                    myItmeCount += 1;
                }
            }
        }

        uint256[] memory items = new uint256[](myItmeCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (!_burnToken[i + 1]) {
                if (ownerOf(i + 1) == msg.sender) {
                    items[currentIndex] = i + 1;
                    currentIndex += 1;
                }
            }
        }

        return items;
    }
}
