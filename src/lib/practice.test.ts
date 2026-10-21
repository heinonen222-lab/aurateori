import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { matchesTopic, topicProgress, trainingSummary, swedishDay } from "./practice";
import type { Question } from "../data/questions";
import type { AppState } from "./store";

const empty: AppState = { answers: [], wrongQueue: [], streak: 0, lastActive: "", theme: "light", examAttempts: [] };
const question: Question = { id: "yield-1", category: "Trafikregler", question: "När gäller högerregeln?", options: ["A", "B", "C", "D"], correct: 0, explanation: "", reference: "" };
describe("Real training progress", () => {
  test("new users have no invented progress", () => {
    assert.equal(topicProgress([question], empty).every((topic) => topic.percent === 0), true);
    assert.equal(trainingSummary(empty).trainingDays, 0);
    assert.equal(trainingSummary(empty).latestExam, undefined);
  });
  test("latest incorrect answer reduces topic progress", () => {
    const state = { ...empty, answers: [{ qid: question.id, category: question.category, correct: true, at: 1 }, { qid: question.id, category: question.category, correct: false, at: 2 }] };
    assert.equal(topicProgress([question], state).find((topic) => topic.id === "yield")?.percent, 0);
    assert.equal(topicProgress([question], { ...state, answers: state.answers.slice(0, 1) }).find((topic) => topic.id === "yield")?.percent, 100);
  });
  test("yield and speed filters use actual questions", () => {
    assert.equal(matchesTopic(question, "yield"), true);
    assert.equal(matchesTopic(question, "speed"), false);
  });
  test("days use Stockholm time and count unique training days", () => {
    const at = Date.parse("2026-10-20T22:30:00Z");
    assert.equal(swedishDay(at), "2026-10-21");
    assert.equal(trainingSummary({ ...empty, answers: [1, 2].map(() => ({ qid: question.id, category: question.category, correct: true, at })) }, at).trainingDays, 1);
  });
});