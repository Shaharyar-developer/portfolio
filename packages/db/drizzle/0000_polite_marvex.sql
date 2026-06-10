CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_products" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text NOT NULL,
	"polar_product_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_products_polar_product_id_unique" UNIQUE("polar_product_id")
);
--> statement-breakpoint
CREATE TABLE "apps" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "apps_key_unique" UNIQUE("key"),
	CONSTRAINT "apps_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "billing_events" (
	"id" text PRIMARY KEY NOT NULL,
	"polar_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "billing_events_polar_event_id_unique" UNIQUE("polar_event_id")
);
--> statement-breakpoint
CREATE TABLE "google_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"app_key" text NOT NULL,
	"google_account_id" text NOT NULL,
	"email" text NOT NULL,
	"scopes" text NOT NULL,
	"encrypted_access_token" text,
	"encrypted_refresh_token" text,
	"access_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sheetdue_column_mappings" (
	"id" text PRIMARY KEY NOT NULL,
	"watch_id" text NOT NULL,
	"title_column" text NOT NULL,
	"due_date_column" text NOT NULL,
	"recipient_email_column" text NOT NULL,
	"status_column" text,
	"header_row_index" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sheetdue_email_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"watch_id" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"sender_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sheetdue_reminder_events" (
	"id" text PRIMARY KEY NOT NULL,
	"watch_id" text NOT NULL,
	"rule_id" text,
	"row_id" text NOT NULL,
	"due_date" date NOT NULL,
	"occurrence_date" date NOT NULL,
	"recipient_email" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"idempotency_key" text NOT NULL,
	"provider_message_id" text,
	"error_message" text,
	"queued_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sheetdue_reminder_events_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "sheetdue_reminder_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"watch_id" text NOT NULL,
	"kind" text NOT NULL,
	"offset_days" integer DEFAULT 0 NOT NULL,
	"repeat_interval_days" integer,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sheetdue_sheet_watches" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"google_connection_id" text NOT NULL,
	"spreadsheet_id" text NOT NULL,
	"spreadsheet_name" text NOT NULL,
	"sheet_id" integer NOT NULL,
	"sheet_title" text NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"scan_cadence" text DEFAULT 'daily' NOT NULL,
	"stable_row_id_column" text DEFAULT '_sheetdue_row_id' NOT NULL,
	"last_scanned_at" timestamp,
	"next_scan_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"app_id" text NOT NULL,
	"app_product_id" text,
	"polar_customer_id" text,
	"polar_subscription_id" text,
	"polar_product_id" text,
	"status" text DEFAULT 'free' NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_polar_subscription_id_unique" UNIQUE("polar_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "usage_counters" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"app_id" text NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"reminders_sent" integer DEFAULT 0 NOT NULL,
	"active_sheets" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_products" ADD CONSTRAINT "app_products_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_connections" ADD CONSTRAINT "google_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_column_mappings" ADD CONSTRAINT "sheetdue_mappings_watch_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."sheetdue_sheet_watches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_email_templates" ADD CONSTRAINT "sheetdue_email_templates_watch_id_sheetdue_sheet_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."sheetdue_sheet_watches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_reminder_events" ADD CONSTRAINT "sheetdue_reminder_events_watch_id_sheetdue_sheet_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."sheetdue_sheet_watches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_reminder_events" ADD CONSTRAINT "sheetdue_reminder_events_rule_id_sheetdue_reminder_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."sheetdue_reminder_rules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_reminder_rules" ADD CONSTRAINT "sheetdue_reminder_rules_watch_id_sheetdue_sheet_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."sheetdue_sheet_watches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_sheet_watches" ADD CONSTRAINT "sheetdue_sheet_watches_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheetdue_sheet_watches" ADD CONSTRAINT "sheetdue_watches_google_conn_fk" FOREIGN KEY ("google_connection_id") REFERENCES "public"."google_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_app_product_id_app_products_id_fk" FOREIGN KEY ("app_product_id") REFERENCES "public"."app_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_counters" ADD CONSTRAINT "usage_counters_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "app_products_app_id_idx" ON "app_products" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "google_connections_user_idx" ON "google_connections" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "google_connection_user_app_account_unique" ON "google_connections" USING btree ("user_id","app_key","google_account_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sheetdue_mapping_watch_unique" ON "sheetdue_column_mappings" USING btree ("watch_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sheetdue_template_watch_unique" ON "sheetdue_email_templates" USING btree ("watch_id");--> statement-breakpoint
CREATE INDEX "sheetdue_events_watch_idx" ON "sheetdue_reminder_events" USING btree ("watch_id");--> statement-breakpoint
CREATE INDEX "sheetdue_events_status_idx" ON "sheetdue_reminder_events" USING btree ("status","queued_at");--> statement-breakpoint
CREATE INDEX "sheetdue_events_provider_idx" ON "sheetdue_reminder_events" USING btree ("provider_message_id");--> statement-breakpoint
CREATE INDEX "sheetdue_rules_watch_idx" ON "sheetdue_reminder_rules" USING btree ("watch_id");--> statement-breakpoint
CREATE INDEX "sheetdue_watches_due_idx" ON "sheetdue_sheet_watches" USING btree ("status","scan_cadence","next_scan_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sheetdue_watch_user_sheet_tab_unique" ON "sheetdue_sheet_watches" USING btree ("user_id","spreadsheet_id","sheet_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_app_idx" ON "subscriptions" USING btree ("user_id","app_id");--> statement-breakpoint
CREATE INDEX "subscriptions_polar_customer_idx" ON "subscriptions" USING btree ("polar_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_counter_user_app_period_unique" ON "usage_counters" USING btree ("user_id","app_id","period_start");