import { describe, expect, test } from "bun:test";

import { canActivateSheet, canSendReminder } from "@/lib/sheetdue/limits";

describe("SheetDue usage limits", () => {
  test("free plan allows one active sheet", () => {
    expect(
      canActivateSheet({
        plan: "free",
        usage: { activeSheets: 0, remindersSent: 0 },
      }),
    ).toBe(true);

    expect(
      canActivateSheet({
        plan: "free",
        usage: { activeSheets: 1, remindersSent: 0 },
      }),
    ).toBe(false);
  });

  test("pro plan allows unlimited active sheets", () => {
    expect(
      canActivateSheet({
        plan: "pro",
        usage: { activeSheets: 500, remindersSent: 0 },
      }),
    ).toBe(true);
  });

  test("monthly reminder limits are enforced", () => {
    expect(
      canSendReminder({
        plan: "free",
        usage: { activeSheets: 1, remindersSent: 49 },
      }),
    ).toBe(true);

    expect(
      canSendReminder({
        plan: "free",
        usage: { activeSheets: 1, remindersSent: 50 },
      }),
    ).toBe(false);
  });
});
