import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import { createElement } from "react";
import { z } from "zod";

export type TemplateVariables = Record<string, string | number | boolean | null>;

export type RenderedReminderEmail = {
  subject: string;
  body: string;
};

export type SheetdueEmailPreset =
  | "gentle_reminder"
  | "payment_request"
  | "internal_followup";

export type SheetdueEmailBuilderInput = {
  preset?: SheetdueEmailPreset | string | null;
  previewText?: string | null;
  headline?: string | null;
  intro?: string | null;
  closing?: string | null;
};

export const sheetdueEmailPresets = {
  gentle_reminder: {
    label: "Gentle reminder",
    subject: "Reminder: {{task}} is due {{dueDate}}",
    headline: "{{task}} is due {{dueDate}}",
    intro:
      "This is a quick reminder that {{task}} is due on {{dueDate}}.",
    closing: "Please take the needed action when you can.",
  },
  payment_request: {
    label: "Payment request",
    subject: "Payment reminder for {{task}}",
    headline: "Payment reminder",
    intro:
      "A payment item, {{task}}, is due on {{dueDate}}.",
    closing: "Please review the sheet and arrange the next step.",
  },
  internal_followup: {
    label: "Internal follow-up",
    subject: "Follow up: {{task}}",
    headline: "Follow-up needed",
    intro:
      "{{task}} needs attention by {{dueDate}}.",
    closing: "Thanks for keeping this moving.",
  },
} as const satisfies Record<
  SheetdueEmailPreset,
  {
    label: string;
    subject: string;
    headline: string;
    intro: string;
    closing: string;
  }
>;

export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
  from?: string;
  fromName?: string;
  reply?: string;
  data?: TemplateVariables;
  headers?: Record<string, string>;
};

export type SendEmailResult = {
  providerMessageId?: string;
  providerContactId?: string;
  raw: unknown;
};

const plunkResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      emails: z
        .array(
          z.object({
            email: z.string().optional(),
            contact: z
              .object({
                id: z.string().optional(),
                email: z.string().optional(),
              })
              .optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  error: z
    .object({
      code: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

export function renderTemplate(
  template: RenderedReminderEmail,
  variables: TemplateVariables,
) {
  const render = (value: string) =>
    value.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_match, key: string) => {
      const replacement = variables[key];
      return replacement == null ? "" : String(replacement);
    });

  return {
    subject: render(template.subject),
    body: render(template.body),
  };
}

function normalizedPreset(value?: string | null): SheetdueEmailPreset {
  return value === "payment_request" || value === "internal_followup"
    ? value
    : "gentle_reminder";
}

export async function renderSheetdueReminderEmail(
  input: SheetdueEmailBuilderInput = {},
) {
  const preset = sheetdueEmailPresets[normalizedPreset(input.preset)];
  const headline = input.headline?.trim() || preset.headline;
  const intro = input.intro?.trim() || preset.intro;
  const closing = input.closing?.trim() || preset.closing;
  const previewText =
    input.previewText?.trim() || `${headline.replace(/\{\{.*?\}\}/g, "")}`.trim();

  return render(
    createElement(
      Html,
      { lang: "en" },
      createElement(Head),
      createElement(Preview, null, previewText || "SheetDue reminder"),
      createElement(
        Body,
        {
          style: {
            margin: "0",
            backgroundColor: "#f6f7f9",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          },
        },
        createElement(
          Container,
          {
            style: {
              margin: "0 auto",
              maxWidth: "560px",
              padding: "32px 20px",
            },
          },
          createElement(
            Section,
            {
              style: {
                border: "1px solid #d9dde3",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                padding: "28px",
              },
            },
            createElement(
              Text,
              {
                style: {
                  margin: "0 0 12px",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                },
              },
              "SheetDue",
            ),
            createElement(
              Heading,
              {
                as: "h1",
                style: {
                  margin: "0 0 16px",
                  color: "#111827",
                  fontSize: "24px",
                  lineHeight: "32px",
                  fontWeight: 700,
                },
              },
              headline,
            ),
            createElement(
              Text,
              {
                style: {
                  margin: "0 0 14px",
                  color: "#334155",
                  fontSize: "15px",
                  lineHeight: "24px",
                },
              },
              intro,
            ),
            createElement(
              Text,
              {
                style: {
                  margin: "0",
                  color: "#334155",
                  fontSize: "15px",
                  lineHeight: "24px",
                },
              },
              closing,
            ),
            createElement(Hr, {
              style: {
                margin: "24px 0",
                borderColor: "#e5e7eb",
              },
            }),
            createElement(
              Text,
              {
                style: {
                  margin: "0",
                  color: "#94a3b8",
                  fontSize: "12px",
                  lineHeight: "18px",
                },
              },
              "Sent by SheetDue from your monitored spreadsheet.",
            ),
          ),
        ),
      ),
    ),
  );
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function sendPlunkEmail(input: SendEmailInput) {
  const apiBaseUrl =
    process.env.PLUNK_API_BASE_URL?.replace(/\/$/, "") ??
    "https://next-api.useplunk.com";
  const secretKey = process.env.PLUNK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PLUNK_SECRET_KEY is required to send reminder email.");
  }

  const response = await fetch(`${apiBaseUrl}/v1/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: input.to,
      from: input.from ?? process.env.PLUNK_FROM_EMAIL,
      fromName: input.fromName,
      reply: input.reply,
      subject: input.subject,
      body: input.body,
      data: input.data,
      headers: input.headers,
    }),
  });

  const json = await response.json().catch(() => ({}));
  const parsed = plunkResponseSchema.safeParse(json);

  if (!response.ok || !parsed.success || !parsed.data.success) {
    const message = parsed.success
      ? (parsed.data.error?.message ?? "Plunk email send failed.")
      : "Plunk email send returned an unexpected response.";
    throw new Error(message);
  }

  const firstEmail = parsed.data.data?.emails?.[0];
  return {
    providerMessageId: firstEmail?.email,
    providerContactId: firstEmail?.contact?.id,
    raw: json,
  } satisfies SendEmailResult;
}

export function verifyPlunkWebhook(request: Request) {
  const secret = process.env.PLUNK_WEBHOOK_SECRET;

  if (!secret) {
    return process.env.NODE_ENV === "development";
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}
