import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, ExternalLink, GraduationCap, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { VisualLessonPlayer } from "@/components/lesson3d/VisualLessonPlayer";
import { LESSONS, type Lesson } from "@/data/lessons";

export const Route = createFileRoute("/genomgangar")({
  ssr: false,
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

function LessonsPage() {
  const [active, setActive] = useState<Lesson | null>(null);

  return (
    <AppShell>
      {active ? (
        <VisualLessonPlayer lesson={active} onExit={() => setActive(null)} />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Visuella 3D-genomgångar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Se trafikregler och risksituationer spelas upp steg för steg i tydliga 3D-scener.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {LESSONS.map((l) => (
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
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 text-[11px] font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {l.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Play className="h-3.5 w-3.5" />
                    {l.steps.filter((step) => step.kind === "info").length} scener
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {l.sources.length} källor
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
