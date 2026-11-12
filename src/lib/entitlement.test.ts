import { describe, it } from "node:test";
import assert from "node:assert/strict";
const expect = (v: unknown) => ({ toBe: (e: unknown) => assert.equal(v, e) });
import { currentPaymentEnv, rowGrantsAccess } from "./entitlement";

const future = new Date(Date.now() + 86_400_000).toISOString();
describe("entitlement", () => {
  it("test-token builds are sandbox", () => expect(currentPaymentEnv("test_abc")).toBe("sandbox"));
  it("live builds are live", () => expect(currentPaymentEnv("live_abc")).toBe("live"));
  it("a test purchase does not grant live Premium", () =>
    expect(rowGrantsAccess({ status: "active", current_period_end: future, environment: "sandbox", paddle_subscription_id: "sub_1" }, "live")).toBe(false));
  it("a live purchase grants live Premium", () =>
    expect(rowGrantsAccess({ status: "active", current_period_end: future, environment: "live", paddle_subscription_id: "sub_1" }, "live")).toBe(true));
  it("teacher-assigned Premium works in any environment", () =>
    expect(rowGrantsAccess({ status: "active", current_period_end: null, environment: "sandbox", paddle_subscription_id: "manual_u_sandbox" }, "live")).toBe(true));
  it("canceled keeps access until period end", () =>
    expect(rowGrantsAccess({ status: "canceled", current_period_end: future, environment: "live" }, "live")).toBe(true));
});
