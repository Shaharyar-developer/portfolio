"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Database,
  FileSpreadsheet,
  KeyRound,
  MailCheck,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sheet,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "Daily scan",
    activeSheets: "1",
    reminders: "25",
    scan: "Daily",
    bestFor: "Try one client tracker",
  },
  {
    name: "Starter",
    price: "$5/mo",
    cadence: "Daily scan",
    activeSheets: "3",
    reminders: "250",
    scan: "Daily",
    bestFor: "Freelancers with a few active sheets",
  },
  {
    name: "Pro",
    price: "$15/mo",
    cadence: "Hourly scan",
    activeSheets: "Unlimited",
    reminders: "2,500",
    scan: "Hourly",
    bestFor: "Small agencies running follow-ups every day",
  },
  {
    name: "Early lifetime",
    price: "$49",
    cadence: "One-time",
    activeSheets: "Limited",
    reminders: "Early access",
    scan: "Daily",
    bestFor: "Founding users while the product is new",
  },
];

const exampleSheetRows = [
  ["ACME", "Send invoice follow-up", "Jun 18", "you@email.com", "Open"],
  ["Nova Ltd", "Collect logo files", "Jun 20", "client@email.com", "Waiting"],
  ["BlueCo", "Contract renewal", "Jun 25", "ops@email.com", "Open"],
];

const useCases = [
  "Client document requests",
  "Unpaid invoice follow-ups",
  "Proposal follow-ups",
  "Approval reminders",
  "Renewal reminders",
  "Internal client-task deadlines",
];

const templates = [
  {
    title: "Client Follow-Up Tracker",
    body: "Track open client asks, due dates, recipients, and status in one starter sheet.",
    icon: ClipboardList,
  },
  {
    title: "Invoice Reminder Tracker",
    body: "Keep invoice follow-ups and payment nudges from disappearing between projects.",
    icon: ReceiptText,
  },
  {
    title: "Document Collection Tracker",
    body: "Collect files, approvals, and missing client assets without morning sheet checks.",
    icon: FileSpreadsheet,
  },
];

const reliabilityItems = [
  "Sorting rows will not duplicate reminders.",
  "Completed rows are skipped.",
  "Repeated scans do not send the same email twice.",
  "Every sent reminder gets a delivery record.",
  "You can pause a sheet anytime.",
];

const reminderDiagramItems: Array<{
  title: string;
  body: string;
  icon: LucideIcon;
}> = [
  { title: "3 days before", body: "Queue reminder", icon: CalendarClock },
  { title: "Due date", body: "Send if still open", icon: BellRing },
  { title: "Overdue repeat", body: "Repeat every 7 days", icon: RefreshCw },
];

const sectionFrameClass = "min-h-svh px-5 py-16 text-zinc-950 md:py-20";
const sectionInnerClass =
  "mx-auto flex min-h-[calc(100svh-8rem)] max-w-6xl flex-col justify-center";

