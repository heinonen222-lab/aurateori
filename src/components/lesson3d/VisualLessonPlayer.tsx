import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { Lesson, LessonStep } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { AutoFitText } from "@/components/AutoFitText";
import { LessonScene } from "./LessonScene";
import { getLessonScene } from "./lesson-scenes";

const STEP_SECONDS = 6;

export function VisualLessonPlayer({
  lesson,
  onExit,
  initialStep = 0,
  onStepChange,
}: {
  lesson: Lesson;
  onExit: () => void;
  initialStep?: number;
  onStepChange?: (step: number, totalSteps: number) => void;
}) {
  const slides = useMemo(
    () => lesson.steps.filter((step): step is Extract<LessonStep, { kind: "info" }> => step.kind === "info"),
    [lesson.steps],
  );
  const [index, setIndex] = useState(() => Math.min(Math.max(0, initialStep), Math.max(0, slides.length - 1)));
  const [playing, setPlaying] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    onStepChange?.(index, slides.length);
  }, [index, slides.length, onStepChange]);

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length);
    setCycleKey((value) => value + 1);
  };

  if (!slide) return null;
  const scene = getLessonScene(lesson.id, index);

  return (
    <div className="min-w-0 space-y-4">
      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Button variant="outline" size="icon" onClick={onExit} aria-label="Tillbaka till genomgångar">
          <ArrowLeft />
        </Button>
        <div className="min-w-0">
          <AutoFitText maxSize={20} minSize={14} className="h-7 font-black leading-7">{lesson.title}</AutoFitText>
          <p className="truncate text-xs text-muted-foreground">{lesson.reference}</p>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[4/3] min-h-64 w-full bg-muted sm:aspect-video">
          <LessonScene scene={scene} playing={playing} reducedMotion={reducedMotion} />
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span className="rounded-md bg-background/90 px-2 py-1 text-[11px] font-bold backdrop-blur">
              {index + 1}/{slides.length}: {scene.label}
            </span>
            <span className="rounded-md bg-background/90 px-2 py-1 text-[11px] font-semibold backdrop-blur">
              {lesson.category}
            </span>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <AutoFitText maxSize={20} minSize={14} className="h-14 font-bold leading-7">{slide.title}</AutoFitText>
          <p className="mt-2 break-words hyphens-auto text-sm leading-relaxed text-muted-foreground">{slide.body}</p>
          {slide.bullets && (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {slide.bullets.map((item) => (
                <li key={item} className="min-w-0 rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-relaxed break-words hyphens-auto">
                  {item}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            {!reducedMotion && (
              <div
                key={`${index}-${cycleKey}`}
                className="h-full origin-left bg-primary"
                style={{
                  animation: `lesson-progress ${STEP_SECONDS}s linear forwards`,
                  animationPlayState: playing ? "running" : "paused",
                }}
                onAnimationEnd={() => go(index + 1)}
              />
            )}
          </div>

          <div className="mt-4 grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => go(index - 1)} aria-label="Föregående scen"><SkipBack /></Button>
            <Button variant="outline" size="icon" onClick={() => { setCycleKey((value) => value + 1); setPlaying(true); }} aria-label="Starta om scenen"><RotateCcw /></Button>
            <Button onClick={() => setPlaying((value) => !value)} className="min-w-0">
              {playing ? <Pause /> : <Play />}
              <span className="truncate">{playing ? "Pausa" : "Spela"}</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => go(index + 1)} aria-label="Nästa scen"><SkipForward /></Button>
          </div>

          {slide.source && (
            <a href={slide.source.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex max-w-full items-start gap-1.5 break-words text-xs font-semibold text-primary hover:underline">
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 break-words">{slide.source.label}</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
