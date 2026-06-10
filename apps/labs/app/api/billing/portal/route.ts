import { requireUser } from "@/lib/auth/session";
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  getExternalCustomerId: async () => {
    const user = await requireUser();
    return user.id;
  },
  returnUrl: `${process.env.LABS_BASE_URL ?? "http://localhost:3001"}/sheetdue/dashboard`,
  server: process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
});
