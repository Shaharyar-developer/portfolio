import { format, isValid, parse } from "date-fns";

export type SheetdueDateFormat =
  | "yyyy-MM-dd"
  | "yyyy/M/d"
  | "yyyy.M.d"
  | "M/d/yy"
  | "d/M/yy"
  | "M/d/yyyy"
  | "d/M/yyyy"
  | "M-d-yy"
  | "d-M-yy"
  | "M-d-yyyy"
  | "d-M-yyyy"
  | "M.d.yy"
  | "d.M.yy"
  | "M.d.yyyy"
  | "d.M.yyyy"
  | "MMM d, yyyy"
  | "d MMM yyyy";

export type DateFormatInference = {
  confidence: "certain" | "ambiguous" | "none";
  format: SheetdueDateFormat | null;
  candidates: SheetdueDateFormat[];
  reason: string;
  samples: Array<{
    raw: string;
    parsed: string | null;
  }>;
};

export const sheetdueDateFormatOptions: Array<{
  value: SheetdueDateFormat;
  label: string;
  example: string;
}> = [
  { value: "yyyy-MM-dd", label: "ISO year-month-day", example: "2026-06-13" },
  { value: "yyyy/M/d", label: "Year/month/day", example: "2026/6/13" },
  { value: "yyyy.M.d", label: "Year.month.day", example: "2026.6.13" },
  { value: "M/d/yy", label: "Month/day/year", example: "6/13/26" },
  { value: "d/M/yy", label: "Day/month/year", example: "13/6/26" },
  { value: "M/d/yyyy", label: "Month/day/year", example: "6/13/2026" },
  { value: "d/M/yyyy", label: "Day/month/year", example: "13/6/2026" },
  { value: "M-d-yy", label: "Month-day-year", example: "6-13-26" },
  { value: "d-M-yy", label: "Day-month-year", example: "13-6-26" },
  { value: "M-d-yyyy", label: "Month-day-year", example: "6-13-2026" },
  { value: "d-M-yyyy", label: "Day-month-year", example: "13-6-2026" },
  { value: "M.d.yy", label: "Month.day.year", example: "6.13.26" },
  { value: "d.M.yy", label: "Day.month.year", example: "13.6.26" },
  { value: "M.d.yyyy", label: "Month.day.year", example: "6.13.2026" },
  { value: "d.M.yyyy", label: "Day.month.year", example: "13.6.2026" },
  { value: "MMM d, yyyy", label: "Month name day, year", example: "Jun 13, 2026" },
  { value: "d MMM yyyy", label: "Day month name year", example: "13 Jun 2026" },
];

const referenceDate = new Date(Date.UTC(2000, 0, 1));
const monthFirstFormats: SheetdueDateFormat[] = [
  "M/d/yy",
  "M/d/yyyy",
  "M-d-yy",
  "M-d-yyyy",
  "M.d.yy",
  "M.d.yyyy",
];

function normalizeRawDate(value: unknown) {
  return String(value ?? "").trim();
}

function parseWithFormat(raw: string, dateFormat: SheetdueDateFormat) {
  const parsed = parse(raw, dateFormat, referenceDate);

  if (!isValid(parsed)) {
    return null;
  }

  return format(parsed, "yyyy-MM-dd");
}

function yearTokenFor(value: string) {
  const year = value.trim().split(/[./-]/).at(-1) ?? "";
  return year.length === 2 ? "yy" : "yyyy";
}

function numericSlashDashDotParts(value: string) {
  const match = value
    .trim()
    .match(/^(\d{1,4})([./-])(\d{1,2})\2(\d{2}|\d{4})$/);

  if (!match) {
    return null;
  }

  return {
    first: Number(match[1]),
    delimiter: match[2] as "/" | "-" | ".",
    second: Number(match[3]),
    yearToken: yearTokenFor(value),
    yearFirst: match[1]?.length === 4,
  };
}

function slashDashDotFormat(input: {
  dayFirst: boolean;
  delimiter: "/" | "-" | ".";
  yearToken: string;
}) {
  const first = input.dayFirst ? "d" : "M";
  const second = input.dayFirst ? "M" : "d";
  return `${first}${input.delimiter}${second}${input.delimiter}${input.yearToken}` as SheetdueDateFormat;
}

function parsedSamples(values: string[], dateFormat: SheetdueDateFormat | null) {
  return values.slice(0, 4).map((raw) => ({
    raw,
    parsed: dateFormat ? parseSheetdueDateValue(raw, dateFormat) : null,
  }));
}

