// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ContributorCredential} from "../src/ContributorCredential.sol";

contract Deploy is Script {
    function run() external returns (ContributorCredential) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address attestor = vm.envAddress("ATTESTOR_ADDRESS");

        vm.startBroadcast(deployerKey);
        ContributorCredential credential = new ContributorCredential(attestor);
        vm.stopBroadcast();

        console.log("ContributorCredential deployed at:", address(credential));
        return credential;
    }
}
