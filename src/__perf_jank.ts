import { QUESTIONS } from "@/data/questions";
import { EXAM_QUESTIONS } from "@/data/exam-questions";
import { EXTRA_QUESTIONS } from "@/data/extra-questions";
import { seededShuffle } from "@/lib/shuffle";
import { store, computeStats, type AppState } from "@/lib/store";

const all = [...EXAM_QUESTIONS, ...QUESTIONS, ...EXTRA_QUESTIONS];
console.log("total questions:", all.length);

// Repetera felaktiga svar: samma körning som quiz.tsx gör vid varje svar.
store.hydrate();
for (const q of all) store.recordAnswer(q.id, q.category, false);
const s = store.get() as AppState;
console.log("wrongQueue:", s.wrongQueue.length, "answers:", s.answers.length);

let t = performance.now();
for (let i = 0; i < 20; i++) {
  const rep = seededShuffle(all.filter((q) => s.wrongQueue.includes(q.id)), 7);
  void rep;
}
console.log("repPool rebuild ms (per answer):", Math.round((performance.now() - t) / 20));

t = performance.now();
for (let i = 0; i < 20; i++) computeStats(s);
console.log("computeStats ms:", Math.round(((performance.now() - t) / 20) * 100) / 100);

t = performance.now();
for (let i = 0; i < 20; i++) (JSON.stringify(s).length);
console.log("localStorage JSON.stringify ms:", Math.round(((performance.now() - t) / 20) * 100) / 100);

