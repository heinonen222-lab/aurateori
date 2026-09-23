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
    <div className="min-w-0 space-y-3">
      <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Button variant="outline" size="icon" onClick={onExit} aria-label="Tillbaka till genomgångar"><ArrowLeft /></Button>
        <div className="min-w-0">
          <AutoFitText maxSize={20} minSize={14} className="h-7 font-black leading-7">{lesson.title}</AutoFitText>
          <p className="truncate text-xs text-muted-foreground">{lesson.reference}</p>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[4/3] min-h-64 w-full bg-muted sm:aspect-video">
          <LessonScene scene={scene} playing={playing} reducedMotion={reducedMotion} drive={drive} />
          <div className="pointer-events-none absolute inset-x-3 top-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <span className="min-w-0 rounded-md bg-background/90 px-2 py-1 text-[11px] font-bold backdrop-blur">{index + 1}/{scenes.length}: {scene.label}</span>
            <span className="rounded-md bg-background/90 px-2 py-1 text-[11px] font-semibold backdrop-blur">{lesson.category}</span>
          </div>
        </div>

        <div className="grid gap-3 border-y border-border bg-secondary/35 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={drive.throttle ? "default" : "outline"}
              className="h-12"
              onPointerDown={() => setDrive((value) => ({ ...value, throttle: true, braking: false }))}
              onPointerUp={() => setDrive((value) => ({ ...value, throttle: false }))}
              onPointerLeave={() => setDrive((value) => ({ ...value, throttle: false }))}
            >Gas</Button>
            <Button
              variant={drive.braking ? "destructive" : "outline"}
              className="h-12"
              onPointerDown={() => setDrive((value) => ({ ...value, braking: true, throttle: false }))}
              onPointerUp={() => setDrive((value) => ({ ...value, braking: false }))}
              onPointerLeave={() => setDrive((value) => ({ ...value, braking: false }))}
            >Broms</Button>
          </div>
          <div className="grid grid-cols-[auto_8rem] items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-muted-foreground">Manuell växel</div>
              <div className="text-xs font-semibold">{drive.gear === 0 ? "Friläge" : drive.gear === -1 ? "Back" : `Växel ${drive.gear}`}</div>
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1" aria-label="H-växel">
              {gears.map((gear) => (
                <Button key={gear} type="button" size="sm" variant={drive.gear === gear ? "default" : "ghost"} className="h-8 px-0" onClick={() => setDrive((value) => ({ ...value, gear: value.gear === gear ? 0 : gear }))} aria-label={gear === -1 ? "Backväxel" : `Växel ${gear}`}>
                  {gear === -1 ? "R" : gear}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
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
                  <Button className="mt-4 w-full" onClick={() => changeScene(index + 1)}>{index === scenes.length - 1 ? "Slutför genomgången" : "Nästa scen"}<SkipForward /></Button>
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