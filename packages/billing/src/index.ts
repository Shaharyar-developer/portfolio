import { db, schema } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const SHEETDUE_APP_KEY = "sheetdue";

export type PlanKey = "free" | "pro";

export type PlanLimits = {
  activeSheets: number | "unlimited";
  remindersPerMonth: number;
  scanCadence: "daily" | "hourly";
  customSenderName: boolean;
  reminderHistory: boolean;
};

export const sheetduePlanLimits: Record<PlanKey, PlanLimits> = {
  free: {
    activeSheets: 1,
    remindersPerMonth: 50,
    scanCadence: "daily",
    customSenderName: false,
    reminderHistory: false,
  },
  pro: {
    activeSheets: "unlimited",
    remindersPerMonth: 2500,
    scanCadence: "hourly",
    customSenderName: true,
    reminderHistory: true,
  },
};

const polarPayloadSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.unknown()),
});

type PolarPayload = z.infer<typeof polarPayloadSchema>;

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function readBoolean(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "boolean" ? value : undefined;
}

function readRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readDate(record: Record<string, unknown>, key: string) {
  const value = readString(record, key);
  return value ? new Date(value) : undefined;
}

function getMetadataUserId(data: Record<string, unknown>) {
  const metadata = readRecord(data, "metadata");
  const customer = readRecord(data, "customer");
  const customerMetadata = readRecord(customer, "metadata");

  return (
    readString(metadata, "userId") ??
    readString(customerMetadata, "userId") ??
    readString(customer, "externalId") ??
    readString(customer, "external_id")
  );
}

function getProductId(data: Record<string, unknown>) {
  const product = readRecord(data, "product");
  return (
    readString(data, "productId") ??
    readString(data, "product_id") ??
    readString(product, "id") ??
    process.env.POLAR_SHEETDUE_PRODUCT_ID
  );
}

export async function ensureSheetdueApp() {
  const existing = await db.query.apps.findFirst({
    where: eq(schema.apps.key, SHEETDUE_APP_KEY),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(schema.apps)
    .values({
      key: SHEETDUE_APP_KEY,
      name: "SheetDue",
      slug: "sheetdue",
    })
    .onConflictDoUpdate({
      target: schema.apps.key,
      set: {
        name: "SheetDue",
        slug: "sheetdue",
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!created) {
    throw new Error("Unable to create SheetDue app record.");
  }

  return created;
}

export async function ensureSheetdueProduct() {
  const app = await ensureSheetdueApp();
  const polarProductId =
    process.env.POLAR_SHEETDUE_PRODUCT_ID ?? "sheetdue-product-unconfigured";

  const [product] = await db
    .insert(schema.appProducts)
    .values({
      appId: app.id,
      polarProductId,
      name: "SheetDue Pro",
    })
    .onConflictDoUpdate({
      target: schema.appProducts.polarProductId,
      set: {
        appId: app.id,
        name: "SheetDue Pro",
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!product) {
    throw new Error("Unable to create SheetDue product record.");
  }

  return { app, product };
}

export async function getUserSheetduePlan(userId: string): Promise<PlanKey> {
  const app = await ensureSheetdueApp();
  const subscription = await db.query.subscriptions.findFirst({
    where: and(
      eq(schema.subscriptions.userId, userId),
      eq(schema.subscriptions.appId, app.id),
    ),
  });

  if (
    subscription?.plan === "pro" &&
    ["active", "trialing"].includes(subscription.status)
  ) {
    return "pro";
  }

  return "free";
}

export async function syncPolarPayload(rawPayload: unknown) {
  const payload = polarPayloadSchema.parse(rawPayload);
  const eventId = payload.id ?? `${payload.type}:${crypto.randomUUID()}`;

  await db
    .insert(schema.billingEvents)
    .values({
      polarEventId: eventId,
      eventType: payload.type,
      payload,
      processedAt: new Date(),
    })
    .onConflictDoNothing();

  if (!payload.type.startsWith("subscription.")) {
    return { handled: false, eventType: payload.type };
  }

  const userId = getMetadataUserId(payload.data);
  const polarSubscriptionId =
    readString(payload.data, "id") ??
    readString(payload.data, "subscriptionId") ??
    readString(payload.data, "subscription_id");

  if (!userId || !polarSubscriptionId) {
    return { handled: false, eventType: payload.type };
  }

  const { app, product } = await ensureSheetdueProduct();
  const status = readString(payload.data, "status") ?? "active";
  const plan: PlanKey = ["active", "trialing"].includes(status) ? "pro" : "free";
  const customer = readRecord(payload.data, "customer");

  await db
    .insert(schema.subscriptions)
    .values({
      userId,
      appId: app.id,
      appProductId: product.id,
      polarCustomerId:
        readString(payload.data, "customerId") ??
        readString(payload.data, "customer_id") ??
        readString(customer, "id"),
      polarSubscriptionId,
      polarProductId: getProductId(payload.data),
      status,
      plan,
      currentPeriodEnd:
        readDate(payload.data, "currentPeriodEnd") ??
        readDate(payload.data, "current_period_end"),
      cancelAtPeriodEnd:
        readBoolean(payload.data, "cancelAtPeriodEnd") ??
        readBoolean(payload.data, "cancel_at_period_end") ??
        false,
    })
    .onConflictDoUpdate({
      target: schema.subscriptions.polarSubscriptionId,
      set: {
        appProductId: product.id,
        polarProductId: getProductId(payload.data),
        status,
        plan,
        currentPeriodEnd:
          readDate(payload.data, "currentPeriodEnd") ??
          readDate(payload.data, "current_period_end"),
        cancelAtPeriodEnd:
          readBoolean(payload.data, "cancelAtPeriodEnd") ??
          readBoolean(payload.data, "cancel_at_period_end") ??
          false,
        updatedAt: new Date(),
      },
    });

  return { handled: true, eventType: payload.type };
}
