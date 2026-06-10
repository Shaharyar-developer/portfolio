"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { SheetdueSetupForm } from "@/components/sheetdue-setup-form";
import { WatchStatusButton } from "@/components/watch-status-button";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  ExternalLink,
  History,
  Link2,
  Mail,
  Sheet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

type Connection = {
  id: string;
  email: string;
  scopes: string | null;
};

type Watch = {
  id: string;
  spreadsheetName: string;
  sheetTitle: string;
  scanCadence: string;
  status: string;
};

type ReminderEvent = {
  id: string;
  status: string;
  recipientEmail: string;
  subject: string;
  queuedAt: Date;
};

type DashboardClientProps = {
  connections: Connection[];
  watches: Watch[];
  plan: string;
  usageSnapshot: {
    usage: {
      activeSheets: number;
      remindersSent: number;
    };
  };
  limits: {
    activeSheets: number | "unlimited" | string;
    remindersPerMonth: number | "unlimited" | string;
  };
  events: ReminderEvent[];
};

type DashboardTab = "setup" | "watches" | "logs";

const dashboardTabs: Array<{
  id: DashboardTab;
  label: string;
  icon: typeof Activity;
}> = [
  { id: "setup", label: "New Watch", icon: Activity },
  { id: "watches", label: "Watches", icon: Sheet },
  { id: "logs", label: "Logs", icon: History },
];

function displayLimit(value: DashboardClientProps["limits"]["activeSheets"]) {
  return typeof value === "number" ? value.toLocaleString() : value;
}

function usagePercent(used: number, limit: number | "unlimited" | string) {
  return typeof limit === "number" ? Math.min((used / limit) * 100, 100) : 100;
}

