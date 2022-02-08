// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    address fusionAddress;

    constructor(address marketplaceAddress, address _fusionAddress) ERC721("Metaverse Tokens", "METT"){
        contractAddress = marketplaceAddress;
        fusionAddress = _fusionAddress;
        setApprovalForAll(contractAddress, true);
        setApprovalForAll(fusionAddress, true);
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function burnToken(uint tokenId) public returns (uint) {
        _burn(tokenId);
        
        return tokenId;
    }
}