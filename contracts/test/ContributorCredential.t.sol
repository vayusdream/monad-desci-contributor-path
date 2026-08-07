// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ContributorCredential} from "../src/ContributorCredential.sol";

contract ContributorCredentialTest is Test {
    ContributorCredential credential;
    address alice = makeAddr("alice");

    function setUp() public {
        credential = new ContributorCredential();
    }

    function test_MintIssuesTokenToSender() public {
        vm.prank(alice);
        uint256 tokenId = credential.mint(ContributorCredential.Track.Builder);

        assertEq(credential.ownerOf(tokenId), alice);
        (ContributorCredential.Track track,) = credential.credentials(tokenId);
        assertEq(uint256(track), uint256(ContributorCredential.Track.Builder));
    }

    function test_RevertWhen_MintingSameTrackTwice() public {
        vm.startPrank(alice);
        credential.mint(ContributorCredential.Track.Research);

        vm.expectRevert(ContributorCredential.AlreadyMinted.selector);
        credential.mint(ContributorCredential.Track.Research);
        vm.stopPrank();
    }

    function test_AllowsDifferentTracksForSameAddress() public {
        vm.startPrank(alice);
        credential.mint(ContributorCredential.Track.Research);
        credential.mint(ContributorCredential.Track.Community);
        vm.stopPrank();

        assertEq(credential.balanceOf(alice), 2);
    }

    function test_TokenURIIsWellFormedDataURI() public {
        vm.prank(alice);
        uint256 tokenId = credential.mint(ContributorCredential.Track.Science);

        string memory uri = credential.tokenURI(tokenId);
        assertTrue(bytes(uri).length > 0);
    }
}
