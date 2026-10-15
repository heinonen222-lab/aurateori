import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock, ExternalLink, GraduationCap, Play, Sparkles, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";


// 3D-spelaren är tung (three.js + drei). Den laddas först när en genomgång
// faktiskt öppnas, så listan visas snabbt och utan 3D-kod i förhandsvisningen.
// Om modulen inte kan hämtas (t.ex. en föråldrad fil efter en ny publicering)
// laddas sidan om en gång automatiskt istället för att bli blank.
const RELOAD_FLAG = "genomgangar-player-reloaded";
const VisualLessonPlayer = lazy(() =>
  import("@/components/lesson3d/VisualLessonPlayer")
    .then((m) => {
      sessionStorage.removeItem(RELOAD_FLAG);
      return { default: m.VisualLessonPlayer };
    })
    .catch((err) => {
      if (typeof window !== "undefined" && !sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
        return new Promise<never>(() => {});
      }
      throw err;
    }),
);

import { LESSONS, type Lesson } from "@/data/lessons";
import { useAuth } from "@/hooks/useAuth";
import { listLessonProgress, saveLessonProgress } from "@/utils/lessons.functions";
import { Button } from "@/components/ui/button";
import { AuraLoading, AuraState } from "@/components/AuraState";

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

  const { data: progress, isPending: progressPending, isError: progressError, refetch: refetchProgress } = useQuery({
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
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl px-4 py-16">
              <AuraLoading label="Laddar genomgången…" />
            </div>
          }
        >
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
        </Suspense>
      ) : (

        <div className="space-y-7">
          <header className="aura-surface relative overflow-hidden rounded-xl border border-border p-5 shadow-lifted sm:p-7">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-premium">
                <Sparkles className="h-4 w-4" /> Interaktiv teori
              </div>
              <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">Se trafiken innan du möter den</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Utforska svenska trafikregler i spelbara 3D-scener med bil, växling och korta kunskapskontroller.
                {user ? " Dina resultat och din plats sparas automatiskt." : " Logga in för att spara dina resultat."}
              </p>
            </div>
            <div className="relative z-10 mt-5 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-background/65 backdrop-blur">
              <LessonMetric value={LESSONS.length} label="Genomgångar" />
              <LessonMetric value={LESSONS.reduce((sum, lesson) => sum + infoSteps(lesson), 0)} label="3D-scener" />
              <LessonMetric value="Sparas" label="Dina framsteg" />
            </div>
          </header>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Välj genomgång</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fortsätt där du slutade eller börja med ett nytt område.</p>
            </div>
          </div>

          {user && progressPending && <AuraLoading label="Laddar dina sparade genomgångar…" compact />}

          {user && progressError && (
            <AuraState
              icon={TriangleAlert}
              title="Sparade resultat kunde inte hämtas"
              description="Du kan fortfarande starta alla genomgångar. Försök igen för att visa var du slutade senast."
              actionLabel="Försök igen"
              onAction={() => void refetchProgress()}
              tone="danger"
              compact
            />
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {LESSONS.map((l) => {
              const saved = progressFor(l.id);
              const total = infoSteps(l);
              return (
                <Button
                  variant="ghost"
                  key={l.id}
                  onClick={() => setActive(l)}
                  className="group h-full min-h-64 min-w-0 flex-col items-stretch justify-start overflow-hidden rounded-lg border border-border bg-card p-0 text-left shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-premium/60 hover:bg-card hover:shadow-lifted"
                >
                  <div className="relative h-24 overflow-hidden border-b border-border bg-secondary/40">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-premium/50" />
                    <div className="absolute left-[18%] top-1/2 h-20 w-px -translate-y-1/2 rotate-[58deg] bg-border" />
                    <div className="absolute right-[18%] top-1/2 h-20 w-px -translate-y-1/2 -rotate-[58deg] bg-border" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="grid h-11 w-11 place-items-center rounded-lg border border-premium/35 bg-background/80 text-premium shadow-soft backdrop-blur">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="absolute right-3 top-3 max-w-[60%] rounded-md border border-border bg-background/80 px-2 py-1 text-right text-[10px] font-bold text-muted-foreground backdrop-blur">{l.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <AutoFitText maxSize={16} minSize={12} className="h-12 font-bold leading-6">{l.title}</AutoFitText>
                    <p className="mt-1 line-clamp-2 min-h-10 whitespace-normal text-sm leading-5 text-muted-foreground">{l.summary}</p>
                    {saved && (
                    <span className="mt-3 inline-flex items-center gap-1.5 self-start rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                      {saved.completed ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Klar
                        </>
                      ) : (
                        <>Fortsätt scen {Math.min(saved.last_step + 1, total)}/{total}</>
                      )}
                    </span>
                    )}
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-[11px] font-medium text-muted-foreground">
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
                    <ArrowRight className="ml-auto h-4 w-4 text-premium transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function LessonMetric({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="min-w-0 px-2 py-3 text-center sm:px-4">
      <div className="font-display text-lg font-extrabold text-foreground">{value}</div>
      <AutoFitText maxSize={10} minSize={8} className="mt-1 h-4 uppercase leading-4 text-muted-foreground">{label}</AutoFitText>
    </div>
  );
}
