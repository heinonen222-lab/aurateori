import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState }
from "react";
import { useQuery } from "@tanstack/react-query";
import { bankQuestionsQuery } from "@/lib/ai-questions";
import { trainingSummary, swedishDay } from "@/lib/practice";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS } from "@/data/questions";
import { EXAM_QUESTIONS } from "@/data/exam-questions";
import { EXTRA_QUESTIONS } from "@/data/extra-questions";
import { TRIAL_QUESTIONS } from "@/data/trial-questions";

const ALL_QUESTIONS = [
  ...QUESTIONS,
  ...EXAM_QUESTIONS,
  ...EXTRA_QUESTIONS,
  ...TRIAL_QUESTIONS,
];
import { store, useStore, computeStats } from "@/lib/store";
import { RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AutoFitText } from "@/components/AutoFitText";
import { Button } from "@/components/ui/button";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { AuraState } from "@/components/AuraState";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Statistik & svaga punkter – Aurateori" },
      { name: "description", content: "Följ din utveckling och repetera frågor du svarat fel på." },
      { property: "og:title", content: "Statistik & svaga punkter – Aurateori" },
      { property: "og:description", content: "Följ din utveckling och repetera fel svar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const navigate = useNavigate();
  const s = useStore();
  const stats = computeStats(s);
  const summary = trainingSummary(s);
  const { data: bank } = useQuery(bankQuestionsQuery);
  const [weeklyGoal, setWeeklyGoal] = useState(3);
  useEffect(() => { const saved = Number(localStorage.getItem("aurateori-weekly-goal")); if (saved >= 1 && saved <= 7) setWeeklyGoal(saved); }, []);
  const [repeatIdx, setRepeatIdx] = useState(0);

  // Group answers by day (last 7 days)
  const days = useMemo(() => {
    const out: { day: string; correct: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = swedishDay(d.getTime());
      const label = d.toLocaleDateString("sv-SE", { weekday: "short", timeZone: "Europe/Stockholm" });
      const dayAns = s.answers.filter((a) => swedishDay(a.at) === key);
      out.push({
        day: label,
        correct: dayAns.filter((a) => a.correct).length,
        total: dayAns.length,
      });
    }
    return out;
  }, [s.answers]);

  const catStats = useMemo(() => {
    const m: Record<string, { ok: number; total: number }> = {};
    s.answers.forEach((a) => {
      if (!m[a.category]) m[a.category] = { ok: 0, total: 0 };
      m[a.category].total++;
      if (a.correct) m[a.category].ok++;
    });
    return m;
  }, [s.answers]);

  const maxTotal = Math.max(1, ...days.map((d) => d.total));

  // Bara frågor som finns i den lokala frågebanken kan repeteras här.
  const repeatQueue = useMemo(
    () =>
      s.wrongQueue
        .map((id) => [...ALL_QUESTIONS, ...(bank ?? [])].find((q) => q.id === id))
        .filter((q): q is NonNullable<typeof q> => Boolean(q)),
    [s.wrongQueue, bank],
  );

  const repeatQuestion = repeatQueue.length > 0 ? repeatQueue[repeatIdx % repeatQueue.length] : null;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Statistik</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Din utveckling och områden att fokusera på.
            </p>
          </div>
          {s.answers.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Nollställ all statistik?")) store.reset();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Nollställ
            </Button>
          )}
        </div>

        <section className="border-y border-border py-5">
          <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-lg font-bold">Ditt veckomål</h2><p className="mt-1 text-sm text-muted-foreground">{summary.weeklyDays} av {weeklyGoal} träningsdagar · denna vecka</p></div><div className="flex items-center gap-2"><label htmlFor="weekly-goal" className="text-xs text-muted-foreground">Dagar</label><Input id="weekly-goal" type="number" min={1} max={7} value={weeklyGoal} className="h-11 w-16" onChange={(event) => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= 1 && value <= 7) { setWeeklyGoal(value); localStorage.setItem("aurateori-weekly-goal", String(value)); } }} /></div></div>
          <Progress value={Math.min(100, summary.weeklyDays / weeklyGoal * 100)} aria-label="Veckomål" className="mt-4 h-2" />
        </section>

        {s.answers.length === 0 ? (
          <AuraState
            icon={BarChart3}
            title="Ingen statistik än"
            description="Gör din första övning. Därefter ser du träffsäkerhet, utveckling och vilka områden du behöver repetera."
            actionLabel="Starta en övning"
            onAction={() => void navigate({ to: "/quiz" })}
          />
        ) : (
          <>
        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Totalt" value={stats.total} />
          <MiniStat label="Rätt" value={stats.correct} accent="success" />
          <MiniStat label="Träffsäkerhet" value={`${stats.accuracy}%`} accent="primary" />
        </div>

        <div className="border-b border-border py-5 sm:py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Senaste 7 dagarna
          </h2>
          {days.every((d) => d.total === 0) && (
            <p className="mt-2 text-xs text-muted-foreground">
              Inga svar den här veckan än – svara på några frågor så fylls diagrammet.
            </p>
          )}
          <div className="mt-5 flex h-40 items-end gap-2" role="img" aria-label={days.map((day) => `${day.day}: ${day.correct} rätt av ${day.total}`).join(", ")}>
            {days.map((d, i) => {
              const h = (d.total / maxTotal) * 100;
              const accuracy = d.total ? (d.correct / d.total) * 100 : 0;
              return (
                <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-muted"
                      style={{ height: `${Math.max(4, h)}%` }}
                    >
                      <div
                        className="w-full rounded-t-md bg-primary"
                        style={{ height: `${accuracy}%` }}
                        title={`${d.correct}/${d.total}`}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-b border-border py-5 sm:py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Per kategori
          </h2>
          <div className="mt-4 space-y-3">
            {Object.entries(catStats).map(([cat, v]) => {
              const pct = Math.round((v.ok / v.total) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 text-sm">
                    <span className="min-w-0 break-words font-medium">{cat}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {v.ok}/{v.total} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        pct >= 80 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          </>
        )}

        <section className="border-b border-border pb-6">
          <h2 className="font-display text-lg font-bold">Tidigare prov</h2>
          {s.examAttempts.length ? <ul className="mt-3 divide-y divide-border">{s.examAttempts.slice(-10).reverse().map((attempt, index) => <li key={`${attempt.at}-${index}`} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="text-muted-foreground">{new Date(attempt.at).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "medium", timeStyle: "short" })}</span><span className="font-semibold tabular-nums">{attempt.correct}/{attempt.total}</span><span className={attempt.passed ? "text-success" : "text-destructive"}>{attempt.passed ? "Godkänt" : "Ej godkänt"}</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">Inga genomförda prov ännu.</p>}
        </section>
        <div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link to="/genomgangar">Genomgångar</Link></Button><Button asChild variant="outline"><Link to="/flashcards">Snabbplugg</Link></Button></div>

        {repeatQuestion ? (
          <div className="border-b border-border py-5 sm:py-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Repetera felaktiga svar</h2>
                <p className="text-sm text-muted-foreground">
                  {repeatQueue.length} frågor att repetera
                </p>
              </div>
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <QuestionCard
              key={`${repeatQuestion.id}-${repeatIdx}`}
              question={repeatQuestion}
              onAnswer={(ok) => store.recordAnswer(repeatQuestion.id, repeatQuestion.category, ok)}
              onNext={() => setRepeatIdx((i) => i + 1)}
            />
          </div>
        ) : (
          <AuraState
            icon={CheckCircle2}
            title="Inget att repetera"
            description="Bra jobbat. Frågor du svarar fel på samlas automatiskt här."
            tone="success"
            compact
          />
        )}
      </div>
    </AppShell>
  );
}

function MiniStat({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: React.ReactNode;
  accent?: "default" | "success" | "primary";
}) {
  const clr = {
    default: "text-foreground",
    success: "text-success",
    primary: "text-primary",
  }[accent];
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card p-3 shadow-soft sm:p-4">
      <AutoFitText maxSize={24} minSize={15} className={`h-7 font-black leading-7 ${clr}`}>{value}</AutoFitText>
      <AutoFitText maxSize={11} minSize={8} className="mt-1 h-8 uppercase leading-4 tracking-wider text-muted-foreground">{label}</AutoFitText>
    </div>
  );
}
