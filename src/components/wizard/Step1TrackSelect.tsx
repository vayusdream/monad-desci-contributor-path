"use client";

import { TRACK_LIST } from "@/lib/tracks";
import { useWizardStore } from "@/lib/store";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Tag";

export function Step1TrackSelect() {
  const selectTrack = useWizardStore((s) => s.selectTrack);

  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="mb-10 text-center">
        <Tag>Step 1 · Choose Your Path</Tag>
        <h1 className="mt-4 font-serif-cjk text-3xl font-bold text-ink sm:text-4xl">
          选择你的<span className="text-terracotta">方向</span>
        </h1>
        <p className="mt-3 text-ink-soft">
          只需要一个真实的开始。选一个最吸引你的 DeSci 方向。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {TRACK_LIST.map((track) => (
          <Card
            key={track.id}
            className="group cursor-pointer text-left transition-shadow hover:shadow-md"
            onClick={() => selectTrack(track.id)}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-serif-cjk text-2xl font-bold text-ink">
                {track.name}
              </h3>
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: track.accent }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-ink-soft">
              {track.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {track.description}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4 font-mono-tag text-xs text-ink-soft">
              <span>{track.participants} 人已参与</span>
              <span>平均 {track.avgHours}</span>
            </div>
            <div className="mt-4 text-sm font-medium text-navy opacity-0 transition-opacity group-hover:opacity-100">
              开始这个方向 →
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
