import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Timer, Signpost, Flame, Target, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Gauge({ value }: { value: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid h-44 w-44 shrink-0 place-items-center sm:h-48 sm:w-48">
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
        <div className="font-display text-4xl font-extrabold">{value}%</div>
        <div className="mt-1 text-[10px] font-semibold uppercase text-muted-foreground">
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
      <section className="space-y-8">
        <header className="max-w-3xl">
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Personbil · Behörighet B
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Din väg till körkortet
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Träna smartare, se vad du behöver förbättra och följ din utveckling fram till provdagen.
          </p>
        </header>

        <SubscriptionCountdown compact />

        <div className="aura-surface relative overflow-hidden rounded-xl border border-border p-5 shadow-lifted sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-10 sm:p-8">
          <div className="relative z-10 mx-auto w-fit sm:mx-0"><Gauge value={stats.readiness} /></div>
          <div className="relative z-10 mt-5 min-w-0 sm:mt-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">Dagens översikt</h2>
                <p className="mt-1 text-sm text-muted-foreground">Målet är 80 % körkortsklarhet.</p>
              </div>
              <span className="hidden rounded-md bg-premium px-2.5 py-1 text-xs font-bold text-premium-foreground sm:inline-flex">Mål 80 %</span>
            </div>
            <div className="grid min-w-0 grid-cols-3 divide-x divide-border overflow-hidden rounded-lg border border-border bg-background/70 backdrop-blur">
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
        </div>

        <div>
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Fortsätt träna</h2>
              <p className="mt-1 text-sm text-muted-foreground">Välj ett sätt att komma vidare.</p>
            </div>
          </div>
          <div className="grid overflow-hidden rounded-lg border border-border bg-card shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-border">
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
        </div>

        {s.wrongQueue.length > 0 && (
          <Link
            to="/stats"
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 transition-[background-color,transform] duration-200 hover:bg-warning/15 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-warning/20 text-warning-foreground"><RotateCcw className="h-5 w-5" /></span>
            <div className="min-w-0">
              <div className="text-sm font-bold">
                Du har {s.wrongQueue.length} frågor att repetera
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">Träna på dina svaga områden</div>
            </div>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
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
    <div className="flex min-w-0 flex-col overflow-hidden px-3 py-3 sm:px-4">
      <div
        className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md ${accentBg}`}
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
      className={`group relative flex h-full min-h-48 min-w-0 flex-col overflow-hidden border-b p-5 transition-colors duration-200 last:border-b-0 hover:bg-accent/40 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring sm:border-b-0 ${
        highlight ? "bg-primary text-primary-foreground hover:bg-primary/95" : "border-border bg-card"
      }`}
    >
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
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
      <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold opacity-70 transition group-hover:opacity-100">
        Starta <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
