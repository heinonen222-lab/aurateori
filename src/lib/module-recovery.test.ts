import { test } from "node:test";
import { strict as assert } from "node:assert";
import { runInNewContext } from "node:vm";
import { MODULE_RECOVERY_SCRIPT } from "./module-recovery";

function harness(online = true, last = "") {
  let reloads = 0;
  const handlers: Record<string, (event: Record<string, unknown>) => void> = {};
  const storage = new Map([["aurateori-module-recovery", last]]);
  runInNewContext(MODULE_RECOVERY_SCRIPT, { Error, navigator: { onLine: online }, sessionStorage: { getItem: (key: string) => storage.get(key), setItem: (key: string, value: string) => storage.set(key, value) }, window: { addEventListener: (event: string, handler: (event: Record<string, unknown>) => void) => { handlers[event] = handler; }, setTimeout: (fn: () => void) => fn(), location: { reload: () => { reloads++; } } } });
  return { handlers, reloads: () => reloads };
}
test("Safari failed entry import recovers once, even with duplicate events", () => {
  const app = harness();
  app.handlers.unhandledrejection({ reason: new Error("Importing a module script failed.") });
  app.handlers.error({ message: "Importing a module script failed." });
  assert.equal(app.reloads(), 1);
});
test("recent recovery prevents an infinite refresh loop", () => {
  const app = harness(true, String(Date.now()));
  app.handlers.unhandledrejection({ reason: new Error("Importing a module script failed.") });
  assert.equal(app.reloads(), 0);
});
test("offline and unrelated application errors do not force reload", () => {
  const offline = harness(false);
  offline.handlers.error({ message: "Importing a module script failed." });
  assert.equal(offline.reloads(), 0);
  const app = harness();
  app.handlers.error({ message: "Invalid answer" });
  assert.equal(app.reloads(), 0);
});