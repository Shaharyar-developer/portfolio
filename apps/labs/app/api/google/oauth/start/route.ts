import { getSheetdueGoogleRedirectUri } from "@/lib/google/redirect-uri";
import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/http";
import { buildGoogleOAuthUrl } from "@workspace/google";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await requireUser();
    const state = crypto.randomUUID();
    const response = NextResponse.redirect(
      buildGoogleOAuthUrl({
        redirectUri: getSheetdueGoogleRedirectUri(request),
        state,
      }),
    );

    response.cookies.set("sheetdue_google_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error) {
    return jsonError(error, 401);
  }
}
