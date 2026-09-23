import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Timer, Trophy, XCircle, CheckCircle2, Crown, Lock, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS, type Question } from "@/data/questions";
import { EXAM_QUESTIONS } from "@/data/exam-questions";
import { EXTRA_QUESTIONS } from "@/data/extra-questions";
import { TRIAL_QUESTIONS } from "@/data/trial-questions";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { seededShuffle } from "@/lib/shuffle";
import { store, useStore, examUsage } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [
      { title: "Examsimulator – Aurateori" },
      {
        name: "description",
        content:
          "Simulera Trafikverkets B-teoriprov: 70 frågor (65 räknas), 50 minuter, gränsen är 52 rätt.",
      },
      { property: "og:title", content: "Examsimulator – Aurateori" },
      { property: "og:description", content: "Simulera Trafikverkets B-teoriprov." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExamPage,
});

const TOTAL = 70;
const SCORED = 65;
const TRIAL = TOTAL - SCORED;
const PASS = 52;
const SECONDS = 50 * 60;

function buildExam(seed: number, source: Question[], trialSource: Question[]) {
  // Draw 65 scored questions, balanced across categories, without duplicates when possible.
  const pool = (source.length ? source : QUESTIONS).filter((q) => !q.trial);
  const byCat = new Map<string, Question[]>();
  for (const q of pool) {
    byCat.set(q.category, [...(byCat.get(q.category) ?? []), q]);
  }
  const buckets = [...byCat.values()].map((list, i) => seededShuffle(list, seed + i * 97));
  const picked: Question[] = [];
  let round = 0;
  while (picked.length < SCORED && round < 400) {
    for (const b of buckets) {
      const q = b[round];
      if (q) picked.push(q);
      if (picked.length === SCORED) break;
    }
    round++;
  }
  // Fallback padding if the pool is smaller than the scored exam length.
  for (let i = 0; picked.length < SCORED; i++) {
    const src = pool[i % pool.length]!;
    picked.push({ ...src, id: `${src.id}-e${i}` });
  }
  // Add the 5 non-scored test questions ("testfrågor") so the exam is 70 questions.
  const trials = seededShuffle(trialSource, seed + 13)
    .slice(0, TRIAL)
    .map((q) => ({ ...q, trial: true as const }));
  for (let i = 0; trials.length < TRIAL; i++) {
    const src = trialSource[i % trialSource.length]!;
    trials.push({ ...src, id: `${src.id}-t${i}`, trial: true as const });
  }
  return seededShuffle([...picked, ...trials], seed);
}

type Result = {
  qid: string;
  category: string;
  correct: boolean;
  chosen: number;
  q: Question;
  trial: boolean;
};

