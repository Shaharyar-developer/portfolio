import {
  boolean,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const now = () => new Date();
const id = () => crypto.randomUUID();

export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(id),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey().$defaultFn(id),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey().$defaultFn(id),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
});

export const apps = pgTable("apps", {
  id: text("id").primaryKey().$defaultFn(id),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
});

export const appProducts = pgTable(
  "app_products",
  {
    id: text("id").primaryKey().$defaultFn(id),
    appId: text("app_id")
      .notNull()
      .references(() => apps.id, { onDelete: "cascade" }),
    polarProductId: text("polar_product_id").notNull().unique(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [index("app_products_app_id_idx").on(table.appId)],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey().$defaultFn(id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    appId: text("app_id")
      .notNull()
      .references(() => apps.id, { onDelete: "cascade" }),
    appProductId: text("app_product_id").references(() => appProducts.id, {
      onDelete: "set null",
    }),
    polarCustomerId: text("polar_customer_id"),
    polarSubscriptionId: text("polar_subscription_id").unique(),
    polarProductId: text("polar_product_id"),
    status: text("status").notNull().default("free"),
    plan: text("plan").notNull().default("free"),
    currentPeriodEnd: timestamp("current_period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    index("subscriptions_user_app_idx").on(table.userId, table.appId),
    index("subscriptions_polar_customer_idx").on(table.polarCustomerId),
  ],
);

export const usageCounters = pgTable(
  "usage_counters",
  {
    id: text("id").primaryKey().$defaultFn(id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    appId: text("app_id")
      .notNull()
      .references(() => apps.id, { onDelete: "cascade" }),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),
    remindersSent: integer("reminders_sent").notNull().default(0),
    activeSheets: integer("active_sheets").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    uniqueIndex("usage_counter_user_app_period_unique").on(
      table.userId,
      table.appId,
      table.periodStart,
    ),
  ],
);

export const billingEvents = pgTable("billing_events", {
  id: text("id").primaryKey().$defaultFn(id),
  polarEventId: text("polar_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const googleConnections = pgTable(
  "google_connections",
  {
    id: text("id").primaryKey().$defaultFn(id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    appKey: text("app_key").notNull(),
    googleAccountId: text("google_account_id").notNull(),
    email: text("email").notNull(),
    scopes: text("scopes").notNull(),
    encryptedAccessToken: text("encrypted_access_token"),
    encryptedRefreshToken: text("encrypted_refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    index("google_connections_user_idx").on(table.userId),
    uniqueIndex("google_connection_user_app_account_unique").on(
      table.userId,
      table.appKey,
      table.googleAccountId,
    ),
  ],
);

export const sheetdueSheetWatches = pgTable(
  "sheetdue_sheet_watches",
  {
    id: text("id").primaryKey().$defaultFn(id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    googleConnectionId: text("google_connection_id").notNull(),
    spreadsheetId: text("spreadsheet_id").notNull(),
    spreadsheetName: text("spreadsheet_name").notNull(),
    sheetId: integer("sheet_id").notNull(),
    sheetTitle: text("sheet_title").notNull(),
    timezone: text("timezone").notNull().default("UTC"),
    status: text("status").notNull().default("draft"),
    scanCadence: text("scan_cadence").notNull().default("daily"),
    stableRowIdColumn: text("stable_row_id_column")
      .notNull()
      .default("_sheetdue_row_id"),
    lastScannedAt: timestamp("last_scanned_at"),
    nextScanAt: timestamp("next_scan_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    foreignKey({
      name: "sheetdue_watches_google_conn_fk",
      columns: [table.googleConnectionId],
      foreignColumns: [googleConnections.id],
    }).onDelete("cascade"),
    index("sheetdue_watches_due_idx").on(
      table.status,
      table.scanCadence,
      table.nextScanAt,
    ),
    uniqueIndex("sheetdue_watch_user_sheet_tab_unique").on(
      table.userId,
      table.spreadsheetId,
      table.sheetId,
    ),
  ],
);

export const sheetdueColumnMappings = pgTable(
  "sheetdue_column_mappings",
  {
    id: text("id").primaryKey().$defaultFn(id),
    watchId: text("watch_id").notNull(),
    titleColumn: text("title_column").notNull(),
    titleSourceType: text("title_source_type").notNull().default("column"),
    titleStaticValue: text("title_static_value"),
    titleTemplate: text("title_template"),
    dueDateColumn: text("due_date_column").notNull(),
    dueDateSourceType: text("due_date_source_type").notNull().default("column"),
    dueDateStaticValue: text("due_date_static_value"),
    dueDateTemplate: text("due_date_template"),
    dueDateFormat: text("due_date_format"),
    recipientEmailColumn: text("recipient_email_column").notNull(),
    recipientEmailSourceType: text("recipient_email_source_type")
      .notNull()
      .default("column"),
    recipientEmailStaticValue: text("recipient_email_static_value"),
    recipientEmailTemplate: text("recipient_email_template"),
    statusColumn: text("status_column"),
    headerRowIndex: integer("header_row_index").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    foreignKey({
      name: "sheetdue_mappings_watch_id_fk",
      columns: [table.watchId],
      foreignColumns: [sheetdueSheetWatches.id],
    }).onDelete("cascade"),
    uniqueIndex("sheetdue_mapping_watch_unique").on(table.watchId),
  ],
);

export const sheetdueReminderRules = pgTable(
  "sheetdue_reminder_rules",
  {
    id: text("id").primaryKey().$defaultFn(id),
    watchId: text("watch_id")
      .notNull()
      .references(() => sheetdueSheetWatches.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    offsetDays: integer("offset_days").notNull().default(0),
    repeatIntervalDays: integer("repeat_interval_days"),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [index("sheetdue_rules_watch_idx").on(table.watchId)],
);

export const sheetdueEmailTemplates = pgTable(
  "sheetdue_email_templates",
  {
    id: text("id").primaryKey().$defaultFn(id),
    watchId: text("watch_id")
      .notNull()
      .references(() => sheetdueSheetWatches.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    senderName: text("sender_name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [uniqueIndex("sheetdue_template_watch_unique").on(table.watchId)],
);

export const sheetdueReminderEvents = pgTable(
  "sheetdue_reminder_events",
  {
    id: text("id").primaryKey().$defaultFn(id),
    watchId: text("watch_id")
      .notNull()
      .references(() => sheetdueSheetWatches.id, { onDelete: "cascade" }),
    ruleId: text("rule_id").references(() => sheetdueReminderRules.id, {
      onDelete: "set null",
    }),
    rowId: text("row_id").notNull(),
    dueDate: date("due_date").notNull(),
    occurrenceDate: date("occurrence_date").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("queued"),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    providerMessageId: text("provider_message_id"),
    errorMessage: text("error_message"),
    queuedAt: timestamp("queued_at").notNull().defaultNow(),
    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(now),
  },
  (table) => [
    index("sheetdue_events_watch_idx").on(table.watchId),
    index("sheetdue_events_status_idx").on(table.status, table.queuedAt),
    index("sheetdue_events_provider_idx").on(table.providerMessageId),
  ],
);

export type User = typeof user.$inferSelect;
export type SheetdueSheetWatch = typeof sheetdueSheetWatches.$inferSelect;
export type SheetdueReminderRule = typeof sheetdueReminderRules.$inferSelect;
export type SheetdueReminderEvent = typeof sheetdueReminderEvents.$inferSelect;
