import { NextRequest, NextResponse } from "next/server";
import { flagProof } from "@/lib/server/kv";
import { isAdminAuthorized } from "@/lib/server/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let reason: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.reason === "string") reason = body.reason;
  } catch {
    // no body is fine, reason is optional
  }

  const updated = await flagProof(id, reason);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
