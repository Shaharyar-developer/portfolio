import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/http";
import { defaultReminderTemplate } from "@/lib/sheetdue/defaults";
import { buildReminderIdempotencyKey, toDateOnly } from "@/lib/sheetdue/rules";
import { db, schema } from "@workspace/db";
import { renderSheetdueReminderEmail, sendPlunkEmail } from "@workspace/email";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const testEmailSchema = z.object({
  watchId: z.string().optional(),
  to: z.string().email(),
  subject: z.string().min(1).default(defaultReminderTemplate.subject),
  body: z.string().optional().nullable(),
  preset: z
    .enum(["gentle_reminder", "payment_request", "internal_followup"])
    .default("gentle_reminder"),
  headline: z.string().trim().optional().nullable(),
  intro: z.string().trim().optional().nullable(),
  closing: z.string().trim().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = testEmailSchema.parse(await request.json());

    if (input.watchId) {
      const watch = await db.query.sheetdueSheetWatches.findFirst({
        where: and(
          eq(schema.sheetdueSheetWatches.id, input.watchId),
          eq(schema.sheetdueSheetWatches.userId, user.id),
        ),
      });

      if (!watch) {
        throw new Error("Sheet watch not found.");
      }
    }

    const body =
      input.body?.trim() ||
      (await renderSheetdueReminderEmail({
        preset: input.preset,
        headline: input.headline,
        intro: input.intro,
        closing: input.closing,
      }));

    const result = await sendPlunkEmail({
      to: input.to,
      subject: input.subject,
      body,
      headers: {
        "X-SheetDue-Test": "true",
      },
    });

    if (input.watchId) {
      const today = toDateOnly(new Date());
      await db.insert(schema.sheetdueReminderEvents).values({
        watchId: input.watchId,
        rowId: "__test__",
        dueDate: today,
        occurrenceDate: today,
        recipientEmail: input.to,
        subject: input.subject,
        body,
        status: "sent",
        providerMessageId: result.providerMessageId,
        sentAt: new Date(),
        idempotencyKey: buildReminderIdempotencyKey({
          watchId: input.watchId,
          rowId: "__test__",
          dueDate: today,
          ruleId: "__test__",
          recipientEmail: input.to,
          occurrenceDate: today,
        }),
      });
    }

    return NextResponse.json({ ok: true, providerMessageId: result.providerMessageId });
  } catch (error) {
    return jsonError(error, 400);
  }
}
