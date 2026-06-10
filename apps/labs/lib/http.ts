import { NextResponse } from "next/server";

export function jsonError(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "Something went wrong.";

  return NextResponse.json({ error: message }, { status });
}

export function redirectToSignIn(request: Request) {
  const url = new URL("/sheetdue", request.url);
  url.searchParams.set("auth", "required");
  return NextResponse.redirect(url);
}
