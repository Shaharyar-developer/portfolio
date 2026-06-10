export function getSheetdueGoogleRedirectUri(request?: Request) {
  if (process.env.GOOGLE_SHEETDUE_REDIRECT_URI) {
    return process.env.GOOGLE_SHEETDUE_REDIRECT_URI;
  }

  const baseUrl =
    process.env.LABS_BASE_URL ??
    (request ? new URL(request.url).origin : "http://localhost:3001");

  return `${baseUrl}/api/google/oauth/callback`;
}
