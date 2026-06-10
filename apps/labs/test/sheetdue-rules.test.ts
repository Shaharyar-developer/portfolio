import { describe, expect, test } from "bun:test";

import { inferDateFormatFromValues } from "@/lib/sheetdue/date-inference";
import {
  buildReminderIdempotencyKey,
  columnIndexToLetter,
  columnLetterToIndex,
  evaluateSheetRow,
  getRuleOccurrenceDate,
  parseDueDateValue,
} from "@/lib/sheetdue/rules";

describe("SheetDue reminder rules", () => {
  test("maps spreadsheet column letters and indexes", () => {
    expect(columnLetterToIndex("A")).toBe(0);
    expect(columnLetterToIndex("Z")).toBe(25);
    expect(columnLetterToIndex("AA")).toBe(26);
    expect(columnIndexToLetter(26)).toBe("AA");
  });

  test("matches before, on, after, and repeat-overdue dates", () => {
    expect(
      getRuleOccurrenceDate({
        rule: { id: "before", kind: "before_due", offsetDays: 3 },
        dueDate: "2026-06-10",
        today: "2026-06-07",
      }),
    ).toBe("2026-06-07");

    expect(
      getRuleOccurrenceDate({
        rule: { id: "on", kind: "on_due" },
        dueDate: "2026-06-10",
        today: "2026-06-10",
      }),
    ).toBe("2026-06-10");

    expect(
      getRuleOccurrenceDate({
        rule: { id: "after", kind: "after_due", offsetDays: 2 },
        dueDate: "2026-06-10",
        today: "2026-06-12",
      }),
    ).toBe("2026-06-12");

    expect(
      getRuleOccurrenceDate({
        rule: {
          id: "repeat",
          kind: "repeat_overdue",
          repeatIntervalDays: 3,
        },
        dueDate: "2026-06-10",
        today: "2026-06-16",
      }),
    ).toBe("2026-06-16");
  });

  test("parses common date values", () => {
    expect(parseDueDateValue("2026-06-10")).toBe("2026-06-10");
    expect(parseDueDateValue("6/10/2026", "M/d/yyyy")).toBe("2026-06-10");
    expect(parseDueDateValue("13/6/26", "d/M/yy")).toBe("2026-06-13");
    expect(parseDueDateValue(46283)).toBe("2026-09-18");
  });

  test("infers slash date formats from all samples", () => {
    expect(
      inferDateFormatFromValues(["13/06/26", "14/06/26"]).format,
    ).toBe("d/M/yy");
    expect(
      inferDateFormatFromValues(["06/13/26", "06/14/26"]).format,
    ).toBe("M/d/yy");

    const ambiguous = inferDateFormatFromValues(["06/07/26", "08/09/26"]);
    expect(ambiguous.confidence).toBe("ambiguous");
    expect(ambiguous.candidates).toEqual(["M/d/yy", "d/M/yy"]);
  });

  test("builds stable idempotency keys with normalized email", () => {
    const first = buildReminderIdempotencyKey({
      watchId: "watch",
      rowId: "row",
      dueDate: "2026-06-10",
      ruleId: "rule",
      recipientEmail: "Person@Example.com",
      occurrenceDate: "2026-06-10",
    });
    const second = buildReminderIdempotencyKey({
      watchId: "watch",
      rowId: "row",
      dueDate: "2026-06-10",
      ruleId: "rule",
      recipientEmail: "person@example.com",
      occurrenceDate: "2026-06-10",
    });

    expect(first).toBe(second);
  });

  test("evaluates a row into a rendered reminder candidate", () => {
    const candidates = evaluateSheetRow({
      watchId: "watch",
      rowId: "row-1",
      rowNumber: 2,
      row: ["Client docs", "2026-06-10", "client@example.com", "open"],
      mapping: {
        titleColumn: "A",
        dueDateColumn: "B",
        recipientEmailColumn: "C",
        statusColumn: "D",
      },
      rules: [{ id: "on", kind: "on_due" }],
      template: {
        subject: "{{task}} due {{dueDate}}",
        body: "<p>{{recipientEmail}}</p>",
      },
      today: "2026-06-10",
      timezone: "UTC",
    });

    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.subject).toBe("Client docs due 2026-06-10");
    expect(candidates[0]?.recipientEmail).toBe("client@example.com");
  });

  test("evaluates fixed and template-derived row values", () => {
    const candidates = evaluateSheetRow({
      watchId: "watch",
      rowId: "row-2",
      rowNumber: 2,
      row: ["2026-06-10", "Legal review", "north"],
      headers: ["Date", "Work", "Region"],
      mapping: {
        titleColumn: "B",
        titleSourceType: "template",
        titleTemplate: "{{Region}} - {{Work}}",
        dueDateColumn: "A",
        dueDateSourceType: "template",
        dueDateTemplate: "{{Date}}",
        recipientEmailColumn: "A",
        recipientEmailSourceType: "static",
        recipientEmailStaticValue: "ops@example.com",
      },
      rules: [{ id: "on", kind: "on_due" }],
      template: {
        subject: "{{task}}",
        body: "{{recipientEmail}} {{dueDate}}",
      },
      today: "2026-06-10",
      timezone: "UTC",
    });

    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.taskTitle).toBe("north - Legal review");
    expect(candidates[0]?.recipientEmail).toBe("ops@example.com");
    expect(candidates[0]?.dueDate).toBe("2026-06-10");
  });

  test("skips completed rows", () => {
    const candidates = evaluateSheetRow({
      watchId: "watch",
      rowId: "row-1",
      rowNumber: 2,
      row: ["Client docs", "2026-06-10", "client@example.com", "done"],
      mapping: {
        titleColumn: "A",
        dueDateColumn: "B",
        recipientEmailColumn: "C",
        statusColumn: "D",
      },
      rules: [{ id: "on", kind: "on_due" }],
      template: {
        subject: "{{task}}",
        body: "{{dueDate}}",
      },
      today: "2026-06-10",
      timezone: "UTC",
    });

    expect(candidates).toHaveLength(0);
  });
});
