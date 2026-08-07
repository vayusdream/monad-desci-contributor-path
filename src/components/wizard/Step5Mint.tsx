"use client";

import { useEffect } from "react";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
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
  const goToStep = useWizardStore((s) => s.goToStep);
  const reset = useWizardStore((s) => s.reset);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const onWrongChain = isConnected && chainId !== monadTestnet.id;
  const trackIndex = trackId ? TRACK_ENUM[trackId] : undefined;

  const { data: alreadyMinted } = useReadContract({
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

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    // no-op placeholder for future: could refetch hasMinted after confirm
  }, [isConfirmed]);

  if (!trackId) return null;
  const track = TRACKS[trackId];

  const minted = Boolean(alreadyMinted) || isConfirmed;

  function handleMint() {
    if (trackIndex === undefined) return;
    writeContract({
      address: CONTRIBUTOR_CREDENTIAL_ADDRESS,
      abi: contributorCredentialAbi,
      functionName: "mint",
      args: [trackIndex],
    });
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
        <BadgePreview
          trackName={track.name}
          accent={track.accent}
        />

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
            <Button
              onClick={handleMint}
              disabled={isMinting || isConfirming}
              className="w-full sm:w-auto"
            >
              {isMinting
                ? "等待钱包确认…"
                : isConfirming
                  ? "铸造中…"
                  : "在 Monad 上铸造"}
            </Button>
            {writeError && (
              <p className="text-sm text-terracotta">
                {writeError.message.split("\n")[0]}
              </p>
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
