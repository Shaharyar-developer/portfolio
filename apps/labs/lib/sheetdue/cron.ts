import { getSheetdueGoogleRedirectUri } from "@/lib/google/redirect-uri";
import { inferDateFormatFromValues } from "@/lib/sheetdue/date-inference";
import { assertCanSendReminder, incrementReminderUsage } from "@/lib/sheetdue/usage";
import {
  evaluateSheetRow,
  resolveMappedValue,
  type ReminderRuleKind,
  todayInTimezone,
} from "@/lib/sheetdue/rules";
import { db, schema } from "@workspace/db";
import { sendPlunkEmail } from "@workspace/email";
import {
  createGoogleOAuthClient,
  createSheetsClient,
  decryptToken,
  ensureStableRowIds,
  readSheetPreview,
} from "@workspace/google";
import { and, eq, isNull, lte, or, sql } from "drizzle-orm";

type LockedReminderEvent = {
  id: string;
  watch_id: string;
  recipient_email: string;
  subject: string;
  body: string;
};

function nextScanAt(cadence: string, now: Date) {
  const next = new Date(now);
  next.setUTCHours(
    next.getUTCHours() + (cadence === "hourly" ? 1 : 24),
  );
  return next;
}

function rowsFromExecute(result: unknown) {
  if (Array.isArray(result)) {
    return result as LockedReminderEvent[];
  }

  if (result && typeof result === "object" && "rows" in result) {
    return (result as { rows: LockedReminderEvent[] }).rows;
  }

  return [];
}

export async function scanSheetdueWatches(now = new Date()) {
  const watches = await db
    .select()
    .from(schema.sheetdueSheetWatches)
    .where(
      and(
        eq(schema.sheetdueSheetWatches.status, "active"),
        or(
          isNull(schema.sheetdueSheetWatches.nextScanAt),
          lte(schema.sheetdueSheetWatches.nextScanAt, now),
        ),
      ),
    )
    .limit(25);

  let queued = 0;

  for (const watch of watches) {
    const [connection, mapping, template] = await Promise.all([
      db.query.googleConnections.findFirst({
        where: eq(schema.googleConnections.id, watch.googleConnectionId),
      }),
      db.query.sheetdueColumnMappings.findFirst({
        where: eq(schema.sheetdueColumnMappings.watchId, watch.id),
      }),
      db.query.sheetdueEmailTemplates.findFirst({
        where: eq(schema.sheetdueEmailTemplates.watchId, watch.id),
      }),
    ]);

    const rules = await db
      .select()
      .from(schema.sheetdueReminderRules)
      .where(
        and(
          eq(schema.sheetdueReminderRules.watchId, watch.id),
          eq(schema.sheetdueReminderRules.enabled, true),
        ),
      );

    if (!connection || !mapping || !template || rules.length === 0) {
      await db
        .update(schema.sheetdueSheetWatches)
        .set({
          lastScannedAt: now,
          nextScanAt: nextScanAt(watch.scanCadence, now),
          updatedAt: new Date(),
        })
        .where(eq(schema.sheetdueSheetWatches.id, watch.id));
      continue;
    }

    const client = createGoogleOAuthClient({
      redirectUri: getSheetdueGoogleRedirectUri(),
      accessToken: decryptToken(connection.encryptedAccessToken),
      refreshToken: decryptToken(connection.encryptedRefreshToken),
      expiryDate: connection.accessTokenExpiresAt,
    });
    const sheets = createSheetsClient(client);
    const previewRows = await readSheetPreview({
      sheets,
      spreadsheetId: watch.spreadsheetId,
      sheetTitle: watch.sheetTitle,
      rows: 1000,
    });
    const rows = await ensureStableRowIds({
      sheets,
      spreadsheetId: watch.spreadsheetId,
      sheetId: watch.sheetId,
      sheetTitle: watch.sheetTitle,
      rows: previewRows.map((row) => row.map(String)),
      stableColumnName: watch.stableRowIdColumn,
    });
    const stableColumnIndex =
      rows[0]?.findIndex(
        (header) =>
          header.trim().toLowerCase() === watch.stableRowIdColumn.toLowerCase(),
      ) ?? -1;
    const headers = rows[0] ?? [];
    const dateFormat =
      mapping.dueDateFormat ??
      inferDateFormatFromValues(
        rows.slice(mapping.headerRowIndex).map((row, index) =>
          resolveMappedValue({
            row,
            headers,
            rowNumber: mapping.headerRowIndex + index + 1,
            sourceType: mapping.dueDateSourceType,
            column: mapping.dueDateColumn,
            staticValue: mapping.dueDateStaticValue,
            template: mapping.dueDateTemplate,
          }),
        ),
      ).format;
    const mappingForScan = {
      ...mapping,
      dueDateFormat: dateFormat,
    };
    const today = todayInTimezone(now, watch.timezone);

    for (let rowIndex = mapping.headerRowIndex; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex] ?? [];
      const rowId = stableColumnIndex >= 0 ? row[stableColumnIndex] : "";

      if (!rowId) {
        continue;
      }

      const candidates = evaluateSheetRow({
        watchId: watch.id,
        rowId,
        rowNumber: rowIndex + 1,
        row,
        headers,
        mapping: mappingForScan,
        rules: rules.map((rule) => ({
          id: rule.id,
          kind: rule.kind as ReminderRuleKind,
          offsetDays: rule.offsetDays,
          repeatIntervalDays: rule.repeatIntervalDays,
          enabled: rule.enabled,
        })),
        template,
        today,
        timezone: watch.timezone,
      });

      for (const candidate of candidates) {
        await db
          .insert(schema.sheetdueReminderEvents)
          .values({
            watchId: candidate.watchId,
            ruleId: candidate.ruleId,
            rowId: candidate.rowId,
            dueDate: candidate.dueDate,
            occurrenceDate: candidate.occurrenceDate,
            recipientEmail: candidate.recipientEmail,
            subject: candidate.subject,
            body: candidate.body,
            idempotencyKey: candidate.idempotencyKey,
          })
          .onConflictDoNothing();
        queued += 1;
      }
    }

    await db
      .update(schema.sheetdueSheetWatches)
      .set({
        lastScannedAt: now,
        nextScanAt: nextScanAt(watch.scanCadence, now),
        updatedAt: new Date(),
      })
      .where(eq(schema.sheetdueSheetWatches.id, watch.id));
  }

  return { scanned: watches.length, queued };
}

