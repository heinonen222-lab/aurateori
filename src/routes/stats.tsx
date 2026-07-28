import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { QuestionCard } from "@/components/QuestionCard";
import { QUESTIONS } from "@/data/questions";
import { store, useStore, computeStats } from "@/lib/store";
import { RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Statistik & svaga punkter – Körkortskollen" },
      { name: "description", content: "Följ din utveckling och repetera frågor du svarat fel på." },
      { property: "og:title", content: "Statistik & svaga punkter – Körkortskollen" },
      { property: "og:description", content: "Följ din utveckling och repetera fel svar." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const s = useStore();
  const stats = computeStats(s);
  const [repeatIdx, setRepeatIdx] = useState(0);

  // Group answers by day (last 7 days)
  const days = useMemo(() => {
    const out: { day: string; correct: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("sv-SE", { weekday: "short" });
      const dayAns = s.answers.filter((a) => new Date(a.at).toISOString().slice(0, 10) === key);
      out.push({ day: label, correct: dayAns.filter((a) => a.correct).length, total: dayAns.length });
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

  const repeatQuestion = s.wrongQueue.length > 0 ? QUESTIONS.find((q) => q.id === s.wrongQueue[repeatIdx % s.wrongQueue.length]) : null;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Statistik</h1>
            <p className="mt-1 text-sm text-muted-foreground">Din utveckling och områden att fokusera på.</p>
          </div>
          {s.answers.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Nollställ all statistik?")) store.reset();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Nollställ
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Totalt" value={stats.total} />
          <MiniStat label="Rätt" value={stats.correct} accent="success" />
          <MiniStat label="Träffsäkerhet" value={`${stats.accuracy}%`} accent="primary" />
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Senaste 7 dagarna</h2>
          <div className="mt-5 flex h-40 items-end gap-2">
            {days.map((d, i) => {
              const h = (d.total / maxTotal) * 100;
              const accuracy = d.total ? (d.correct / d.total) * 100 : 0;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
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

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Per kategori</h2>
          <div className="mt-4 space-y-3">
            {Object.keys(catStats).length === 0 && (
              <div className="text-sm text-muted-foreground">Inga svar än – börja med Övningsfrågor.</div>
            )}
            {Object.entries(catStats).map(([cat, v]) => {
              const pct = Math.round((v.ok / v.total) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{cat}</span>
                    <span className="text-muted-foreground">{v.ok}/{v.total} · {pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", pct >= 80 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Repetera felaktiga svar</h2>
              <p className="text-sm text-muted-foreground">
                {s.wrongQueue.length} frågor i kön · spaced repetition
              </p>
            </div>
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
          {repeatQuestion ? (
            <QuestionCard
              key={`${repeatQuestion.id}-${repeatIdx}`}
              question={repeatQuestion}
              onAnswer={(ok) => store.recordAnswer(repeatQuestion.id, repeatQuestion.category, ok)}
              onNext={() => setRepeatIdx((i) => i + 1)}
            />
          ) : (
            <div className="rounded-2xl bg-success/10 p-6 text-center text-sm text-success">
              🎯 Kön är tom – bra jobbat!
            </div>
          )}
        </div>
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
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className={`text-2xl font-black ${clr}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
