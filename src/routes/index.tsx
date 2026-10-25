import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Timer, Signpost, Flame, Target, CheckCircle2, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { useNavigate } from "@tanstack/react-router";
import { TrainingTopics } from "@/components/TrainingTopics";
import { trainingSummary } from "@/lib/practice";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { SubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { Button } from "@/components/ui/button";
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
    <div className="relative grid h-36 w-36 shrink-0 place-items-center sm:h-44 sm:w-44">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden="true">
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
        <div className="font-display text-3xl font-extrabold sm:text-4xl">{value}%</div>
        <div className="mt-1 text-[9px] font-semibold text-muted-foreground sm:text-[10px]">
          Körkortsklarhet
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const s = useStore();
  const stats = computeStats(s);
  const summary = trainingSummary(s);
  const navigate = useNavigate();
  const { questions } = useQuestions();

  return (
    <AppShell>
      <section className="space-y-8">
        <header className="max-w-3xl">
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Personbil · Behörighet B
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Ditt körkort börjar här.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Träna smartare. Förstå trafiken. Var redo för teoriprovet.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:flex sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 w-full text-base sm:w-auto">
              <Link to="/quiz">
                Fortsätt träna
                <Zap className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 w-full text-base sm:w-auto">
              <Link to="/exam">
                Starta teoriprov
                <Timer className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <SubscriptionCountdown compact />

        <div className="grid grid-cols-1 items-center gap-5 rounded-lg border border-border bg-card p-5 shadow-soft sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 sm:p-6">
          <div className="flex flex-col items-center gap-3">
            <Gauge value={stats.readiness} />
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                stats.readiness >= 80
                  ? "bg-success/15 text-success"
                  : stats.readiness >= 50
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {stats.readiness >= 80
                ? "Provklar – redo för provet"
                : stats.readiness >= 50
                  ? "På god väg – slipa detaljerna"
                  : "Kom igång med grunderna"}
            </span>
          </div>
          <div className="min-w-0">
            <div className="mb-4">
              <h2 className="font-display text-base font-bold sm:text-xl">Dagens översikt</h2>
              <p className="mt-1 text-sm text-muted-foreground">Målet är 80 % körkortsklarhet.</p>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={<Target className="h-4 w-4" />} label="Frågor" value={stats.total} accent="primary" />
              <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Träffsäkerhet" value={`${stats.accuracy}%`} accent="success" />
              <Stat icon={<Flame className="h-4 w-4" />} label="Träningsdagar" value={summary.trainingDays} accent="warning" />
              <Stat icon={<Timer className="h-4 w-4" />} label="Senaste prov" value={summary.latestExam ? `${summary.latestExam.correct}/${summary.latestExam.total}` : "–"} accent="primary" />
            </div>
          </div>
        </div>

        {s.wrongQueue.length > 0 && (
          <Link
            to="/stats"
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 transition-[background-color,transform] duration-200 hover:bg-warning/15 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-warning/20 text-warning-foreground"><RotateCcw className="h-5 w-5" /></span>
            <div className="min-w-0">
              <div className="text-sm font-bold">Du har {s.wrongQueue.length} frågor att repetera</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Träna på dina svaga områden</div>
            </div>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        <div>
          <h2 className="mb-4 font-display text-xl font-bold">Fler sätt att träna</h2>
          <div className="grid overflow-hidden rounded-lg border border-border bg-card shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-border">
            <ActionCard to="/quiz" icon={<Zap className="h-5 w-5" />} title="Snabbquiz" desc="10 blandade frågor för snabb repetition." />
            <ActionCard to="/signs" icon={<Signpost className="h-5 w-5" />} title="Vägmärken" desc="Lär dig märkenas betydelse och regler." />
            <ActionCard to="/forsakring" icon={<ShieldCheck className="h-5 w-5" />} title="Försäkring – gratis" desc="10 frågor med förklaringar. Ingen Premium krävs." />
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Dina kunskapsområden</h2>
              <p className="mt-1 text-sm text-muted-foreground">Träna ett specifikt ämnesområde.</p>
            </div>
            <Button asChild variant="ghost" size="sm"><Link to="/stats">Statistik <ArrowRight /></Link></Button>
          </div>
          <TrainingTopics questions={questions} state={s} onSelect={(topic) => void navigate({ to: "/quiz", search: { topic } })} />
        </section>
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
    <div className="flex min-w-0 flex-col overflow-hidden">
      <div
        className={`mb-2 hidden h-7 w-7 items-center justify-center rounded-md sm:inline-flex ${accentBg}`}
      >
        {icon}
      </div>
      <AutoFitText maxSize={20} minSize={14} className="h-6 font-black leading-6">{value}</AutoFitText>
      <span className="mt-1 text-[10px] leading-4 text-muted-foreground">{label}</span>
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
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden border-b p-4 transition-colors duration-200 last:border-b-0 hover:bg-accent/40 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring sm:border-b-0 ${
        highlight ? "bg-primary text-primary-foreground hover:bg-primary/95" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            highlight ? "bg-primary-foreground/15" : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>
        <AutoFitText maxSize={16} minSize={13} className="h-6 min-w-0 flex-1 font-bold leading-6">{title}</AutoFitText>
        <ArrowRight className="h-4 w-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>
      <div
        className={`mt-2 text-[13px] leading-5 ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}
      >
        {desc}
      </div>
    </Link>
  );
}
