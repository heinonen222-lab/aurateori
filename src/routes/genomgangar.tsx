import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  Clock,
  ExternalLink,
  GraduationCap,
  RotateCcw,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SignImage } from "@/components/SignImage";
import { ROAD_SIGNS } from "@/data/signs";
import { LESSONS, type Lesson, type LessonSource, type LessonStep } from "@/data/lessons";
import { cn } from "@/lib/utils";

function stepSigns(step: LessonStep): string[] {
  if (step.signs?.length) return step.signs;
  return step.sign ? [step.sign] : [];
}

function SignRow({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <div className="mb-5 flex flex-wrap items-start justify-center gap-4 rounded-2xl bg-muted p-5">
      {ids.map((id) => {
        const sign = ROAD_SIGNS.find((s) => s.id === id);
        return (
          <figure key={id} className="w-24 text-center">
            <SignImage id={id} className="mx-auto h-20 w-20" />
            <figcaption className="mt-2 text-[11px] font-medium leading-tight text-muted-foreground">
              {sign?.name ?? id}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function SourceLink({ source }: { source?: LessonSource }) {
  if (!source) return null;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      Läs källan: {source.label}
    </a>
  );
}

function SourceList({ sources }: { sources: LessonSource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-left">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Officiella källor
      </div>
      <ul className="mt-2 space-y-1.5">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
            >
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Route = createFileRoute("/genomgangar")({
  head: () => ({
    meta: [
      { title: "Interaktiva genomgångar – Aurateori" },
      {
        name: "description",
        content:
          "Interaktiva genomgångar av nyckelkunskaperna för B-körkortet: väjningsregler, stoppsträcka, vägmärken, alkohol och trötthet, miljö och fordonskännedom.",
      },
      { property: "og:title", content: "Interaktiva genomgångar – Aurateori" },
      {
        property: "og:description",
        content: "Lär dig nyckelkunskaperna steg för steg med kontrollfrågor efter varje avsnitt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const [active, setActive] = useState<Lesson | null>(null);

  return (
    <AppShell>
      {active ? (
        <LessonPlayer lesson={active} onExit={() => setActive(null)} />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Interaktiva genomgångar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Nyckelkunskaperna för teoriprovet, steg för steg – med kontrollfråga efter varje
              avsnitt så att du märker direkt om något inte satt.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {LESSONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActive(l)}
                className="group rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                    {l.category}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-bold leading-snug">{l.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{l.summary}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {l.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpenCheck className="h-3.5 w-3.5" />
                    {l.steps.length} steg
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

type CheckStep = Extract<Lesson["steps"][number], { kind: "check" }>;

function LessonPlayer({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [missed, setMissed] = useState<CheckStep[]>([]);
  const [reviewing, setReviewing] = useState(false);

  const step = lesson.steps[idx];
  const done = !step;
  const progress = (idx / lesson.steps.length) * 100;

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setMissed([]);
    setReviewing(false);
  };

  const advance = () => {
    setSelected(null);
    setIdx((i) => i + 1);
  };

  const pick = (i: number) => {
    if (selected !== null || !step || step.kind !== "check") return;
    setSelected(i);
    const isCorrect = i === step.correct;
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    if (!isCorrect) setMissed((m) => (m.includes(step) ? m : [...m, step]));
  };

  if (reviewing) {
    return (
      <ReviewQueue
        lesson={lesson}
        queue={missed}
        onDone={() => {
          setMissed([]);
          setReviewing(false);
        }}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border transition hover:border-primary/60"
          aria-label="Tillbaka till genomgångar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black sm:text-xl">{lesson.title}</h1>
          <p className="text-[11px] text-muted-foreground">{lesson.reference}</p>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      {step?.kind === "info" && (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-3 text-xs font-medium text-muted-foreground">
            Steg {idx + 1} / {lesson.steps.length}
          </div>
          <SignRow ids={stepSigns(step)} />
          <h2 className="text-lg font-bold leading-snug sm:text-xl">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          {step.bullets && (
            <ul className="mt-4 space-y-2">
              {step.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          <SourceLink source={step.source} />
          <button
            onClick={advance}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            Fortsätt →
          </button>
        </div>
      )}

      {step?.kind === "check" && (
        <CheckCard
          step={step}
          selected={selected}
          onPick={pick}
          onNext={advance}
          badge={`Steg ${idx + 1} / ${lesson.steps.length}`}
        />
      )}

      {done && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="text-5xl">🎓</div>
          <h2 className="mt-3 text-2xl font-black">Genomgång klar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {score.total > 0
              ? `Du klarade ${score.correct} av ${score.total} kontrollfrågor.`
              : "Du har gått igenom hela avsnittet."}
          </p>

          {missed.length > 0 && (
            <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-left">
              <div className="flex items-center gap-2 text-sm font-bold">
                <RotateCcw className="h-4 w-4" />
                Repetitionskö: {missed.length}{" "}
                {missed.length === 1 ? "missad fråga" : "missade frågor"}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Träna bara de kontrollfrågor du svarade fel på. Kön är klar när du har rätt på alla.
              </p>
              <button
                onClick={() => setReviewing(true)}
                className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
              >
                Starta repetition →
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary/60"
            >
              Gör om genomgången
            </button>
            <button
              onClick={onExit}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary/60"
            >
              Välj en annan genomgång
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewQueue({
  lesson,
  queue,
  onDone,
  onExit,
}: {
  lesson: Lesson;
  queue: CheckStep[];
  onDone: () => void;
  onExit: () => void;
}) {
  const [pending, setPending] = useState<CheckStep[]>(queue);
  const [selected, setSelected] = useState<number | null>(null);
  const [cleared, setCleared] = useState(0);

  const step = pending[0];

  const pick = (i: number) => {
    if (selected !== null || !step) return;
    setSelected(i);
  };

  const next = () => {
    if (!step) return;
    const wasCorrect = selected === step.correct;
    setPending((p) => (wasCorrect ? p.slice(1) : [...p.slice(1), step]));
    if (wasCorrect) setCleared((c) => c + 1);
    setSelected(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border transition hover:border-primary/60"
          aria-label="Tillbaka till genomgångar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black sm:text-xl">Repetitionskö</h1>
          <p className="text-[11px] text-muted-foreground">{lesson.title}</p>
        </div>
      </div>

      {step ? (
        <>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-warning transition-all"
              style={{ width: `${(cleared / (cleared + pending.length)) * 100}%` }}
            />
          </div>
          <CheckCard
            step={step}
            selected={selected}
            onPick={pick}
            onNext={next}
            badge={`${pending.length} kvar i kön`}
          />
        </>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="text-5xl">✅</div>
          <h2 className="mt-3 text-2xl font-black">Kön är tömd</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Du har nu svarat rätt på alla frågor du missade.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={onDone}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Tillbaka till resultatet
            </button>
            <button
              onClick={onExit}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:border-primary/60"
            >
              Välj en annan genomgång
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCard({
  step,
  selected,
  onPick,
  onNext,
  badge,
}: {
  step: CheckStep;
  selected: number | null;
  onPick: (i: number) => void;
  onNext: () => void;
  badge: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{badge}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
          Kontrollfråga
        </span>
      </div>
      {step.sign && (
        <div className="mb-5 grid place-items-center rounded-2xl bg-muted p-6">
          <SignImage id={step.sign} className="h-32 w-32" />
        </div>
      )}
      <h2 className="text-lg font-bold leading-snug sm:text-xl">{step.question}</h2>
      <div className="mt-5 space-y-2.5">
        {step.options.map((opt, i) => {
          const answered = selected !== null;
          const isCorrect = i === step.correct;
          const state = !answered
            ? "idle"
            : isCorrect
              ? "correct"
              : selected === i
                ? "wrong"
                : "muted";
          return (
            <button
              key={opt}
              onClick={() => onPick(i)}
              disabled={answered}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                state === "idle" &&
                  "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
                state === "correct" && "border-success bg-success/10",
                state === "wrong" && "border-destructive bg-destructive/10",
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

      {selected !== null && (
        <>
          <div className="mt-5 rounded-2xl border border-border bg-secondary/60 p-4">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
              Förklaring
            </div>
            <p className="text-sm leading-relaxed">{step.explanation}</p>
          </div>
          <button
            onClick={onNext}
            className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            Fortsätt →
          </button>
        </>
      )}
    </div>
  );
}
