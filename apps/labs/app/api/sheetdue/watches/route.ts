import { requireUser } from "@/lib/auth/session";
import { defaultReminderTemplate, defaultRules } from "@/lib/sheetdue/defaults";
import { columnLetterToIndex } from "@/lib/sheetdue/rules";
import { assertCanActivateSheet } from "@/lib/sheetdue/usage";
import {
  SHEETDUE_APP_KEY,
  getUserSheetduePlan,
  sheetduePlanLimits,
} from "@workspace/billing";
import { db, schema } from "@workspace/db";
import { renderSheetdueReminderEmail } from "@workspace/email";
import { and, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/http";

const columnSchema = z.string().min(1).max(4).transform((value) => {
  columnLetterToIndex(value);
  return value.trim().toUpperCase();
});
const sourceTypeSchema = z.enum(["column", "static", "template"]).default("column");
const optionalValueSchema = z.string().trim().optional().nullable();
const emailPresetSchema = z
  .enum(["gentle_reminder", "payment_request", "internal_followup"])
  .default("gentle_reminder");
const dateFormatSchema = z
  .enum([
    "yyyy-MM-dd",
    "yyyy/M/d",
    "yyyy.M.d",
    "M/d/yy",
    "d/M/yy",
    "M/d/yyyy",
    "d/M/yyyy",
    "M-d-yy",
    "d-M-yy",
    "M-d-yyyy",
    "d-M-yyyy",
    "M.d.yy",
    "d.M.yy",
    "M.d.yyyy",
    "d.M.yyyy",
    "MMM d, yyyy",
    "d MMM yyyy",
  ])
  .optional()
  .nullable();

const watchSchema = z.object({
  spreadsheetId: z.string().min(1),
  spreadsheetName: z.string().min(1).default("Untitled spreadsheet"),
  sheetId: z.number().int(),
  sheetTitle: z.string().min(1),
  timezone: z.string().min(1).default("UTC"),
  status: z.enum(["draft", "active", "paused"]).default("draft"),
  mapping: z.object({
    titleColumn: columnSchema.optional().default("A"),
    titleSourceType: sourceTypeSchema,
    titleStaticValue: optionalValueSchema,
    titleTemplate: optionalValueSchema,
    dueDateColumn: columnSchema.optional().default("A"),
    dueDateSourceType: sourceTypeSchema,
    dueDateStaticValue: optionalValueSchema,
    dueDateTemplate: optionalValueSchema,
    dueDateFormat: dateFormatSchema,
    recipientEmailColumn: columnSchema.optional().default("A"),
    recipientEmailSourceType: sourceTypeSchema,
    recipientEmailStaticValue: optionalValueSchema,
    recipientEmailTemplate: optionalValueSchema,
    statusColumn: columnSchema.optional().nullable(),
    headerRowIndex: z.number().int().min(1).default(1),
  }),
  rules: z
    .array(
      z.object({
        kind: z.enum(["before_due", "on_due", "after_due", "repeat_overdue"]),
        offsetDays: z.number().int().min(0).default(0),
        repeatIntervalDays: z.number().int().min(1).optional().nullable(),
        enabled: z.boolean().default(true),
      }),
    )
    .default(defaultRules),
  template: z
    .object({
      subject: z.string().min(1).default(defaultReminderTemplate.subject),
      body: z.string().optional().nullable(),
      senderName: z.string().optional().nullable(),
      preset: emailPresetSchema,
      headline: optionalValueSchema,
      intro: optionalValueSchema,
      closing: optionalValueSchema,
    })
    .default({
      ...defaultReminderTemplate,
      preset: "gentle_reminder",
    }),
});

export async function GET() {
  try {
    const user = await requireUser();
    const watches = await db
      .select()
      .from(schema.sheetdueSheetWatches)
      .where(eq(schema.sheetdueSheetWatches.userId, user.id))
      .orderBy(desc(schema.sheetdueSheetWatches.createdAt));
    const watchIds = watches.map((watch) => watch.id);
    const events =
      watchIds.length === 0
        ? []
        : await db
            .select()
            .from(schema.sheetdueReminderEvents)
            .where(inArray(schema.sheetdueReminderEvents.watchId, watchIds))
            .orderBy(desc(schema.sheetdueReminderEvents.createdAt))
            .limit(50);

    return NextResponse.json({ watches, events });
  } catch (error) {
    return jsonError(error, 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = watchSchema.parse(await request.json());

    if (input.mapping.titleSourceType === "column" && !input.mapping.titleColumn) {
      throw new Error("Choose a task column or use a fixed/template task value.");
    }

    if (
      input.mapping.dueDateSourceType === "column" &&
      !input.mapping.dueDateColumn
    ) {
      throw new Error("Choose a due date column or use a fixed/template due date.");
    }

    if (
      input.mapping.recipientEmailSourceType === "column" &&
      !input.mapping.recipientEmailColumn
    ) {
      throw new Error(
        "Choose a recipient column or use a fixed/template recipient.",
      );
    }

    const connection = await db.query.googleConnections.findFirst({
      where: and(
        eq(schema.googleConnections.userId, user.id),
        eq(schema.googleConnections.appKey, SHEETDUE_APP_KEY),
      ),
    });

    if (!connection) {
      throw new Error("Connect Google Sheets before creating a watch.");
    }

    const plan = await getUserSheetduePlan(user.id);
    const emailBody =
      input.template.body?.trim() ||
      (await renderSheetdueReminderEmail({
        preset: input.template.preset,
        headline: input.template.headline,
        intro: input.template.intro,
        closing: input.template.closing,
      }));
    const existingWatch = await db.query.sheetdueSheetWatches.findFirst({
      where: and(
        eq(schema.sheetdueSheetWatches.userId, user.id),
        eq(schema.sheetdueSheetWatches.spreadsheetId, input.spreadsheetId),
        eq(schema.sheetdueSheetWatches.sheetId, input.sheetId),
      ),
    });

    if (input.status === "active") {
      await assertCanActivateSheet(user.id, {
        excludeWatchId: existingWatch?.id,
      });
    }

    const [watch] = await db
      .insert(schema.sheetdueSheetWatches)
      .values({
        userId: user.id,
        googleConnectionId: connection.id,
        spreadsheetId: input.spreadsheetId,
        spreadsheetName: input.spreadsheetName,
        sheetId: input.sheetId,
        sheetTitle: input.sheetTitle,
        timezone: input.timezone,
        status: input.status,
        scanCadence: sheetduePlanLimits[plan].scanCadence,
        nextScanAt: input.status === "active" ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [
          schema.sheetdueSheetWatches.userId,
          schema.sheetdueSheetWatches.spreadsheetId,
          schema.sheetdueSheetWatches.sheetId,
        ],
        set: {
          googleConnectionId: connection.id,
          spreadsheetName: input.spreadsheetName,
          sheetTitle: input.sheetTitle,
          timezone: input.timezone,
          status: input.status,
          scanCadence: sheetduePlanLimits[plan].scanCadence,
          nextScanAt: input.status === "active" ? new Date() : null,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!watch) {
      throw new Error("Unable to create SheetDue watch.");
    }

    await db
      .insert(schema.sheetdueColumnMappings)
      .values({
        watchId: watch.id,
        titleColumn: input.mapping.titleColumn,
        titleSourceType: input.mapping.titleSourceType,
        titleStaticValue: input.mapping.titleStaticValue,
        titleTemplate: input.mapping.titleTemplate,
        dueDateColumn: input.mapping.dueDateColumn,
        dueDateSourceType: input.mapping.dueDateSourceType,
        dueDateStaticValue: input.mapping.dueDateStaticValue,
        dueDateTemplate: input.mapping.dueDateTemplate,
        dueDateFormat: input.mapping.dueDateFormat,
        recipientEmailColumn: input.mapping.recipientEmailColumn,
        recipientEmailSourceType: input.mapping.recipientEmailSourceType,
        recipientEmailStaticValue: input.mapping.recipientEmailStaticValue,
        recipientEmailTemplate: input.mapping.recipientEmailTemplate,
        statusColumn: input.mapping.statusColumn,
        headerRowIndex: input.mapping.headerRowIndex,
      })
      .onConflictDoUpdate({
        target: schema.sheetdueColumnMappings.watchId,
        set: {
          titleColumn: input.mapping.titleColumn,
          titleSourceType: input.mapping.titleSourceType,
          titleStaticValue: input.mapping.titleStaticValue,
          titleTemplate: input.mapping.titleTemplate,
          dueDateColumn: input.mapping.dueDateColumn,
          dueDateSourceType: input.mapping.dueDateSourceType,
          dueDateStaticValue: input.mapping.dueDateStaticValue,
          dueDateTemplate: input.mapping.dueDateTemplate,
          dueDateFormat: input.mapping.dueDateFormat,
          recipientEmailColumn: input.mapping.recipientEmailColumn,
          recipientEmailSourceType: input.mapping.recipientEmailSourceType,
          recipientEmailStaticValue: input.mapping.recipientEmailStaticValue,
          recipientEmailTemplate: input.mapping.recipientEmailTemplate,
          statusColumn: input.mapping.statusColumn,
          headerRowIndex: input.mapping.headerRowIndex,
          updatedAt: new Date(),
        },
      });

    await db
      .insert(schema.sheetdueEmailTemplates)
      .values({
        watchId: watch.id,
        subject: input.template.subject,
        body: emailBody,
        senderName: input.template.senderName,
      })
      .onConflictDoUpdate({
        target: schema.sheetdueEmailTemplates.watchId,
        set: {
          subject: input.template.subject,
          body: emailBody,
          senderName: input.template.senderName,
          updatedAt: new Date(),
        },
      });

    await db
      .delete(schema.sheetdueReminderRules)
      .where(eq(schema.sheetdueReminderRules.watchId, watch.id));

    if (input.rules.length > 0) {
      await db.insert(schema.sheetdueReminderRules).values(
        input.rules.map((rule) => ({
          watchId: watch.id,
          kind: rule.kind,
          offsetDays: rule.offsetDays,
          repeatIntervalDays: rule.repeatIntervalDays,
          enabled: rule.enabled,
        })),
      );
    }

    return NextResponse.json({ watch }, { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
