"use client";

import { FormEvent, useState } from "react";
import { TRACK_ENUM } from "@/lib/contract";
import { TRACKS, TrackId } from "@/lib/tracks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ProofRecord {
  id: string;
  address: string;
  track: number;
  link: string;
  note: string;
  submittedAt: number;
  status: "approved" | "flagged";
  flagReason?: string;
}

const TRACK_ID_BY_INDEX = Object.fromEntries(
  Object.entries(TRACK_ENUM).map(([id, index]) => [index, id as TrackId]),
) as Record<number, TrackId>;

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [proofs, setProofs] = useState<ProofRecord[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchProofs(key: string): Promise<boolean> {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/proofs", {
        headers: { "x-admin-secret": key },
      });
      if (res.status === 401) {
        setError("密钥不正确");
        return false;
      }
      if (!res.ok) throw new Error(`请求失败(${res.status})`);
      setProofs(await res.json());
      return true;
    } catch {
      setError("加载失败,请检查网络或稍后重试");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    const key = secretInput.trim();
    if (!key) return;
    if (await fetchProofs(key)) setSecret(key);
  }

  async function handleFlag(id: string) {
    const reason = window.prompt("标记原因(可选)") ?? undefined;
    const res = await fetch(`/api/admin/proofs/${id}/flag`, {
      method: "POST",
      headers: { "x-admin-secret": secret, "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProofs((prev) =>
        prev ? prev.map((p) => (p.id === id ? updated : p)) : prev,
      );
    } else {
      window.alert("标记失败");
    }
  }

  if (!secret) {
    return (
      <div className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-6 font-serif-cjk text-2xl font-bold text-ink">
          管理后台
        </h1>
        <Card>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Admin Secret
              </label>
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-navy"
              />
            </div>
            {error && <p className="text-sm text-terracotta">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "验证中…" : "进入"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif-cjk text-2xl font-bold text-ink">
          贡献证明提交记录
        </h1>
        <Button
          variant="ghost"
          onClick={() => fetchProofs(secret)}
          disabled={loading}
        >
          {loading ? "刷新中…" : "刷新"}
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-terracotta">{error}</p>}

      {!proofs || proofs.length === 0 ? (
        <p className="text-sm text-ink-soft">暂无提交记录。</p>
      ) : (
        <div className="space-y-4">
          {proofs.map((proof) => {
            const trackId = TRACK_ID_BY_INDEX[proof.track];
            const track = trackId ? TRACKS[trackId] : undefined;
            return (
              <Card key={proof.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tag text-xs text-ink-soft">
                      {proof.address}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-paper"
                      style={{ backgroundColor: track?.accent ?? "#57534a" }}
                    >
                      {track?.name ?? `Track ${proof.track}`}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        proof.status === "flagged" ? "text-terracotta" : "text-navy"
                      }`}
                    >
                      {proof.status === "flagged" ? "已标记可疑" : "已批准"}
                    </span>
                  </div>
                  <span className="text-xs text-ink-soft">
                    {new Date(proof.submittedAt).toLocaleString()}
                  </span>
                </div>
                <a
                  href={proof.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-navy underline decoration-line hover:text-terracotta"
                >
                  {proof.link}
                </a>
                {proof.note && (
                  <p className="text-sm text-ink-soft">{proof.note}</p>
                )}
                {proof.flagReason && (
                  <p className="text-sm text-terracotta">
                    标记原因:{proof.flagReason}
                  </p>
                )}
                {proof.status !== "flagged" && (
                  <Button variant="secondary" onClick={() => handleFlag(proof.id)}>
                    标记可疑
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
