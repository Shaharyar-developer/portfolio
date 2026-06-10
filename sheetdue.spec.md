# Product: SheetDue

## SEO name
**SheetDue — Google Sheets Due Date Reminder Add-on**

## One-liner
Send automatic email reminders from Google Sheets before, on, or after due dates.

## Target users
- Accountants tracking client documents
- Agencies tracking deliverables
- Ops teams tracking deadlines
- Freelancers tracking client tasks
- Admin teams using Google Sheets as a lightweight CRM/task tracker

## Core problem
Many small teams use Google Sheets to track tasks, documents, renewals, invoices, and client follow-ups. Dates live in the sheet, but reminders are manual, forgotten, or handled through messy calendar workarounds.

## Core workflow
1. User signs in with Google.
2. User selects a Google Sheet.
3. User selects the worksheet/tab.
4. User maps columns:
   - Task/title column
   - Due date column
   - Recipient email column
   - Optional status column
5. User chooses reminder rules:
   - X days before due date
   - On due date
   - X days after due date
   - Repeat overdue reminders
6. User customizes email template.
7. User sends a test email.
8. User activates reminders.
9. System scans the sheet hourly/daily and sends emails when rules match.

## MVP features
- Google OAuth
- Select spreadsheet and tab
- Preview rows
- Column mapping
- Reminder rules
- Editable email template
- Test reminder
- Scheduled scanning
- Reminder delivery logs
- Pause/resume sheet monitoring
- Basic usage limits

## Non-goals for v1
Do not build:
- SMS
- WhatsApp
- Slack
- team accounts
- complex automation builder
- AI writing
- advanced permissions
- calendar sync
- mobile app

## Suggested route
`labs.shaharyar.dev/sheetdue`

## SEO keywords to target
Primary:
- Google Sheets due date reminder
- Google Sheets reminder add-on
- automatic reminders from Google Sheets
- send email reminders from Google Sheets

Secondary:
- Google Sheets deadline reminder
- Google Sheets task reminder
- Google Sheets overdue reminder
- spreadsheet reminder tool

## Landing page headline
**Automatic Due Date Reminders for Google Sheets**

## Landing page subheadline
Connect a spreadsheet, map your due-date and email columns, and SheetDue will send reminders automatically before deadlines are missed.

## Pricing
Free:
- 1 active sheet
- 50 reminders/month
- daily scans

Pro — $19/mo:
- unlimited active sheets
- 2,500 reminders/month
- hourly scans
- custom sender name
- reminder history

## Technical direction
Build as a Next.js app in the monorepo.

Use:
- Next.js
- TypeScript
- Postgres/Drizzle
- Google Sheets API
- Google Drive file picker
- Vercel Cron
- Resend or similar for email delivery

## Data model overview
Entities:
- User
- GoogleConnection
- SheetWatch
- ColumnMapping
- ReminderRule
- EmailTemplate
- ReminderEvent
- Subscription

Important:
Rows should not be tracked only by row number because users may sort the sheet. Add or manage a hidden stable row ID column.

## Key implementation requirement
Reminder sending must be idempotent. The same reminder should not be sent twice if the cron job reruns.

Use an idempotency key based on:
- sheet watch ID
- row ID
- due date
- reminder rule
- recipient email

## Completion criteria
The MVP is complete when a user can:
- connect Google
- select a sheet
- map columns
- configure a reminder
- send a test email
- activate monitoring
- receive a real reminder
- see reminder logs
- pause monitoring
