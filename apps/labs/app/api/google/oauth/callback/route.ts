import { getSheetdueGoogleRedirectUri } from "@/lib/google/redirect-uri";
import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/http";
import { SHEETDUE_APP_KEY } from "@workspace/billing";
import { db, schema } from "@workspace/db";
import {
  encryptToken,
  exchangeGoogleCode,
  getGoogleUserInfo,
} from "@workspace/google";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");
    const cookieStore = await cookies();
    const expectedState = cookieStore.get("sheetdue_google_state")?.value;

    if (!code || !state || !expectedState || state !== expectedState) {
      throw new Error("Google OAuth state did not match.");
    }

    const tokens = await exchangeGoogleCode({
      code,
      redirectUri: getSheetdueGoogleRedirectUri(request),
    });

    if (!tokens.access_token) {
      throw new Error("Google did not return an access token.");
    }

    const profile = await getGoogleUserInfo(tokens.access_token);
    const existing = await db.query.googleConnections.findFirst({
      where: and(
        eq(schema.googleConnections.userId, user.id),
        eq(schema.googleConnections.appKey, SHEETDUE_APP_KEY),
        eq(schema.googleConnections.googleAccountId, profile.googleAccountId),
      ),
    });

    await db
      .insert(schema.googleConnections)
      .values({
        userId: user.id,
        appKey: SHEETDUE_APP_KEY,
        googleAccountId: profile.googleAccountId,
        email: profile.email,
        scopes: tokens.scope ?? "",
        encryptedAccessToken: encryptToken(tokens.access_token),
        encryptedRefreshToken:
          encryptToken(tokens.refresh_token) ?? existing?.encryptedRefreshToken,
        accessTokenExpiresAt: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
      })
      .onConflictDoUpdate({
        target: [
          schema.googleConnections.userId,
          schema.googleConnections.appKey,
          schema.googleConnections.googleAccountId,
        ],
        set: {
          email: profile.email,
          scopes: tokens.scope ?? "",
          encryptedAccessToken: encryptToken(tokens.access_token),
          encryptedRefreshToken:
            encryptToken(tokens.refresh_token) ?? existing?.encryptedRefreshToken,
          accessTokenExpiresAt: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null,
          updatedAt: new Date(),
        },
      });

    const response = NextResponse.redirect(
      new URL("/sheetdue/dashboard?connected=1", request.url),
    );
    response.cookies.delete("sheetdue_google_state");
    return response;
  } catch (error) {
    return jsonError(error, 400);
  }
}
