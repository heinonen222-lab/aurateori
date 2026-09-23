import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ExternalLink, Pause, Play, RotateCcw, SkipBack, SkipForward, XCircle } from "lucide-react";
import type { Lesson, LessonStep } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { AutoFitText } from "@/components/AutoFitText";
import { cn } from "@/lib/utils";
import { LessonScene, type DriveControl } from "./LessonScene";
import { getLessonScene } from "./lesson-scenes";

const STEP_SECONDS = 9;
type InfoStep = Extract<LessonStep, { kind: "info" }>;
type CheckStep = Extract<LessonStep, { kind: "check" }>;
type LessonResult = {
  step: number;
  totalSteps: number;
  answeredChecks: number;
  correctChecks: number;
  bestCorrectChecks: number;
  completed: boolean;
};

function buildScenes(steps: LessonStep[]) {
  const scenes: { info: InfoStep; check?: CheckStep }[] = [];
  for (const step of steps) {
    if (step.kind === "info") scenes.push({ info: step });
    else if (scenes.length > 0 && !scenes[scenes.length - 1]?.check) scenes[scenes.length - 1] = { ...scenes[scenes.length - 1], check: step };
  }
  return scenes;
}

export function VisualLessonPlayer({
  lesson,
  onExit,
  initialStep = 0,
  initialAnsweredChecks = 0,
  initialCorrectChecks = 0,
  initialBestCorrectChecks = 0,
  onStepChange,
}: {
  lesson: Lesson;
  onExit: () => void;
  initialStep?: number;
  initialAnsweredChecks?: number;
  initialCorrectChecks?: number;
  initialBestCorrectChecks?: number;
  onStepChange?: (result: LessonResult) => void;
}) {
  const scenes = useMemo(() => buildScenes(lesson.steps), [lesson.steps]);
  const totalChecks = useMemo(() => lesson.steps.filter((step) => step.kind === "check").length, [lesson.steps]);
  const [index, setIndex] = useState(() => Math.min(Math.max(0, initialStep), Math.max(0, scenes.length - 1)));
  const [phase, setPhase] = useState<"scene" | "question" | "answer">("scene");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredChecks, setAnsweredChecks] = useState(initialAnsweredChecks);
  const [correctChecks, setCorrectChecks] = useState(initialCorrectChecks);
  const [bestCorrectChecks, setBestCorrectChecks] = useState(initialBestCorrectChecks);
  const [playing, setPlaying] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [drive, setDrive] = useState<DriveControl>({ gear: 1, throttle: true, braking: false });
  const unit = scenes[index] ?? scenes[0];

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (scenes.length === 0) return;
    onStepChange?.({
      step: index,
      totalSteps: scenes.length,
      answeredChecks,
      correctChecks,
      bestCorrectChecks,
      completed: index >= scenes.length - 1 && (phase === "answer" || !unit?.check),
    });
  }, [answeredChecks, bestCorrectChecks, correctChecks, index, onStepChange, phase, scenes.length, unit?.check]);

  const changeScene = (next: number) => {
    setIndex((next + scenes.length) % scenes.length);
    setPhase("scene");
    setSelectedAnswer(null);
    setPlaying(true);
    setCycleKey((value) => value + 1);
  };

  const finishScene = () => {
    if (unit?.check) {
      setPlaying(false);
      setPhase("question");
    } else {
      changeScene(index + 1);
    }
  };

  const answer = (option: number) => {
    if (!unit?.check || phase !== "question") return;
    const isCorrect = option === unit.check.correct;
    const nextAnswered = Math.min(totalChecks, answeredChecks + 1);
    const nextCorrect = Math.min(nextAnswered, correctChecks + (isCorrect ? 1 : 0));
    setSelectedAnswer(option);
    setAnsweredChecks(nextAnswered);
    setCorrectChecks(nextCorrect);
    setBestCorrectChecks((value) => Math.max(value, nextCorrect));
    setPhase("answer");
  };

  if (!unit) return null;
  const scene = getLessonScene(lesson.id, index);
  const isCorrect = selectedAnswer === unit.check?.correct;
  const gears: DriveControl["gear"][] = [1, 3, 5, 2, 4, -1];

  return (
    <div className="min-w-0 space-y-4">
      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Button variant="outline" size="icon" onClick={onExit} aria-label="Tillbaka till genomgångar"><ArrowLeft /></Button>
        <div className="min-w-0">
          <AutoFitText maxSize={20} minSize={14} className="h-7 font-black leading-7">{lesson.title}</AutoFitText>
          <p className="truncate text-xs text-muted-foreground">{lesson.reference}</p>
        </div>
      </header>

      <section className="aura-surface overflow-hidden rounded-xl border border-border shadow-lifted">
        <div className="relative aspect-[4/3] min-h-56 w-full bg-muted sm:aspect-video">
          <LessonScene scene={scene} playing={playing} reducedMotion={reducedMotion} drive={drive} />
          <div className="pointer-events-none absolute inset-x-2 top-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 sm:inset-x-3 sm:top-3">
            <span className="min-w-0 truncate rounded-md border border-border/60 bg-background/85 px-2 py-1 text-[10px] font-bold shadow-soft backdrop-blur sm:text-[11px]">{index + 1}/{scenes.length} · {scene.label}</span>
            <span className="shrink-0 rounded-md border border-premium/30 bg-background/85 px-2 py-1 text-[10px] font-semibold text-premium shadow-soft backdrop-blur sm:text-[11px]">{lesson.category}</span>
          </div>
        </div>

        <div className="aura-cockpit grid gap-3 border-y border-border/40 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-4">
          <div className="grid min-w-0 gap-2">
            <div className="flex min-w-0 items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-white/60">
              <span className="truncate">Körreglage</span>
              <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-white">
                {drive.gear === 0 ? "Friläge" : drive.gear === -1 ? "Backväxel" : `Växel ${drive.gear}`}
                {drive.braking ? " · bromsar" : drive.throttle ? " · gas" : " · rullar"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "h-14 rounded-lg border text-sm font-bold uppercase tracking-wide transition-transform duration-150 active:scale-[0.98]",
                  drive.throttle ? "border-premium bg-premium text-premium-foreground" : "border-white/20 bg-white/10 text-white",
                )}
                aria-pressed={drive.throttle}
                onPointerDown={() => setDrive((value) => ({ ...value, throttle: true, braking: false }))}
                onPointerUp={() => setDrive((value) => ({ ...value, throttle: false }))}
                onPointerLeave={() => setDrive((value) => ({ ...value, throttle: false }))}
                onPointerCancel={() => setDrive((value) => ({ ...value, throttle: false }))}
              >Gas</button>
              <button
                type="button"
                className={cn(
                  "h-14 rounded-lg border text-sm font-bold uppercase tracking-wide transition-transform duration-150 active:scale-[0.98]",
                  drive.braking ? "border-destructive bg-destructive text-destructive-foreground" : "border-white/20 bg-white/10 text-white",
                )}
                aria-pressed={drive.braking}
                onPointerDown={() => setDrive((value) => ({ ...value, braking: true, throttle: false }))}
                onPointerUp={() => setDrive((value) => ({ ...value, braking: false }))}
                onPointerLeave={() => setDrive((value) => ({ ...value, braking: false }))}
                onPointerCancel={() => setDrive((value) => ({ ...value, braking: false }))}
              >Broms</button>
            </div>
          </div>
          <div className="grid gap-1.5 justify-self-stretch sm:justify-self-end">
            <span className="text-[10px] font-bold uppercase tracking-wide text-white/60">H-växel</span>
            <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-white/15 bg-black/25 p-1.5" role="group" aria-label="Manuell växellåda">
              {gears.map((gear) => (
                <button
                  key={gear}
                  type="button"
                  aria-pressed={drive.gear === gear}
                  className={cn(
                    "h-10 min-w-11 rounded-md text-sm font-bold transition-colors duration-150",
                    drive.gear === gear ? "bg-premium text-premium-foreground" : "bg-white/10 text-white hover:bg-white/20",
                  )}
                  onClick={() => setDrive((value) => ({ ...value, gear: value.gear === gear ? 0 : gear }))}
                  aria-label={gear === -1 ? "Backväxel" : `Växel ${gear}`}
                >
                  {gear === -1 ? "R" : gear}
                </button>
              ))}
            </div>
          </div>
        </div>

          <div className="min-w-0 bg-card/70 p-4 backdrop-blur sm:p-5">
          {phase === "scene" ? (
            <>
              <AutoFitText maxSize={20} minSize={14} className="h-14 font-bold leading-7">{unit.info.title}</AutoFitText>
              <p className="mt-2 break-words hyphens-auto text-sm leading-relaxed text-muted-foreground">{unit.info.body}</p>
              {unit.info.bullets && <ul className="mt-3 grid gap-2 sm:grid-cols-2">{unit.info.bullets.map((item) => <li key={item} className="min-w-0 rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-relaxed break-words hyphens-auto">{item}</li>)}</ul>}
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                {!reducedMotion && <div key={`${index}-${cycleKey}`} className="h-full origin-left bg-primary" style={{ animation: `lesson-progress ${STEP_SECONDS}s linear forwards`, animationPlayState: playing ? "running" : "paused" }} onAnimationEnd={finishScene} />}
              </div>
              <div className="mt-4 grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => changeScene(index - 1)} aria-label="Föregående scen"><SkipBack /></Button>
                <Button variant="outline" size="icon" onClick={() => { setCycleKey((value) => value + 1); setPlaying(true); }} aria-label="Starta om scenen"><RotateCcw /></Button>
                <Button onClick={() => setPlaying((value) => !value)} className="min-w-0">{playing ? <Pause /> : <Play />}<span className="truncate">{playing ? "Pausa" : "Spela"}</span></Button>
                <Button variant="outline" size="icon" onClick={finishScene} aria-label={unit.check ? "Till kontrollfrågan" : "Nästa scen"}><SkipForward /></Button>
              </div>
            </>
          ) : unit.check ? (
            <div className="space-y-4" aria-live="polite">
              {phase === "question" ? (
                <>
                  <div><p className="text-xs font-bold uppercase text-primary">Kontrollfråga</p><h2 className="mt-1 text-lg font-bold leading-snug">{unit.check.question}</h2></div>
                  <div className="grid gap-2">{unit.check.options.map((option, optionIndex) => <Button key={option} variant="outline" className="h-auto min-h-12 justify-start whitespace-normal px-4 py-3 text-left leading-snug" onClick={() => answer(optionIndex)}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span></Button>)}</div>
                </>
              ) : (
                <div className={cn("rounded-lg border p-4", isCorrect ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10")}>
                  <div className="flex items-center gap-2 text-base font-bold">{isCorrect ? <CheckCircle2 className="text-success" /> : <XCircle className="text-destructive" />}{isCorrect ? "Rätt svar" : "Inte riktigt"}</div>
                  {!isCorrect && <p className="mt-2 text-sm"><span className="font-semibold">Rätt svar:</span> {unit.check.options[unit.check.correct]}</p>}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{unit.check.explanation}</p>
                  <Button className="mt-4 w-full" onClick={() => index === scenes.length - 1 ? onExit() : changeScene(index + 1)}>{index === scenes.length - 1 ? "Slutför genomgången" : "Nästa scen"}<SkipForward /></Button>
                </div>
              )}
            </div>
          ) : null}

          {(phase === "scene" ? unit.info.source : unit.check?.source) && (
            <a href={(phase === "scene" ? unit.info.source : unit.check?.source)?.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex max-w-full items-start gap-1.5 break-words text-xs font-semibold text-primary hover:underline"><ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="min-w-0 break-words">{(phase === "scene" ? unit.info.source : unit.check?.source)?.label}</span></a>
          )}
        </div>
      </section>
    </div>
  );
}