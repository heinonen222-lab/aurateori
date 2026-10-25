import { useState } from "react";
import { Check, Star, X } from "lucide-react";
import { store, useStore } from "@/lib/store";
import { QuestionReference } from "@/components/QuestionReference";
import type { Question } from "@/data/questions";
import { SignImage } from "@/components/SignImage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  question: Question;
  onAnswer: (correct: boolean, chosen: number) => void;
  onNext: () => void;
  showExplanation?: boolean;
  index?: number;
  total?: number;
  selectedAnswer?: number;
  examMode?: boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  onNext,
  showExplanation = true,
  index,
  total,
  selectedAnswer,
  examMode = false,
}: Props) {
  const [selected, setSelected] = useState<number | null>(selectedAnswer ?? null);
  const answered = selected !== null;
  const favorites = useStore().favorites ?? [];
  const isFavorite = favorites.includes(question.id);

  const pick = (i: number) => {
    if (answered && !examMode) return;
    setSelected(i);
    onAnswer(i === question.correct, i);
  };

  const next = () => {
    setSelected(null);
    onNext();
  };

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-soft sm:p-7">
      {typeof index === "number" && typeof total === "number" && (
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Fråga {index + 1} / {total}
          </span>
          <span className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground">
            {question.category}
          </span>
        </div>
      )}

      {question.image && (
        <div className="mb-5 grid place-items-center rounded-lg bg-muted p-4 sm:p-6">
          <SignImage id={question.image} className="aspect-square h-auto w-full max-w-40" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <h2 className="min-w-0 flex-1 text-lg font-bold leading-snug sm:text-xl">{question.question}</h2>
        {!examMode && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Ta bort från favoriter" : "Spara som favorit"}
            onClick={() => store.toggleFavorite(question.id)}
          >
            <Star className={cn("h-5 w-5", isFavorite && "fill-premium text-premium")} />
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-2.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correct;
          const isChosen = selected === i;
          const state = examMode ? (isChosen ? "chosen" : "idle") : !answered ? "idle" : isCorrect ? "correct" : isChosen ? "wrong" : "muted";
          return (
            <Button
              variant="outline"
              aria-pressed={selected === i}
              key={i}
              onClick={() => pick(i)}
              disabled={answered && !examMode}
              className={cn(
                "flex h-auto min-h-12 w-full justify-start whitespace-normal disabled:opacity-100 items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm leading-relaxed transition-[background-color,border-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] sm:px-4",
                state === "idle" &&
                  "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
                state === "chosen" && "border-ring bg-accent text-accent-foreground",
                state === "correct" && "border-success bg-success/10 text-foreground",
                state === "wrong" && "border-destructive bg-destructive/10 text-foreground",
                state === "muted" && "border-border bg-background opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-bold",
                  state === "chosen" && "border-ring bg-accent text-accent-foreground",
                state === "correct" && "border-success bg-success text-success-foreground",
                  state === "wrong" &&
                    "border-destructive bg-destructive text-destructive-foreground",
                  (state === "idle" || state === "muted") && "border-border bg-secondary",
                )}
              >
                {state === "correct" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : state === "wrong" ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="flex-1">{opt}</span>
            </Button>
          );
        })}
      </div>

      {answered && showExplanation && !examMode && (
        <div className="mt-5 border-l-2 border-primary bg-secondary/60 p-4" role="status" aria-live="polite">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold">{selected === question.correct ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}{selected === question.correct ? "Rätt svar!" : "Inte riktigt – förstå regeln och försök igen."}</p>
          <p className="mb-3 text-sm"><strong>Rätt svar: </strong>{question.options[question.correct]}</p>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
            Förklaring
          </div>
          <p className="text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {!examMode && <QuestionReference question={question} />}

      {answered && !examMode && (
        <Button onClick={next} className="mt-5 w-full">
          Nästa fråga →
        </Button>
      )}
    </article>
  );
}
