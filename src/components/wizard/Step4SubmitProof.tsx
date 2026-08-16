"use client";

import { FormEvent, useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TRACKS } from "@/lib/tracks";
import { TRACK_ENUM } from "@/lib/contract";
import { useWizardStore } from "@/lib/store";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";

export function Step4SubmitProof() {
  const trackId = useWizardStore((s) => s.trackId);
  const goToStep = useWizardStore((s) => s.goToStep);
  const submitProof = useWizardStore((s) => s.submitProof);
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [formDone, setFormDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!trackId) return null;
  const track = TRACKS[trackId];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!link.trim() || !/^https?:\/\//.test(link.trim())) {
      setError("请填写一个有效的链接(以 http:// 或 https:// 开头)");
      return;
    }
    if (!formDone) {
      setError("请先完成贡献者 NFT 申请表格的填写,并勾选确认");
      return;
    }
    if (!isConnected || !address) {
      setError("请先连接钱包,贡献证明需要和你的地址关联才能审核铸造");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/proofs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          track: TRACK_ENUM[track.id],
          link: link.trim(),
          note: note.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "提交失败,请稍后重试");
        return;
      }
      submitProof({ link: link.trim(), note: note.trim() });
    } catch {
      setError("网络错误,请检查连接后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6">
      <div className="mb-10 text-center">
        <Tag dotColor={track.accent}>Step 4 · Contribution Proof</Tag>
        <h1 className="mt-4 font-serif-cjk text-3xl font-bold text-ink sm:text-4xl">
          提交你的<span className="text-terracotta">Contribution Proof</span>
        </h1>
        <p className="mt-3 text-ink-soft">{track.task.submissionHint}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              成果链接
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              补充说明(可选)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="简单说说你做了什么"
              className="w-full resize-none rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-navy"
            />
          </div>
          <div className="rounded-md border border-line bg-paper p-4">
            <p className="text-sm font-medium text-ink">
              贡献者 NFT 申请表格(必填)
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              为方便人工审核与后续 NFT 发放,请先填写这份申请表格,再回来完成提交。
            </p>
            <a
              href="https://docs.google.com/forms/d/15GTTqehq8lZ9rE1ztPBH9A6wCy1T8xO-wGgTavt0nEs/edit"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-navy underline decoration-line hover:text-terracotta"
            >
              打开申请表格 →
            </a>
            <label className="mt-3 flex items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={formDone}
                onChange={(e) => setFormDone(e.target.checked)}
                className="mt-0.5"
              />
              我已完成贡献者 NFT 申请表格的填写
            </label>
          </div>
          {!isConnected && (
            <p className="text-sm text-ink-soft">
              贡献证明需要和钱包地址关联,
              <button
                type="button"
                onClick={() => openConnectModal?.()}
                className="text-navy underline decoration-line hover:text-terracotta"
              >
                先连接钱包
              </button>
              。
            </p>
          )}
          {error && <p className="text-sm text-terracotta">{error}</p>}
          <div className="flex justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => goToStep(3)}
            >
              ← 返回任务
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "提交中…" : "提交并去铸造凭证 →"}
            </Button>
          </div>
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-ink-soft">
        提交后台会记录你的贡献证明,审核通过后即可在下一步铸造凭证。
      </p>
    </div>
  );
}
