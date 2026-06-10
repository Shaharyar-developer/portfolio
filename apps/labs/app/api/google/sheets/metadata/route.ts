import { requireUser } from "@/lib/auth/session";
import { getUserGoogleClients } from "@/lib/google/server-client";
import { jsonError } from "@/lib/http";
import { getSpreadsheetMetadata } from "@workspace/google";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const url = new URL(request.url);
    const spreadsheetId = url.searchParams.get("spreadsheetId");

    if (!spreadsheetId) {
      throw new Error("spreadsheetId is required.");
    }

    const { sheets } = await getUserGoogleClients(user.id);
    const metadata = await getSpreadsheetMetadata({ sheets, spreadsheetId });

    return NextResponse.json({ metadata });
  } catch (error) {
    return jsonError(error, 400);
  }
}
