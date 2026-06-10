"use client";

import { defaultReminderTemplate } from "@/lib/sheetdue/defaults";
import {
  inferDateFormatFromValues,
  parseSheetdueDateValue,
  sheetdueDateFormatOptions,
  type SheetdueDateFormat,
} from "@/lib/sheetdue/date-inference";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Columns3,
  FileText,
  FileSpreadsheet,
  MailCheck,
  Mail,
  Plus,
  Play,
  RefreshCw,
  Repeat2,
  Search,
  Send,
  Sheet,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type SetupFormProps = {
  hasGoogleConnection: boolean;
};

type SubmitState = {
  status: "idle" | "pending" | "success" | "error";
  message: string;
};

type SpreadsheetOption = {
  id: string;
  name: string;
  mimeType: string;
  kind: "google_sheet" | "excel";
  modifiedTime?: string;
  webViewLink?: string;
  convertedFromFileId?: string;
};

type SheetTab = {
  sheetId: number;
  title: string;
};

type ColumnOption = {
  value: string;
  label: string;
  header: string;
};

type ColumnGuess = {
  column: string;
  score: number;
  confidence: "high" | "medium" | "low";
  reason: string;
};

type ColumnGuesses = {
  title: ColumnGuess | null;
  dueDate: ColumnGuess | null;
  recipientEmail: ColumnGuess | null;
  status: ColumnGuess | null;
};

type ValueSourceType = "column" | "static" | "template";
type EmailPreset = "gentle_reminder" | "payment_request" | "internal_followup";

type SpreadsheetMetadata = {
  spreadsheetId: string;
  title: string;
  timezone: string;
  sheets: SheetTab[];
};

type WatchValues = {
  titleColumn: string;
  titleSourceType: ValueSourceType;
  titleStaticValue: string;
  titleTemplate: string;
  dueDateColumn: string;
  dueDateSourceType: ValueSourceType;
  dueDateStaticValue: string;
  dueDateTemplate: string;
  dueDateFormat: "auto" | SheetdueDateFormat;
  recipientEmailColumn: string;
  recipientEmailSourceType: ValueSourceType;
  recipientEmailStaticValue: string;
  recipientEmailTemplate: string;
  statusColumn: string;
  headerRowIndex: string;
  beforeDays: string;
  onDue: boolean;
  repeatOverdue: boolean;
  repeatDays: string;
  senderName: string;
  subject: string;
  emailPreset: EmailPreset;
  emailHeadline: string;
  emailIntro: string;
  emailClosing: string;
  body: string;
  status: "draft" | "active" | "paused";
};

type ActiveStage =
  | "connect"
  | "source"
  | "import"
  | "worksheet"
  | "columns"
  | "finish";

type ComboBoxOption = {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

const stageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};
const revealTransition = { duration: 0.18, ease: "easeOut" as const };

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-all duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50";
const labelClass = "grid gap-1.5 text-xs font-semibold text-foreground/80";

const emailPresets = {
  gentle_reminder: {
    label: "Gentle reminder",
    description: "Neutral and light, good for most due-date follow-ups.",
    subject: "Reminder: {{task}} is due {{dueDate}}",
    headline: "{{task}} is due {{dueDate}}",
    intro: "This is a quick reminder that {{task}} is due on {{dueDate}}.",
    closing: "Please take the needed action when you can.",
  },
  payment_request: {
    label: "Payment request",
    description: "A bit more direct for receivables and expenses.",
    subject: "Payment reminder for {{task}}",
    headline: "Payment reminder",
    intro: "A payment item, {{task}}, is due on {{dueDate}}.",
    closing: "Please review the sheet and arrange the next step.",
  },
  internal_followup: {
    label: "Internal follow-up",
    description: "Short copy for teammates and operational reminders.",
    subject: "Follow up: {{task}}",
    headline: "Follow-up needed",
    intro: "{{task}} needs attention by {{dueDate}}.",
    closing: "Thanks for keeping this moving.",
  },
} as const satisfies Record<
  EmailPreset,
  {
    label: string;
    description: string;
    subject: string;
    headline: string;
    intro: string;
    closing: string;
  }
>;

type EmailFieldKey =
  | "subject"
  | "emailHeadline"
  | "emailIntro"
  | "emailClosing";

const emailFields: Array<{
  key: EmailFieldKey;
  label: string;
  description: string;
}> = [
  {
    key: "subject",
    label: "Subject",
    description: "The inbox line.",
  },
  {
    key: "emailHeadline",
    label: "Headline",
    description: "The first line inside the email.",
  },
  {
    key: "emailIntro",
    label: "Message",
    description: "The main reminder sentence.",
  },
  {
    key: "emailClosing",
    label: "Closing",
    description: "A short sign-off.",
  },
];

