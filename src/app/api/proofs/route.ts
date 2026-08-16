import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { saveProof } from "@/lib/server/kv";

/**
 * Records a Step 4 contribution proof submission. Status is set to
 * "approved" immediately (auto-approve for a smooth demo flow) — every
 * submission is still persisted so it can be spot-checked later from
 * /admin, per the hybrid review approach.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法的 JSON" }, { status: 400 });
  }

  const { address, track, link, note } = (body ?? {}) as Record<string, unknown>;

  if (typeof address !== "string" || !isAddress(address)) {
    return NextResponse.json({ error: "address 不是合法的链上地址" }, { status: 400 });
  }
  if (typeof track !== "number" || !Number.isInteger(track) || track < 0 || track > 3) {
    return NextResponse.json({ error: "track 必须是 0-3 之间的整数" }, { status: 400 });
  }
  if (typeof link !== "string" || !/^https?:\/\//.test(link)) {
    return NextResponse.json({ error: "link 必须是 http(s) 链接" }, { status: 400 });
  }
  if (note !== undefined && typeof note !== "string") {
    return NextResponse.json({ error: "note 必须是字符串" }, { status: 400 });
  }

  const record = await saveProof({
    address,
    track,
    link,
    note: note ?? "",
    submittedAt: Date.now(),
    status: "approved",
  });

  return NextResponse.json({ id: record.id, status: record.status }, { status: 201 });
}
