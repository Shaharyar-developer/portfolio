import { getSession } from "@workspace/auth";
import { headers } from "next/headers";

export async function getCurrentSession() {
  return getSession(await headers());
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session?.user) {
    throw new Error("Authentication required.");
  }

  return session.user;
}
