import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/http";
import { assertCanActivateSheet } from "@/lib/sheetdue/usage";
import { getUserSheetduePlan, sheetduePlanLimits } from "@workspace/billing";
import { db, schema } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["draft", "active", "paused"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ watchId: string }> },
) {
  try {
    const user = await requireUser();
    const { watchId } = await context.params;
    const input = patchSchema.parse(await request.json());
    const plan = await getUserSheetduePlan(user.id);
    const existing = await db.query.sheetdueSheetWatches.findFirst({
      where: and(
        eq(schema.sheetdueSheetWatches.id, watchId),
        eq(schema.sheetdueSheetWatches.userId, user.id),
      ),
    });

    if (!existing) {
      throw new Error("Sheet watch not found.");
    }

    if (input.status === "active") {
      await assertCanActivateSheet(user.id, {
        excludeWatchId: existing.id,
      });
    }

    const [watch] = await db
      .update(schema.sheetdueSheetWatches)
      .set({
        status: input.status,
        scanCadence: sheetduePlanLimits[plan].scanCadence,
        nextScanAt: input.status === "active" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.sheetdueSheetWatches.id, watchId),
          eq(schema.sheetdueSheetWatches.userId, user.id),
        ),
      )
      .returning();

    if (!watch) {
      throw new Error("Sheet watch not found.");
    }

    return NextResponse.json({ watch });
  } catch (error) {
    return jsonError(error, 400);
  }
}