function ExamPage() {
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(SECONDS);
  const [results, setResults] = useState<Result[]>([]);
  const [seed, setSeed] = useState(0);
  const { data: bank } = useQuery(bankQuestionsQuery);
  const { user } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const appState = useStore();
  const usage = examUsage(appState);
  const [attemptNo, setAttemptNo] = useState(0);
  const exam = useMemo(
    () =>
      buildExam(
        seed,
        [...EXAM_QUESTIONS, ...QUESTIONS, ...EXTRA_QUESTIONS, ...(bank ?? [])],
        TRIAL_QUESTIONS,
      ),
    [seed, bank],
  );

  const scoredResults = results.filter((r) => !r.trial);
  const correctCountRef = scoredResults.filter((r) => r.correct).length;
  useEffect(() => {
    if (phase !== "done") return;
    store.recordExamAttempt(correctCountRef, scoredResults.length, correctCountRef >= PASS);
    setAttemptNo(examUsage(store.get()).total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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

  const correctCount = scoredResults.filter((r) => r.correct).length;

  return (
    <AppShell>
      {phase === "intro" && (
        <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-border bg-card p-6 text-center shadow-lifted sm:p-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Timer className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold">Teoriprov</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              70 frågor · 50 minuter · minst 52 rätt för att klara provet.
            </p>
          </div>
          <ul className="mx-auto max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>• Alla frågor visas utan förklaring – som i skarpt läge.</li>
            <li>• Du kan inte gå tillbaka till tidigare frågor.</li>
            <li>• 5 av de 70 frågorna är testfrågor och räknas inte i resultatet.</li>
            <li>• Sammanställning per kategori i slutet.</li>
            <li>• Frågorna följer Trafikverkets provformat och är källhänvisade.</li>
            <li>
              • Max {usage.limit} prov per dygn · {usage.usedToday}/{usage.limit} använda idag.
            </li>
          </ul>
          {subLoading ? (
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
          ) : isActive ? (
            <>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-success/15 px-3 py-1 text-xs font-bold text-success">
                <Crown className="h-3.5 w-3.5" />
                Premium aktivt
              </div>
              <p className="text-xs text-muted-foreground">
                Totalt genomförda prov: <span className="font-bold">{usage.total}</span> ·{" "}
                {usage.remaining} kvar idag
              </p>
              {usage.limitReached ? (
                <div className="rounded-lg border border-warning/40 bg-warning/10 p-5 text-left">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Lock className="h-4 w-4" />
                    Dagsgränsen är nådd
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Du har gjort {usage.limit} prov idag. Kom tillbaka imorgon – öva vidare med
                    övningsfrågor eller genomgångar under tiden.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      to="/quiz"
                      className="rounded-xl bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground transition hover:opacity-90"
                    >
                      Öva frågor →
                    </Link>
                    <Link
                      to="/genomgangar"
                      className="rounded-xl border border-border px-5 py-3 text-center text-sm font-semibold transition hover:border-primary/60"
                    >
                      Genomgångar
                    </Link>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setSeed((n) => n + 1);
                    setPhase("running");
                    setIdx(0);
                    setResults([]);
                    setTime(SECONDS);
                  }}
                  className="w-full"
                >
                  Starta provet
                </Button>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-5 text-left">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Lock className="h-4 w-4" />
                Fullständigt prov kräver Premium
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {user
                  ? "Lås upp hela examsimulatorn med Premium. Övningsfrågor och genomgångar är fortsatt gratis."
                  : "Logga in och aktivera Premium för att köra hela provet. Övningsfrågor och genomgångar är fortsatt gratis."}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/priser"
                  className="rounded-xl bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  Se priser →
                </Link>
                {!user && (
                  <Link
                    to="/auth"
                    className="rounded-xl border border-border px-5 py-3 text-center text-sm font-semibold transition hover:border-primary/60"
                  >
                    Logga in
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "running" && (
        <div className="space-y-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-soft">
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
            onAnswer={(ok, chosen) => {
              const src = exam[idx];
              setResults((r) => [
                ...r,
                {
                  qid: src.id,
                  category: src.category,
                  correct: ok,
                  chosen,
                  q: src,
                  trial: !!src.trial,
                },
              ]);
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
        <ExamResults
          results={results}
          correct={correctCount}
          scoredTotal={scoredResults.length}
          attemptNo={attemptNo || usage.total}
          usedToday={usage.usedToday}
          limit={usage.limit}
          canRetry={!usage.limitReached}
          onRestart={() => setPhase("intro")}
        />
      )}
    </AppShell>
  );
}

function ExamResults({
  results,
  correct,
  scoredTotal,
  attemptNo,
  usedToday,
  limit,
  canRetry,
  onRestart,
}: {
  results: Result[];
  correct: number;
  scoredTotal: number;
  attemptNo: number;
  usedToday: number;
  limit: number;
  canRetry: boolean;
  onRestart: () => void;
}) {
  const passed = correct >= PASS;
  const [filter, setFilter] = useState<"all" | "wrong">("all");
  const wrongCount = results.filter((r) => !r.correct).length;
  const scored = results.filter((r) => !r.trial);
  const byCat = scored.reduce<Record<string, { ok: number; total: number }>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = { ok: 0, total: 0 };
    acc[r.category].total++;
    if (r.correct) acc[r.category].ok++;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div
        className={cn(
          "rounded-xl border p-8 text-center shadow-soft",
          passed ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10",
        )}
      >
        <div
          className={cn(
            "mx-auto grid h-16 w-16 place-items-center rounded-lg",
            passed
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {passed ? <Trophy className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold">{passed ? "Godkänt!" : "Underkänt"}</h1>
        <p className="mt-1 text-muted-foreground">
          {correct} av {scoredTotal} rätt · gränsen är {PASS}
        </p>
        <p className="mt-3 inline-flex flex-wrap items-center justify-center gap-x-2 rounded-md bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
          <span>Prov nr {attemptNo} totalt</span>
          <span>·</span>
          <span>
            {usedToday}/{limit} idag
          </span>
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
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

      <div className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
        <h2 className="text-lg font-bold">Detaljerad genomgång</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Tryck på en ruta för att hoppa till frågan. Grå rutor är testfrågor som inte räknas.
        </p>
        <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-10">
          {results.map((r, i) => (
            <a
              key={i}
              href={`#fraga-${i + 1}`}
              title={`Fråga ${i + 1}: ${r.correct ? "rätt" : "fel"}${r.trial ? " (testfråga, räknas inte)" : ""}`}
              className={cn(
                "flex h-8 items-center justify-center gap-0.5 rounded-md text-[10px] font-bold transition hover:opacity-80",
                r.trial
                  ? "bg-muted text-muted-foreground"
                  : r.correct
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive",
              )}
            >
              {r.correct ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Alla frågor – svar, förklaring och källa</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Ditt svar, rätt svar och regelhänvisning för varje fråga i provet.
            </p>
          </div>
          <div className="grid grid-cols-2 rounded-lg border border-border p-0.5 text-xs font-semibold">
            {(
              [
                ["all", `Alla (${results.length})`],
                ["wrong", `Endast fel (${wrongCount})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "min-h-9 rounded-md px-3 py-1.5 transition focus-visible:ring-2 focus-visible:ring-ring",
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-4 space-y-4">
          {results
            .map((r, i) => ({ ...r, nr: i + 1 }))
            .filter((r) => (filter === "wrong" ? !r.correct : true))
            .map((r) => (
              <li
                key={r.nr}
                id={`fraga-${r.nr}`}
                className={cn(
                  "scroll-mt-24 rounded-lg border p-4",
                  r.correct
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5",
                )}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>
                    Fråga {r.nr} · {r.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px]",
                      r.correct
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive",
                    )}
                  >
                    {r.correct ? "Rätt" : "Fel"}
                  </span>
                  {r.trial && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      Testfråga – räknas inte
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold">{r.q.question}</p>
                {!r.correct && (
                  <p className="mt-2 text-sm">
                    <span className="font-bold text-destructive">Ditt svar: </span>
                    {r.q.options[r.chosen] ?? "Inget svar"}
                  </p>
                )}
                <p className="mt-1 text-sm">
                  <span className="font-bold text-success">Rätt svar: </span>
                  {r.q.options[r.q.correct]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.q.explanation}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">Referens: {r.q.reference}</div>
                {r.q.source && (
                  <a
                    href={r.q.source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    {r.q.source.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
        </ul>
      </div>

      {canRetry ? (
        <Button onClick={onRestart} className="w-full">
          Gör om provet
        </Button>
      ) : (
        <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
          Du har använt alla {limit} prov för idag. Nya prov låses upp imorgon.
        </div>
      )}
    </div>
  );
}
