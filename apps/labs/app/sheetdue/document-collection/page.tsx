import { SheetdueUseCasePage } from "../use-case-page";

export const metadata = {
  title: "Google Sheets Document Collection Reminders - SheetDue",
  description:
    "Send automatic document collection reminder emails from Google Sheets without Apps Script or manual checking.",
};

export default function DocumentCollectionPage() {
  return (
    <SheetdueUseCasePage
      eyebrow="Document collection reminders"
      title="Stop chasing client documents by hand."
      description="Use a simple Google Sheet to track requested files, due dates, client email addresses, and status. SheetDue handles the reminder emails."
      rows={[
        ["Client", "Task", "Due Date", "Recipient Email", "Status"],
        ["ACME", "Collect W-9", "Jun 18", "ops@email.com", "Open"],
        ["Nova Ltd", "Request brand assets", "Jun 20", "client@email.com", "Waiting"],
        ["BlueCo", "Collect signed approval", "Jun 25", "legal@email.com", "Open"],
      ]}
      bullets={[
        "Use one status column to stop reminders when files arrive.",
        "Send before-due and due-date reminders automatically.",
        "Avoid Apps Script maintenance for simple client chasing.",
      ]}
    />
  );
}
