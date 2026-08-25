import { createServerFn } from "@tanstack/react-start";

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: { priceId: string; environment: "sandbox" | "live" }) => data)
  .handler(async ({ data }): Promise<string> => {
    const { gatewayFetch } = await import("@/lib/paddle.server");
    const response = await gatewayFetch(
      data.environment,
      `/prices?external_id=${encodeURIComponent(data.priceId)}`,
    );
    const result = (await response.json()) as { data?: { id: string }[] };
    const price = result.data?.[0];
    if (!price) throw new Error(`Priset "${data.priceId}" hittades inte.`);
    return price.id;
  });
