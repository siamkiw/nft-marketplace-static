// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Owner is Ownable {
    mapping(address => bool) private _approvals;

    event UpdateApprovals(
        address sender,
        address contractAddress,
        bool approved
    );

    function updateApprovals(address contractAddress, bool approved)
        public
        onlyOwner
    {
        _approvals[contractAddress] = approved;

        emit UpdateApprovals(msg.sender, contractAddress, approved);
    }

    function isApproved(address contractAddress) public view returns (bool) {
        return _approvals[contractAddress];
    }
}
