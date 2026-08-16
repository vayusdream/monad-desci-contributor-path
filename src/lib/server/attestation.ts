import "server-only";
import { privateKeyToAccount } from "viem/accounts";
import { MINT_EIP712_TYPES, CONTRIBUTOR_CREDENTIAL_ADDRESS } from "@/lib/contract";
import { monadTestnet } from "@/lib/chains";

const DEADLINE_WINDOW_SECONDS = 10 * 60;

export interface MintAttestation {
  deadline: string;
  signature: `0x${string}`;
}

/**
 * Signs an EIP-712 `Mint(to, track, deadline)` attestation matching
 * contracts/src/ContributorCredential.sol exactly — domain, types, and
 * struct field order must stay in lockstep with the contract or every
 * signature will fail ECDSA.recover on-chain.
 */
export async function signMintAttestation(
  to: `0x${string}`,
  track: number,
): Promise<MintAttestation> {
  const privateKey = process.env.ATTESTOR_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "ATTESTOR_PRIVATE_KEY is not configured — set it in .env.local (see .env.local.example)",
    );
  }

  const account = privateKeyToAccount(
    (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as `0x${string}`,
  );

  const deadline = BigInt(Math.floor(Date.now() / 1000) + DEADLINE_WINDOW_SECONDS);

  const signature = await account.signTypedData({
    domain: {
      name: "DeSci Contributor Credential",
      version: "1",
      chainId: monadTestnet.id,
      verifyingContract: CONTRIBUTOR_CREDENTIAL_ADDRESS,
    },
    types: MINT_EIP712_TYPES,
    primaryType: "Mint",
    message: { to, track, deadline },
  });

  return { deadline: deadline.toString(), signature };
}
