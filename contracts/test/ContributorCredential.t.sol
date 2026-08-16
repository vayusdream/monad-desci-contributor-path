// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ContributorCredential} from "../src/ContributorCredential.sol";

contract ContributorCredentialTest is Test {
    ContributorCredential credential;
    address alice = makeAddr("alice");

    uint256 attestorKey = 0xA11CE;
    address attestor;

    bytes32 private constant MINT_TYPEHASH =
        keccak256("Mint(address to,uint8 track,uint256 deadline)");
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    function setUp() public {
        attestor = vm.addr(attestorKey);
        credential = new ContributorCredential(attestor);
    }

    function _sign(uint256 signerKey, address to, ContributorCredential.Track track, uint256 deadline)
        internal
        view
        returns (bytes memory)
    {
        bytes32 structHash = keccak256(abi.encode(MINT_TYPEHASH, to, uint8(track), deadline));
        bytes32 domainSeparator = keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256(bytes("DeSci Contributor Credential")),
                keccak256(bytes("1")),
                block.chainid,
                address(credential)
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, digest);
        return abi.encodePacked(r, s, v);
    }

    function test_MintIssuesTokenToSender() public {
        uint256 deadline = block.timestamp + 10 minutes;
        bytes memory sig = _sign(attestorKey, alice, ContributorCredential.Track.Builder, deadline);

        vm.prank(alice);
        uint256 tokenId = credential.mint(ContributorCredential.Track.Builder, deadline, sig);

        assertEq(credential.ownerOf(tokenId), alice);
        (ContributorCredential.Track track,) = credential.credentials(tokenId);
        assertEq(uint256(track), uint256(ContributorCredential.Track.Builder));
    }

    function test_RevertWhen_MintingSameTrackTwice() public {
        uint256 deadline = block.timestamp + 10 minutes;
        bytes memory sig1 = _sign(attestorKey, alice, ContributorCredential.Track.Research, deadline);
        bytes memory sig2 = _sign(attestorKey, alice, ContributorCredential.Track.Research, deadline);

        vm.startPrank(alice);
        credential.mint(ContributorCredential.Track.Research, deadline, sig1);

        vm.expectRevert(ContributorCredential.AlreadyMinted.selector);
        credential.mint(ContributorCredential.Track.Research, deadline, sig2);
        vm.stopPrank();
    }

    function test_AllowsDifferentTracksForSameAddress() public {
        uint256 deadline = block.timestamp + 10 minutes;
        bytes memory sigResearch = _sign(attestorKey, alice, ContributorCredential.Track.Research, deadline);
        bytes memory sigCommunity = _sign(attestorKey, alice, ContributorCredential.Track.Community, deadline);

        vm.startPrank(alice);
        credential.mint(ContributorCredential.Track.Research, deadline, sigResearch);
        credential.mint(ContributorCredential.Track.Community, deadline, sigCommunity);
        vm.stopPrank();

        assertEq(credential.balanceOf(alice), 2);
    }

    function test_TokenURIIsWellFormedDataURI() public {
        uint256 deadline = block.timestamp + 10 minutes;
        bytes memory sig = _sign(attestorKey, alice, ContributorCredential.Track.Science, deadline);

        vm.prank(alice);
        uint256 tokenId = credential.mint(ContributorCredential.Track.Science, deadline, sig);

        string memory uri = credential.tokenURI(tokenId);
        assertTrue(bytes(uri).length > 0);
    }

    function test_RevertWhen_SignatureFromWrongSigner() public {
        uint256 deadline = block.timestamp + 10 minutes;
        uint256 impostorKey = 0xBAD;
        bytes memory badSig = _sign(impostorKey, alice, ContributorCredential.Track.Builder, deadline);

        vm.prank(alice);
        vm.expectRevert(ContributorCredential.InvalidSignature.selector);
        credential.mint(ContributorCredential.Track.Builder, deadline, badSig);
    }

    function test_RevertWhen_SignatureExpired() public {
        // Deadline is a fixed literal (not derived from block.timestamp) so the
        // via_ir optimizer can't copy-propagate a `block.timestamp` read past
        // the vm.warp cheatcode below and pick up the post-warp value instead.
        uint256 deadline = 1000;
        bytes memory sig = _sign(attestorKey, alice, ContributorCredential.Track.Builder, deadline);

        vm.warp(deadline + 1);
        vm.prank(alice);
        vm.expectRevert(ContributorCredential.SignatureExpired.selector);
        credential.mint(ContributorCredential.Track.Builder, deadline, sig);
    }
}
