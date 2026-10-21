import type { Question } from "@/data/questions";
import type { AppState } from "@/lib/store";

export const TOPICS = [
  { id: "signs", label: "Vägmärken", icon: "sign", category: "Vägmärken" },
  { id: "rules", label: "Trafikregler", icon: "book", category: "Trafikregler" },
  { id: "yield", label: "Väjningsregler", icon: "yield", pattern: /högerregel|väjningsplikt|stopplikt|cirkulationsplats|korsning/i },
  { id: "speed", label: "Hastighet", icon: "speed", pattern: /hastighet|bromssträcka|stoppsträcka|reaktionssträcka/i },
  { id: "safety", label: "Trafiksäkerhet", icon: "shield", pattern: /säkerhet|avstånd|halka|halt|mörker|bälte|omkörning|barn|risk/i },
  { id: "vehicle", label: "Fordonskunskap", icon: "car", category: "Fordonskännedom" },
  { id: "environment", label: "Miljö", icon: "leaf", category: "Miljö" },
  { id: "human", label: "Människan i trafiken", icon: "person", category: "Människan & Trafiken" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

export function matchesTopic(question: Question, id: TopicId) {
  const topic = TOPICS.find((item) => item.id === id);
  if (!topic) return false;
  return "category" in topic
    ? question.category === topic.category
    : topic.pattern.test(question.question);
}

export function topicProgress(questions: Question[], state: AppState) {
  const latest = new Map(state.answers.map((answer) => [answer.qid, answer]));
  return TOPICS.map((topic) => {
    const pool = questions.filter((question) => matchesTopic(question, topic.id));
    const answered = pool.filter((question) => latest.has(question.id)).length;
    const correct = pool.filter((question) => latest.get(question.id)?.correct).length;
    return { ...topic, available: pool.length, answered, correct, percent: pool.length ? Math.round(correct / pool.length * 100) : 0 };
  });
}

export function swedishDay(timestamp: number) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" }).format(timestamp);
}

export function trainingSummary(state: AppState, now = Date.now()) {
  const dates = new Set([...state.answers.map((answer) => swedishDay(answer.at)), ...state.examAttempts.map((exam) => swedishDay(exam.at))]);
  const weekStart = new Date(swedishDay(now) + "T12:00:00Z");
  weekStart.setUTCDate(weekStart.getUTCDate() - (weekStart.getUTCDay() + 6) % 7);
  const start = swedishDay(weekStart.getTime());
  const end = swedishDay(now);
  const weeklyDays = [...dates].filter((day) => day >= start && day <= end).length;
  const latestExam = state.examAttempts.at(-1);
  return { trainingDays: dates.size, weeklyDays, latestExam };
}