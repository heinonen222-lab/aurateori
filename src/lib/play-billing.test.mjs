import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAY_PACKAGE, PLAY_PLANS, playEntitled } from "./play-billing.ts";

test("Android purchases use the retained package ID", () => {
  assert.equal(PLAY_PACKAGE, "app.aurateori.android");
});
test("three Premium products remain distinct", () => {
  assert.deepEqual(PLAY_PLANS, ["premium_monthly", "premium_quarterly", "premium_yearly"]);
});
test("active Play subscription grants access only before expiry", () => {
  assert.equal(playEntitled("SUBSCRIPTION_STATE_ACTIVE", "2026-11-01", Date.parse("2026-10-21")), true);
  assert.equal(playEntitled("SUBSCRIPTION_STATE_ACTIVE", "2026-10-20", Date.parse("2026-10-21")), false);
});
test("failed renewal in grace period keeps access", () => {
  assert.equal(playEntitled("SUBSCRIPTION_STATE_IN_GRACE_PERIOD", "2026-11-01", Date.parse("2026-10-21")), true);
});
test("canceled subscription keeps the paid remaining period", () => {
  assert.equal(playEntitled("SUBSCRIPTION_STATE_CANCELED", "2026-11-01", Date.parse("2026-10-21")), true);
});
test("pending, held, paused and expired purchases cannot activate Premium", () => {
  for (const state of ["PENDING", "ON_HOLD", "PAUSED", "EXPIRED"]) {
    assert.equal(playEntitled(`SUBSCRIPTION_STATE_${state}`, "2026-11-01", Date.parse("2026-10-21")), false);
  }
});