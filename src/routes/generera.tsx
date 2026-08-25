import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import type { QuestionCategory } from "@/data/questions";
import { QUESTIONS } from "@/data/questions";
import {
  generateQuestions,
  type GeneratedQuestion,
} from "@/lib/generate-questions.functions";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/generera")({
  head: () => ({
    meta: [
      { title: "AI-frågor – Aurateori" },
      {
        name: "description",
        content:
          "Generera nya teorifrågor för B-körkort baserat på aktuella svenska trafikregler, med källhänvisningar.",
      },
      { property: "og:title", content: "AI-frågor – Aurateori" },
      {
        property: "og:description",
        content: "Nya teorifrågor genererade från aktuella svenska trafikregler.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeneratePage,
});

const CATEGORIES: QuestionCategory[] = [
  "Vägmärken",
  "Trafikregler",
  "Miljö",
  "Människan & Trafiken",
  "Fordonskännedom",
];

const DIFFICULTIES = ["lätt", "medel", "svår"] as const;

function GeneratePage() {
  const [cat, setCat] = useState<QuestionCategory>("Trafikregler");
  const [count, setCount] = useState(4);
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("medel");
  const [batch, setBatch] = useState<GeneratedQuestion[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const queryClient = useQueryClient();
  const { data: bank } = useQuery(bankQuestionsQuery);
  const run = useServerFn(generateQuestions);
  const mutation = useMutation({
    mutationFn: (vars: {
      category: QuestionCategory;
      count: number;
      difficulty: (typeof DIFFICULTIES)[number];
      avoid: string[];
    }) => run({ data: vars }),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: bankQuestionsQuery.queryKey });
      setBatch(res.questions);
      setSources(res.sources);
      setIdx(0);
      setCorrectCount(0);
    },
  });

  const generate = () => {
    const avoid = [...QUESTIONS, ...(bank ?? [])]
      .filter((q) => q.category === cat)
      .slice(-30)
      .map((q) => q.question)
      .concat(batch.map((q) => q.question));
    mutation.mutate({ category: cat, count, difficulty, avoid });
  };

  const current = batch[idx];
  const finished = batch.length > 0 && !current;

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">AI-frågor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generera helt nya teorifrågor baserade på aktuella svenska trafikregler – med
            lagrum och källor. Frågorna sparas permanent i frågebanken och används sedan
            i övningsfrågorna och provsimulatorn.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Kategori
              </div>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                      cat === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Svårighetsgrad
                </div>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition",
                        difficulty === d
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50",
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="count"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Antal frågor: {count}
                </label>
                <input
                  id="count"
                  type="range"
                  min={1}
                  max={8}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="mt-3 w-full accent-primary"
                />
              </div>
            </div>

            <button
              onClick={generate}
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Genererar frågor…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generera frågor
                </>
              )}
            </button>

            {mutation.isSuccess && (
              <p className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs text-foreground">
                {mutation.data.saved} frågor sparade i frågebanken. Frågebanken innehåller nu{" "}
                {(bank?.length ?? 0) + QUESTIONS.length} frågor.
              </p>
            )}

            {mutation.isError && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
                {(mutation.error as Error).message}
              </p>
            )}
          </div>
        </div>

        {current && (
          <QuestionCard
            key={current.id}
            question={current}
            index={idx}
            total={batch.length}
            onAnswer={(ok) => {
              if (ok) setCorrectCount((c) => c + 1);
              store.recordAnswer(current.id, current.category, ok);
            }}
            onNext={() => setIdx((i) => i + 1)}
          />
        )}

        {finished && (
          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="text-sm text-muted-foreground">Omgång klar</div>
            <div className="mt-1 text-3xl font-black">
              {correctCount} / {batch.length} rätt
            </div>
            <button
              onClick={generate}
              disabled={mutation.isPending}
              className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary/60 disabled:opacity-60"
            >
              Generera nya frågor
            </button>
          </div>
        )}

        {sources.length > 0 && (
          <div className="rounded-3xl border border-border bg-secondary/40 p-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Källor
            </div>
            <ul className="space-y-1.5">
              {sources.map((s) => (
                <li key={s}>
                  <a
                    href={s}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="break-all">{s}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}
