import { useSyncExternalStore } from "react";

export interface AnswerLog {
  qid: string;
  category: string;
  correct: boolean;
  at: number; // timestamp
}

export interface ExamAttempt {
  at: number; // timestamp
  correct: number;
  total: number;
  passed: boolean;
}

export interface AppState {
  answers: AnswerLog[];
  wrongQueue: string[]; // qids to repeat
  streak: number;
  lastActive: string; // yyyy-mm-dd
  theme: "light" | "dark";
  examAttempts: ExamAttempt[];
}

const KEY = "korkortskollen-v1";

/** Max antal fullständiga prov per dygn. */
export const EXAM_DAILY_LIMIT = 3;

const defaultState: AppState = {
  answers: [],
  wrongQueue: [],
  streak: 0,
  lastActive: "",
  theme: "light",
  examAttempts: [],
};

function load(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

let state: AppState = defaultState;
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }
  listeners.forEach((l) => l());
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak() {
  const t = today();
  if (state.lastActive === t) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak = state.lastActive === yesterday ? state.streak + 1 : 1;
  state.lastActive = t;
}

export const store = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  hydrate: () => {
    state = load();
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    }
    emit();
  },
  recordAnswer: (qid: string, category: string, correct: boolean) => {
    state.answers = [...state.answers, { qid, category, correct, at: Date.now() }];
    if (!correct) {
      if (!state.wrongQueue.includes(qid)) state.wrongQueue = [...state.wrongQueue, qid];
    } else {
      state.wrongQueue = state.wrongQueue.filter((q) => q !== qid);
    }
    bumpStreak();
    emit();
  },
  recordExamAttempt: (correct: number, total: number, passed: boolean) => {
    state.examAttempts = [...state.examAttempts, { at: Date.now(), correct, total, passed }];
    emit();
  },
  toggleTheme: () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    emit();
  },

  reset: () => {
    state = { ...defaultState, theme: state.theme };
    emit();
  },
};

export function useStore(): AppState {
  return useSyncExternalStore(
    store.subscribe,
    () => state,
    () => defaultState,
  );
}

export function computeStats(s: AppState) {
  const total = s.answers.length;
  const correct = s.answers.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  if (total === 0) return { total, correct, accuracy, readiness: 0 };

  // De senaste svaren väger tyngst, så ett nytt fel märks direkt.
  const recentAnswers = s.answers.slice(-50);
  const recentCorrect = recentAnswers.filter((answer) => answer.correct).length;
  const recentAccuracy = (recentCorrect / recentAnswers.length) * 100;

  // Varje olöst fråga är en faktisk kunskapsskuld. 25 frågor i kön ger noll
  // i denna del av modellen.
  const errorDebtScore = Math.max(0, 100 - s.wrongQueue.length * 4);

  // Fullständiga prov är den bästa mätningen av provberedskap. Utan prov används
  // den aktuella träffsäkerheten, så nya användare aldrig får en gratis bonus.
  const recentExams = (s.examAttempts ?? []).slice(-3);
  const examScore = recentExams.length
    ? recentExams.reduce(
        (sum, attempt) => sum + (attempt.total > 0 ? (attempt.correct / attempt.total) * 100 : 0),
        0,
      ) / recentExams.length
    : recentAccuracy;

  // Träningsmängd multiplicerar bara resultatet. Ett fel kan därför aldrig
  // höja klarheten genom att öka antalet besvarade frågor.
  const confidence = Math.min(1, total / 100);
  const baseReadiness = recentAccuracy * 0.5 + errorDebtScore * 0.25 + examScore * 0.25;
  const readiness = Math.round(baseReadiness * confidence);

  return { total, correct, accuracy, readiness: Math.min(100, Math.max(0, readiness)) };
}

export function examUsage(s: AppState) {
  const attempts = s.examAttempts ?? [];
  const t = new Date().toISOString().slice(0, 10);
  const todayAttempts = attempts.filter((a) => new Date(a.at).toISOString().slice(0, 10) === t);
  const usedToday = todayAttempts.length;
  return {
    total: attempts.length,
    usedToday,
    remaining: Math.max(0, EXAM_DAILY_LIMIT - usedToday),
    limitReached: usedToday >= EXAM_DAILY_LIMIT,
    limit: EXAM_DAILY_LIMIT,
  };
}
