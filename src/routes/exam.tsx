import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Timer, Trophy, XCircle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS, type Question } from "@/data/questions";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { seededShuffle } from "@/lib/shuffle";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [
      { title: "Examsimulator – Aurateori" },
      {
        name: "description",
        content: "Simulera Trafikverkets B-teoriprov: 65 frågor, 50 minuter, gränsen är 52 rätt.",
      },
      { property: "og:title", content: "Examsimulator – Aurateori" },
      { property: "og:description", content: "Simulera Trafikverkets B-teoriprov." },
    ],
  }),
  component: ExamPage,
});

const TOTAL = 65;
const PASS = 52;
const SECONDS = 50 * 60;

function buildExam(seed: number, source: Question[]) {
  // Draw 65 questions, balanced across categories, without duplicates when possible.
  const pool = source.length ? source : QUESTIONS;
  const byCat = new Map<string, Question[]>();
  for (const q of pool) {
    byCat.set(q.category, [...(byCat.get(q.category) ?? []), q]);
  }
  const buckets = [...byCat.values()].map((list, i) => seededShuffle(list, seed + i * 97));
  const picked: Question[] = [];
  let round = 0;
  while (picked.length < TOTAL && round < 200) {
    for (const b of buckets) {
      const q = b[round];
      if (q) picked.push(q);
      if (picked.length === TOTAL) break;
    }
    round++;
  }
  // Fallback padding if the pool is smaller than the exam length.
  for (let i = 0; picked.length < TOTAL; i++) {
    const src = pool[i % pool.length]!;
    picked.push({ ...src, id: `${src.id}-e${i}` });
  }
  return seededShuffle(picked, seed);
}

type Result = { qid: string; category: string; correct: boolean };

function ExamPage() {
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(SECONDS);
  const [results, setResults] = useState<Result[]>([]);
  const [seed, setSeed] = useState(0);
  const { data: bank } = useQuery(bankQuestionsQuery);
  const exam = useMemo(() => buildExam(seed, [...QUESTIONS, ...(bank ?? [])]), [seed, bank]);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => {
      setTime((s) => {
        if (s <= 1) {
          clearInterval(t);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  const correctCount = results.filter((r) => r.correct).length;

  return (
    <AppShell>
      {phase === "intro" && (
        <div className="mx-auto max-w-xl space-y-6 rounded-3xl border border-border bg-card p-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Timer className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Trafikverket-prov</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              65 frågor · 50 minuter · minst 52 rätt för att klara provet.
            </p>
          </div>
          <ul className="mx-auto max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>• Alla frågor visas utan förklaring – som i skarpt läge.</li>
            <li>• Du kan inte gå tillbaka till tidigare frågor.</li>
            <li>• Sammanställning per kategori i slutet.</li>
          </ul>
          <button
            onClick={() => {
              setSeed((n) => n + 1);
              setPhase("running");
              setIdx(0);
              setResults([]);
              setTime(SECONDS);
            }}
            className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground"
          >
            Starta provet
          </button>
        </div>
      )}

      {phase === "running" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fråga {idx + 1} / {TOTAL}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums",
                time < 300 ? "bg-destructive/15 text-destructive" : "bg-secondary",
              )}
            >
              <Timer className="h-4 w-4" />
              {mm}:{ss}
            </div>
          </div>
          <QuestionCard
            key={exam[idx].id}
            question={exam[idx]}
            index={idx}
            total={TOTAL}
            showExplanation={false}
            onAnswer={(ok) => {
              const src = exam[idx];
              setResults((r) => [...r, { qid: src.id, category: src.category, correct: ok }]);
              store.recordAnswer(src.id, src.category, ok);
            }}
            onNext={() => {
              if (idx + 1 >= TOTAL) setPhase("done");
              else setIdx((i) => i + 1);
            }}
          />
        </div>
      )}

      {phase === "done" && (
        <ExamResults results={results} correct={correctCount} onRestart={() => setPhase("intro")} />
      )}
    </AppShell>
  );
}

function ExamResults({
  results,
  correct,
  onRestart,
}: {
  results: Result[];
  correct: number;
  onRestart: () => void;
}) {
  const passed = correct >= PASS;
  const byCat = results.reduce<Record<string, { ok: number; total: number }>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = { ok: 0, total: 0 };
    acc[r.category].total++;
    if (r.correct) acc[r.category].ok++;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div
        className={cn(
          "rounded-3xl border p-8 text-center",
          passed ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10",
        )}
      >
        <div
          className={cn(
            "mx-auto grid h-16 w-16 place-items-center rounded-2xl",
            passed
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {passed ? <Trophy className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
        </div>
        <h1 className="mt-4 text-3xl font-black">{passed ? "Godkänt!" : "Underkänt"}</h1>
        <p className="mt-1 text-muted-foreground">
          {correct} av {results.length} rätt · gränsen är {PASS}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Resultat per kategori</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(byCat).map(([cat, v]) => {
            const pct = Math.round((v.ok / v.total) * 100);
            return (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{cat}</span>
                  <span className="text-muted-foreground">
                    {v.ok}/{v.total} · {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      pct >= 80 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">Detaljerad genomgång</h2>
        <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-10">
          {results.map((r, i) => (
            <div
              key={i}
              title={`Fråga ${i + 1}: ${r.correct ? "rätt" : "fel"}`}
              className={cn(
                "flex h-8 items-center justify-center rounded-md text-[10px] font-bold",
                r.correct ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive",
              )}
            >
              {r.correct ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground"
      >
        Gör om provet
      </button>
    </div>
  );
}
