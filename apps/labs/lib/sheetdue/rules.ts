import { createHash } from "crypto";

import { normalizeEmail, renderTemplate } from "@workspace/email";

import {
  parseSheetdueDateValue,
  type SheetdueDateFormat,
} from "./date-inference";

export type ReminderRuleKind =
  | "before_due"
  | "on_due"
  | "after_due"
  | "repeat_overdue";

export type ReminderRuleInput = {
  id: string;
  kind: ReminderRuleKind;
  offsetDays?: number | null;
  repeatIntervalDays?: number | null;
  enabled?: boolean;
};

export type ColumnMappingInput = {
  titleColumn: string;
  titleSourceType?: ValueSourceType | string | null;
  titleStaticValue?: string | null;
  titleTemplate?: string | null;
  dueDateColumn: string;
  dueDateSourceType?: ValueSourceType | string | null;
  dueDateStaticValue?: string | null;
  dueDateTemplate?: string | null;
  dueDateFormat?: SheetdueDateFormat | string | null;
  recipientEmailColumn: string;
  recipientEmailSourceType?: ValueSourceType | string | null;
  recipientEmailStaticValue?: string | null;
  recipientEmailTemplate?: string | null;
  statusColumn?: string | null;
  headerRowIndex?: number;
};

type ValueSourceType = "column" | "static" | "template";

export type TemplateInput = {
  subject: string;
  body: string;
};

export type SheetRowEvaluationInput = {
  watchId: string;
  rowId: string;
  rowNumber: number;
  row: string[];
  headers?: string[];
  mapping: ColumnMappingInput;
  rules: ReminderRuleInput[];
  template: TemplateInput;
  today: string;
  timezone: string;
};

export type ReminderCandidate = {
  watchId: string;
  ruleId: string;
  rowId: string;
  rowNumber: number;
  dueDate: string;
  occurrenceDate: string;
  recipientEmail: string;
  taskTitle: string;
  subject: string;
  body: string;
  idempotencyKey: string;
};

const completedStatuses = new Set([
  "done",
  "complete",
  "completed",
  "closed",
  "cancelled",
  "canceled",
]);

export function columnLetterToIndex(column: string) {
  const normalized = column.trim().toUpperCase();

  if (!/^[A-Z]+$/.test(normalized)) {
    throw new Error(`Invalid spreadsheet column "${column}".`);
  }

  return [...normalized].reduce(
    (index, letter) => index * 26 + letter.charCodeAt(0) - 64,
    0,
  ) - 1;
}

export function columnIndexToLetter(index: number) {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("Column index must be a non-negative integer.");
  }

  let value = index + 1;
  let column = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    value = Math.floor((value - 1) / 26);
  }

  return column;
}

export function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function utcDate(dateOnly: string) {
  return new Date(`${dateOnly}T00:00:00.000Z`);
}

export function addDays(dateOnly: string, days: number) {
  const date = utcDate(dateOnly);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateOnly(date);
}

export function diffDays(leftDateOnly: string, rightDateOnly: string) {
  const left = utcDate(leftDateOnly).getTime();
  const right = utcDate(rightDateOnly).getTime();
  return Math.round((left - right) / 86_400_000);
}