export function parseSheetdueDateValue(
  value: unknown,
  dateFormat?: SheetdueDateFormat | string | null,
) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value === "number") {
    const excelEpoch = Date.UTC(1899, 11, 30);
    return format(new Date(excelEpoch + value * 86_400_000), "yyyy-MM-dd");
  }

  const raw = normalizeRawDate(value);

  if (!raw) {
    return null;
  }

  if (dateFormat && dateFormat !== "auto") {
    return parseWithFormat(raw, dateFormat as SheetdueDateFormat);
  }

  const inference = inferDateFormatFromValues([raw]);
  const inferredFormat =
    inference.format ??
    inference.candidates.find((candidate) => monthFirstFormats.includes(candidate)) ??
    inference.candidates[0] ??
    null;

  if (inferredFormat) {
    return parseWithFormat(raw, inferredFormat);
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : format(parsed, "yyyy-MM-dd");
}

export function inferDateFormatFromValues(values: unknown[]): DateFormatInference {
  const samples = values
    .map(normalizeRawDate)
    .filter(Boolean)
    .slice(0, 50);

  if (samples.length === 0) {
    return {
      confidence: "none",
      format: null,
      candidates: [],
      reason: "No date samples found.",
      samples: [],
    };
  }

  const numericParts = samples.map(numericSlashDashDotParts);
  const numericCandidates = numericParts.filter(
    (part): part is NonNullable<ReturnType<typeof numericSlashDashDotParts>> =>
      Boolean(part),
  );

  if (numericCandidates.length === samples.length) {
    const yearFirst = numericCandidates.every((part) => part.yearFirst);

    if (yearFirst) {
      const delimiter = numericCandidates[0]?.delimiter ?? "-";
      const dateFormat =
        delimiter === "/"
          ? "yyyy/M/d"
          : delimiter === "."
            ? "yyyy.M.d"
            : "yyyy-MM-dd";

      return {
        confidence: "certain",
        format: dateFormat,
        candidates: [dateFormat],
        reason: "All samples start with a four-digit year.",
        samples: parsedSamples(samples, dateFormat),
      };
    }

    const delimiters = new Set(numericCandidates.map((part) => part.delimiter));
    const yearTokens = new Set(numericCandidates.map((part) => part.yearToken));
    const delimiter = numericCandidates[0]?.delimiter ?? "/";
    const yearToken = numericCandidates[0]?.yearToken ?? "yyyy";
    const hasDayFirstEvidence = numericCandidates.some((part) => part.first > 12);
    const hasMonthFirstEvidence = numericCandidates.some((part) => part.second > 12);

    if (delimiters.size === 1 && yearTokens.size === 1) {
      if (hasDayFirstEvidence && !hasMonthFirstEvidence) {
        const dateFormat = slashDashDotFormat({
          dayFirst: true,
          delimiter,
          yearToken,
        });

        return {
          confidence: "certain",
          format: dateFormat,
          candidates: [dateFormat],
          reason: "A first date part above 12 means the sheet is using day-first dates.",
          samples: parsedSamples(samples, dateFormat),
        };
      }

      if (hasMonthFirstEvidence && !hasDayFirstEvidence) {
        const dateFormat = slashDashDotFormat({
          dayFirst: false,
          delimiter,
          yearToken,
        });

        return {
          confidence: "certain",
          format: dateFormat,
          candidates: [dateFormat],
          reason: "A second date part above 12 means the sheet is using month-first dates.",
          samples: parsedSamples(samples, dateFormat),
        };
      }

      const candidates = [
        slashDashDotFormat({ dayFirst: false, delimiter, yearToken }),
        slashDashDotFormat({ dayFirst: true, delimiter, yearToken }),
      ];

      return {
        confidence: "ambiguous",
        format: null,
        candidates,
        reason:
          "Every sample can be read as either month-first or day-first.",
        samples: parsedSamples(samples, candidates[0] ?? null),
      };
    }
  }

  const validFormats = sheetdueDateFormatOptions
    .map((option) => option.value)
    .filter((dateFormat) =>
      samples.every((sample) => parseWithFormat(sample, dateFormat) != null),
    );

  if (validFormats.length === 1) {
    return {
      confidence: "certain",
      format: validFormats[0] ?? null,
      candidates: validFormats,
      reason: "All samples match one date format.",
      samples: parsedSamples(samples, validFormats[0] ?? null),
    };
  }

  if (validFormats.length > 1) {
    return {
      confidence: "ambiguous",
      format: null,
      candidates: validFormats,
      reason: "Multiple date formats fit the sample values.",
      samples: parsedSamples(samples, validFormats[0] ?? null),
    };
  }

  return {
    confidence: "none",
    format: null,
    candidates: [],
    reason: "No supported date format matched these samples.",
    samples: parsedSamples(samples, null),
  };
}
