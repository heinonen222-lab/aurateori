import { describe, test, expect } from "bun:test";
import { matchesTopic, topicProgress, trainingSummary, swedishDay } from "./practice";
import type { Question } from "../data/questions";
import type { AppState } from "./store";

const empty: AppState = { answers: [], wrongQueue: [], streak: 0, lastActive: "", theme: "light", examAttempts: [] };
const question: Question = { id: "yield-1", category: "Trafikregler", question: "När gäller högerregeln?", options: ["A", "B", "C", "D"], correct: 0, explanation: "", reference: "" };
describe("Real training progress", () => {
  test("new users have no invented progress", () => {
    expect(topicProgress([question], empty).every((topic) => topic.percent === 0)).toBe(true);
    expect(trainingSummary(empty).trainingDays).toBe(0);
    expect(trainingSummary(empty).latestExam).toBeUndefined();
  });
  test("latest incorrect answer reduces topic progress", () => {
    const state = { ...empty, answers: [{ qid: question.id, category: question.category, correct: true, at: 1 }, { qid: question.id, category: question.category, correct: false, at: 2 }] };
    expect(topicProgress([question], state).find((topic) => topic.id === "yield")?.percent).toBe(0);
    expect(topicProgress([question], { ...state, answers: state.answers.slice(0, 1) }).find((topic) => topic.id === "yield")?.percent).toBe(100);
  });
  test("yield and speed filters use actual questions", () => {
    expect(matchesTopic(question, "yield")).toBe(true);
    expect(matchesTopic(question, "speed")).toBe(false);
  });
  test("days use Stockholm time and count unique training days", () => {
    const at = Date.parse("2026-10-20T22:30:00Z");
    expect(swedishDay(at)).toBe("2026-10-21");
    expect(trainingSummary({ ...empty, answers: [1, 2].map(() => ({ qid: question.id, category: question.category, correct: true, at })) }, at).trainingDays).toBe(1);
  });
});