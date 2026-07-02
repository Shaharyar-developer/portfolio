import { SheetdueUseCasePage } from "../use-case-page";

export const metadata = {
  title: "Google Sheets Invoice Reminder Emails - SheetDue",
  description:
    "Send invoice follow-up reminder emails from Google Sheets without Apps Script, Zapier, or calendar workarounds.",
};

export default function InvoiceRemindersPage() {
  return (
    <SheetdueUseCasePage
      eyebrow="Invoice reminder emails"
      title="Turn your invoice tracker into an automatic follow-up system."
      description="Track unpaid invoices in Google Sheets and let SheetDue send reminder emails before and after payment follow-up dates."
      rows={[
        ["Client", "Task", "Due Date", "Recipient Email", "Status"],
        ["ACME", "Send invoice follow-up", "Jun 18", "billing@email.com", "Open"],
        ["Northstar", "Second payment reminder", "Jun 22", "ap@email.com", "Open"],
        ["BlueCo", "Confirm payment received", "Jun 25", "you@email.com", "Waiting"],
      ]}
      bullets={[
        "Send reminders before invoice follow-up dates.",
        "Repeat overdue reminders on a schedule.",
        "Keep a delivery log next to the monitored sheet.",
      ]}
    />
  );
}
