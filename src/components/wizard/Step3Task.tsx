"use client";

import { TRACKS } from "@/lib/tracks";
import { useWizardStore } from "@/lib/store";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";

export function Step3Task() {
  const trackId = useWizardStore((s) => s.trackId);
  const goToStep = useWizardStore((s) => s.goToStep);
  if (!trackId) return null;
  const track = TRACKS[trackId];
  const { task } = track;

  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="mb-10 text-center">
        <Tag dotColor={track.accent}>Step 3 · {task.type}</Tag>
        <h1 className="mt-4 font-serif-cjk text-3xl font-bold text-ink sm:text-4xl">
          完成一个<span className="text-terracotta">真实的小任务</span>
        </h1>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif-cjk text-xl font-bold text-ink">
            {task.title}
          </h2>
          <span className="shrink-0 font-mono-tag text-xs text-ink-soft">
            ~{task.estMinutes} 分钟
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {task.summary}
        </p>

        <div className="mt-5 border-t border-line pt-5">
          <p className="mb-2 font-mono-tag text-xs uppercase tracking-wide text-ink-soft">
            验收标准
          </p>
          <ul className="space-y-2">
            {task.acceptance.map((a) => (
              <li key={a} className="flex gap-2 text-sm text-ink">
                <span className="mt-0.5 text-terracotta">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <div className="mt-10 flex justify-center gap-3">
        <Button variant="ghost" onClick={() => goToStep(2)}>
          ← 返回学习内容
        </Button>
        <Button onClick={() => goToStep(4)}>我已完成,去提交 →</Button>
      </div>
    </div>
  );
}
