import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS, type QuestionCategory } from "@/data/questions";
import { EXAM_QUESTIONS } from "@/data/exam-questions";
import { EXTRA_QUESTIONS } from "@/data/extra-questions";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { seededShuffle } from "@/lib/shuffle";
import { store, useStore, computeStats } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpenCheck, RefreshCcw, RotateCcw, TriangleAlert } from "lucide-react";
import { AuraState } from "@/components/AuraState";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Övningsfrågor – Aurateori" },
      {
        name: "description",
        content:
          "Öva på svenska teorifrågor per kategori: vägmärken, trafikregler, miljö, människan och fordonet.",
      },
      { property: "og:title", content: "Övningsfrågor – Aurateori" },
      { property: "og:description", content: "Öva på svenska teorifrågor per kategori." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [cat, setCat] = useState<QuestionCategory | "Alla">("Alla");
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [repActive, setRepActive] = useState(false);

  const [seed, setSeed] = useState(0);

  const s = useStore();
  const stats = computeStats(s);
  const { data: bank, isError, refetch } = useQuery(bankQuestionsQuery);

  const pool = useMemo(() => {
    const all = [...EXAM_QUESTIONS, ...QUESTIONS, ...EXTRA_QUESTIONS, ...(bank ?? [])];
    const list = cat === "Alla" ? all : all.filter((q) => q.category === cat);
    return seededShuffle(list, seed);
  }, [cat, seed, bank]);

  // Användarens egna frågor: allt som ligger i repetitions-kön och går att lösa.
  const repPool = useMemo(
    () =>
      seededShuffle(
        [...EXAM_QUESTIONS, ...QUESTIONS, ...EXTRA_QUESTIONS, ...(bank ?? [])].filter((q) =>
          s.wrongQueue.includes(q.id),
        ),
        7,
      ),
    [bank, s.wrongQueue],
  );

  const activePool = repActive ? repPool : pool;
  const q = activePool[idx];
  const empty = !repActive && pool.length === 0;
  const done = !q && !empty;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Övningsfrågor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtrera på kategori och öva i din takt.
          </p>
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setIdx(0);
                setCorrectCount(0);
                setRepActive(false);
              }}
              className={cn(
                "min-h-11 shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition-[background-color,border-color,color] focus-visible:ring-2 focus-visible:ring-ring",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {isError && !empty && (
          <div className="flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/10 p-4 text-sm" role="status">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Extra frågor kunde inte hämtas</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">Du kan fortsätta med frågorna som redan finns i appen.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => void refetch()} aria-label="Försök hämta extra frågor igen">
              <RefreshCcw />
            </Button>
          </div>
        )}

        {empty && (
          <AuraState
            icon={BookOpenCheck}
            title={isError ? "Frågorna kunde inte hämtas" : "Inga frågor i den här kategorin"}
            description={
              isError
                ? "Kontrollera anslutningen och försök igen. Dina tidigare resultat påverkas inte."
                : "Välj Alla för att fortsätta öva med hela frågebanken."
            }
            tone={isError ? "danger" : "default"}
            actionLabel={isError ? "Försök igen" : "Visa alla frågor"}
            onAction={() => {
              if (isError) void refetch();
              else setCat("Alla");
            }}
          >
            {!isError && repPool.length === 0 && (
              <div className="mt-5 w-full max-w-sm rounded-lg border border-sidebar-border bg-sidebar/55 p-4 text-left backdrop-blur" role="note">
                <p className="text-xs font-bold uppercase text-premium">Exempel i frågebanken</p>
                <ul className="mt-3 grid gap-2 text-sm text-sidebar-foreground/80 sm:grid-cols-2">
                  <li className="rounded-md border border-sidebar-border bg-sidebar-accent/55 px-3 py-2">Högerregeln och väjningsplikt</li>
                  <li className="rounded-md border border-sidebar-border bg-sidebar-accent/55 px-3 py-2">Hastighet och parkering</li>
                  <li className="rounded-md border border-sidebar-border bg-sidebar-accent/55 px-3 py-2">Däck och belysning</li>
                  <li className="rounded-md border border-sidebar-border bg-sidebar-accent/55 px-3 py-2">Risker och säker körning</li>
                </ul>
                <p className="mt-3 text-xs leading-5 text-sidebar-foreground/65">Tryck på <strong className="text-sidebar-foreground">Visa alla frågor</strong> eller välj en annan kategori ovan.</p>
              </div>
            )}
            {!isError && repPool.length > 0 && (
              <div className="mt-5 w-full max-w-sm rounded-lg border border-premium/30 bg-sidebar/55 p-4 text-left backdrop-blur" role="note">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-premium">
                  <RotateCcw className="h-3.5 w-3.5" /> Dina frågor
                </div>
                <p className="mt-2 text-sm leading-5 text-sidebar-foreground/80">
                  Du har {repPool.length} sparade frågor att repetera. Svara på dem direkt här – du får riktig procent och poäng.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <MiniFact label="Frågor" value={repPool.length} />
                  <MiniFact label="Träffsäkerhet" value={`${stats.accuracy}%`} />
                  <MiniFact label="Poäng" value={stats.correct} />
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    setRepActive(true);
                    setIdx(0);
                    setCorrectCount(0);
                  }}
                >
                  Starta repetition
                </Button>
              </div>
            )}
          </AuraState>
        )}

        {!done && !empty && q && (
          <>
            {repActive && (
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-premium/30 bg-premium/10 px-4 py-2.5">
                <p className="min-w-0 text-xs font-bold uppercase tracking-wider text-premium">
                  Repetition · {activePool.length} sparade frågor
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRepActive(false);
                    setIdx(0);
                    setCorrectCount(0);
                  }}
                >
                  Avsluta
                </Button>
              </div>
            )}
            <Progress value={(idx / activePool.length) * 100} aria-label="Framsteg i övningen" />
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              total={activePool.length}
              onAnswer={(ok) => {
                store.recordAnswer(q.id, q.category, ok);
                if (ok) setCorrectCount((n) => n + 1);
              }}
              onNext={() => setIdx((i) => i + 1)}
            />
          </>
        )}

        {done && (
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-soft">
            <div className="text-5xl">🎉</div>
            <h2 className="mt-3 text-2xl font-black">Klart!</h2>
            <p className="mt-1 text-muted-foreground">
              Du fick {correctCount} av {activePool.length} rätt (
              {activePool.length > 0 ? Math.round((correctCount / activePool.length) * 100) : 0}%).
            </p>
            <Button
              onClick={() => {
                setIdx(0);
                setCorrectCount(0);
                if (repActive) setRepActive(false);
                else setSeed((n) => n + 1);
              }}
              className="mt-6"
            >
              {repActive ? "Tillbaka till övningen" : "Kör en runda till"}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function MiniFact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 rounded-md border border-sidebar-border bg-sidebar-accent/55 px-2 py-2">
      <div className="font-display text-lg font-extrabold leading-6 text-sidebar-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">{label}</div>
    </div>
  );
}