function SearchCombobox({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
  loading,
  onSearchChange,
  onSelect,
}: {
  value: string;
  options: ComboBoxOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-auto min-h-10 w-full justify-between rounded-lg border-border bg-background px-3 py-2 text-left shadow-sm hover:bg-background"
        >
          <span className="flex min-w-0 items-center gap-2">
            {selected?.icon}
            <span className="grid min-w-0 gap-0.5">
              <span
                className={cn(
                  "truncate text-sm",
                  !selected && "text-muted-foreground",
                )}
              >
                {selected?.label ?? placeholder}
              </span>
              {selected?.description ? (
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {selected.description}
                </span>
              ) : null}
            </span>
          </span>
          {loading ? (
            <RefreshCw className="ml-2 size-4 shrink-0 animate-spin opacity-60" />
          ) : (
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(520px,calc(100vw-2rem))] p-0"
        align="start"
      >
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>{loading ? "Loading..." : emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.description ?? ""}`}
                  onSelect={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                >
                  {option.icon}
                  <span className="grid min-w-0 gap-0.5">
                    <span className="truncate font-medium">{option.label}</span>
                    {option.description ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "Recently modified";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headerKeywordScore(header: string, keywords: string[]) {
  const normalized = normalizeHeader(header);

  return keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeHeader(keyword);

    if (normalized === normalizedKeyword) {
      return score + 7;
    }

    if (normalized.includes(normalizedKeyword)) {
      return score + 4;
    }

    return score;
  }, 0);
}

function confidenceForScore(score: number): ColumnGuess["confidence"] {
  if (score >= 9) {
    return "high";
  }

  if (score >= 5) {
    return "medium";
  }

  return "low";
}

function columnSamples(input: {
  rows: string[][];
  column: string;
  headerRowIndex: number;
}) {
  const startIndex = Math.max(0, input.headerRowIndex);

  return input.rows
    .slice(startIndex + 1, startIndex + 31)
    .map((row) => rowValueByColumn(row, input.column).trim())
    .filter(Boolean);
}

function nonNumericTextScore(samples: string[]) {
  if (samples.length === 0) {
    return 0;
  }

  const textLike = samples.filter((sample) => {
    const normalized = sample.replace(/[,\s]/g, "");
    const isNumber = normalized !== "" && !Number.isNaN(Number(normalized));
    return !isNumber && !emailPattern.test(sample);
  });
  const averageLength =
    textLike.reduce((total, sample) => total + sample.length, 0) /
    Math.max(textLike.length, 1);

  return (
    (textLike.length / samples.length) * 4 + Math.min(averageLength / 16, 3)
  );
}

function makeGuess(
  column: ColumnOption,
  score: number,
  reason: string,
): ColumnGuess | null {
  if (score < 3) {
    return null;
  }

  return {
    column: column.value,
    score,
    confidence: confidenceForScore(score),
    reason,
  };
}

function bestGuess(guesses: Array<ColumnGuess | null>, excluded: Set<string>) {
  return (
    guesses
      .filter((guess): guess is ColumnGuess => Boolean(guess))
      .filter((guess) => !excluded.has(guess.column))
      .sort((left, right) => right.score - left.score)[0] ?? null
  );
}

function inferColumnGuesses(input: {
  columns: ColumnOption[];
  rows: string[][];
  headerRowIndex: number;
}): ColumnGuesses {
  const dateKeywords = [
    "due",
    "due date",
    "deadline",
    "date",
    "expires",
    "expiry",
    "renewal",
    "follow up",
    "payment date",
    "invoice date",
  ];
  const emailKeywords = [
    "email",
    "e mail",
    "recipient",
    "assignee",
    "owner",
    "contact",
    "billing email",
    "client email",
  ];
  const titleKeywords = [
    "title",
    "task",
    "name",
    "description",
    "invoice",
    "item",
    "vendor",
    "client",
    "project",
    "nature",
    "expense",
    "expenditure",
  ];
  const statusKeywords = ["status", "done", "complete", "completed", "paid"];

  const scored = input.columns.map((column) => {
    const samples = columnSamples({
      rows: input.rows,
      column: column.value,
      headerRowIndex: input.headerRowIndex,
    });
    const dateInference = inferDateFormatFromValues(samples);
    const dateFormat =
      dateInference.format ?? dateInference.candidates[0] ?? null;
    const parsedDates = dateFormat
      ? samples.filter((sample) => parseSheetdueDateValue(sample, dateFormat))
      : [];
    const emailMatches = samples.filter((sample) => emailPattern.test(sample));
    const header = column.header || column.label;
    const dateScore =
      headerKeywordScore(header, dateKeywords) +
      (dateInference.confidence === "certain"
        ? 7
        : dateInference.confidence === "ambiguous"
          ? 4
          : 0) +
      (samples.length ? (parsedDates.length / samples.length) * 4 : 0);
    const emailScore =
      headerKeywordScore(header, emailKeywords) +
      (samples.length ? (emailMatches.length / samples.length) * 10 : 0);
    const titleScore =
      headerKeywordScore(header, titleKeywords) +
      nonNumericTextScore(samples) -
      Math.max(emailScore - 3, 0) -
      (dateInference.confidence !== "none" ? 2 : 0);
    const statusScore =
      headerKeywordScore(header, statusKeywords) +
      (samples.some((sample) =>
        ["done", "complete", "completed", "paid", "closed"].includes(
          sample.toLowerCase(),
        ),
      )
        ? 4
        : 0);

    return {
      column,
      date: makeGuess(
        column,
        dateScore,
        dateInference.confidence === "certain"
          ? "Dates matched across the sampled rows."
          : "Header suggests this is the due date.",
      ),
      email: makeGuess(
        column,
        emailScore,
        emailMatches.length > 0
          ? "Email addresses were found in the sampled rows."
          : "Header suggests this is the recipient email.",
      ),
      title: makeGuess(
        column,
        titleScore,
        "Header and row text look like a task or invoice label.",
      ),
      status: makeGuess(
        column,
        statusScore,
        "Header or values look like completion status.",
      ),
    };
  });

  const used = new Set<string>();
  const dueDate = bestGuess(
    scored.map((score) => score.date),
    used,
  );
  if (dueDate) {
    used.add(dueDate.column);
  }

  const recipientEmail = bestGuess(
    scored.map((score) => score.email),
    used,
  );
  if (recipientEmail) {
    used.add(recipientEmail.column);
  }

  const title = bestGuess(
    scored.map((score) => score.title),
    used,
  );
  if (title) {
    used.add(title.column);
  }

  const status = bestGuess(
    scored.map((score) => score.status),
    used,
  );

  return {
    title,
    dueDate,
    recipientEmail,
    status,
  };
}

function renderTemplate(value: string) {
  return value
    .replace(/\{\{\s*task\s*\}\}/g, "Client docs")
    .replace(/\{\{\s*dueDate\s*\}\}/g, "2026-06-10")
    .replace(/\{\{\s*recipientEmail\s*\}\}/g, "client@example.com")
    .replace(/\{\{\s*rowNumber\s*\}\}/g, "12");
}

function StagePanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const isStepEyebrow = /^Step\s+\d+\s+of\s+\d+$/i.test(eyebrow);

  return (
    <section className="grid gap-5 py-1">
      <div className="grid max-w-2xl gap-1.5">
        {isStepEyebrow ? (
          <p className="sr-only">{eyebrow}</p>
        ) : (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h3 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function SetupProgressRail({
  currentStep,
  totalSteps = 4,
}: {
  currentStep: number;
  totalSteps?: number;
}) {
  if (currentStep <= 0) {
    return null;
  }

  return (
    <div
      className="grid w-full gap-1"
      aria-label={`Setup progress: step ${currentStep} of ${totalSteps}`}
    >
      <div
        className="grid h-1.5 w-full gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;

          return (
            <span
              key={index}
              className="relative h-full overflow-hidden rounded-full bg-muted"
            >
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function AnimatedReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -4 }}
      transition={revealTransition}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}

function SourceBadge({ spreadsheet }: { spreadsheet: SpreadsheetOption }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md",
        spreadsheet.kind === "excel" &&
          "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        spreadsheet.kind === "google_sheet" &&
          "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      )}
    >
      {spreadsheet.kind === "excel" ? "Excel workbook" : "Google Sheet"}
    </Badge>
  );
}

function StepContextBar({
  activeStage,
  selectedSpreadsheet,
  selectedSheetTitle,
  metadata,
  columns,
  onChangeSource,
  onChangeWorksheet,
}: {
  activeStage: ActiveStage;
  selectedSpreadsheet: SpreadsheetOption | null;
  selectedSheetTitle: string;
  metadata: SpreadsheetMetadata | null;
  columns: ColumnOption[];
  onChangeSource: () => void;
  onChangeWorksheet: () => void;
}) {
  if (!selectedSpreadsheet) {
    return null;
  }

  const modes = {
    import: {
      icon: UploadCloud,
      label: "Excel import",
      title: selectedSpreadsheet.name,
      detail: "A Google Sheet copy will be created for monitoring.",
      action: "Change file",
      onAction: onChangeSource,
    },
    worksheet: {
      icon: Sheet,
      label: "Worksheet",
      title: selectedSpreadsheet.name,
      detail: metadata
        ? `${metadata.sheets.length} worksheet tab${metadata.sheets.length === 1 ? "" : "s"} found`
        : "Reading worksheet tabs...",
      action: "Change file",
      onAction: onChangeSource,
    },
    columns: {
      icon: Columns3,
      label: "Values",
      title: selectedSheetTitle || "Selected worksheet",
      detail: `${columns.length} detected header${columns.length === 1 ? "" : "s"}`,
      action: "Change tab",
      onAction: onChangeWorksheet,
    },
    finish: {
      icon: CheckCircle2,
      label: "Ready",
      title: "Monitor settings",
      detail: `${selectedSpreadsheet.name}${selectedSheetTitle ? ` / ${selectedSheetTitle}` : ""}`,
      action: "Change file",
      onAction: onChangeSource,
    },
  } satisfies Partial<
    Record<
      ActiveStage,
      {
        icon: typeof Sheet;
        label: string;
        title: string;
        detail: string;
        action: string;
        onAction: () => void;
      }
    >
  >;
  const mode =
    activeStage === "import" ||
    activeStage === "worksheet" ||
    activeStage === "columns" ||
    activeStage === "finish"
      ? modes[activeStage]
      : null;

  if (!mode) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <SourceBadge spreadsheet={selectedSpreadsheet} />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {mode.label}
          </span>
        </div>
        <p className="truncate text-sm font-semibold text-foreground">
          {mode.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{mode.detail}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit"
        onClick={mode.onAction}
      >
        {mode.action}
      </Button>
    </div>
  );
}

function templateParts(value: string) {
  const parts: Array<{ kind: "text" | "token"; value: string }> = [];
  const regex = /\{\{\s*([^}]+?)\s*\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value))) {
    if (match.index > lastIndex) {
      parts.push({ kind: "text", value: value.slice(lastIndex, match.index) });
    }

    parts.push({ kind: "token", value: match[1]?.trim() ?? "" });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < value.length) {
    parts.push({ kind: "text", value: value.slice(lastIndex) });
  }

  return parts.filter((part) => part.value.length > 0);
}

function appendTemplatePart(template: string, part: string) {
  const spacer = template && !template.endsWith(" ") ? " " : "";
  return `${template}${spacer}${part}`;
}

function tokenLabelFromColumn(option: ComboBoxOption) {
  const header = option.label.includes(" - ")
    ? option.label.split(" - ").slice(1).join(" - ").trim()
    : "";

  return header || option.value;
}

function columnIndexFromLetter(column: string) {
  return (
    [...column.trim().toUpperCase()].reduce(
      (index, letter) => index * 26 + letter.charCodeAt(0) - 64,
      0,
    ) - 1
  );
}

function rowValueByColumn(row: string[], column: string) {
  const index = columnIndexFromLetter(column);
  return index >= 0 ? (row[index] ?? "") : "";
}

function renderPreviewRowTemplate(input: {
  template: string;
  row: string[];
  columns: ColumnOption[];
  rowNumber: number;
}) {
  return input.template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, token) => {
    const normalized = String(token).trim();

    if (normalized === "rowNumber") {
      return String(input.rowNumber);
    }

    const column = input.columns.find(
      (option) =>
        option.value.toLowerCase() === normalized.toLowerCase() ||
        option.header.toLowerCase() === normalized.toLowerCase(),
    );

    return column ? rowValueByColumn(input.row, column.value) : "";
  });
}

function TemplateBuilder({
  value,
  onChange,
  tokens,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  tokens: Array<{ value: string; label: string }>;
  placeholder: string;
}) {
  const [literal, setLiteral] = useState("");
  const parts = useMemo(() => templateParts(value), [value]);

  function appendToken(token: string) {
    onChange(appendTemplatePart(value, `{{${token}}}`));
  }

  function appendLiteral() {
    const nextLiteral = literal.trim();

    if (!nextLiteral) {
      return;
    }

    onChange(appendTemplatePart(value, nextLiteral));
    setLiteral("");
  }

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-muted/15 p-3">
      <div className="min-h-10 rounded-lg border border-border bg-background px-3 py-2">
        {parts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {parts.map((part, index) => (
              <span
                key={`${part.kind}-${part.value}-${index}`}
                className={cn(
                  "inline-flex min-h-7 items-center rounded-md px-2 text-xs font-medium",
                  part.kind === "token"
                    ? "border border-primary/30 bg-primary/10 text-primary"
                    : "border border-border bg-muted/40 text-foreground",
                )}
              >
                {part.kind === "token" ? part.value : part.value.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap gap-1.5">
          {tokens.slice(0, 10).map((token) => (
            <button
              key={token.value}
              type="button"
              className="inline-flex h-7 items-center rounded-md border border-border px-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              onClick={() => appendToken(token.value)}
            >
              {token.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={cn(inputClass, "h-9")}
            value={literal}
            placeholder="Add text..."
            onChange={(event) => setLiteral(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                appendLiteral();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={appendLiteral}
          >
            <Plus aria-hidden className="size-4" />
            Text
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={!value}
            onClick={() => onChange("")}
          >
            <X aria-hidden className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function sourceIsReady(input: {
  sourceType: ValueSourceType;
  column: string;
  staticValue: string;
  template: string;
}) {
  if (input.sourceType === "static") {
    return input.staticValue.trim().length > 0;
  }

  if (input.sourceType === "template") {
    return input.template.trim().length > 0;
  }

  return input.column.trim().length > 0;
}

function ValueSourceControl({
  label,
  description,
  icon,
  guess,
  children,
  sourceType,
  column,
  staticValue,
  template,
  columnOptions,
  templateTokens,
  loading,
  staticType = "text",
  columnPlaceholder,
  staticPlaceholder,
  templatePlaceholder,
  onSourceTypeChange,
  onColumnChange,
  onStaticChange,
  onTemplateChange,
}: {
  label: string;
  description?: string;
  icon?: ReactNode;
  guess?: ColumnGuess | null;
  children?: ReactNode;
  sourceType: ValueSourceType;
  column: string;
  staticValue: string;
  template: string;
  columnOptions: ComboBoxOption[];
  templateTokens: Array<{ value: string; label: string }>;
  loading?: boolean;
  staticType?: "text" | "email" | "date";
  columnPlaceholder: string;
  staticPlaceholder: string;
  templatePlaceholder: string;
  onSourceTypeChange: (value: ValueSourceType) => void;
  onColumnChange: (value: string) => void;
  onStaticChange: (value: string) => void;
  onTemplateChange: (value: string) => void;
}) {
  const modes: Array<{ value: ValueSourceType; label: string }> = [
    { value: "column", label: "Column" },
    { value: "static", label: "Fixed" },
    { value: "template", label: "Template" },
  ];
  const activeGuess =
    guess && sourceType === "column" && guess.column === column ? guess : null;

  return (
    <motion.div
      layout
      className="grid min-h-full content-start gap-4 rounded-xl border border-border bg-card p-4 shadow-[0_18px_55px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.04)_inset] dark:shadow-[0_22px_70px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.05)_inset]"
    >
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            {activeGuess ? (
              <Badge
                variant="outline"
                className="h-5 rounded-md border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-700 dark:text-emerald-300"
              >
                Auto
              </Badge>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
          {activeGuess ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground/90">
              {activeGuess.reason}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex w-fit rounded-lg border border-border bg-muted/25 p-0.5">
          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={cn(
                "h-7 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                sourceType === mode.value &&
                  "bg-background text-foreground shadow-xs",
              )}
              onClick={() => onSourceTypeChange(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {sourceType === "column" ? (
            <AnimatedReveal key="column">
              <SearchCombobox
                value={column}
                options={columnOptions}
                placeholder={columnPlaceholder}
                searchPlaceholder="Search headers..."
                emptyText="No columns found."
                loading={loading}
                onSelect={onColumnChange}
              />
            </AnimatedReveal>
          ) : null}

          {sourceType === "static" ? (
            <AnimatedReveal key="static">
              <input
                className={inputClass}
                type={staticType}
                value={staticValue}
                placeholder={staticPlaceholder}
                onChange={(event) => onStaticChange(event.target.value)}
              />
            </AnimatedReveal>
          ) : null}

          {sourceType === "template" ? (
            <AnimatedReveal key="template">
              <TemplateBuilder
                value={template}
                onChange={onTemplateChange}
                tokens={templateTokens}
                placeholder={templatePlaceholder}
              />
            </AnimatedReveal>
          ) : null}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {children ? (
            <AnimatedReveal key="child-content">{children}</AnimatedReveal>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DateFormatControl({
  value,
  inference,
  onChange,
}: {
  value: "auto" | SheetdueDateFormat;
  inference: ReturnType<typeof inferDateFormatFromValues>;
  onChange: (value: "auto" | SheetdueDateFormat) => void;
}) {
  const effectiveFormat = value === "auto" ? inference.format : value;
  const selectedOption = sheetdueDateFormatOptions.find(
    (option) => option.value === effectiveFormat,
  );
  const visibleOptions =
    inference.candidates.length > 0
      ? sheetdueDateFormatOptions.filter((option) =>
          inference.candidates.includes(option.value),
        )
      : sheetdueDateFormatOptions;

  return (
    <div
      className={cn(
        "grid gap-3 rounded-lg border px-3 py-3",
        inference.confidence === "certain" && value === "auto"
          ? "border-emerald-500/25 bg-emerald-500/10"
          : "border-border bg-background/55",
      )}
    >
      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/70 text-muted-foreground">
          <CalendarDays className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Date format</p>
            {inference.confidence === "certain" && value === "auto" ? (
              <Badge className="h-5 rounded-md bg-emerald-500/10 px-1.5 text-[10px] text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
                Auto
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {inference.confidence === "certain" && value === "auto"
              ? `${selectedOption?.label ?? "Format"} detected from samples.`
              : inference.reason}
          </p>
        </div>
      </div>

      <div className="flex min-h-8 flex-wrap content-center gap-1.5">
        {inference.samples.length > 0 ? (
          inference.samples.slice(0, 3).map((sample) => (
            <span
              key={sample.raw}
              className="rounded-md border border-border bg-background/70 px-2 py-1 text-xs text-muted-foreground"
            >
              {sample.raw}
              {sample.parsed ? ` -> ${sample.parsed}` : ""}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">
            Choose a format before continuing.
          </span>
        )}
      </div>
      {inference.confidence !== "certain" || value !== "auto" ? (
        <select
          className={inputClass}
          value={value}
          onChange={(event) =>
            onChange(event.target.value as "auto" | SheetdueDateFormat)
          }
        >
          {inference.format ? (
            <option value="auto">
              Auto: {selectedOption?.label ?? inference.format}
            </option>
          ) : null}
          {visibleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.example})
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}

function ReminderOption({
  checked,
  title,
  description,
  icon,
  onToggle,
  children,
}: {
  checked: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onToggle: () => void;
  children?: ReactNode;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border bg-card p-3 shadow-[0_12px_34px_rgba(0,0,0,0.08)] transition-colors dark:shadow-[0_14px_42px_rgba(0,0,0,0.32)]",
        checked
          ? "border-emerald-500/35 bg-emerald-500/10"
          : "border-border hover:border-foreground/20",
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={onToggle}
      >
        <span className="flex min-w-0 gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg border",
              checked
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">
              {title}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          </span>
        </span>
        <span
          className={cn(
            "mt-1 flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-colors",
            checked
              ? "border-emerald-500/50 bg-emerald-500"
              : "border-border bg-muted",
          )}
        >
          <span
            className={cn(
              "size-3.5 rounded-full bg-background shadow-sm transition-transform",
              checked && "translate-x-4",
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {checked && children ? (
          <AnimatedReveal
            key="reminder-option-details"
            className="mt-3 border-t border-border/70 pt-3"
          >
            {children}
          </AnimatedReveal>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function EmailLine({
  label,
  value,
  active,
  onSelect,
}: {
  label: string;
  value: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "grid gap-1 rounded-lg border px-3 py-2 text-left transition-colors",
        active
          ? "border-primary/45 bg-primary/10"
          : "border-transparent hover:border-border hover:bg-muted/30",
      )}
      onClick={onSelect}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm leading-6 text-foreground">
        {renderTemplate(value)}
      </span>
    </button>
  );
}

function FocusedTemplateEditor({
  value,
  onChange,
  tokens,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  tokens: Array<{ value: string; label: string }>;
  placeholder: string;
}) {
  return (
    <div className="grid gap-3">
      <textarea
        className="min-h-28 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((token) => (
          <button
            key={token.value}
            type="button"
            className="inline-flex h-7 items-center rounded-md border border-border px-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            onClick={() =>
              onChange(appendTemplatePart(value, `{{${token.value}}}`))
            }
          >
            {token.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmailPreviewCard({
  values,
  activeField,
  onSelectField,
}: {
  values: WatchValues;
  activeField: EmailFieldKey;
  onSelectField: (field: EmailFieldKey) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-xs">
      <div className="mb-3 rounded-md border border-border bg-muted/30 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Subject
        </p>
        <button
          type="button"
          className={cn(
            "mt-1 w-full rounded-md px-2 py-1 text-left text-sm font-semibold transition-colors",
            activeField === "subject"
              ? "bg-primary/10 text-foreground"
              : "hover:bg-background",
          )}
          onClick={() => onSelectField("subject")}
        >
          {renderTemplate(values.subject)}
        </button>
      </div>
      <div className="grid gap-2 rounded-md border border-border bg-card p-4">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MailCheck className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {values.senderName || "SheetDue"}
            </p>
            <p className="text-xs text-muted-foreground">reminders@sheetdue</p>
          </div>
        </div>
        <EmailLine
          label="Headline"
          value={values.emailHeadline}
          active={activeField === "emailHeadline"}
          onSelect={() => onSelectField("emailHeadline")}
        />
        <EmailLine
          label="Message"
          value={values.emailIntro}
          active={activeField === "emailIntro"}
          onSelect={() => onSelectField("emailIntro")}
        />
        <EmailLine
          label="Closing"
          value={values.emailClosing}
          active={activeField === "emailClosing"}
          onSelect={() => onSelectField("emailClosing")}
        />
      </div>
    </div>
  );
}

function EmailCopyDesigner({
  values,
  tokens,
  onFieldChange,
  onPresetChange,
}: {
  values: WatchValues;
  tokens: Array<{ value: string; label: string }>;
  onFieldChange: (field: EmailFieldKey | "senderName", value: string) => void;
  onPresetChange: (preset: EmailPreset) => void;
}) {
  const [activeField, setActiveField] = useState<EmailFieldKey>("emailIntro");
  const activeMeta =
    emailFields.find((field) => field.key === activeField) ?? emailFields[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <EmailPreviewCard
        values={values}
        activeField={activeField}
        onSelectField={setActiveField}
      />

      <div className="grid content-start gap-4">
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Starting point
          </p>
          <div className="grid gap-2">
            {Object.entries(emailPresets).map(([key, preset]) => {
              const isSelected = values.emailPreset === key;

              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    "grid gap-0.5 rounded-lg border border-border px-3 py-2 text-left transition-colors hover:border-primary/40",
                    isSelected && "border-primary/45 bg-primary/10",
                  )}
                  onClick={() => onPresetChange(key as EmailPreset)}
                >
                  <span className="text-sm font-semibold">{preset.label}</span>
                  <span className="text-xs leading-5 text-muted-foreground">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className={labelClass}>
          Sender name
          <input
            className={inputClass}
            value={values.senderName}
            onChange={(event) =>
              onFieldChange("senderName", event.target.value)
            }
            placeholder="SheetDue"
          />
        </label>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {emailFields.map((field) => (
              <button
                key={field.key}
                type="button"
                className={cn(
                  "h-8 rounded-md border border-border px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
                  activeField === field.key &&
                    "border-primary/45 bg-primary/10 text-foreground",
                )}
                onClick={() => setActiveField(field.key)}
              >
                {field.label}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <div className="mb-2">
              <p className="text-sm font-semibold">{activeMeta?.label}</p>
              <p className="text-xs leading-5 text-muted-foreground">
                {activeMeta?.description}
              </p>
            </div>
            <FocusedTemplateEditor
              value={values[activeField]}
              onChange={(value) => onFieldChange(activeField, value)}
              tokens={tokens}
              placeholder={`Write the ${activeMeta?.label.toLowerCase()}...`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailCopyDialog({
  values,
  tokens,
  onFieldChange,
  onPresetChange,
}: {
  values: WatchValues;
  tokens: Array<{ value: string; label: string }>;
  onFieldChange: (field: EmailFieldKey | "senderName", value: string) => void;
  onPresetChange: (preset: EmailPreset) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <SlidersHorizontal aria-hidden className="size-4" />
          Edit copy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-lg p-5 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Email copy</DialogTitle>
          <DialogDescription>
            Pick a template, click the preview line to edit, and add variables
            with chips.
          </DialogDescription>
        </DialogHeader>
        <EmailCopyDesigner
          values={values}
          tokens={tokens}
          onFieldChange={onFieldChange}
          onPresetChange={onPresetChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export function SheetdueSetupForm({ hasGoogleConnection }: SetupFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const };
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });
  const [testState, setTestState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetOption[]>([]);
  const [selectedSpreadsheet, setSelectedSpreadsheet] =
    useState<SpreadsheetOption | null>(null);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState("");
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [selectedSheetTitle, setSelectedSheetTitle] = useState("");
  const [columns, setColumns] = useState<ColumnOption[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [importingSpreadsheet, setImportingSpreadsheet] = useState(false);
  const [columnsConfirmed, setColumnsConfirmed] = useState(false);
  const [showStatusColumn, setShowStatusColumn] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [values, setValues] = useState<WatchValues>({
    titleColumn: "",
    titleSourceType: "column",
    titleStaticValue: "",
    titleTemplate: "",
    dueDateColumn: "",
    dueDateSourceType: "column",
    dueDateStaticValue: "",
    dueDateTemplate: "",
    dueDateFormat: "auto",
    recipientEmailColumn: "",
    recipientEmailSourceType: "column",
    recipientEmailStaticValue: "",
    recipientEmailTemplate: "",
    statusColumn: "",
    headerRowIndex: "1",
    beforeDays: "3",
    onDue: true,
    repeatOverdue: false,
    repeatDays: "7",
    senderName: "",
    subject: defaultReminderTemplate.subject,
    emailPreset: "gentle_reminder",
    emailHeadline: emailPresets.gentle_reminder.headline,
    emailIntro: emailPresets.gentle_reminder.intro,
    emailClosing: emailPresets.gentle_reminder.closing,
    body: defaultReminderTemplate.body,
    status: "active",
  });

  const displayedSpreadsheets = useMemo(
    () =>
      selectedSpreadsheet &&
      !spreadsheets.some(
        (spreadsheet) => spreadsheet.id === selectedSpreadsheet.id,
      )
        ? [selectedSpreadsheet, ...spreadsheets]
        : spreadsheets,
    [selectedSpreadsheet, spreadsheets],
  );
  const selectedSheet = metadata?.sheets.find(
    (sheet) => sheet.title === selectedSheetTitle,
  );
  const sourceReady = Boolean(
    selectedSpreadsheet?.kind === "google_sheet" && selectedSheet,
  );
  const dateSampleValues = useMemo(() => {
    if (values.dueDateSourceType === "static") {
      return values.dueDateStaticValue ? [values.dueDateStaticValue] : [];
    }

    const headerIndex = Math.max(0, Number(values.headerRowIndex || 1) - 1);
    const rows = previewRows.slice(headerIndex + 1, headerIndex + 11);

    if (values.dueDateSourceType === "template") {
      return rows.map((row, index) =>
        renderPreviewRowTemplate({
          template: values.dueDateTemplate,
          row,
          columns,
          rowNumber: headerIndex + index + 2,
        }),
      );
    }

    if (!values.dueDateColumn) {
      return [];
    }

    return rows.map((row) => rowValueByColumn(row, values.dueDateColumn));
  }, [
    columns,
    previewRows,
    values.dueDateColumn,
    values.dueDateSourceType,
    values.dueDateStaticValue,
    values.dueDateTemplate,
    values.headerRowIndex,
  ]);
  const dateInference = useMemo(
    () => inferDateFormatFromValues(dateSampleValues),
    [dateSampleValues],
  );
  const effectiveDueDateFormat =
    values.dueDateFormat === "auto"
      ? dateInference.format
      : values.dueDateFormat;
  const dateFormatReady = Boolean(effectiveDueDateFormat);
  const showDateFormatControl =
    sourceIsReady({
      sourceType: values.dueDateSourceType,
      column: values.dueDateColumn,
      staticValue: values.dueDateStaticValue,
      template: values.dueDateTemplate,
    }) &&
    !(
      dateInference.confidence === "certain" && values.dueDateFormat === "auto"
    );
  const columnsReady = Boolean(
    sourceIsReady({
      sourceType: values.titleSourceType,
      column: values.titleColumn,
      staticValue: values.titleStaticValue,
      template: values.titleTemplate,
    }) &&
      sourceIsReady({
        sourceType: values.dueDateSourceType,
        column: values.dueDateColumn,
        staticValue: values.dueDateStaticValue,
        template: values.dueDateTemplate,
      }) &&
      sourceIsReady({
        sourceType: values.recipientEmailSourceType,
        column: values.recipientEmailColumn,
        staticValue: values.recipientEmailStaticValue,
        template: values.recipientEmailTemplate,
      }) &&
      dateFormatReady,
  );
  const canSave =
    sourceReady && columnsReady && columnsConfirmed && hasGoogleConnection;
  const usingImportedExcel = Boolean(selectedSpreadsheet?.convertedFromFileId);
  const totalSteps = usingImportedExcel ? 5 : 4;

  const activeStage: ActiveStage = !hasGoogleConnection
    ? "connect"
    : !selectedSpreadsheet
      ? "source"
      : selectedSpreadsheet.kind === "excel"
        ? "import"
        : !selectedSheetTitle
          ? "worksheet"
          : !columnsReady || !columnsConfirmed
            ? "columns"
            : "finish";
  const progressStep =
    activeStage === "source" || activeStage === "import"
      ? 1
      : activeStage === "worksheet"
        ? 2
        : activeStage === "columns"
          ? 3
          : activeStage === "finish"
            ? 4
            : 0;

  const spreadsheetOptions = useMemo(
    () =>
      displayedSpreadsheets.map((spreadsheet) => ({
        value: spreadsheet.id,
        label: spreadsheet.name,
        description:
          spreadsheet.kind === "excel"
            ? `${formatDate(spreadsheet.modifiedTime)} - Excel workbook`
            : `${formatDate(spreadsheet.modifiedTime)} - Google Sheet`,
        icon: (
          <FileSpreadsheet
            className={cn(
              "size-4",
              spreadsheet.kind === "excel"
                ? "text-amber-500"
                : "text-emerald-500",
            )}
          />
        ),
      })),
    [displayedSpreadsheets],
  );
  const sheetOptions = useMemo(
    () =>
      metadata?.sheets.map((sheet) => ({
        value: sheet.title,
        label: sheet.title,
        description: `Tab ID ${sheet.sheetId}`,
        icon: <Sheet className="size-4 text-primary" />,
      })) ?? [],
    [metadata],
  );
  const columnOptions = useMemo(
    () =>
      columns.map((column) => ({
        value: column.value,
        label: column.label,
        description: column.header ? "Detected header" : "Unnamed column",
      })),
    [columns],
  );
  const columnGuesses = useMemo(
    () =>
      inferColumnGuesses({
        columns,
        rows: previewRows,
        headerRowIndex: Math.max(0, Number(values.headerRowIndex || 1) - 1),
      }),
    [columns, previewRows, values.headerRowIndex],
  );
  const rowTemplateTokens = useMemo(
    () => [
      ...columnOptions.map((option) => {
        const label = tokenLabelFromColumn(option);

        return {
          value: label,
          label,
        };
      }),
      { value: "rowNumber", label: "Row number" },
    ],
    [columnOptions],
  );
  const emailTemplateTokens = useMemo(
    () => [
      { value: "task", label: "Task" },
      { value: "dueDate", label: "Due date" },
      { value: "recipientEmail", label: "Recipient" },
      { value: "rowNumber", label: "Row number" },
    ],
    [],
  );

  const loadSpreadsheets = useCallback(
    async (query: string) => {
      if (!hasGoogleConnection) {
        return;
      }

      setLoadingSheets(true);
      setFormError("");

      try {
        const response = await fetch(
          `/api/google/sheets/search?q=${encodeURIComponent(query)}`,
        );
        const json = (await response.json()) as {
          spreadsheets?: SpreadsheetOption[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(json.error ?? "Unable to search Google Drive.");
        }

        setSpreadsheets(json.spreadsheets ?? []);
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Search failed.");
      } finally {
        setLoadingSheets(false);
      }
    },
    [hasGoogleConnection],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadSpreadsheets(searchTerm);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [loadSpreadsheets, searchTerm]);

  useEffect(() => {
    if (
      !selectedSpreadsheetId ||
      selectedSpreadsheet?.kind !== "google_sheet"
    ) {
      setMetadata(null);
      setSelectedSheetTitle("");
      return;
    }

    setLoadingMetadata(true);
    setFormError("");

    fetch(
      `/api/google/sheets/metadata?spreadsheetId=${encodeURIComponent(
        selectedSpreadsheetId,
      )}`,
    )
      .then(async (response) => {
        const json = (await response.json()) as {
          metadata?: SpreadsheetMetadata;
          error?: string;
        };

        if (!response.ok || !json.metadata) {
          throw new Error(json.error ?? "Unable to read spreadsheet metadata.");
        }

        setMetadata(json.metadata);
        setValues((previous) => ({
          ...previous,
          titleColumn: "",
          titleSourceType: "column",
          titleStaticValue: "",
          titleTemplate: "",
          dueDateColumn: "",
          dueDateSourceType: "column",
          dueDateStaticValue: "",
          dueDateTemplate: "",
          dueDateFormat: "auto",
          recipientEmailColumn: "",
          recipientEmailSourceType: "column",
          recipientEmailStaticValue: "",
          recipientEmailTemplate: "",
          statusColumn: "",
        }));
        setColumnsConfirmed(false);
        setShowStatusColumn(false);
        setSelectedSheetTitle(
          json.metadata.sheets.length === 1
            ? (json.metadata.sheets[0]?.title ?? "")
            : "",
        );
      })
      .catch((error) => {
        setFormError(
          error instanceof Error ? error.message : "Metadata failed.",
        );
      })
      .finally(() => setLoadingMetadata(false));
  }, [selectedSpreadsheetId, selectedSpreadsheet?.kind]);

  useEffect(() => {
    if (
      !selectedSpreadsheetId ||
      !selectedSheetTitle ||
      selectedSpreadsheet?.kind !== "google_sheet"
    ) {
      setColumns([]);
      setPreviewRows([]);
      return;
    }

    setLoadingPreview(true);
    setFormError("");

    fetch(
      `/api/google/sheets/preview?spreadsheetId=${encodeURIComponent(
        selectedSpreadsheetId,
      )}&sheetTitle=${encodeURIComponent(
        selectedSheetTitle,
      )}&headerRowIndex=${encodeURIComponent(values.headerRowIndex)}`,
    )
      .then(async (response) => {
        const json = (await response.json()) as {
          columns?: ColumnOption[];
          rows?: string[][];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(json.error ?? "Unable to preview worksheet.");
        }

        const nextColumns = json.columns ?? [];
        const nextRows = json.rows ?? [];
        const nextGuesses = inferColumnGuesses({
          columns: nextColumns,
          rows: nextRows,
          headerRowIndex: Math.max(0, Number(values.headerRowIndex || 1) - 1),
        });
        setColumns(nextColumns);
        setPreviewRows(nextRows);
        setValues((previous) => ({
          ...previous,
          titleColumn:
            previous.titleColumn ||
            nextGuesses.title?.column ||
            nextColumns[0]?.value ||
            "",
          dueDateColumn:
            previous.dueDateColumn ||
            nextGuesses.dueDate?.column ||
            nextColumns[1]?.value ||
            "",
          recipientEmailColumn:
            previous.recipientEmailColumn ||
            nextGuesses.recipientEmail?.column ||
            nextColumns[2]?.value ||
            "",
          statusColumn:
            previous.statusColumn || nextGuesses.status?.column || "",
        }));
        setColumnsConfirmed(false);
      })
      .catch((error) => {
        setFormError(
          error instanceof Error ? error.message : "Preview failed.",
        );
      })
      .finally(() => setLoadingPreview(false));
  }, [
    selectedSpreadsheetId,
    selectedSheetTitle,
    selectedSpreadsheet?.kind,
    values.headerRowIndex,
  ]);

  function setValue<K extends keyof WatchValues>(
    key: K,
    value: WatchValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setFormError("");

    if (
      key === "titleColumn" ||
      key === "titleSourceType" ||
      key === "titleStaticValue" ||
      key === "titleTemplate" ||
      key === "dueDateColumn" ||
      key === "dueDateSourceType" ||
      key === "dueDateStaticValue" ||
      key === "dueDateTemplate" ||
      key === "dueDateFormat" ||
      key === "recipientEmailColumn" ||
      key === "recipientEmailSourceType" ||
      key === "recipientEmailStaticValue" ||
      key === "recipientEmailTemplate" ||
      key === "statusColumn" ||
      key === "headerRowIndex"
    ) {
      setColumnsConfirmed(false);
    }
  }

  function applyEmailPreset(preset: EmailPreset) {
    const nextPreset = emailPresets[preset];
    setValues((previous) => ({
      ...previous,
      emailPreset: preset,
      subject: nextPreset.subject,
      emailHeadline: nextPreset.headline,
      emailIntro: nextPreset.intro,
      emailClosing: nextPreset.closing,
    }));
    setFormError("");
  }

  function applyColumnGuesses() {
    setValues((previous) => ({
      ...previous,
      titleColumn: columnGuesses.title?.column || previous.titleColumn,
      dueDateColumn: columnGuesses.dueDate?.column || previous.dueDateColumn,
      recipientEmailColumn:
        columnGuesses.recipientEmail?.column || previous.recipientEmailColumn,
      statusColumn: columnGuesses.status?.column || previous.statusColumn,
      dueDateFormat: "auto",
    }));
    setColumnsConfirmed(false);
    setFormError("");
  }

  function resetSource() {
    setSelectedSpreadsheet(null);
    setSelectedSpreadsheetId("");
    setMetadata(null);
    setSelectedSheetTitle("");
    setColumns([]);
    setPreviewRows([]);
    setColumnsConfirmed(false);
    setConversionMessage("");
    setFormError("");
  }

  function selectSource(value: string) {
    const spreadsheet =
      displayedSpreadsheets.find((option) => option.id === value) ?? null;

    setSelectedSpreadsheet(spreadsheet);
    setSelectedSpreadsheetId(value);
    setMetadata(null);
    setSelectedSheetTitle("");
    setColumns([]);
    setPreviewRows([]);
    setColumnsConfirmed(false);
    setConversionMessage("");
    setFormError("");
  }

  async function importExcelSpreadsheet() {
    if (!selectedSpreadsheet || selectedSpreadsheet.kind !== "excel") {
      setFormError("Choose an Excel workbook first.");
      return;
    }

    setImportingSpreadsheet(true);
    setFormError("");
    setConversionMessage("");

    try {
      const response = await fetch("/api/google/sheets/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: selectedSpreadsheet.id,
        }),
      });
      const json = (await response.json()) as {
        spreadsheet?: SpreadsheetOption;
        error?: string;
      };

      if (!response.ok || !json.spreadsheet) {
        throw new Error(json.error ?? "Unable to import Excel workbook.");
      }

      setSpreadsheets((previous) => [
        json.spreadsheet as SpreadsheetOption,
        ...previous.filter(
          (spreadsheet) => spreadsheet.id !== json.spreadsheet?.id,
        ),
      ]);
      setSelectedSpreadsheet(json.spreadsheet);
      setSelectedSpreadsheetId(json.spreadsheet.id);
      setSelectedSheetTitle("");
      setColumnsConfirmed(false);
      setConversionMessage("Excel copy created. Choose its worksheet next.");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to import Excel workbook.",
      );
    } finally {
      setImportingSpreadsheet(false);
    }
  }

  async function saveWatch() {
    if (!selectedSpreadsheet || !selectedSheet || !metadata) {
      setFormError("Choose a spreadsheet and worksheet first.");
      return;
    }

    if (!columnsReady || !columnsConfirmed) {
      setFormError("Confirm the required columns first.");
      return;
    }

    setSubmitState({ status: "pending", message: "Saving monitor" });

    const response = await fetch("/api/sheetdue/watches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spreadsheetId: selectedSpreadsheet.id,
        spreadsheetName: selectedSpreadsheet.name,
        sheetId: selectedSheet.sheetId,
        sheetTitle: selectedSheet.title,
        timezone: metadata.timezone,
        status: values.status,
        mapping: {
          titleColumn: values.titleColumn,
          titleSourceType: values.titleSourceType,
          titleStaticValue: values.titleStaticValue || null,
          titleTemplate: values.titleTemplate || null,
          dueDateColumn: values.dueDateColumn,
          dueDateSourceType: values.dueDateSourceType,
          dueDateStaticValue: values.dueDateStaticValue || null,
          dueDateTemplate: values.dueDateTemplate || null,
          dueDateFormat: effectiveDueDateFormat,
          recipientEmailColumn: values.recipientEmailColumn,
          recipientEmailSourceType: values.recipientEmailSourceType,
          recipientEmailStaticValue: values.recipientEmailStaticValue || null,
          recipientEmailTemplate: values.recipientEmailTemplate || null,
          statusColumn: values.statusColumn || null,
          headerRowIndex: Number(values.headerRowIndex || 1),
        },
        rules: [
          {
            kind: "before_due",
            offsetDays: Number(values.beforeDays || 3),
            enabled: true,
          },
          {
            kind: "on_due",
            offsetDays: 0,
            enabled: values.onDue,
          },
          {
            kind: "repeat_overdue",
            repeatIntervalDays: Number(values.repeatDays || 7),
            enabled: values.repeatOverdue,
          },
        ],
        template: {
          subject: values.subject,
          preset: values.emailPreset,
          headline: values.emailHeadline,
          intro: values.emailIntro,
          closing: values.emailClosing,
          senderName: values.senderName || null,
        },
      }),
    });

    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setSubmitState({
        status: "error",
        message: json.error ?? "Unable to save monitor",
      });
      return;
    }

    setSubmitState({
      status: "success",
      message: "Monitor saved. It is available in the Watches tab.",
    });
  }

  async function sendTestEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setTestState({ status: "pending", message: "Sending test" });

    const response = await fetch("/api/sheetdue/test-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: form.get("to"),
        subject: values.subject,
        preset: values.emailPreset,
        headline: values.emailHeadline,
        intro: values.emailIntro,
        closing: values.emailClosing,
      }),
    });

    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setTestState({
        status: "error",
        message: json.error ?? "Unable to send test",
      });
      return;
    }

    setTestState({ status: "success", message: "Test sent" });
  }

  const statusNode =
    formError || conversionMessage || submitState.message ? (
      <motion.div
        variants={stageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
        className={cn(
          "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
          formError &&
            "border-destructive/25 bg-destructive/5 text-destructive",
          !formError &&
            "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        )}
      >
        {formError ? (
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
        ) : (
          <Check className="mt-0.5 size-4 shrink-0" />
        )}
        <span>{formError || conversionMessage || submitState.message}</span>
      </motion.div>
    ) : null;

  return (
    <div className="grid gap-5">
      <AnimatePresence>{statusNode}</AnimatePresence>

      <StepContextBar
        activeStage={activeStage}
        selectedSpreadsheet={selectedSpreadsheet}
        selectedSheetTitle={selectedSheetTitle}
        metadata={metadata}
        columns={columns}
        onChangeSource={resetSource}
        onChangeWorksheet={() => {
          setSelectedSheetTitle("");
          setColumnsConfirmed(false);
        }}
      />

      <div className="grid gap-8">
        <SetupProgressRail currentStep={progressStep} />

        <AnimatePresence mode="wait">
          {activeStage === "connect" ? (
            <motion.div
              key="connect"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
            >
              <StagePanel
                eyebrow="Start here"
                title="Connect Google Sheets"
                description="SheetDue needs your Google account before it can search Drive or inspect worksheet columns."
              >
                <Button asChild>
                  <a href="/api/google/oauth/start">
                    <Sheet aria-hidden className="size-4" />
                    Connect Sheets
                  </a>
                </Button>
              </StagePanel>
            </motion.div>
          ) : null}

          {activeStage === "source" ? (
            <motion.div
              key="source"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
            >
              <StagePanel
                eyebrow={`Step 1 of ${totalSteps}`}
                title="Choose the sheet to monitor"
                description="Search by file name. Google Sheets open directly; .xlsx files are imported as a SheetDue copy."
              >
                <div className="grid gap-3">
                  <SearchCombobox
                    value={selectedSpreadsheetId}
                    options={spreadsheetOptions}
                    placeholder="Search Drive sheets and Excel files..."
                    searchPlaceholder="Type a sheet name..."
                    emptyText="No Sheets or .xlsx files found."
                    disabled={!hasGoogleConnection}
                    loading={loadingSheets}
                    onSearchChange={setSearchTerm}
                    onSelect={selectSource}
                  />
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md border border-border px-2 py-1">
                      Google Sheets
                    </span>
                    <span className="rounded-md border border-border px-2 py-1">
                      .xlsx imports as a copy
                    </span>
                  </div>
                </div>
              </StagePanel>
            </motion.div>
          ) : null}

          {activeStage === "import" && selectedSpreadsheet ? (
            <motion.div
              key="import"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
            >
              <StagePanel
                eyebrow={`Step 2 of ${totalSteps}`}
                title="Import this Excel workbook"
                description="SheetDue monitors a Google Sheet copy so it can keep stable row IDs. Your original Excel file stays unchanged."
              >
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <SourceBadge spreadsheet={selectedSpreadsheet} />
                    <span className="font-medium text-foreground">
                      {selectedSpreadsheet.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={importExcelSpreadsheet}
                      disabled={importingSpreadsheet}
                    >
                      {importingSpreadsheet ? (
                        <RefreshCw
                          aria-hidden
                          className="size-4 animate-spin"
                        />
                      ) : (
                        <UploadCloud aria-hidden className="size-4" />
                      )}
                      Import as Google Sheet
                    </Button>
                    <Button type="button" variant="ghost" onClick={resetSource}>
                      Choose another file
                    </Button>
                  </div>
                </div>
              </StagePanel>
            </motion.div>
          ) : null}

          {activeStage === "worksheet" ? (
            <motion.div
              key="worksheet"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
            >
              <StagePanel
                eyebrow={`Step ${usingImportedExcel ? 3 : 2} of ${totalSteps}`}
                title="Choose the worksheet tab"
                description="Pick the tab that contains the rows SheetDue should scan."
              >
                <div className="grid gap-3">
                  {loadingMetadata ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-20 animate-pulse rounded-xl border border-border bg-muted/20"
                        />
                      ))}
                    </div>
                  ) : metadata && metadata.sheets.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {metadata.sheets.map((sheet) => {
                        const isSelected = selectedSheetTitle === sheet.title;

                        return (
                          <button
                            key={sheet.sheetId}
                            type="button"
                            className={cn(
                              "group flex min-h-20 items-center justify-between gap-3 rounded-xl border border-border bg-background/70 p-4 text-left transition-colors hover:border-primary/35 hover:bg-background",
                              isSelected &&
                                "border-primary/50 bg-primary/10 text-primary",
                            )}
                            onClick={() => {
                              setSelectedSheetTitle(sheet.title);
                              setColumnsConfirmed(false);
                            }}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
                                  isSelected && "bg-primary/15 text-primary",
                                )}
                              >
                                <Sheet className="size-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">
                                  {sheet.title}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Tab ID {sheet.sheetId}
                                </span>
                              </span>
                            </span>
                            {isSelected ? (
                              <CheckCircle2 className="size-4 shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                      No worksheet tabs found in this spreadsheet.
                    </div>
                  )}

                  {metadata && metadata.sheets.length > 6 ? (
                    <SearchCombobox
                      value={selectedSheetTitle}
                      options={sheetOptions}
                      placeholder="Search worksheet tabs..."
                      searchPlaceholder="Search tabs..."
                      emptyText="No worksheets found."
                      loading={loadingMetadata}
                      onSelect={(value) => {
                        setSelectedSheetTitle(value);
                        setColumnsConfirmed(false);
                      }}
                    />
                  ) : null}
                </div>
              </StagePanel>
            </motion.div>
          ) : null}

          {activeStage === "columns" ? (
            <motion.div
              key="columns"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
            >
              <StagePanel
                eyebrow={`Step ${usingImportedExcel ? 4 : 3} of ${totalSteps}`}
                title="Review the mapped values"
                description="SheetDue guessed the task, date, and recipient. Change only what looks wrong."
              >
                <div className="grid gap-4">
                  <div className="flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Sparkles className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          Auto-mapped from your header row
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Header names and sample rows decide the defaults.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-end gap-2">
                      <label className={cn(labelClass, "w-24")}>
                        Header row
                        <input
                          className={inputClass}
                          type="number"
                          min="1"
                          value={values.headerRowIndex}
                          onChange={(event) =>
                            setValue("headerRowIndex", event.target.value)
                          }
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          !columnGuesses.title &&
                          !columnGuesses.dueDate &&
                          !columnGuesses.recipientEmail
                        }
                        onClick={applyColumnGuesses}
                      >
                        <Sparkles aria-hidden className="size-4" />
                        Reapply
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={previewRows.length === 0}
                          >
                            <Search aria-hidden className="size-4" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl rounded-lg">
                          <DialogHeader>
                            <DialogTitle>Worksheet preview</DialogTitle>
                            <DialogDescription>
                              First rows from the selected tab.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="overflow-hidden rounded-lg border border-border">
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[620px] text-left text-xs">
                                <tbody>
                                  {previewRows
                                    .slice(0, 6)
                                    .map((row, rowIndex) => (
                                      <tr
                                        key={rowIndex}
                                        className="border-b border-border last:border-0"
                                      >
                                        {columns
                                          .slice(0, 7)
                                          .map((column, columnIndex) => (
                                            <td
                                              key={`${rowIndex}-${column.value}`}
                                              className={cn(
                                                "max-w-[180px] truncate px-3 py-2",
                                                rowIndex ===
                                                  Number(
                                                    values.headerRowIndex,
                                                  ) -
                                                    1 &&
                                                  "font-semibold text-foreground",
                                                columnIndex > 0 &&
                                                  "border-l border-border",
                                              )}
                                            >
                                              {row[columnIndex] ?? ""}
                                            </td>
                                          ))}
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {loadingPreview ? (
                        <RefreshCw className="mb-2 size-4 animate-spin text-muted-foreground" />
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    <ValueSourceControl
                      label="Task"
                      description="What the reminder is about."
                      icon={<FileText className="size-4" />}
                      guess={columnGuesses.title}
                      sourceType={values.titleSourceType}
                      column={values.titleColumn}
                      staticValue={values.titleStaticValue}
                      template={values.titleTemplate}
                      columnOptions={columnOptions}
                      templateTokens={rowTemplateTokens}
                      loading={loadingPreview}
                      columnPlaceholder="Select task column..."
                      staticPlaceholder="Expense reminder"
                      templatePlaceholder="Payment for {{Vendor}}"
                      onSourceTypeChange={(value) =>
                        setValue("titleSourceType", value)
                      }
                      onColumnChange={(value) => setValue("titleColumn", value)}
                      onStaticChange={(value) =>
                        setValue("titleStaticValue", value)
                      }
                      onTemplateChange={(value) =>
                        setValue("titleTemplate", value)
                      }
                    />
                    <ValueSourceControl
                      label="Due date"
                      description="The date SheetDue evaluates."
                      icon={<CalendarDays className="size-4" />}
                      guess={columnGuesses.dueDate}
                      sourceType={values.dueDateSourceType}
                      column={values.dueDateColumn}
                      staticValue={values.dueDateStaticValue}
                      template={values.dueDateTemplate}
                      columnOptions={columnOptions}
                      templateTokens={rowTemplateTokens}
                      loading={loadingPreview}
                      staticType="date"
                      columnPlaceholder="Select due date column..."
                      staticPlaceholder="2026-06-10"
                      templatePlaceholder="{{Due Date}}"
                      onSourceTypeChange={(value) =>
                        setValue("dueDateSourceType", value)
                      }
                      onColumnChange={(value) =>
                        setValue("dueDateColumn", value)
                      }
                      onStaticChange={(value) =>
                        setValue("dueDateStaticValue", value)
                      }
                      onTemplateChange={(value) =>
                        setValue("dueDateTemplate", value)
                      }
                    >
                      {showDateFormatControl ? (
                        <DateFormatControl
                          value={values.dueDateFormat}
                          inference={dateInference}
                          onChange={(value) => setValue("dueDateFormat", value)}
                        />
                      ) : null}
                    </ValueSourceControl>
                    <ValueSourceControl
                      label="Recipient"
                      description="Who receives the reminder."
                      icon={<Mail className="size-4" />}
                      guess={columnGuesses.recipientEmail}
                      sourceType={values.recipientEmailSourceType}
                      column={values.recipientEmailColumn}
                      staticValue={values.recipientEmailStaticValue}
                      template={values.recipientEmailTemplate}
                      columnOptions={columnOptions}
                      templateTokens={rowTemplateTokens}
                      loading={loadingPreview}
                      staticType="email"
                      columnPlaceholder="Select recipient column..."
                      staticPlaceholder="ops@example.com"
                      templatePlaceholder="{{Owner Email}}"
                      onSourceTypeChange={(value) =>
                        setValue("recipientEmailSourceType", value)
                      }
                      onColumnChange={(value) =>
                        setValue("recipientEmailColumn", value)
                      }
                      onStaticChange={(value) =>
                        setValue("recipientEmailStaticValue", value)
                      }
                      onTemplateChange={(value) =>
                        setValue("recipientEmailTemplate", value)
                      }
                    />
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {showStatusColumn || values.statusColumn ? (
                      <AnimatedReveal key="status-column">
                        <div className="grid gap-3 rounded-xl border border-border bg-card px-4 py-4 shadow-[0_16px_45px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_55px_rgba(0,0,0,0.36)] lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-5">
                          <div className="flex gap-3">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                              <CheckCircle2 className="size-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">
                                Completed/status
                              </p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                Rows marked done are skipped.
                              </p>
                            </div>
                          </div>
                          <SearchCombobox
                            value={values.statusColumn}
                            options={columnOptions}
                            placeholder="Optional status column..."
                            searchPlaceholder="Search headers..."
                            emptyText="No columns found."
                            loading={loadingPreview}
                            onSelect={(value) =>
                              setValue("statusColumn", value)
                            }
                          />
                        </div>
                      </AnimatedReveal>
                    ) : (
                      <AnimatedReveal key="status-button">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-fit"
                          onClick={() => setShowStatusColumn(true)}
                        >
                          <Plus aria-hidden className="size-4" />
                          Add status column
                        </Button>
                      </AnimatedReveal>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-muted-foreground">
                      {columnsReady
                        ? "Everything required is mapped."
                        : "Map task, due date, recipient, and date format to continue."}
                    </p>
                    <Button
                      type="button"
                      className="w-fit"
                      disabled={!columnsReady}
                      onClick={() => setColumnsConfirmed(true)}
                    >
                      Continue
                      <ArrowRight aria-hidden className="size-4" />
                    </Button>
                  </div>
                </div>
              </StagePanel>
            </motion.div>
          ) : null}

          {activeStage === "finish" ? (
            <motion.div
              key="finish"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
            >
              <StagePanel
                eyebrow={`Step ${totalSteps} of ${totalSteps}`}
                title="Save the monitor"
                description="The defaults are ready. Adjust timing or email copy only if this sheet needs something different."
              >
                <div className="grid gap-4">
                  <div className="grid gap-4 rounded-lg border border-border bg-background px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <CalendarDays className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Timing</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Defaults cover the common reminder path.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 xl:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">
                      <label className="grid content-start gap-2 rounded-xl border border-border bg-card p-3 shadow-[0_12px_34px_rgba(0,0,0,0.08)] dark:shadow-[0_14px_42px_rgba(0,0,0,0.32)]">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <CalendarDays className="size-4 text-muted-foreground" />
                          Lead time
                        </span>
                        <span className="text-xs leading-5 text-muted-foreground">
                          Send before each due date.
                        </span>
                        <span className="mt-1 flex items-center gap-2">
                          <input
                            className={cn(inputClass, "w-20 text-center")}
                            type="number"
                            min="0"
                            value={values.beforeDays}
                            onChange={(event) =>
                              setValue("beforeDays", event.target.value)
                            }
                          />
                          <span className="text-sm font-medium text-muted-foreground">
                            days
                          </span>
                        </span>
                      </label>

                      <ReminderOption
                        checked={values.onDue}
                        title="Due-date reminder"
                        description="Also send on the exact due date."
                        icon={<CalendarCheck className="size-4" />}
                        onToggle={() => setValue("onDue", !values.onDue)}
                      />

                      <ReminderOption
                        checked={values.repeatOverdue}
                        title="Repeat while overdue"
                        description="Keep reminding after the due date until the row is complete."
                        icon={<Repeat2 className="size-4" />}
                        onToggle={() =>
                          setValue("repeatOverdue", !values.repeatOverdue)
                        }
                      >
                        <label className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          Repeat every
                          <input
                            className="h-8 w-16 rounded-md border border-border bg-background px-2 text-center text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
                            type="number"
                            min="1"
                            value={values.repeatDays}
                            onChange={(event) =>
                              setValue("repeatDays", event.target.value)
                            }
                          />
                          days
                        </label>
                      </ReminderOption>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-lg border border-border bg-background px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Mail className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Email</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Current preset:{" "}
                          {emailPresets[values.emailPreset].label}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <div className="rounded-lg border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {renderTemplate(values.subject)}
                        </p>
                        <div className="mt-3 rounded-md border border-border bg-background p-3">
                          <p className="text-sm font-semibold">
                            {renderTemplate(values.emailHeadline)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {renderTemplate(values.emailIntro)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {renderTemplate(values.emailClosing)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <EmailCopyDialog
                          values={values}
                          tokens={emailTemplateTokens}
                          onFieldChange={(field, value) =>
                            setValue(field, value)
                          }
                          onPresetChange={applyEmailPreset}
                        />

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline">
                              <Mail aria-hidden className="size-4" />
                              Send test
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-lg">
                            <DialogHeader>
                              <DialogTitle>Send a test reminder</DialogTitle>
                              <DialogDescription>
                                Uses the current email copy.
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="grid gap-3"
                              onSubmit={sendTestEmail}
                            >
                              <label className={labelClass}>
                                Test recipient
                                <input
                                  className={inputClass}
                                  name="to"
                                  type="email"
                                  required
                                  placeholder="you@example.com"
                                />
                              </label>
                              <div className="flex flex-wrap items-center gap-2">
                                <Button
                                  type="submit"
                                  disabled={testState.status === "pending"}
                                >
                                  <Send aria-hidden className="size-4" />
                                  Send test
                                </Button>
                                {testState.message ? (
                                  <span
                                    className={cn(
                                      "text-sm",
                                      testState.status === "error"
                                        ? "text-destructive"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {testState.message}
                                  </span>
                                ) : null}
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-muted-foreground">
                      The monitor will start with {values.beforeDays || 0} day
                      lead reminders
                      {values.onDue ? " and due-date reminders" : ""}.
                    </p>
                    <Button
                      type="button"
                      disabled={!canSave || submitState.status === "pending"}
                      onClick={saveWatch}
                    >
                      <Play aria-hidden className="size-4" />
                      Save monitor
                    </Button>
                  </div>
                </div>
              </StagePanel>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