export function todayInTimezone(now: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

export function parseDueDateValue(
  value: unknown,
  dateFormat?: SheetdueDateFormat | string | null,
) {
  return parseSheetdueDateValue(value, dateFormat);
}

export function getRuleOccurrenceDate(input: {
  rule: ReminderRuleInput;
  dueDate: string;
  today: string;
}) {
  const { rule, dueDate, today } = input;

  if (rule.enabled === false) {
    return null;
  }

  if (rule.kind === "before_due") {
    const target = addDays(dueDate, -(rule.offsetDays ?? 0));
    return target === today ? today : null;
  }

  if (rule.kind === "on_due") {
    return dueDate === today ? today : null;
  }

  if (rule.kind === "after_due") {
    const target = addDays(dueDate, rule.offsetDays ?? 0);
    return target === today ? today : null;
  }

  const interval = Math.max(1, rule.repeatIntervalDays ?? 1);
  const daysOverdue = diffDays(today, dueDate);

  if (daysOverdue <= 0) {
    return null;
  }

  return daysOverdue % interval === 0 ? today : null;
}

export function buildReminderIdempotencyKey(input: {
  watchId: string;
  rowId: string;
  dueDate: string;
  ruleId: string;
  recipientEmail: string;
  occurrenceDate: string;
}) {
  return createHash("sha256")
    .update(
      [
        input.watchId,
        input.rowId,
        input.dueDate,
        input.ruleId,
        normalizeEmail(input.recipientEmail),
        input.occurrenceDate,
      ].join("|"),
    )
    .digest("hex");
}

export function shouldSkipStatus(status?: string | null) {
  return Boolean(status && completedStatuses.has(status.trim().toLowerCase()));
}

function rowValue(row: string[], column: string) {
  return row[columnLetterToIndex(column)]?.trim() ?? "";
}

function normalizeSourceType(value?: string | null): ValueSourceType {
  return value === "static" || value === "template" ? value : "column";
}

function resolveHeaderToken(input: {
  token: string;
  row: string[];
  headers?: string[];
}) {
  const token = input.token.trim();
  const headerIndex =
    input.headers?.findIndex(
      (header) => header.trim().toLowerCase() === token.toLowerCase(),
    ) ?? -1;

  if (headerIndex >= 0) {
    return input.row[headerIndex]?.trim() ?? "";
  }

  if (/^[A-Za-z]+$/.test(token)) {
    try {
      return rowValue(input.row, token);
    } catch {
      return "";
    }
  }

  return "";
}

export function renderRowValueTemplate(input: {
  template: string;
  row: string[];
  headers?: string[];
  rowNumber?: number;
}) {
  return input.template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, token) => {
    const normalizedToken = String(token).trim();

    if (normalizedToken === "rowNumber") {
      return String(input.rowNumber ?? "");
    }

    return resolveHeaderToken({
      token: normalizedToken,
      row: input.row,
      headers: input.headers,
    });
  }).trim();
}

export function resolveMappedValue(input: {
  row: string[];
  headers?: string[];
  rowNumber: number;
  sourceType?: string | null;
  column: string;
  staticValue?: string | null;
  template?: string | null;
}) {
  const sourceType = normalizeSourceType(input.sourceType);

  if (sourceType === "static") {
    return input.staticValue?.trim() ?? "";
  }

  if (sourceType === "template") {
    return renderRowValueTemplate({
      template: input.template ?? "",
      row: input.row,
      headers: input.headers,
      rowNumber: input.rowNumber,
    });
  }

  return rowValue(input.row, input.column);
}

export function evaluateSheetRow(input: SheetRowEvaluationInput) {
  const status =
    input.mapping.statusColumn == null
      ? null
      : rowValue(input.row, input.mapping.statusColumn);

  if (shouldSkipStatus(status)) {
    return [];
  }

  const taskTitle = resolveMappedValue({
    row: input.row,
    headers: input.headers,
    rowNumber: input.rowNumber,
    sourceType: input.mapping.titleSourceType,
    column: input.mapping.titleColumn,
    staticValue: input.mapping.titleStaticValue,
    template: input.mapping.titleTemplate,
  });
  const recipientEmail = normalizeEmail(
    resolveMappedValue({
      row: input.row,
      headers: input.headers,
      rowNumber: input.rowNumber,
      sourceType: input.mapping.recipientEmailSourceType,
      column: input.mapping.recipientEmailColumn,
      staticValue: input.mapping.recipientEmailStaticValue,
      template: input.mapping.recipientEmailTemplate,
    }),
  );
  const dueDate = parseDueDateValue(
    resolveMappedValue({
      row: input.row,
      headers: input.headers,
      rowNumber: input.rowNumber,
      sourceType: input.mapping.dueDateSourceType,
      column: input.mapping.dueDateColumn,
      staticValue: input.mapping.dueDateStaticValue,
      template: input.mapping.dueDateTemplate,
    }),
    input.mapping.dueDateFormat,
  );

  if (!taskTitle || !recipientEmail || !dueDate) {
    return [];
  }

  return input.rules.flatMap((rule) => {
    const occurrenceDate = getRuleOccurrenceDate({
      rule,
      dueDate,
      today: input.today,
    });

    if (!occurrenceDate) {
      return [];
    }

    const rendered = renderTemplate(input.template, {
      task: taskTitle,
      title: taskTitle,
      dueDate,
      recipientEmail,
      rowNumber: input.rowNumber,
    });

    return [
      {
        watchId: input.watchId,
        ruleId: rule.id,
        rowId: input.rowId,
        rowNumber: input.rowNumber,
        dueDate,
        occurrenceDate,
        recipientEmail,
        taskTitle,
        subject: rendered.subject,
        body: rendered.body,
        idempotencyKey: buildReminderIdempotencyKey({
          watchId: input.watchId,
          rowId: input.rowId,
          dueDate,
          ruleId: rule.id,
          recipientEmail,
          occurrenceDate,
        }),
      } satisfies ReminderCandidate,
    ];
  });
}
