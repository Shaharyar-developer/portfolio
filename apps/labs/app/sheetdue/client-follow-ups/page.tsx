import { SheetdueUseCasePage } from "../use-case-page";

export const metadata = {
  title: "Google Sheets Client Follow-Up Reminders - SheetDue",
  description:
    "Send automatic client follow-up reminder emails from a Google Sheets tracker without Apps Script or Zapier.",
};

export default function ClientFollowUpsPage() {
  return (
    <SheetdueUseCasePage
      eyebrow="Client follow-up reminders"
      title="Send client follow-up reminders from Google Sheets."
      description="Use SheetDue to watch the client tracker you already maintain, then send email reminders before requests, approvals, proposals, and tasks go stale."
      rows={[
        ["Client", "Task", "Due Date", "Recipient Email", "Status"],
        ["ACME", "Follow up on proposal", "Jun 18", "you@email.com", "Open"],
        ["Nova Ltd", "Collect final logo files", "Jun 20", "client@email.com", "Waiting"],
        ["BlueCo", "Review launch checklist", "Jun 25", "ops@email.com", "Open"],
      ]}
      bullets={[
        "Use your existing client tracker columns.",
        "Skip rows marked Done.",
        "Repeat overdue reminders until the work is closed.",
      ]}
    />
  );
}
