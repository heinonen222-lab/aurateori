import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS, type QuestionCategory } from "@/data/questions";
import { EXAM_QUESTIONS } from "@/data/exam-questions";
import { EXTRA_QUESTIONS } from "@/data/extra-questions";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { seededShuffle } from "@/lib/shuffle";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpenCheck, RefreshCcw, TriangleAlert } from "lucide-react";
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

  const [seed, setSeed] = useState(0);

  const { data: bank, isError, refetch } = useQuery(bankQuestionsQuery);

  const pool = useMemo(() => {
    const all = [...EXAM_QUESTIONS, ...QUESTIONS, ...EXTRA_QUESTIONS, ...(bank ?? [])];
    const list = cat === "Alla" ? all : all.filter((q) => q.category === cat);
    return seededShuffle(list, seed);
  }, [cat, seed, bank]);

  const q = pool[idx];
  const empty = pool.length === 0;
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
          />
        )}

        {!done && !empty && q && (
          <>
            <Progress value={(idx / pool.length) * 100} aria-label="Framsteg i övningen" />
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
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-soft">
            <div className="text-5xl">🎉</div>
            <h2 className="mt-3 text-2xl font-black">Klart!</h2>
            <p className="mt-1 text-muted-foreground">
              Du fick {correctCount} av {pool.length} rätt (
              {Math.round((correctCount / pool.length) * 100)}%).
            </p>
            <Button
              onClick={() => {
                setIdx(0);
                setCorrectCount(0);
                setSeed((n) => n + 1);
              }}
              className="mt-6"
            >
              Kör en runda till
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