function ExampleSheet() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/40">
      <div className="flex flex-col gap-3 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Example client follow-up sheet</p>
          <p className="text-xs text-zinc-500">
            The exact columns SheetDue needs: task, due date, recipient, and status.
          </p>
        </div>
        <Badge variant="outline" className="rounded-md">
          No Apps Script required
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              {["Client", "Task", "Due Date", "Owner Email", "Status"].map(
                (header) => (
                  <th key={header} className="px-5 py-4 font-semibold">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {exampleSheetRows.map((row) => (
              <tr
                key={row.join("-")}
                className="border-b border-zinc-100 last:border-b-0"
              >
                {row.map((cell, index) => (
                  <td key={cell} className="px-5 py-5">
                    <span
                      className={cn(
                        index === 0 && "font-semibold",
                        cell === "Waiting" && "text-amber-700",
                        cell === "Open" && "text-emerald-700",
                      )}
                    >
                      {cell}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-0 border-t border-zinc-200 bg-zinc-950 text-white md:grid-cols-3">
        {[
          "Reminder email sent 3 days before due date",
          "Reminder email sent on the due date",
          "Overdue reminders repeat every 7 days until Status = Done",
        ].map((item) => (
          <div key={item} className="border-b border-white/10 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
            <CheckCircle2 className="size-4 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold leading-6">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCaseSheet() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {useCases.map((useCase) => (
        <div
          key={useCase}
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <CheckCircle2 className="size-4 text-emerald-600" />
          <p className="mt-4 font-semibold">{useCase}</p>
        </div>
      ))}
    </div>
  );
}

function TemplateLibrary() {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-3">
      {templates.map(({ title, body, icon: Icon }) => (
        <div
          key={title}
          className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60"
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon className="size-5" />
          </div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{body}</p>
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-medium text-zinc-500">
            Client / Task / Due Date / Recipient Email / Status / Notes
          </div>
        </div>
      ))}
    </div>
  );
}

function ReminderEventCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090a09] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Reminder preview</p>
        <Badge className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-200 hover:bg-emerald-400/10">
          Queued
        </Badge>
      </div>
      <div className="mt-4 rounded-xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          Subject
        </p>
        <p className="mt-2 text-sm font-semibold leading-5 text-white">
          Reminder: Collect W-9 is due 2026-06-13
        </p>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          This is a quick reminder that Collect W-9 is due on 2026-06-13.
        </p>
      </div>
    </div>
  );
}

function HeroConsole() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080908] shadow-2xl shadow-black/70 lg:w-[860px] lg:[mask-image:linear-gradient(to_right,rgba(0,0,0,0.14)_0%,black_18%,black_100%)]">
      <div className="relative p-5">
        <div className="mb-5 flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>SheetDue</span>
              <span>/</span>
              <Badge className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300 hover:bg-white/10">
                Console
              </Badge>
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Client follow-up monitor
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-400">
              Watch invoice, document, approval, and renewal rows from the
              sheet your client work already lives in.
            </p>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Badge className="rounded-full bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10">
              Google connected
            </Badge>
            <Badge className="rounded-full bg-white/10 text-zinc-200 hover:bg-white/10">
              Upgrade
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Plan", "free", "Daily scans while in sandbox."],
            ["Active sheets", "0 / 1", "0 configured watches"],
            ["Reminders", "0 / 50", "Current monthly usage."],
          ].map(([label, value, meta]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {label}
                </p>
                <p className="text-right text-xs leading-5 text-zinc-500">
                  {meta}
                </p>
              </div>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e0d] shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-semibold text-white">New client follow-up monitor</p>
              <p className="mt-1 text-xs text-zinc-500">
                One guided flow: source, worksheet, mapped values, then
                schedule.
              </p>
            </div>
            <Badge className="rounded-full bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10">
              Google connected
            </Badge>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="rounded-md bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10">
                  Google Sheet
                </Badge>
                <p className="mt-2 text-sm font-semibold text-white">Sheet1</p>
                <p className="text-xs text-zinc-500">8 detected headers</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-300 hover:text-white"
              >
                Change tab
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-1">
              {[0, 1, 2].map((index) => (
                <div key={index} className="h-1.5 rounded-full bg-white" />
              ))}
              <div className="h-1.5 rounded-full bg-white/5" />
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_19rem]">
              <div>
                <p className="text-xl font-semibold text-white">
                  Review the mapped values
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  SheetDue guessed the task, date, and recipient. Change only
                  what looks wrong.
                </p>
                <MappingCard />
              </div>
              <ReminderEventCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MappingCard() {
  const fields = [
    ["Task", "A - Task", "Auto"],
    ["Due date", "B - Due date", "ISO detected"],
    ["Recipient", "C - Owner Email", "Auto"],
    ["Status", "D - Status", "Optional"],
  ];

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-emerald-300" />
        <p className="text-sm font-semibold text-white">Auto-mapped fields</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([label, value, meta]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-400">{label}</span>
              <Badge className="rounded-md bg-white/5 text-[10px] text-zinc-300 hover:bg-white/5">
                {meta}
              </Badge>
            </div>
            <span className="mt-2 block truncate text-sm font-semibold text-zinc-100">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReminderDiagram() {
  const days = Array.from({ length: 11 }).map((_, index) => index - 5);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-50 shadow-2xl shadow-zinc-200/70">
      <div className="border-b border-zinc-200 bg-white px-5 py-4">
        <p className="text-sm font-semibold">Rule preview for “Collect W-9”</p>
        <p className="text-xs text-zinc-500">
          Due on 2026-06-13, spreadsheet timezone respected
        </p>
      </div>
      <div className="p-5">
        <div className="relative rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="absolute left-10 right-10 top-1/2 h-1 -translate-y-1/2 rounded-full bg-zinc-200" />
          <div className="relative grid grid-cols-11 gap-1">
            {days.map((offset) => {
              const isBefore = offset === -3;
              const isDue = offset === 0;
              const isRepeat = offset === 4;

              return (
                <div key={offset} className="grid justify-items-center gap-3">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full border bg-white text-sm font-semibold shadow-sm",
                      isBefore &&
                        "border-emerald-500 bg-emerald-50 text-emerald-700",
                      isDue && "border-zinc-950 bg-zinc-950 text-white",
                      isRepeat && "border-amber-500 bg-amber-50 text-amber-700",
                    )}
                  >
                    {offset === 0 ? "Due" : offset > 0 ? `+${offset}` : offset}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-500">
                    {offset === 0
                      ? "Jun 13"
                      : offset > 0
                        ? `+${offset}d`
                        : `${Math.abs(offset)}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {reminderDiagramItems.map(({ title, body, icon: Icon }) => (
            <div
              key={title}
              className="grid grid-cols-[36px_1fr] gap-3 rounded-2xl bg-white p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReliabilityDiagram() {
  const attempts = [
    {
      worker: "Cron run A",
      time: "10:00:01",
      operation: "Insert reminder event",
      result: "Created",
      outcome: "Email is sent",
      tone: "success",
    },
    {
      worker: "Cron run B",
      time: "10:00:04",
      operation: "Insert same event",
      result: "Unique conflict",
      outcome: "Email is skipped",
      tone: "muted",
    },
  ];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#060706] shadow-2xl shadow-black/50">
      <div className="grid border-b border-white/10 lg:grid-cols-[1fr_17rem]">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-white">
                Duplicate-send simulation
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Two cron runs find the same due row. Only one reminder is
                allowed.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-white/10 text-sm lg:border-l lg:border-t-0">
          <div className="border-r border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Free
            </p>
            <p className="mt-1 font-semibold text-white">Daily scan</p>
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Pro</p>
            <p className="mt-1 font-semibold text-white">Hourly scan</p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-emerald-300" />
                <p className="text-sm font-semibold text-white">
                  Sheet row being scanned
                </p>
              </div>
              <Badge className="rounded-md bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10">
                Open
              </Badge>
            </div>
            <div className="grid gap-px bg-white/10 text-sm sm:grid-cols-5">
              {[
                ["_sheetdue_row_id", "row_8f21"],
                ["Task", "Collect W-9"],
                ["Due date", "2026-06-13"],
                ["Recipient", "ops@example.com"],
                ["Rule", "3 days before"],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#101211] p-4">
                  <p className="text-xs font-semibold text-zinc-500">{label}</p>
                  <p
                    className={cn(
                      "mt-3 break-words text-sm font-semibold text-white",
                      label === "_sheetdue_row_id" &&
                        "font-mono text-emerald-200",
                    )}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-1 size-5 shrink-0 text-emerald-200" />
              <div>
                <p className="text-sm font-semibold text-emerald-50">
                  The row can move, but the key does not.
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  Sorting or filtering the sheet changes row position, not the
                  hidden row id used to identify this reminder.
                </p>
              </div>
            </div>
            <p className="mt-4 break-all rounded-xl border border-emerald-300/15 bg-black/30 px-3 py-2 font-mono text-xs leading-5 text-emerald-50">
              watch_ops + row_8f21 + 2026-06-13 + before_3_days +
              ops@example.com
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-white/10 bg-black/40">
            <div className="grid grid-cols-[1fr_auto] border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Database className="size-4 text-emerald-300" />
                <p className="text-sm font-semibold text-white">
                  reminder_events
                </p>
              </div>
              <p className="text-xs font-medium text-zinc-500">unique index</p>
            </div>
            <div className="divide-y divide-white/10">
              {attempts.map((attempt) => (
                <div
                  key={attempt.worker}
                  className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {attempt.worker}
                      </p>
                      <span className="text-xs text-zinc-500">
                        {attempt.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">
                      {attempt.operation}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Badge
                      className={cn(
                        "rounded-md",
                        attempt.tone === "success"
                          ? "bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10"
                          : "bg-white/5 text-zinc-300 hover:bg-white/5",
                      )}
                    >
                      {attempt.result}
                    </Badge>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        attempt.tone === "success"
                          ? "text-emerald-200"
                          : "text-zinc-500",
                      )}
                    >
                      {attempt.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <MailCheck className="size-4 text-emerald-300" />
                <p className="text-sm font-semibold text-white">
                  Delivery record
                </p>
              </div>
            </div>
            <div className="grid gap-3 p-4 text-sm">
              <div className="grid grid-cols-[7rem_1fr] gap-3">
                <span className="text-zinc-500">Status</span>
                <span className="font-semibold text-emerald-200">sent</span>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-3">
                <span className="text-zinc-500">Provider ID</span>
                <span className="font-mono text-xs text-zinc-300">
                  plunk_msg_4N7...
                </span>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-3">
                <span className="text-zinc-500">Next repeat</span>
                <span className="text-zinc-300">
                  Only if row remains overdue
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 text-center text-xs">
            {[
              ["1 row", "stable id"],
              ["1 event", "unique key"],
              ["1 email", "provider log"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="border-r border-white/10 p-4 last:border-r-0"
              >
                <p className="text-base font-semibold text-white">{value}</p>
                <p className="mt-1 text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingWorkbench() {
  return (
    <div className="mt-10 grid items-start gap-6">
      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5 shadow-xl shadow-zinc-200/50",
              plan.name === "Starter" && "border-zinc-950 bg-white shadow-2xl",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {plan.bestFor}
                </p>
              </div>
              {plan.name === "Starter" ? (
                <Badge className="rounded-full bg-zinc-950 text-white hover:bg-zinc-950">
                  wedge
                </Badge>
              ) : null}
            </div>
            <p className="mt-6 text-3xl font-semibold tracking-tight">
              {plan.price}
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <span className="text-zinc-500">Sheets</span>
                <span className="font-semibold">{plan.activeSheets}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <span className="text-zinc-500">Reminders</span>
                <span className="font-semibold">{plan.reminders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Scan</span>
                <span className="font-semibold">{plan.cadence}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-2xl shadow-zinc-300/50">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-sm font-semibold">Start free, prove the workflow.</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                The free plan should answer one question: will automatic
                follow-up emails save you from checking the sheet manually?
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "No checkout for Free",
                "Starter for freelancers",
                "Pro for hourly scans",
                "Early lifetime for founding users",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="h-full min-h-24 rounded-[2rem] bg-zinc-950 text-white hover:bg-zinc-800"
        >
          <Link href="/sheetdue/dashboard" className="flex-col gap-2">
            <span>Start with one sheet</span>
            <span className="flex items-center gap-2 text-sm font-normal text-zinc-300">
              No Apps Script required
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function SheetdueLandingClient() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-400/25">
      <section className="min-h-svh px-3 py-3 sm:px-5 sm:py-5">
        <div className="relative mx-auto flex min-h-[calc(100svh-1.5rem)] md:max-w-[80%] flex-col overflow-hidden rounded-[2rem] sm:min-h-[calc(100svh-2.5rem)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,#000_0%,#000_48%,transparent_100%)]" />
          <div className="pointer-events-none absolute right-0 top-0 h-[520px] w-[520px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_62%)]" />

          <header className="relative z-10 flex items-center justify-between px-5 py-4 md:px-8">
            <Link href="/sheetdue" className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                <Sheet className="size-4 text-emerald-300" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                SheetDue
              </span>
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-400 md:flex">
              <Link href="#example" className="hover:text-white">
                Example
              </Link>
              <Link href="#workflow" className="hover:text-white">
                How it works
              </Link>
              <Link href="#templates" className="hover:text-white">
                Templates
              </Link>
              <Link href="#pricing" className="hover:text-white">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden text-zinc-300 hover:text-white sm:inline-flex"
              >
                <Link href="/sheetdue/dashboard">Log in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-white text-black hover:bg-zinc-200"
              >
                <Link href="/sheetdue/dashboard">Start free</Link>
              </Button>
            </div>
          </header>

          <div className="relative z-10 grid flex-1 gap-10 px-5 py-10 md:px-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(560px,1.16fr)] lg:items-center lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.85rem] lg:leading-[0.95]">
                Never miss a client follow-up in Google Sheets.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400">
                SheetDue watches your due-date, status, and email columns, then
                sends reminder emails before client tasks, invoices, documents,
                or renewals become overdue.
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500">
                Connect your sheet. Pick the due-date, email, task, and status
                columns. Let reminders send automatically.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  <Link href="/sheetdue/dashboard">
                    Start free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="#example">View example sheet</Link>
                </Button>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3 lg:max-w-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  No Apps Script
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  No Zapier setup
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  No calendar workaround
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              className="relative lg:-ml-24 lg:translate-x-8"
            >
              <HeroConsole />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="example" className={cn(sectionFrameClass, "bg-zinc-100")}>
        <div className={sectionInnerClass}>
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Example sheet
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Turn your client tracker into an automatic reminder system.
              </h2>
            </div>
            <p className="text-lg leading-8 text-zinc-600">
              If your sheet already has client tasks, due dates, recipient
              emails, and a status column, SheetDue can watch it. No Apps
              Script, Zapier setup, calendar workaround, or morning manual
              checking.
            </p>
          </div>

          <div className="mt-12">
            <ExampleSheet />
          </div>
        </div>
      </section>

      <section id="workflow" className={cn(sectionFrameClass, "bg-white")}>
        <div
          className={cn(
            sectionInnerClass,
            "grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center",
          )}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Four decisions, then the emails go out automatically.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Connect your Google Sheet, choose the due-date, recipient, task,
              and status columns, pick reminder rules, then let SheetDue send
              follow-up emails before rows become overdue.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                "Connect your Google Sheet or import an Excel workbook.",
                "Choose the due-date, recipient, task, and status columns.",
                "Pick before-due, due-date, and repeat-overdue rules.",
                "SheetDue sends emails and records delivery logs.",
              ].map((step, index) => (
                <div key={step} className="grid grid-cols-[2.25rem_1fr] items-start gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-sm font-medium leading-6 text-zinc-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ReminderDiagram />
        </div>
      </section>

      <section className={cn(sectionFrameClass, "bg-zinc-100")}>
        <div className={sectionInnerClass}>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Use cases
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Built for freelancers and small agencies tracking client work.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                Start narrow: follow-ups that already live in your client
                tracker, invoice tracker, proposal sheet, or document collection
                list.
              </p>
            </div>
            <UseCaseSheet />
          </div>
        </div>
      </section>

      <section id="templates" className={cn(sectionFrameClass, "bg-white")}>
        <div className={sectionInnerClass}>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Free templates
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Start from a sheet that is already shaped for reminders.
              </h2>
            </div>
            <p className="text-lg leading-8 text-zinc-600">
              The easiest first step is not a blank app. It is a working Google
              Sheet template with the right columns already in place.
            </p>
          </div>
          <TemplateLibrary />
          <div className="mt-8 rounded-2xl bg-zinc-950 p-5 text-white md:flex md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">Get the free client follow-up sheet.</p>
              <p className="mt-1 text-sm text-zinc-400">
                Want automatic email reminders from it? Connect the template to SheetDue.
              </p>
            </div>
            <Button asChild className="mt-5 bg-white text-black hover:bg-zinc-200 md:mt-0">
              <Link href="/sheetdue/dashboard">
                Start with the template
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className={cn(sectionFrameClass, "bg-white")}>
        <div className={sectionInnerClass}>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Pricing
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Start with one client sheet. Upgrade when follow-ups become routine.
              </h2>
            </div>
            <p className="text-lg leading-8 text-zinc-600">
              Pricing is framed around adoption: one sheet for free, a cheap
              starter tier for freelancers, and Pro when an agency needs more
              sheets and hourly scans.
            </p>
          </div>
          <PricingWorkbench />
        </div>
      </section>

      <section
        id="reliability"
        className="min-h-svh bg-zinc-950 px-5 py-16 text-white md:py-20"
      >
        <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-6xl flex-col justify-center">
          <div className="grid gap-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Reliability
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  Safe to use on messy real spreadsheets.
                </h2>
              </div>
              <div>
                <p className="text-lg leading-8 text-zinc-400">
                  Rows can move, sheets can be sorted, scans can rerun, and
                  completed tasks can be skipped without duplicate reminder
                  emails.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {reliabilityItems.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className="size-4 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ReliabilityDiagram />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-5 py-8 text-sm text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="size-4 text-emerald-300" />
            SheetDue runs under labs.shaharyar.dev
          </div>
          <div className="flex gap-4">
            <Link href="/sheetdue/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/api/google/oauth/start" className="hover:text-white">
              Connect Google
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
