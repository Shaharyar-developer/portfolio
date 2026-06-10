import { SheetdueLandingClient } from "./landing-client";

export const metadata = {
  title: "SheetDue - Google Sheets Due Date Reminder Add-on",
  description:
    "Send automatic email reminders from Google Sheets before, on, or after due dates.",
};

export default function SheetdueLandingPage() {
  return <SheetdueLandingClient />;
}
