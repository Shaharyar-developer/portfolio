import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SheetdueDashboardClient } from "./dashboard-client";
import { getCurrentSession } from "@/lib/auth/session";
import { getUsageSnapshot } from "@/lib/sheetdue/usage";
import {
  SHEETDUE_APP_KEY,
  getUserSheetduePlan,
  sheetduePlanLimits,
} from "@workspace/billing";
import { db, schema } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Lock } from "lucide-react";
import { and, desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";

export const metadata = {
  title: "SheetDue Dashboard",
};

export default async function SheetdueDashboardPage() {
  const session = await getCurrentSession().catch(() => null);

  if (!session?.user) {
    return (
      <main className="relative min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 flex flex-col justify-center items-center">
        {/* Background ambient glows */}
        <div className="absolute top-[30%] right-[-10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md shadow-xl relative z-10 flex flex-col gap-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Lock className="size-5" />
          </div>
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Access Dashboard</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in with your Google account to connect sheets, customize rules, and monitor active due dates.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 pt-2">
            <GoogleSignInButton />
            <Button asChild variant="ghost" className="text-xs text-muted-foreground border-t border-border/10 rounded-xl pt-4">
              <Link href="/sheetdue">
                <ArrowLeft className="size-3.5 mr-1" />
                Back to product details
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const [connections, watches, plan, usageSnapshot] = await Promise.all([
    db
      .select()
      .from(schema.googleConnections)
      .where(
        and(
          eq(schema.googleConnections.userId, session.user.id),
          eq(schema.googleConnections.appKey, SHEETDUE_APP_KEY),
        ),
      ),
    db
      .select()
      .from(schema.sheetdueSheetWatches)
      .where(eq(schema.sheetdueSheetWatches.userId, session.user.id))
      .orderBy(desc(schema.sheetdueSheetWatches.createdAt)),
    getUserSheetduePlan(session.user.id),
    getUsageSnapshot(session.user.id),
  ]);

  const watchIds = watches.map((watch) => watch.id);
  const events =
    watchIds.length === 0
      ? []
      : await db
          .select()
          .from(schema.sheetdueReminderEvents)
          .where(inArray(schema.sheetdueReminderEvents.watchId, watchIds))
          .orderBy(desc(schema.sheetdueReminderEvents.createdAt))
          .limit(20);
  const limits = sheetduePlanLimits[plan];

  return (
    <SheetdueDashboardClient
      connections={connections}
      watches={watches}
      plan={plan}
      usageSnapshot={usageSnapshot}
      limits={limits}
      events={events}
    />
  );
}
