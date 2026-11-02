import { describe, expect, it } from "vitest";
import { pickSubscription } from "./useSubscription";

const future = new Date(Date.now() + 30 * 86_400_000).toISOString();
const past = new Date(Date.now() - 30 * 86_400_000).toISOString();

const row = (over: Partial<{ status: string; current_period_end: string | null; created_at: string | null; environment: string; price_id: string }>) => ({
  status: "active",
  current_period_end: future,
  created_at: "2026-10-01T00:00:00Z",
  environment: "sandbox",
  price_id: "premium_monthly",
  ...over,
});

describe("pickSubscription", () => {
  it("returns null when the user has no subscription rows", () => {
    expect(pickSubscription([])).toBeNull();
  });

  it("grants access to an active row in the sandbox environment", () => {
    const rows = [row({ environment: "sandbox", price_id: "manual" })];
    const picked = pickSubscription(rows);
    expect(picked?.price_id).toBe("manual");
    expect(picked?.status).toBe("active");
  });

  it("prefers an active row over an older expired row", () => {
    const rows = [
      row({ status: "canceled", current_period_end: past, created_at: "2026-10-05T00:00:00Z", price_id: "old" }),
      row({ status: "active", price_id: "premium_yearly", created_at: "2026-09-01T00:00:00Z" }),
    ];
    expect(pickSubscription(rows)?.price_id).toBe("premium_yearly");
  });

  it("keeps a canceled row that is still inside its paid period", () => {
    const rows = [
      row({ status: "canceled", current_period_end: future, created_at: "2026-10-02T00:00:00Z", price_id: "keep" }),
      row({ status: "expired", current_period_end: past, created_at: "2026-10-09T00:00:00Z", price_id: "gone" }),
    ];
    expect(pickSubscription(rows)?.price_id).toBe("keep");
  });

  it("treats a failed renewal (past_due) as active", () => {
    const rows = [row({ status: "past_due", price_id: "premium_monthly" })];
    expect(pickSubscription(rows)?.price_id).toBe("premium_monthly");
  });

  it("returns the most recent row when nothing grants access", () => {
    const rows = [
      row({ status: "canceled", current_period_end: past, created_at: "2026-08-01T00:00:00Z", price_id: "older" }),
      row({ status: "canceled", current_period_end: past, created_at: "2026-10-01T00:00:00Z", price_id: "newer" }),
    ];
    expect(pickSubscription(rows)?.price_id).toBe("newer");
  });
});
