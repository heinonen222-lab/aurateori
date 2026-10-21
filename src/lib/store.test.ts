import { test } from "node:test";
import { strict as assert } from "node:assert";
import { store, computeStats } from "./store";

test("mounted consumers receive a new snapshot when an answer is saved", () => {
  store.reset();
  const previous = store.get();
  store.recordAnswer("live-update", "Trafikregler", true);
  assert.notEqual(store.get(), previous);
  assert.equal(computeStats(store.get()).total, 1);
  store.reset();
});
test("incorrect answers enter repetition and correct retries remove them", () => {
  store.recordAnswer("repeat", "Vägmärken", false);
  assert.deepEqual(store.get().wrongQueue, ["repeat"]);
  store.recordAnswer("repeat", "Vägmärken", true);
  assert.deepEqual(store.get().wrongQueue, []);
  store.reset();
});