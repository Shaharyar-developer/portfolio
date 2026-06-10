import { jsonError } from "@/lib/http";
import { db, schema } from "@workspace/db";
import { verifyPlunkWebhook } from "@workspace/email";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type PlunkWebhookPayload = {
  event?: {
    emailId?: string;
    bouncedAt?: string;
    deliveredAt?: string;
    openedAt?: string;
  };
};

export async function POST(request: Request) {
  try {
    if (!verifyPlunkWebhook(request)) {
      return NextResponse.json({ error: "Invalid webhook token." }, { status: 401 });
    }

    const payload = (await request.json()) as PlunkWebhookPayload;
    const emailId = payload.event?.emailId;

    if (emailId) {
      const status = payload.event?.bouncedAt
        ? "failed"
        : payload.event?.deliveredAt || payload.event?.openedAt
          ? "sent"
          : undefined;

      if (status) {
        await db
          .update(schema.sheetdueReminderEvents)
          .set({
            status,
            errorMessage: payload.event?.bouncedAt ? "Email bounced." : null,
            updatedAt: new Date(),
          })
          .where(eq(schema.sheetdueReminderEvents.providerMessageId, emailId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return jsonError(error, 400);
  }
}
