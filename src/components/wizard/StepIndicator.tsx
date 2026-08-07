"use client";

import { WizardStep } from "@/lib/store";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 1, label: "选择方向" },
  { id: 2, label: "学习推荐" },
  { id: 3, label: "完成任务" },
  { id: 4, label: "提交 Proof" },
  { id: 5, label: "铸造凭证" },
];

export function StepIndicator({ current }: { current: WizardStep }) {
  return (
    <ol className="mx-auto flex max-w-3xl items-center justify-between px-2">
      {STEPS.map((s, i) => {
        const active = s.id === current;
        const done = s.id < current;
        return (
          <li key={s.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono-tag text-xs ${
                  done
                    ? "bg-navy text-paper"
                    : active
                      ? "bg-terracotta text-paper"
                      : "border border-line bg-card text-ink-soft"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  active ? "font-medium text-ink" : "text-ink-soft"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${done ? "bg-navy" : "bg-line"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
