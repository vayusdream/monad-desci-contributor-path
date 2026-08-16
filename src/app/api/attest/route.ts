import { isAddress, isHex } from "viem";
import { TRACK_ENUM } from "@/lib/contract";
import { getProof } from "@/lib/server/kv";
import { signMintAttestation } from "@/lib/server/attestation";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Demo-scale only: in-memory, per-process. Resets on redeploy/cold start and
// isn't shared across serverless instances — fine for a hackathon demo, not
// a substitute for a real distributed rate limiter in production.
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  const attestorKey = process.env.ATTESTOR_PRIVATE_KEY;
  if (!attestorKey || !isHex(attestorKey)) {
    return Response.json(
      { error: "ATTESTOR_PRIVATE_KEY 未配置，无法签发铸造授权" },
      { status: 500 }
    );
  }

  let body: { address?: string; track?: string; proofLink?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const { address, track, proofLink } = body;

  if (!address || !isAddress(address)) {
    return Response.json({ error: "address 无效" }, { status: 400 });
  }
  if (!track || !(track in TRACK_ENUM)) {
    return Response.json({ error: "track 无效" }, { status: 400 });
  }
  if (!proofLink || !/^https?:\/\//.test(proofLink)) {
    return Response.json(
      { error: "proofLink 必须是 http:// 或 https:// 开头的链接" },
      { status: 400 }
    );
  }

  if (isRateLimited(address.toLowerCase())) {
    return Response.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const trackIndex = TRACK_ENUM[track as keyof typeof TRACK_ENUM];

  // Source of truth for "this was actually submitted and approved" is the
  // persisted /api/proofs record — never the client-supplied proofLink, or
  // anyone could pass an arbitrary link and self-approve a mint.
  const proof = await getProof(address, trackIndex);
  if (!proof || proof.status !== "approved") {
    return Response.json(
      { error: "找不到该地址在此赛道已批准的贡献证明，请先完成 Step 4 提交" },
      { status: 403 }
    );
  }

  try {
    const attestation = await signMintAttestation(address, trackIndex);
    return Response.json(attestation);
  } catch (error) {
    console.error("Failed to sign mint attestation:", error);
    return Response.json({ error: "签发铸造授权失败，请稍后重试" }, { status: 500 });
  }
}
