export type PaymentEnv = "sandbox" | "live";

type Row = { status: string; current_period_end: string | null; environment?: string | null; paddle_subscription_id?: string | null };

/** Same rule on client and server: the build's payment token decides test vs live. */
export function currentPaymentEnv(token: string | undefined = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined): PaymentEnv {
  return token?.startsWith("test_") ? "sandbox" : "live";
}

/** Teacher/admin grants are independent of checkout; paid rows only count in their own environment. */
export function rowInEnvironment(row: Row, env: PaymentEnv): boolean {
  if (row.paddle_subscription_id?.startsWith("manual_")) return true;
  return (row.environment ?? "sandbox") === env;
}

export function rowGrantsAccess(row: Row, env: PaymentEnv, now: number = Date.now()): boolean {
  if (!rowInEnvironment(row, env)) return false;
  const end = row.current_period_end ? new Date(row.current_period_end).getTime() : null;
  const inPeriod = end === null || end > now;
  if (["active", "trialing", "past_due"].includes(row.status)) return inPeriod;
  if (row.status === "canceled") return end !== null && end > now;
  return false;
}
