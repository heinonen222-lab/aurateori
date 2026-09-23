import { useState } from "react";
import { Check, ExternalLink, X } from "lucide-react";
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
}

export function QuestionCard({
  question,
  onAnswer,
  onNext,
  showExplanation = true,
  index,
  total,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const pick = (i: number) => {
    if (answered) return;
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

      <h2 className="text-lg font-bold leading-snug sm:text-xl">{question.question}</h2>

      <div className="mt-5 space-y-2.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correct;
          const isChosen = selected === i;
          const state = !answered ? "idle" : isCorrect ? "correct" : isChosen ? "wrong" : "muted";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className={cn(
                "flex min-h-12 w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm leading-relaxed transition-[background-color,border-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] sm:px-4",
                state === "idle" &&
                  "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
                state === "correct" && "border-success bg-success/10 text-foreground",
                state === "wrong" && "border-destructive bg-destructive/10 text-foreground",
                state === "muted" && "border-border bg-background opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-bold",
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
            </button>
          );
        })}
      </div>

      {answered && showExplanation && (
        <div className="mt-5 rounded-lg border border-border bg-secondary/60 p-4">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
            Förklaring
          </div>
          <p className="text-sm leading-relaxed">{question.explanation}</p>
          <div className="mt-2 text-xs text-muted-foreground">Referens: {question.reference}</div>
          {question.source && (
            <a
              href={question.source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              {question.source.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {answered && (
        <Button onClick={next} className="mt-5 w-full">
          Nästa fråga →
        </Button>
      )}
    </article>
  );
}
