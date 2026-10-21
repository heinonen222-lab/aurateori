import { test } from "node:test";
import { strict as assert } from "node:assert";
import { QUESTIONS } from "../data/questions";

test("non-Premium question inventory contains exactly ten distinct questions globally", () => {
  assert.equal(QUESTIONS.length, 10);
  assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, 10);
  assert.deepEqual(QUESTIONS.map((q) => q.id), Array.from({ length: 10 }, (_, i) => `q${i + 1}`));
});