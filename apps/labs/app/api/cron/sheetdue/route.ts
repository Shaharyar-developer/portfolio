import { jsonError } from "@/lib/http";
import { isBearerSecretAuthorized } from "@/lib/security";
import { runSheetdueCron } from "@/lib/sheetdue/cron";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET;

    if (
      !isBearerSecretAuthorized({
        authorizationHeader: request.headers.get("authorization"),
        secret,
        allowMissingSecretInDevelopment: true,
      })
    ) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const result = await runSheetdueCron();
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error, 500);
  }
}
