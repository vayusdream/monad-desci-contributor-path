"use client";

import { TRACKS } from "@/lib/tracks";
import { useWizardStore } from "@/lib/store";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";

export function Step2LearnRecommend() {
  const trackId = useWizardStore((s) => s.trackId);
  const goToStep = useWizardStore((s) => s.goToStep);
  if (!trackId) return null;
  const track = TRACKS[trackId];

  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="mb-10 text-center">
        <Tag dotColor={track.accent}>Step 2 · {track.name} Track</Tag>
        <h1 className="mt-4 font-serif-cjk text-3xl font-bold text-ink sm:text-4xl">
          推荐的<span className="text-terracotta">学习内容</span> + 项目
        </h1>
        <p className="mt-3 text-ink-soft">{track.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-mono-tag text-xs uppercase tracking-wide text-ink-soft">
            学习内容
          </h2>
          <div className="space-y-3">
            {track.resources.map((r) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <p className="font-medium text-ink">{r.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{r.desc}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-mono-tag text-xs uppercase tracking-wide text-ink-soft">
            推荐项目
          </h2>
          <div className="space-y-3">
            {track.projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{p.desc}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-3">
        <Button variant="ghost" onClick={() => goToStep(1)}>
          ← 换一个方向
        </Button>
        <Button onClick={() => goToStep(3)}>看看具体任务 →</Button>
      </div>
    </div>
  );
}
