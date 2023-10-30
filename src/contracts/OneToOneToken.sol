// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//Mumbai = 0xCaE82a239eB417f635d449430A20AC1039Dd586E

//Remix = 0xd9145CCE52D386f254917e481eB44e9943F39138

contract OTO_Token is ERC20 {
    constructor() ERC20("OTO Token", "OTO") {
        _mint(msg.sender, 1000000 * 10**18);  // Minting 1 million tokens to the contract deployer
    }
}