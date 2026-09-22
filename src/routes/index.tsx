import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Timer, Signpost, Flame, Target, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { useStore, computeStats } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurateori – Teoriprov för B-körkort" },
      {
        name: "description",
        content:
          "Träna inför Trafikverkets teoriprov för B-körkort. Övningsfrågor, examsimulator och vägmärken – helt på svenska.",
      },
      { property: "og:title", content: "Aurateori – Teoriprov för B-körkort" },
      {
        property: "og:description",
        content: "Träna inför Trafikverkets teoriprov för B-körkort på svenska.",
      },
    ],
  }),
  component: Dashboard,
});

function Gauge({ value }: { value: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid h-48 w-48 place-items-center">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--muted)" strokeWidth="14" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-black tracking-tight">{value}%</div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Körkortsklarhet
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const s = useStore();
  const stats = computeStats(s);

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Personbil · Behörighet B
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Körkortsfrågor och teoriprov för B-körkort
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Följ din utveckling mot Trafikverkets teoriprov.
          </p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
          <Gauge value={stats.readiness} />
          <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
            <Stat
              icon={<Target className="h-4 w-4" />}
              label="Frågor"
              value={stats.total}
              accent="primary"
            />
            <Stat
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Träffsäkerhet"
              value={`${stats.accuracy}%`}
              accent="success"
            />
            <Stat
              icon={<Flame className="h-4 w-4" />}
              label="Streak"
              value={`${s.streak}d`}
              accent="warning"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ActionCard
            to="/quiz"
            icon={<Zap className="h-5 w-5" />}
            title="Snabbquiz"
            desc="10 blandade frågor för snabb repetition."
          />
          <ActionCard
            to="/exam"
            icon={<Timer className="h-5 w-5" />}
            title="Fullständigt prov"
            desc="65 frågor på 50 minuter – som riktigt provet."
            highlight
          />
          <ActionCard
            to="/signs"
            icon={<Signpost className="h-5 w-5" />}
            title="Vägmärken"
            desc="Bläddra bland alla svenska vägmärken."
          />
        </div>

        {s.wrongQueue.length > 0 && (
          <Link
            to="/stats"
            className="flex items-center justify-between rounded-2xl border border-warning/40 bg-warning/10 p-4 transition hover:bg-warning/15"
          >
            <div>
              <div className="text-sm font-bold">
                Du har {s.wrongQueue.length} frågor att repetera
              </div>
              <div className="text-xs text-muted-foreground">Gå till Statistik → Svaga punkter</div>
            </div>
            <span className="text-lg">→</span>
          </Link>
        )}
      </section>
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: "primary" | "success" | "warning";
}) {
  const accentBg = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
  }[accent];
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-background p-2.5 sm:p-3">
      <div
        className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${accentBg}`}
      >
        {icon}
      </div>
      <AutoFitText maxSize={20} minSize={14} className="h-6 font-black leading-6">{value}</AutoFitText>
      <AutoFitText maxSize={11} minSize={8} className="mt-1 h-8 uppercase leading-4 tracking-wider text-muted-foreground">{label}</AutoFitText>
    </div>
  );
}

function ActionCard({
  to,
  icon,
  title,
  desc,
  highlight,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        highlight ? "border-primary/30 bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
          highlight ? "bg-primary-foreground/15" : "bg-primary/10 text-primary"
        }`}
      >
        {icon}
      </div>
      <AutoFitText maxSize={16} minSize={12} className="mt-4 h-12 font-bold leading-6">{title}</AutoFitText>
      <div
        className={`mt-1 min-h-[3.75rem] flex-1 text-sm leading-5 ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {desc}
      </div>
      <div className="mt-3 text-sm font-semibold opacity-70 transition group-hover:opacity-100">
        Starta →
      </div>
    </Link>
  );
}
