"use client";

import { FormEvent, useState } from "react";
import { TRACKS } from "@/lib/tracks";
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
  const [error, setError] = useState("");

  if (!trackId) return null;
  const track = TRACKS[trackId];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!link.trim() || !/^https?:\/\//.test(link.trim())) {
      setError("请填写一个有效的链接(以 http:// 或 https:// 开头)");
      return;
    }
    setError("");
    submitProof({ link: link.trim(), note: note.trim() });
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
          {error && <p className="text-sm text-terracotta">{error}</p>}
          <div className="flex justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => goToStep(3)}
            >
              ← 返回任务
            </Button>
            <Button type="submit">提交并去铸造凭证 →</Button>
          </div>
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Demo 版本:提交后直接进入 mint 环节。生产版本会加入人工/自动审核门槛。
      </p>
    </div>
  );
}
