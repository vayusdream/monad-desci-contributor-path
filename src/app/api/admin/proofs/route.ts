import { NextRequest, NextResponse } from "next/server";
import { listProofs } from "@/lib/server/kv";
import { isAdminAuthorized } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proofs = await listProofs();
  return NextResponse.json(proofs);
}
