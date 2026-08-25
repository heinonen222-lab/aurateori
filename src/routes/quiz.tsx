import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS, type QuestionCategory } from "@/data/questions";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { seededShuffle } from "@/lib/shuffle";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Övningsfrågor – Aurateori" },
      { name: "description", content: "Öva på svenska teorifrågor per kategori: vägmärken, trafikregler, miljö, människan och fordonet." },
      { property: "og:title", content: "Övningsfrågor – Aurateori" },
      { property: "og:description", content: "Öva på svenska teorifrågor per kategori." },
    ],
  }),
  component: QuizPage,
});

const CATEGORIES: (QuestionCategory | "Alla")[] = [
  "Alla",
  "Vägmärken",
  "Trafikregler",
  "Miljö",
  "Människan & Trafiken",
  "Fordonskännedom",
];

function QuizPage() {
  const [cat, setCat] = useState<(QuestionCategory | "Alla")>("Alla");
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const [seed, setSeed] = useState(0);

  const { data: bank } = useQuery(bankQuestionsQuery);

  const pool = useMemo(() => {
    const all = [...QUESTIONS, ...(bank ?? [])];
    const list = cat === "Alla" ? all : all.filter((q) => q.category === cat);
    return seededShuffle(list, seed);
  }, [cat, seed, bank]);

  const q = pool[idx];
  const done = !q;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Övningsfrågor</h1>
          <p className="mt-1 text-sm text-muted-foreground">Filtrera på kategori och öva i din takt.</p>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setIdx(0);
                setCorrectCount(0);
              }}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {!done && (
          <>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(idx / pool.length) * 100}%` }}
              />
            </div>
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              total={pool.length}
              onAnswer={(ok) => {
                store.recordAnswer(q.id, q.category, ok);
                if (ok) setCorrectCount((n) => n + 1);
              }}
              onNext={() => setIdx((i) => i + 1)}
            />
          </>
        )}

        {done && (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <div className="text-5xl">🎉</div>
            <h2 className="mt-3 text-2xl font-black">Klart!</h2>
            <p className="mt-1 text-muted-foreground">
              Du fick {correctCount} av {pool.length} rätt ({Math.round((correctCount / pool.length) * 100)}%).
            </p>
            <button
              onClick={() => {
                setIdx(0);
                setCorrectCount(0);
                setSeed((n) => n + 1);
              }}
              className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              Kör en runda till
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
