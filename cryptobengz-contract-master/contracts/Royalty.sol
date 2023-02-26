// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Royalty is Ownable {
    address public artistAddress;
    address public ownerAddress;

    constructor() {
        ownerAddress = msg.sender;
    }

    function setArtistAddress(address _artistAddress) external onlyOwner {
        artistAddress = _artistAddress;
    }

    function setOwnerAddress(address _ownerAddress) external onlyOwner {
        ownerAddress = _ownerAddress;
    }

    function withdrawAmount(uint256 amount_) external onlyOwner {
        require(address(this).balance >= amount_, "Insufficient balance");

        withdraw(amount_);
    }

    function withdrawAll() external onlyOwner {
        require(address(this).balance > 0, "Zero Balace");

        withdraw(address(this).balance);
    }

    function withdraw(uint256 amount_) internal {
        (bool artistStatus, ) = payable(artistAddress).call{
            value: (amount_ * 12) / 100
        }("");
        require(artistStatus);

        (bool ownerStatus, ) = payable(ownerAddress).call{
            value: (amount_ * 88) / 100
        }("");
        require(ownerStatus);
    }
}
