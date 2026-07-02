import { ensureSheetdueApp, getUserSheetduePlan } from "@workspace/billing";
import { db, schema } from "@workspace/db";
import { and, eq, ne, sql } from "drizzle-orm";

import { canActivateSheet, canSendReminder } from "./limits";

export class UsageLimitError extends Error {
  constructor(
    readonly code: "active_sheet_limit" | "monthly_reminder_limit",
    message: string,
  ) {
    super(message);
    this.name = "UsageLimitError";
  }
}

function currentMonthRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
}

export async function getUsageSnapshot(
  userId: string,
  now = new Date(),
  options: { excludeWatchId?: string } = {},
) {
  const app = await ensureSheetdueApp();
  const { periodStart, periodEnd } = currentMonthRange(now);
  const activeSheetConditions = [
    eq(schema.sheetdueSheetWatches.userId, userId),
    eq(schema.sheetdueSheetWatches.status, "active"),
    options.excludeWatchId
      ? ne(schema.sheetdueSheetWatches.id, options.excludeWatchId)
      : undefined,
  ].filter((condition): condition is NonNullable<typeof condition> =>
    Boolean(condition),
  );
  const [activeSheetCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.sheetdueSheetWatches)
    .where(and(...activeSheetConditions));

  const existing = await db.query.usageCounters.findFirst({
    where: and(
      eq(schema.usageCounters.userId, userId),
      eq(schema.usageCounters.appId, app.id),
      eq(schema.usageCounters.periodStart, periodStart),
    ),
  });

  const remindersSent = existing?.remindersSent ?? 0;
  const activeSheets = activeSheetCount?.count ?? 0;

  return {
    app,
    periodStart,
    periodEnd,
    usage: {
      activeSheets,
      remindersSent,
    },
  };
}

export async function assertCanActivateSheet(
  userId: string,
  options: { excludeWatchId?: string } = {},
) {
  const plan = await getUserSheetduePlan(userId);
  const snapshot = await getUsageSnapshot(userId, new Date(), options);

  if (!canActivateSheet({ plan, usage: snapshot.usage })) {
    throw new UsageLimitError(
      "active_sheet_limit",
      "Your plan has reached its active sheet limit.",
    );
  }

  return { plan, ...snapshot };
}

export async function assertCanSendReminder(userId: string) {
  const plan = await getUserSheetduePlan(userId);
  const snapshot = await getUsageSnapshot(userId);

  if (!canSendReminder({ plan, usage: snapshot.usage })) {
    throw new UsageLimitError(
      "monthly_reminder_limit",
      "Your plan has reached its monthly reminder limit.",
    );
  }

  return { plan, ...snapshot };
}

export async function incrementReminderUsage(userId: string, now = new Date()) {
  const { app, periodStart, periodEnd } = await getUsageSnapshot(userId, now);

  await db
    .insert(schema.usageCounters)
    .values({
      userId,
      appId: app.id,
      periodStart,
      periodEnd,
      remindersSent: 1,
    })
    .onConflictDoUpdate({
      target: [
        schema.usageCounters.userId,
        schema.usageCounters.appId,
        schema.usageCounters.periodStart,
      ],
      set: {
        remindersSent: sql`${schema.usageCounters.remindersSent} + 1`,
        updatedAt: new Date(),
      },
    });
}
