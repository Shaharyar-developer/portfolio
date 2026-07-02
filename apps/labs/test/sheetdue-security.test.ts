import { describe, expect, test } from "bun:test";

import { isBearerSecretAuthorized } from "@/lib/security";
import { reminderSendFailureStatus } from "@/lib/sheetdue/cron";
import { UsageLimitError } from "@/lib/sheetdue/usage";
import { verifyPlunkWebhook } from "@workspace/email";
import { hasUsableRefreshToken } from "@workspace/google";

describe("SheetDue security and retry behavior", () => {
  test("cron secret check fails closed when the secret is missing", () => {
    expect(
      isBearerSecretAuthorized({
        authorizationHeader: null,
        secret: undefined,
        allowMissingSecretInDevelopment: false,
      }),
    ).toBe(false);
  });

  test("cron secret check permits a matching bearer token", () => {
    expect(
      isBearerSecretAuthorized({
        authorizationHeader: "Bearer cron-secret",
        secret: "cron-secret",
      }),
    ).toBe(true);
  });

  test("Plunk webhooks require a secret outside development", () => {
    const mutableEnv = process.env as Record<string, string | undefined>;
    const originalNodeEnv = process.env.NODE_ENV;
    const originalSecret = process.env.PLUNK_WEBHOOK_SECRET;
    mutableEnv.NODE_ENV = "production";
    delete process.env.PLUNK_WEBHOOK_SECRET;

    try {
      expect(verifyPlunkWebhook(new Request("https://example.com"))).toBe(false);
    } finally {
      mutableEnv.NODE_ENV = originalNodeEnv;
      if (originalSecret == null) {
        delete process.env.PLUNK_WEBHOOK_SECRET;
      } else {
        process.env.PLUNK_WEBHOOK_SECRET = originalSecret;
      }
    }
  });

  test("monthly reminder limit errors defer queued events", () => {
    expect(
      reminderSendFailureStatus(
        new UsageLimitError(
          "monthly_reminder_limit",
          "Your plan has reached its monthly reminder limit.",
        ),
      ),
    ).toBe("queued");

    expect(reminderSendFailureStatus(new Error("Plunk failed"))).toBe("failed");
  });

  test("new Google connections require a usable refresh token", () => {
    expect(
      hasUsableRefreshToken({
        refreshToken: null,
        existingEncryptedRefreshToken: null,
      }),
    ).toBe(false);

    expect(
      hasUsableRefreshToken({
        refreshToken: null,
        existingEncryptedRefreshToken: "encrypted-refresh-token",
      }),
    ).toBe(true);
  });
});
