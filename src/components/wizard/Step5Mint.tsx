"use client";

import { useEffect, useRef } from "react";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { decodeEventLog } from "viem";
import { TRACKS } from "@/lib/tracks";
import { useWizardStore } from "@/lib/store";
import {
  CONTRIBUTOR_CREDENTIAL_ADDRESS,
  TRACK_ENUM,
  contributorCredentialAbi,
} from "@/lib/contract";
import { monadTestnet } from "@/lib/chains";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";
import { BadgePreview } from "./BadgePreview";

export function Step5Mint() {
  const trackId = useWizardStore((s) => s.trackId);
  const proof = useWizardStore((s) => s.proof);
  const goToStep = useWizardStore((s) => s.goToStep);
  const reset = useWizardStore((s) => s.reset);
  const attestation = useWizardStore((s) => s.attestation);
  const attestationError = useWizardStore((s) => s.attestationError);
  const setAttestation = useWizardStore((s) => s.setAttestation);
  const setAttestationError = useWizardStore((s) => s.setAttestationError);
  const setMinted = useWizardStore((s) => s.setMinted);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const onWrongChain = isConnected && chainId !== monadTestnet.id;
  const trackIndex = trackId ? TRACK_ENUM[trackId] : undefined;

  const hasAutoMintedRef = useRef(false);
  const attestationRequestInFlightRef = useRef(false);

  const { data: alreadyMinted, refetch: refetchHasMinted } = useReadContract({
    address: CONTRIBUTOR_CREDENTIAL_ADDRESS,
    abi: contributorCredentialAbi,
    functionName: "hasMinted",
    args:
      address !== undefined && trackIndex !== undefined
        ? [address, trackIndex]
        : undefined,
    query: { enabled: Boolean(address) && trackIndex !== undefined },
  });

  const {
    writeContract,
    data: txHash,
    isPending: isMinting,
    error: writeError,
  } = useWriteContract();

  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const minted = Boolean(alreadyMinted) || isConfirmed;

  // Derived, not stored: "loading" is simply "conditions to fetch are met
  // and we don't have a result yet" — this reflects completion automatically
  // once setAttestation/setAttestationError land, with no extra setState.
  const isFetchingAttestation = Boolean(
    proof &&
      trackId &&
      address &&
      isConnected &&
      !onWrongChain &&
      !minted &&
      !attestation &&
      !attestationError
  );

  function requestMint(sig: { signature: `0x${string}`; deadline: string }) {
    if (trackIndex === undefined) return;
    writeContract({
      address: CONTRIBUTOR_CREDENTIAL_ADDRESS,
      abi: contributorCredentialAbi,
      functionName: "mint",
      args: [trackIndex, BigInt(sig.deadline), sig.signature],
    });
  }

  // Fetch a mint attestation from the backend once the wallet is connected,
  // on the right chain, and we have proof + a track — but only once (guarded
  // by a ref, since isFetchingAttestation itself doesn't change until the
  // fetch resolves and updates attestation/attestationError).
  useEffect(() => {
    if (!isFetchingAttestation || attestationRequestInFlightRef.current) return;
    attestationRequestInFlightRef.current = true;

    fetch("/api/attest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, track: trackId, proofLink: proof?.link }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "获取铸造授权失败");
        setAttestation({ signature: json.signature, deadline: json.deadline });
      })
      .catch((err: Error) => setAttestationError(err.message))
      .finally(() => {
        attestationRequestInFlightRef.current = false;
      });
  }, [
    isFetchingAttestation,
    proof,
    trackId,
    address,
    setAttestation,
    setAttestationError,
  ]);

  // Auto-fire the mint transaction exactly once, as soon as we have a valid
  // attestation and the wallet is ready. The wallet's own signature popup is
  // still the real consent step — this just skips the extra button click.
  useEffect(() => {
    if (
      hasAutoMintedRef.current ||
      !attestation ||
      !isConnected ||
      onWrongChain ||
      minted ||
      isMinting ||
      isConfirming
    ) {
      return;
    }
    hasAutoMintedRef.current = true;
    requestMint(attestation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attestation, isConnected, onWrongChain, minted, isMinting, isConfirming]);

  useEffect(() => {
    if (!isConfirmed || !receipt) return;
    refetchHasMinted();
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: contributorCredentialAbi,
          eventName: "CredentialMinted",
          data: log.data,
          topics: log.topics,
        });
        setMinted(decoded.args.tokenId.toString());
        break;
      } catch {
        continue;
      }
    }
  }, [isConfirmed, receipt, refetchHasMinted, setMinted]);

  if (!trackId) return null;
  const track = TRACKS[trackId];

  const canRetryMint = Boolean(writeError) && !isMinting && !isConfirming;

  function handleRetryMint() {
    if (!attestation) return;
    const deadlineExpired = Date.now() / 1000 > Number(attestation.deadline);
    if (deadlineExpired) {
      setAttestation(null);
      setAttestationError(null);
      return;
    }
    requestMint(attestation);
  }

  return (
    <div className="mx-auto max-w-2xl px-6">
      <div className="mb-10 text-center">
        <Tag dotColor={track.accent}>Step 5 · Mint on Monad</Tag>
        <h1 className="mt-4 font-serif-cjk text-3xl font-bold text-ink sm:text-4xl">
          铸造你的<span className="text-terracotta">Contributor Credential</span>
        </h1>
        <p className="mt-3 text-ink-soft">
          这是一个链上 NFT,证明你在 {track.name} 方向完成了一次真实贡献。
        </p>
      </div>

      <Card className="flex flex-col items-center gap-6 text-center">
        <BadgePreview trackId={track.id} trackName={track.name} />

        {minted ? (
          <div className="w-full space-y-3">
            <p className="font-medium text-navy">
              ✓ 你已经拥有这个方向的 Contributor Credential
            </p>
            {txHash && (
              <a
                href={`${monadTestnet.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-ink-soft underline decoration-line hover:text-navy"
              >
                在区块浏览器查看交易 →
              </a>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  reset();
                }}
              >
                体验另一个方向
              </Button>
            </div>
          </div>
        ) : !isConnected ? (
          <Button onClick={() => openConnectModal?.()}>连接钱包</Button>
        ) : onWrongChain ? (
          <Button
            onClick={() => switchChain({ chainId: monadTestnet.id })}
            disabled={isSwitching}
          >
            {isSwitching ? "切换中…" : "切换到 Monad Testnet"}
          </Button>
        ) : (
          <div className="w-full space-y-3">
            {isFetchingAttestation && (
              <p className="text-sm text-ink-soft">正在获取铸造授权…</p>
            )}
            {attestationError && (
              <div className="space-y-2">
                <p className="text-sm text-terracotta">{attestationError}</p>
                <Button
                  variant="secondary"
                  onClick={() => setAttestationError(null)}
                >
                  重新获取授权
                </Button>
              </div>
            )}
            {(isMinting || isConfirming) && (
              <p className="text-sm text-ink-soft">
                {isMinting ? "等待钱包确认…" : "铸造中…"}
              </p>
            )}
            {canRetryMint && (
              <div className="space-y-2">
                <p className="text-sm text-terracotta">
                  {writeError?.message.split("\n")[0]}
                </p>
                <Button onClick={handleRetryMint}>重试铸造</Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={() => goToStep(4)}>
          ← 返回提交
        </Button>
      </div>
    </div>
  );
}
