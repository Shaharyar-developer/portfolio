import { syncPolarPayload } from "@workspace/billing";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? "",
  onPayload: async (payload) => {
    await syncPolarPayload(payload);
  },
});
