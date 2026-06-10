import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/http";
import { SHEETDUE_APP_KEY } from "@workspace/billing";
import { Checkout } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

const checkout = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `${process.env.LABS_BASE_URL ?? "http://localhost:3001"}/sheetdue/dashboard?billing=success`,
  returnUrl: `${process.env.LABS_BASE_URL ?? "http://localhost:3001"}/sheetdue`,
  server: process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
  theme: "light",
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(request.url);
    url.searchParams.set(
      "products",
      process.env.POLAR_SHEETDUE_PRODUCT_ID ?? "",
    );
    url.searchParams.set("customerExternalId", user.id);
    url.searchParams.set("customerEmail", user.email);
    url.searchParams.set("customerName", user.name);
    url.searchParams.set(
      "metadata",
      JSON.stringify({
        userId: user.id,
        appKey: SHEETDUE_APP_KEY,
      }),
    );

    return checkout(new NextRequest(url, request));
  } catch (error) {
    return jsonError(error, 401);
  }
}
