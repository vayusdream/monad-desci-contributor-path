import { TrackId } from "./tracks";

/**
 * Deployed via contracts/script/Deploy.s.sol — paste the address here after
 * `forge script script/Deploy.s.sol --rpc-url monad_testnet --broadcast`.
 */
export const CONTRIBUTOR_CREDENTIAL_ADDRESS = (process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const TRACK_ENUM: Record<TrackId, number> = {
  research: 0,
  science: 1,
  builder: 2,
  community: 3,
};

export const contributorCredentialAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [{ name: "track", type: "uint8" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "function",
    name: "hasMinted",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint8" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "CredentialMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "track", type: "uint8", indexed: false },
    ],
  },
] as const;
