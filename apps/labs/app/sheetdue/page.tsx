import { SheetdueLandingClient } from "./landing-client";

export const metadata = {
  title: "SheetDue - Google Sheets Client Follow-Up Reminders",
  description:
    "Send automatic client follow-up, invoice, and document reminder emails from Google Sheets without Apps Script or Zapier.",
};

export default function SheetdueLandingPage() {
  return <SheetdueLandingClient />;
}
