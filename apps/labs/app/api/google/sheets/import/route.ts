import { requireUser } from "@/lib/auth/session";
import { getUserGoogleClients } from "@/lib/google/server-client";
import { jsonError } from "@/lib/http";
import { importExcelFileAsGoogleSheet } from "@workspace/google";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as {
      fileId?: string;
    };

    if (!body.fileId) {
      throw new Error("fileId is required.");
    }

    const { drive } = await getUserGoogleClients(user.id);
    const spreadsheet = await importExcelFileAsGoogleSheet({
      drive,
      fileId: body.fileId,
    });

    return NextResponse.json({ spreadsheet });
  } catch (error) {
    return jsonError(error, 400);
  }
}
