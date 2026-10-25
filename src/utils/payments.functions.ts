import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Only the app's own catalog prices may be resolved; never proxy arbitrary IDs.
const ALLOWED_PRICE_IDS = ["premium_monthly", "premium_quarterly", "premium_yearly"] as const;

const inputSchema = z.object({
  priceId: z.enum(ALLOWED_PRICE_IDS),
  environment: z.enum(["sandbox", "live"]),
});

const cache = new Map<string, string>();

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<string> => {
    const key = `${data.environment}:${data.priceId}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const { gatewayFetch } = await import("@/lib/paddle.server");
    const response = await gatewayFetch(
      data.environment,
      `/prices?external_id=${encodeURIComponent(data.priceId)}`,
    );
    const result = (await response.json()) as { data?: { id: string }[] };
    const price = result.data?.[0];
    if (!price) throw new Error("Priset kunde inte hittas.");
    cache.set(key, price.id);
    return price.id;
  });
