import { expect, test } from "bun:test";
import { scoreExam } from "./exam-session";
import type { Question } from "../data/questions";

const questions: Question[] = Array.from({ length: 70 }, (_, index) => ({ id: `q${index}`, question: "Fråga", category: "Trafikregler", options: ["A", "B", "C", "D"], correct: 0, explanation: "", reference: "", trial: index >= 65 }));
test("70 questions contain 65 scored questions; 52 correct pass", () => {
  const answers = Object.fromEntries(questions.slice(0, 52).map((question) => [question.id, 0]));
  expect(scoreExam(questions, answers)).toEqual({ total: 65, correct: 52, wrong: 13, percent: 80, passed: true });
  delete answers.q51;
  expect(scoreExam(questions, answers).passed).toBe(false);
});
test("unanswered questions count as wrong, trial answers do not add points", () => {
  expect(scoreExam(questions, { q65: 0 })).toEqual({ total: 65, correct: 0, wrong: 65, percent: 0, passed: false });
});
test("revisiting and changing an answer uses only its latest choice", () => {
  const answers = { q0: 1 };
  answers.q0 = 0;
  expect(scoreExam(questions, answers).correct).toBe(1);
});