export async function sendQueuedReminderEvents(limit = 50) {
  const locked = await db.execute(sql`
    update sheetdue_reminder_events
    set status = 'sending', updated_at = now()
    where id in (
      select id
      from sheetdue_reminder_events
      where status = 'queued'
      order by queued_at asc
      limit ${limit}
      for update skip locked
    )
    returning id, watch_id, recipient_email, subject, body
  `);
  const rows = rowsFromExecute(locked);
  let sent = 0;
  let failed = 0;

  for (const event of rows) {
    const watch = await db.query.sheetdueSheetWatches.findFirst({
      where: eq(schema.sheetdueSheetWatches.id, event.watch_id),
    });

    try {
      if (!watch) {
        throw new Error("Sheet watch no longer exists.");
      }

      await assertCanSendReminder(watch.userId);

      const result = await sendPlunkEmail({
        to: event.recipient_email,
        subject: event.subject,
        body: event.body,
        headers: {
          "X-SheetDue-Event": event.id,
        },
      });

      await db
        .update(schema.sheetdueReminderEvents)
        .set({
          status: "sent",
          providerMessageId: result.providerMessageId,
          sentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.sheetdueReminderEvents.id, event.id));

      await incrementReminderUsage(watch.userId);
      sent += 1;
    } catch (error) {
      await db
        .update(schema.sheetdueReminderEvents)
        .set({
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Reminder send failed.",
          updatedAt: new Date(),
        })
        .where(eq(schema.sheetdueReminderEvents.id, event.id));
      failed += 1;
    }
  }

  return { sent, failed };
}

export async function runSheetdueCron() {
  const scan = await scanSheetdueWatches();
  const send = await sendQueuedReminderEvents();

  return {
    ...scan,
    ...send,
  };
}
