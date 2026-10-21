import { test } from "node:test";
import { strict as assert } from "node:assert";
import { scoreExam } from "./exam-session";
import type { Question } from "../data/questions";

const questions: Question[] = Array.from({ length: 70 }, (_, index) => ({ id: `q${index}`, question: "Fråga", category: "Trafikregler", options: ["A", "B", "C", "D"], correct: 0, explanation: "", reference: "", trial: index >= 65 }));
test("70 questions contain 65 scored questions; 52 correct pass", () => {
  const answers = Object.fromEntries(questions.slice(0, 52).map((question) => [question.id, 0]));
  assert.deepEqual(scoreExam(questions, answers), { total: 65, correct: 52, wrong: 13, percent: 80, passed: true });
  delete answers.q51;
  assert.equal(scoreExam(questions, answers).passed, false);
});
test("unanswered questions count as wrong, trial answers do not add points", () => {
  assert.deepEqual(scoreExam(questions, { q65: 0 }), { total: 65, correct: 0, wrong: 65, percent: 0, passed: false });
});
test("revisiting and changing an answer uses only its latest choice", () => {
  const answers = { q0: 1 };
  answers.q0 = 0;
  assert.equal(scoreExam(questions, answers).correct, 1);
});