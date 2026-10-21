import { test } from "node:test";
import { strict as assert } from "node:assert";
import { QUESTIONS } from "../data/questions";

test("non-Premium question inventory contains exactly ten distinct questions globally", () => {
  assert.equal(QUESTIONS.length, 10);
  assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, 10);
  assert.deepEqual(QUESTIONS.map((q) => q.id), Array.from({ length: 10 }, (_, i) => `insurance-${i + 1}`));
});

test("the ten free insurance questions have four options, one answer and a source", () => {
  for (const question of QUESTIONS) {
    assert.equal(question.options.length, 4);
    assert.equal(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4, true);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.category, "Fordonskännedom");
    assert.ok(question.source?.url.startsWith("https://"));
  }
});