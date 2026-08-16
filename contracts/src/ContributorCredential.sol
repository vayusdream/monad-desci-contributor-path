// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title ContributorCredential
/// @notice Soulbound-ish on-chain NFT issued to DeSci contributors after they
///         complete a real, small task in one of four tracks. Metadata and
///         artwork are generated fully on-chain (no IPFS dependency) so the
///         credential is self-contained and always resolvable.
contract ContributorCredential is ERC721, EIP712 {
    enum Track {
        Research,
        Science,
        Builder,
        Community
    }

    struct Credential {
        Track track;
        uint64 mintedAt;
    }

    uint256 public nextTokenId = 1;

    /// @notice Backend address whose EIP-712 signature is required to mint.
    ///         Fixed at deploy time — a review backend signs an attestation
    ///         per (address, track) after the user submits contribution
    ///         proof on the site, so mint can no longer be called directly
    ///         against the contract while skipping the site.
    address public immutable attestor;

    mapping(uint256 => Credential) public credentials;
    mapping(address => mapping(Track => bool)) public hasMinted;

    string[4] private trackNames = ["Research", "Science", "Builder", "Community"];
    string[4] private trackColors = ["#1e3a5c", "#3f6b45", "#c0532d", "#8a5a9e"];

    bytes32 private constant MINT_TYPEHASH =
        keccak256("Mint(address to,uint8 track,uint256 deadline)");

    error AlreadyMinted();
    error InvalidSignature();
    error SignatureExpired();

    event CredentialMinted(address indexed to, uint256 indexed tokenId, Track track);

    constructor(address _attestor)
        ERC721("DeSci Contributor Credential", "DESCI")
        EIP712("DeSci Contributor Credential", "1")
    {
        attestor = _attestor;
    }

    /// @notice Mint a Contributor Credential for `track`. One per address per
    ///         track. Requires a valid EIP-712 `Mint` attestation signed by
    ///         `attestor`, issued by the review backend after the user
    ///         submits contribution proof on the site.
    function mint(Track track, uint256 deadline, bytes calldata signature)
        external
        returns (uint256 tokenId)
    {
        if (block.timestamp > deadline) revert SignatureExpired();

        bytes32 structHash = keccak256(abi.encode(MINT_TYPEHASH, msg.sender, uint8(track), deadline));
        address signer = ECDSA.recover(_hashTypedDataV4(structHash), signature);
        if (signer != attestor) revert InvalidSignature();

        if (hasMinted[msg.sender][track]) revert AlreadyMinted();

        tokenId = nextTokenId++;
        credentials[tokenId] = Credential({track: track, mintedAt: uint64(block.timestamp)});
        hasMinted[msg.sender][track] = true;

        _safeMint(msg.sender, tokenId);
        emit CredentialMinted(msg.sender, tokenId, track);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        Credential memory c = credentials[tokenId];
        string memory name = trackNames[uint256(c.track)];
        string memory color = trackColors[uint256(c.track)];

        string memory json = string(
            abi.encodePacked(
                '{"name":"DeSci Contributor Credential #',
                Strings.toString(tokenId),
                '","description":"On-chain proof of a real DeSci contribution, issued on Monad.",',
                '"attributes":[{"trait_type":"Track","value":"',
                name,
                '"},{"trait_type":"Minted At","value":',
                Strings.toString(c.mintedAt),
                "}],",
                '"image":"data:image/svg+xml;base64,',
                Base64.encode(bytes(_buildSVG(name, color, tokenId))),
                '"}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _buildSVG(string memory name, string memory color, uint256 tokenId)
        private
        pure
        returns (string memory)
    {
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">',
                '<rect width="480" height="480" fill="#f5f2ea"/>',
                '<rect x="16" y="16" width="448" height="448" fill="none" stroke="',
                color,
                '" stroke-width="2"/>',
                '<text x="40" y="72" font-family="monospace" font-size="13" letter-spacing="1" fill="#57534a">',
                "DESCI CONTRIBUTOR CREDENTIAL</text>",
                '<circle cx="424" cy="56" r="8" fill="',
                color,
                '"/>',
                '<text x="40" y="250" font-family="Georgia, serif" font-size="52" font-weight="700" fill="',
                color,
                '">',
                name,
                "</text>",
                '<text x="40" y="286" font-family="monospace" font-size="13" fill="#57534a">TOKEN #',
                Strings.toString(tokenId),
                "</text>",
                '<line x1="40" y1="400" x2="440" y2="400" stroke="#ddd6c7" stroke-width="1"/>',
                '<text x="40" y="430" font-family="monospace" font-size="12" fill="#57534a">MINTED ON MONAD</text>',
                "</svg>"
            )
        );
    }
}
