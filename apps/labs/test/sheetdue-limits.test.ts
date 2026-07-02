import { describe, expect, test } from "bun:test";

import {
  activeSheetCountAfterStatusChange,
  canActivateAfterStatusChange,
  canActivateSheet,
  canSendReminder,
} from "@/lib/sheetdue/limits";

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

  test("free plan can keep an existing active sheet active", () => {
    expect(
      activeSheetCountAfterStatusChange({
        activeSheets: 1,
        currentStatus: "active",
        nextStatus: "active",
      }),
    ).toBe(1);

    expect(
      canActivateAfterStatusChange({
        plan: "free",
        activeSheets: 1,
        currentStatus: "active",
        nextStatus: "active",
      }),
    ).toBe(true);
  });

  test("free plan cannot activate a second sheet", () => {
    expect(
      activeSheetCountAfterStatusChange({
        activeSheets: 1,
        currentStatus: "paused",
        nextStatus: "active",
      }),
    ).toBe(2);

    expect(
      canActivateAfterStatusChange({
        plan: "free",
        activeSheets: 1,
        currentStatus: "paused",
        nextStatus: "active",
      }),
    ).toBe(false);
  });
});
