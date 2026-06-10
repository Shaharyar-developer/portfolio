ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "title_source_type" text DEFAULT 'column' NOT NULL;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "title_static_value" text;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "title_template" text;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "due_date_source_type" text DEFAULT 'column' NOT NULL;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "due_date_static_value" text;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "due_date_template" text;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "recipient_email_source_type" text DEFAULT 'column' NOT NULL;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "recipient_email_static_value" text;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD COLUMN "recipient_email_template" text;