function UsageMetric({
  label,
  value,
  limit,
  detail,
}: {
  label: string;
  value: number | string;
  limit?: number | "unlimited" | string;
  detail: string;
}) {
  const numericValue = typeof value === "number" ? value : 0;
  const percent = limit ? usagePercent(numericValue, limit) : 100;

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 text-xl font-semibold tracking-tight">
            <span>{typeof value === "number" ? value.toLocaleString() : value}</span>
            {limit ? (
              <span className="text-sm font-medium text-muted-foreground">
                / {displayLimit(limit)}
              </span>
            ) : null}
          </p>
        </div>
        <p className="max-w-[140px] text-right text-xs leading-5 text-muted-foreground">
          {detail}
        </p>
      </div>
      {limit ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function ConnectionControl({ connections }: { connections: Connection[] }) {
  if (connections.length === 0) {
    return (
      <Button asChild size="sm">
        <Link href="/api/google/oauth/start">
          <Sheet aria-hidden className="size-4" />
          Connect Sheets
        </Link>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="max-w-[210px] justify-start"
        >
          <Link2 aria-hidden className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">Google connected</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="grid gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Connected account
              </p>
              <p className="mt-1 truncate text-sm font-semibold">
                {connections[0]?.email}
              </p>
            </div>
            <Badge className="rounded-md bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
              Active
            </Badge>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Drive search, Google Sheet monitoring, and Excel import use this
            connection. Reconnect if scopes change.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/api/google/oauth/start">
              <Link2 aria-hidden className="size-4" />
              Reconnect Google
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function statusTone(status: string) {
  if (status === "active" || status === "sent" || status === "delivered") {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (status === "paused" || status === "pending" || status === "queued") {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return "bg-destructive/10 text-destructive";
}

export function SheetdueDashboardClient({
  connections,
  watches,
  plan,
  usageSnapshot,
  limits,
  events,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("setup");

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="mx-auto flex w-full max-w-[1260px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="grid gap-5 border-b border-border pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Link
                  href="/sheetdue"
                  className="transition-colors hover:text-foreground"
                >
                  SheetDue
                </Link>
                <span className="text-border">/</span>
                <Badge
                  variant="outline"
                  className="h-5 rounded-md px-1.5 text-[10px]"
                >
                  Console
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Sheet monitors
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Create due-date monitors from Drive files, review the inferred
                values, and keep delivery logs close to the active watches.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ModeToggle />
              <ConnectionControl connections={connections} />
              <Button asChild variant="secondary" size="sm">
                <Link href="/api/billing/checkout">
                  <CreditCard aria-hidden className="size-4" />
                  Upgrade
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sheetdue">
                  <ExternalLink aria-hidden className="size-4" />
                  Landing
                </Link>
              </Button>
            </div>
          </div>

          <section className="grid gap-2 md:grid-cols-3">
            <UsageMetric
              label="Plan"
              value={plan}
              detail={
                plan === "free"
                  ? "Daily scans while in sandbox."
                  : "Hourly scans enabled."
              }
            />
            <UsageMetric
              label="Active sheets"
              value={usageSnapshot.usage.activeSheets}
              limit={limits.activeSheets}
              detail={`${watches.length} configured watch${
                watches.length === 1 ? "" : "es"
              }`}
            />
            <UsageMetric
              label="Reminders"
              value={usageSnapshot.usage.remindersSent}
              limit={limits.remindersPerMonth}
              detail="Current monthly usage."
            />
          </section>
        </header>

        <nav
          className="mt-4 flex w-full overflow-x-auto border-b border-border"
          aria-label="SheetDue dashboard"
        >
          {dashboardTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex h-11 items-center gap-2 px-4 text-sm font-semibold transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <TabIcon aria-hidden className="size-4" />
                {tab.label}
                {isActive ? (
                  <motion.span
                    layoutId="sheetdue-dashboard-tab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="mt-5">
          <AnimatePresence mode="wait">
            {activeTab === "setup" ? (
              <motion.section
                key="setup"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_28px_90px_rgba(0,0,0,0.14),0_1px_0_rgba(255,255,255,0.06)_inset] ring-1 ring-foreground/[0.03] dark:shadow-[0_32px_110px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.06)_inset]"
              >
                <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <h2 className="text-base font-semibold">New monitor</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      One guided flow: source, worksheet, mapped values, then
                      schedule.
                    </p>
                  </div>
                  <ConnectionControl connections={connections} />
                </div>
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <SheetdueSetupForm
                    hasGoogleConnection={connections.length > 0}
                  />
                </div>
              </motion.section>
            ) : null}

            {activeTab === "watches" ? (
              <motion.section
                key="watches"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl border border-border/80 bg-card/95 shadow-[0_24px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <h2 className="text-base font-semibold">Configured watches</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pause or resume scans without changing the setup.
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-md">
                    {watches.length} total
                  </Badge>
                </div>
                <div className="divide-y divide-border">
                  {watches.length === 0 ? (
                    <div className="grid min-h-64 place-items-center px-5 py-12 text-center">
                      <div className="max-w-sm">
                        <Sheet className="mx-auto size-9 text-muted-foreground/45" />
                        <p className="mt-4 font-semibold">No watches yet</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Create a monitor from the New Watch tab and it will
                          appear here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    watches.map((watch) => (
                      <div
                        key={watch.id}
                        className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-semibold">
                              {watch.spreadsheetName}
                            </p>
                            <Badge
                              className={cn(
                                "rounded-md px-2 py-0 text-[10px] uppercase",
                                statusTone(watch.status),
                              )}
                            >
                              {watch.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {watch.sheetTitle} · {watch.scanCadence} scans
                          </p>
                        </div>
                        <WatchStatusButton
                          watchId={watch.id}
                          status={watch.status}
                        />
                      </div>
                    ))
                  )}
                </div>
              </motion.section>
            ) : null}

            {activeTab === "logs" ? (
              <motion.section
                key="logs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_24px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-semibold">
                      <Mail aria-hidden className="size-4" />
                      Delivery logs
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Latest queued, sent, and failed reminders.
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/api/cron/sheetdue">
                      Cron
                      <ArrowUpRight aria-hidden className="size-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/35 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Recipient</th>
                        <th className="px-5 py-3">Subject</th>
                        <th className="px-5 py-3 text-right">Queued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {events.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-16 text-center">
                            <History className="mx-auto size-8 text-muted-foreground/45" />
                            <p className="mt-4 font-semibold">No delivery logs</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Logs appear after a scan queues reminders.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        events.map((event) => (
                          <tr key={event.id} className="hover:bg-muted/20">
                            <td className="px-5 py-3">
                              <Badge
                                className={cn(
                                  "rounded-md px-2 py-0 text-[10px] uppercase",
                                  statusTone(event.status),
                                )}
                              >
                                {event.status}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 font-medium">
                              {event.recipientEmail}
                            </td>
                            <td className="max-w-[340px] truncate px-5 py-3 text-muted-foreground">
                              {event.subject}
                            </td>
                            <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                              {new Date(event.queuedAt).toLocaleString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
