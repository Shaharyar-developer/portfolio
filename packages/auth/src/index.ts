import { db } from "@workspace/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const labsBaseUrl = process.env.LABS_BASE_URL ?? "http://localhost:3001";
const cookieDomain =
  process.env.AUTH_COOKIE_DOMAIN ??
  (labsBaseUrl.includes("localhost") ? undefined : ".labs.shaharyar.dev");

function resolveAuthSecret() {
  if (process.env.BETTER_AUTH_SECRET) {
    return process.env.BETTER_AUTH_SECRET;
  }

  if (process.env.VERCEL_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }

  return "labs-local-development-secret-replace-before-production";
}

function resolveSocialProviders() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (googleClientId && googleClientSecret) {
    return {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    };
  }

  if (process.env.VERCEL_ENV === "production") {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required.");
  }

  return {};
}

export const auth = betterAuth({
  appName: "Shaharyar Labs",
  baseURL: labsBaseUrl,
  secret: resolveAuthSecret(),
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: resolveSocialProviders(),
  trustedOrigins: [labsBaseUrl],
  advanced: {
    cookiePrefix: "labs-auth",
    crossSubDomainCookies: {
      enabled: Boolean(cookieDomain),
      domain: cookieDomain,
    },
  },
});

export async function getSession(headers: Headers) {
  return auth.api.getSession({ headers });
}

export type AuthSession = Awaited<ReturnType<typeof getSession>>;
