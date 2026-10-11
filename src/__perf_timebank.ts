const t0 = performance.now();
const m = await import("@/data/extra-questions");
const t1 = performance.now();
console.log("extra-questions eval ms:", Math.round(t1 - t0));
console.log("count:", m.EXTRA_QUESTIONS.length);
const t2 = performance.now();
for (let i = 0; i < 100; i++) { const s = m.EXTRA_QUESTIONS.slice(); s.sort(() => Math.random() - 0.5); }
console.log("100 sorts ms:", Math.round(performance.now() - t2));
const t3 = performance.now();
const q = await import("@/data/questions");
console.log("questions eval ms:", Math.round(performance.now() - t3), q.QUESTIONS.length);
