import "server-only";
import { Redis } from "@upstash/redis";

export type ProofStatus = "approved" | "flagged";

export interface ProofRecord {
  id: string;
  address: string;
  track: number;
  link: string;
  note: string;
  submittedAt: number;
  status: ProofStatus;
  flagReason?: string;
}

const PROOF_INDEX_KEY = "proofs:index";

function proofId(address: string, track: number) {
  return `${address.toLowerCase()}_${track}`;
}

function proofKey(id: string) {
  return `proof:${id}`;
}

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null;

/**
 * Local-dev-only fallback so `npm run dev` works without provisioning
 * Upstash Redis. Not persisted across restarts/serverless invocations —
 * production must set KV_REST_API_URL / KV_REST_API_TOKEN.
 */
const memoryStore = new Map<string, ProofRecord>();

export async function saveProof(
  input: Omit<ProofRecord, "id">,
): Promise<ProofRecord> {
  const id = proofId(input.address, input.track);
  const record: ProofRecord = { ...input, id };

  if (redis) {
    await redis.set(proofKey(id), record);
    await redis.sadd(PROOF_INDEX_KEY, id);
  } else {
    memoryStore.set(id, record);
  }

  return record;
}

export async function getProof(
  address: string,
  track: number,
): Promise<ProofRecord | null> {
  const id = proofId(address, track);
  if (redis) {
    return (await redis.get<ProofRecord>(proofKey(id))) ?? null;
  }
  return memoryStore.get(id) ?? null;
}

export async function listProofs(): Promise<ProofRecord[]> {
  let records: ProofRecord[];

  if (redis) {
    const ids = await redis.smembers(PROOF_INDEX_KEY);
    records = ids.length
      ? (
          await Promise.all(
            ids.map((id) => redis!.get<ProofRecord>(proofKey(id))),
          )
        ).filter((r): r is ProofRecord => r !== null)
      : [];
  } else {
    records = Array.from(memoryStore.values());
  }

  return records.sort((a, b) => b.submittedAt - a.submittedAt);
}

export async function flagProof(
  id: string,
  reason?: string,
): Promise<ProofRecord | null> {
  if (redis) {
    const record = await redis.get<ProofRecord>(proofKey(id));
    if (!record) return null;
    const updated: ProofRecord = { ...record, status: "flagged", flagReason: reason };
    await redis.set(proofKey(id), updated);
    return updated;
  }

  const record = memoryStore.get(id);
  if (!record) return null;
  const updated: ProofRecord = { ...record, status: "flagged", flagReason: reason };
  memoryStore.set(id, updated);
  return updated;
}
