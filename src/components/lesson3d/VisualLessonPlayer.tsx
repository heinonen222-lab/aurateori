import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { Lesson, LessonStep } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { AutoFitText } from "@/components/AutoFitText";
import { LessonScene } from "./LessonScene";
import { LESSON_SCENE } from "./lesson-scenes";

const STEP_SECONDS = 6;

export function VisualLessonPlayer({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const slides = useMemo(
    () => lesson.steps.filter((step): step is Extract<LessonStep, { kind: "info" }> => step.kind === "info"),
    [lesson.steps],
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion || slides.length === 0) return;
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current + 0.1 < STEP_SECONDS) return current + 0.1;
        setIndex((value) => (value + 1) % slides.length);
        return 0;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, slides.length]);

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length);
    setElapsed(0);
  };

  if (!slide) return null;
  const sceneKind = LESSON_SCENE[lesson.id] ?? "intersection";

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
          <LessonScene kind={sceneKind} playing={playing} step={index} reducedMotion={reducedMotion} />
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span className="rounded-md bg-background/90 px-2 py-1 text-[11px] font-bold backdrop-blur">
              Scen {index + 1} av {slides.length}
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
            <div className="h-full bg-primary transition-[width] duration-100" style={{ width: `${reducedMotion ? 0 : (elapsed / STEP_SECONDS) * 100}%` }} />
          </div>

          <div className="mt-4 grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => go(index - 1)} aria-label="Föregående scen"><SkipBack /></Button>
            <Button variant="outline" size="icon" onClick={() => { setElapsed(0); setPlaying(true); }} aria-label="Starta om scenen"><RotateCcw /></Button>
            <Button onClick={() => setPlaying((value) => !value)} className="min-w-0">
              {playing ? <Pause /> : <Play />}
              <span className="truncate">{playing ? "Pausa" : "Spela"}</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => go(index + 1)} aria-label="Nästa scen"><SkipForward /></Button>
          </div>

          {slide.source && (
            <a href={slide.source.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex max-w-full items-start gap-1.5 break-words text-xs font-semibold text-primary hover:underline">
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 break-all sm:break-words">{slide.source.label}</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}