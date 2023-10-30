// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

//Mumbai = 0xd9486EC845c26F1f1c4AF4675c47B3ea09aac508

//Remix = 0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99


contract OTONFT is ERC1155 {
    address public oneToOneContract;
    mapping(uint256 => uint256) public mentorIdToTotalNftSupply;
    mapping(uint256 => string) public idToMetadata;
    mapping(uint256 => mapping(address => bool)) public mentorToOwner;

    constructor() ERC1155("https://your-metadata-uri.com/{id}") {}

    function initializeOneToOneContract(address _oneToOneContract) external {
        oneToOneContract = _oneToOneContract;
    }

    function updateTotalNftSupply(uint256 mentorId, uint256 newSupply) external {
        require(msg.sender == oneToOneContract, "Not authorized");
        mentorIdToTotalNftSupply[mentorId] = newSupply;
    }

    function mint(address account, uint256 mentorId) external {
        require(mentorIdToTotalNftSupply[mentorId] > 0, "No NFT supply left");
        require(!mentorToOwner[mentorId][account], "Already owns NFT");
        mentorIdToTotalNftSupply[mentorId]--;
        mentorToOwner[mentorId][account] = true;
        _mint(account, mentorId, 1, "");
    }

    function addMetadata(uint256 mentorId, string memory metadata) external {
        require(bytes(idToMetadata[mentorId]).length == 0, "Metadata already exists");
        idToMetadata[mentorId] = metadata;
    }
}