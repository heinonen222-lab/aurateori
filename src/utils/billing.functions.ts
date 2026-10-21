import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PaddleEnvInput = "sandbox" | "live";

export type BillingTransaction = {
  id: string;
  status: string;
  createdAt: string | null;
  billedAt: string | null;
  total: string | null;
  currency: string | null;
  isLive: boolean;
};

export type BillingSubscription = {
  id: string;
  status: string;
  priceId: string;
  productId: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  nextBilledAt: string | null;
  cancelAtPeriodEnd: boolean;
  scheduledChange: string | null;
  isExpired: boolean;
  isPastDue: boolean;
  isActive: boolean;
  updatePaymentMethodUrl: string | null;
  cancelUrl: string | null;
  environment: string;
  paddleStatus: string | null;
};

export type BillingStatus = {
  environment: PaddleEnvInput;
  subscriptions: BillingSubscription[];
  transactions: BillingTransaction[];
  liveTransactionCount: number;
  activeCount: number;
  fetchedAt: string;
  paddleError: string | null;
};

const ACTIVE_STATUSES = ["active", "trialing"];

function toMajorUnit(amount: string, currency: string): number {
  const zeroDecimal = new Set(["JPY", "KRW", "VND"]);
  const value = Number(amount ?? 0);
  return zeroDecimal.has(currency.toUpperCase()) ? value : value / 100;
}

/**
 * Server-side entitlement check: is the caller an active Premium subscriber?
 * Used to gate paid features (e.g. the full exam) so access cannot be granted
 * by tampering with client-side state.
 */
export const checkPremiumAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ allowed: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: playRows, error: playError } = await supabaseAdmin.from("google_play_subscriptions").select("purchase_token").eq("user_id", context.userId);
    if (playError) throw new Error("Kunde inte kontrollera Google Play-abonnemanget.");
    const { verifyPlayPurchase } = await import("@/lib/play-billing.server");
    for (const row of playRows ?? []) {
      try { if ((await verifyPlayPurchase(row.purchase_token)).allowed) return { allowed: true }; } catch { /* Fall back only to independently valid Paddle access. */ }
    }
    const now = new Date().toISOString();
    const { data, error } = await context.supabase
      .from("subscriptions")
      .select("status,current_period_end")
      .eq("user_id", context.userId);

    if (error) throw new Error(error.message);

    const allowed = (data ?? []).some((row) => {
      const end = row.current_period_end;
      const withinPeriod = !end || end > now;
      const statusActive =
        ACTIVE_STATUSES.includes(row.status) ||
        // past_due: Paddle retries payment (dunning) — keep access until it cancels.
        row.status === "past_due" ||
        (row.status === "canceled" && !!end);
      return statusActive && withinPeriod;
    });

    return { allowed };
  });

export const getBillingStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: PaddleEnvInput }) => data)
  .handler(async ({ data, context }): Promise<BillingStatus> => {
    const environment = data.environment === "live" ? "live" : "sandbox";

    const { data: rows, error } = await context.supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", context.userId)
      .eq("environment", environment)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const { gatewayFetch } = await import("@/lib/paddle.server");
    const now = Date.now();
    let paddleError: string | null = null;

    const subscriptions: BillingSubscription[] = [];
    const customerIds = new Set<string>();

    for (const row of rows ?? []) {
      customerIds.add(row.paddle_customer_id);

      let paddleStatus: string | null = null;
      let nextBilledAt: string | null = null;
      let scheduledChange: string | null = null;
      let updatePaymentMethodUrl: string | null = null;
      let cancelUrl: string | null = null;
      let periodEnd = row.current_period_end;
      let periodStart = row.current_period_start;
      let cancelAtPeriodEnd = Boolean(row.cancel_at_period_end);

      try {
        const res = await gatewayFetch(
          environment,
          `/subscriptions/${encodeURIComponent(row.paddle_subscription_id)}`,
        );
        if (res.ok) {
          const json = (await res.json()) as {
            data?: {
              status?: string;
              next_billed_at?: string | null;
              scheduled_change?: { action?: string; effective_at?: string } | null;
              management_urls?: { update_payment_method?: string; cancel?: string } | null;
              current_billing_period?: { starts_at?: string; ends_at?: string } | null;
            };
          };
          const sub = json.data;
          if (sub) {
            paddleStatus = sub.status ?? null;
            updatePaymentMethodUrl = sub.management_urls?.update_payment_method ?? null;
            cancelUrl = sub.management_urls?.cancel ?? null;
            nextBilledAt = sub.next_billed_at ?? null;
            periodStart = sub.current_billing_period?.starts_at ?? periodStart;
            periodEnd = sub.current_billing_period?.ends_at ?? periodEnd;
            if (sub.scheduled_change?.action) {
              scheduledChange = `${sub.scheduled_change.action}:${sub.scheduled_change.effective_at ?? ""}`;
              if (sub.scheduled_change.action === "cancel") cancelAtPeriodEnd = true;
            }
          }
        }
      } catch (err) {
        paddleError = err instanceof Error ? err.message : "Kunde inte nå Paddle";
      }

      const status = paddleStatus ?? row.status;
      const endMs = periodEnd ? new Date(periodEnd).getTime() : null;
      const withinPeriod = endMs === null || endMs > now;
      const isExpired = endMs !== null && endMs <= now;

      subscriptions.push({
        id: row.paddle_subscription_id,
        status,
        priceId: row.price_id,
        productId: row.product_id,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        nextBilledAt,
        cancelAtPeriodEnd,
        scheduledChange,
        isExpired,
        isPastDue: status === "past_due",
        isActive:
          (ACTIVE_STATUSES.includes(status) && withinPeriod) ||
          (status === "canceled" && withinPeriod && endMs !== null),
        updatePaymentMethodUrl,
        cancelUrl,
        environment: row.environment,
        paddleStatus,
      });
    }

    const transactions: BillingTransaction[] = [];

    for (const customerId of customerIds) {
      try {
        const res = await gatewayFetch(
          environment,
          `/transactions?customer_id=${encodeURIComponent(customerId)}&per_page=20&order_by=created_at[DESC]`,
        );
        if (!res.ok) continue;
        const json = (await res.json()) as {
          data?: {
            id: string;
            status: string;
            created_at?: string;
            billed_at?: string | null;
            currency_code?: string;
            details?: { totals?: { grand_total?: string } };
          }[];
        };
        for (const t of json.data ?? []) {
          const currency = t.currency_code ?? "SEK";
          const raw = t.details?.totals?.grand_total;
          transactions.push({
            id: t.id,
            status: t.status,
            createdAt: t.created_at ?? null,
            billedAt: t.billed_at ?? null,
            total: raw
              ? new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(
                  toMajorUnit(raw, currency),
                )
              : null,
            currency,
            isLive: environment === "live",
          });
        }
      } catch (err) {
        paddleError = err instanceof Error ? err.message : "Kunde inte nå Paddle";
      }
    }

    transactions.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

    return {
      environment,
      subscriptions,
      transactions: transactions.slice(0, 10),
      liveTransactionCount: transactions.filter(
        (t) => t.isLive && (t.status === "completed" || t.status === "billed"),
      ).length,
      activeCount: subscriptions.filter((s) => s.isActive).length,
      fetchedAt: new Date().toISOString(),
      paddleError,
    };
  });
