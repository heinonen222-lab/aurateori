import type { Question } from "@/data/questions";

export function scoreExam(questions: Question[], answers: Record<string, number>) {
  const scored = questions.filter((question) => !question.trial);
  const correct = scored.filter((question) => answers[question.id] === question.correct).length;
  return { total: scored.length, correct, wrong: scored.length - correct, percent: scored.length ? Math.round(correct / scored.length * 100) : 0, passed: correct >= 52 };
}