import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, ExternalLink, GraduationCap, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { VisualLessonPlayer } from "@/components/lesson3d/VisualLessonPlayer";
import { LESSONS, type Lesson } from "@/data/lessons";
import { useAuth } from "@/hooks/useAuth";
import { listLessonProgress, saveLessonProgress } from "@/utils/lessons.functions";

export const Route = createFileRoute("/genomgangar")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { lesson?: string } =>
    typeof search.lesson === "string" ? { lesson: search.lesson } : {},
  head: () => ({
    meta: [
      { title: "Interaktiva genomgångar – Aurateori" },
      {
        name: "description",
        content:
          "Visuella 3D-genomgångar av nyckelkunskaperna för B-körkortet: väjningsregler, stoppsträcka, vägmärken, säkerhet, miljö och fordonskännedom.",
      },
      { property: "og:title", content: "Interaktiva genomgångar – Aurateori" },
      {
        property: "og:description",
        content: "Se svenska trafikregler förklaras steg för steg i styrda 3D-animationer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonsPage,
});

function infoSteps(lesson: Lesson) {
  return lesson.steps.filter((step) => step.kind === "info").length;
}

function LessonsPage() {
  const { lesson: lessonParam } = Route.useSearch();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchProgress = useServerFn(listLessonProgress);
  const persistProgress = useServerFn(saveLessonProgress);
  const [active, setActive] = useState<Lesson | null>(null);

  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: () => fetchProgress({}),
    enabled: Boolean(user),
  });

  // Refs håller callbacken stabil, så att ett sparat steg inte triggar en ny
  // render → ny callback → nytt sparande.
  const activeRef = useRef<Lesson | null>(null);
  activeRef.current = active;
  const saveRef = useRef(persistProgress);
  saveRef.current = persistProgress;
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!lessonParam) return;
    const match = LESSONS.find((l) => l.id === lessonParam);
    if (match) setActive(match);
  }, [lessonParam]);

  const progressFor = (lessonId: string) => progress?.find((row) => row.lesson_id === lessonId);

  const handleStepChange = useCallback(
    (result: { step: number; totalSteps: number; answeredChecks: number; correctChecks: number; bestCorrectChecks: number; completed: boolean }) => {
      const lesson = activeRef.current;
      if (!userId || !lesson) return;
      void saveRef
        .current({
          data: {
            lessonId: lesson.id,
            lastStep: result.step,
            totalSteps: result.totalSteps,
            completed: result.completed,
            answeredChecks: result.answeredChecks,
            correctChecks: result.correctChecks,
            bestCorrectChecks: result.bestCorrectChecks,
          },
        })
        .catch(() => undefined);
    },
    [userId],
  );

  const closePlayer = () => {
    setActive(null);
    void queryClient.invalidateQueries({ queryKey: ["lesson-progress", userId] });
  };

  return (
    <AppShell>
      {active ? (
        <VisualLessonPlayer
          key={active.id}
          lesson={active}
          initialStep={progressFor(active.id)?.last_step ?? 0}
          initialAnsweredChecks={progressFor(active.id)?.answered_checks ?? 0}
          initialCorrectChecks={progressFor(active.id)?.correct_checks ?? 0}
          initialBestCorrectChecks={progressFor(active.id)?.best_correct_checks ?? 0}
          onStepChange={handleStepChange}
          onExit={closePlayer}
        />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Visuella 3D-genomgångar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Se trafikregler och risksituationer spelas upp steg för steg i tydliga 3D-scener.
              {user
                ? " Ditt läge sparas på kontot så du kan återkomma senare."
                : " Logga in för att spara var du slutade."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {LESSONS.map((l) => {
              const saved = progressFor(l.id);
              const total = infoSteps(l);
              return (
                <button
                  key={l.id}
                  onClick={() => setActive(l)}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="max-w-[60%] rounded-full bg-secondary px-2.5 py-0.5 text-right text-[11px] font-semibold text-secondary-foreground break-words">{l.category}</span>
                  </div>
                  <AutoFitText maxSize={16} minSize={12} className="mt-3 h-12 font-bold leading-6">{l.title}</AutoFitText>
                  <p className="mt-1 line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-muted-foreground">{l.summary}</p>
                  {saved && (
                    <span className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {saved.completed ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Klar
                        </>
                      ) : (
                        <>Fortsätt scen {Math.min(saved.last_step + 1, total)}/{total}</>
                      )}
                    </span>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 text-[11px] font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {l.minutes} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Play className="h-3.5 w-3.5" />
                      {total} scener
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {l.sources.length} källor
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}
