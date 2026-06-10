import { requireUser } from "@/lib/auth/session";
import { getUserGoogleClients } from "@/lib/google/server-client";
import { jsonError } from "@/lib/http";
import { searchDriveSpreadsheets } from "@workspace/google";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { drive } = await getUserGoogleClients(user.id);
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";

    const spreadsheets = await searchDriveSpreadsheets({
      drive,
      query,
      pageSize: 12,
    });

    return NextResponse.json({ spreadsheets });
  } catch (error) {
    return jsonError(error, 400);
  }
}
