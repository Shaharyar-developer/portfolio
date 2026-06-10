import { getSheetdueGoogleRedirectUri } from "@/lib/google/redirect-uri";
import { SHEETDUE_APP_KEY } from "@workspace/billing";
import { db, schema } from "@workspace/db";
import {
  createDriveClient,
  createGoogleOAuthClient,
  createSheetsClient,
  decryptToken,
} from "@workspace/google";
import { and, desc, eq } from "drizzle-orm";

export async function getUserGoogleConnection(userId: string) {
  return db.query.googleConnections.findFirst({
    where: and(
      eq(schema.googleConnections.userId, userId),
      eq(schema.googleConnections.appKey, SHEETDUE_APP_KEY),
    ),
    orderBy: [desc(schema.googleConnections.updatedAt)],
  });
}

export async function getUserGoogleClients(userId: string) {
  const connection = await getUserGoogleConnection(userId);

  if (!connection) {
    throw new Error("Connect Google Sheets before searching spreadsheets.");
  }

  const auth = createGoogleOAuthClient({
    redirectUri: getSheetdueGoogleRedirectUri(),
    accessToken: decryptToken(connection.encryptedAccessToken),
    refreshToken: decryptToken(connection.encryptedRefreshToken),
    expiryDate: connection.accessTokenExpiresAt,
  });

  return {
    connection,
    drive: createDriveClient(auth),
    sheets: createSheetsClient(auth),
  };
}
