import { test } from "node:test";
import { strict as assert } from "node:assert";
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

test("pickSubscription returns null when the user has no subscription rows", () => {
  assert.equal(pickSubscription([]), null);
});

test("pickSubscription grants access to an active row in the sandbox environment", () => {
  const picked = pickSubscription([row({ environment: "sandbox", price_id: "manual" })]);
  assert.equal(picked?.price_id, "manual");
  assert.equal(picked?.status, "active");
});

test("pickSubscription prefers an active row over an older expired row", () => {
  const rows = [
    row({ status: "canceled", current_period_end: past, created_at: "2026-10-05T00:00:00Z", price_id: "old" }),
    row({ status: "active", price_id: "premium_yearly", created_at: "2026-09-01T00:00:00Z" }),
  ];
  assert.equal(pickSubscription(rows)?.price_id, "premium_yearly");
});

test("pickSubscription keeps a canceled row that is still inside its paid period", () => {
  const rows = [
    row({ status: "canceled", current_period_end: future, created_at: "2026-10-02T00:00:00Z", price_id: "keep" }),
    row({ status: "expired", current_period_end: past, created_at: "2026-10-09T00:00:00Z", price_id: "gone" }),
  ];
  assert.equal(pickSubscription(rows)?.price_id, "keep");
});

test("pickSubscription treats a failed renewal (past_due) as active", () => {
  const picked = pickSubscription([row({ status: "past_due", price_id: "premium_monthly" })]);
  assert.equal(picked?.price_id, "premium_monthly");
});

test("pickSubscription returns the most recent row when nothing grants access", () => {
  const rows = [
    row({ status: "canceled", current_period_end: past, created_at: "2026-08-01T00:00:00Z", price_id: "older" }),
    row({ status: "canceled", current_period_end: past, created_at: "2026-10-01T00:00:00Z", price_id: "newer" }),
  ];
  assert.equal(pickSubscription(rows)?.price_id, "newer");
});
