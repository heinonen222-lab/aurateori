import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Timer, Signpost, Flame, Target, CheckCircle2, ArrowRight, RotateCcw, ShieldCheck, BookOpenCheck, BookOpen, BarChart3, Star } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { useNavigate } from "@tanstack/react-router";
import { TrainingTopics } from "@/components/TrainingTopics";
import { trainingSummary } from "@/lib/practice";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { SubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { Button } from "@/components/ui/button";
import { useStore, computeStats } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { StudentLogin } from "@/components/StudentLogin";
import logo from "@/assets/aurateori-logo.png";
import hero from "@/assets/hero-license.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ta körkortet med Aurateori – Teoriprov B" },
      {
        name: "description",
        content:
          "Träna inför Trafikverkets teoriprov för B-körkort. Övningsfrågor, examsimulator och vägmärken – helt på svenska.",
      },
      { property: "og:title", content: "Ta körkortet med Aurateori" },
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
  const { user, loading: authLoading } = useAuth();
  const favCount = (s.favorites ?? []).length;

  return (
    <AppShell>
      <section className="space-y-5 sm:space-y-7">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-electric/15 blur-3xl" />
          <div className="relative grid items-center gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-[10px] shadow-soft" />
                <span className="font-display text-lg font-extrabold tracking-tight">Aurateori</span>
              </div>
              <h1 className="mt-5 font-display text-[32px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
                Ta körkortet med <span className="text-electric">Aurateori</span>
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Smartare körkortsteori. Öva, testa och följ dina framsteg – allt på ett ställe.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:flex sm:gap-3">
                <Button asChild size="lg" className="h-12 w-full rounded-xl text-base sm:w-auto">
                  <Link to="/quiz">Börja öva <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-xl text-base sm:w-auto">
                  <a href="#sa-fungerar-det">Se hur det fungerar</a>
                </Button>
              </div>
            </div>
            <img
              src={hero}
              alt="Körkort och bilnyckel på en väg med vägmarkeringar"
              width={1280}
              height={960}
              fetchPriority="high"
              className="animate-aura-float aspect-[4/3] w-full rounded-xl object-cover shadow-soft"
            />
          </div>
        </section>

        <section id="sa-fungerar-det" aria-labelledby="features-title" className="scroll-mt-20">
          <h2 id="features-title" className="font-display text-lg font-bold sm:text-xl">Så fungerar Aurateori</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fyra verktyg som tar dig hela vägen till teoriprovet.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard to="/quiz" icon={<BookOpen className="h-5 w-5" />} title="Teori" desc="Träna på teorifrågor efter kategori." />
            <FeatureCard to="/exam" icon={<Timer className="h-5 w-5" />} title="Övningsprov" desc="Testa dina kunskaper inför teoriprovet." />
            <FeatureCard to="/stats" icon={<BarChart3 className="h-5 w-5" />} title="Statistik" desc="Följ dina framsteg och se vad du behöver träna mer på." />
            <FeatureCard to="/quiz" search={{ mode: "favorites" }} icon={<Star className="h-5 w-5" />} title="Favoriter" desc={`Spara frågor och repetera dem senare.${favCount ? ` ${favCount} sparade.` : ""}`} />
          </div>
        </section>

        <section
          aria-labelledby="daily-overview-title"
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <h2 id="daily-overview-title" className="font-display text-lg font-bold">Dagens översikt</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Målet är 80 % körkortsklarhet.</p>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${
                stats.readiness >= 80
                  ? "bg-success/15 text-success"
                  : stats.readiness >= 50
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {stats.readiness >= 80 ? <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" /> : stats.readiness >= 50 ? <Target aria-hidden="true" className="h-3.5 w-3.5" /> : <BookOpenCheck aria-hidden="true" className="h-3.5 w-3.5" />}
              {stats.readiness >= 80 ? "Provklar" : stats.readiness >= 50 ? "På god väg" : "Kom igång"}
            </span>
          </div>
          <div className="relative mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10">
            <div className="flex justify-center">
              <Gauge value={stats.readiness} />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              <Stat icon={<Target className="h-4 w-4" />} label="Frågor" value={stats.total} accent="primary" />
              <Stat icon={<CheckCircle2 className="h-4 w-4" />} label="Träffsäkerhet" value={`${stats.accuracy}%`} accent="success" />
              <Stat icon={<Flame className="h-4 w-4" />} label="Träningsdagar" value={summary.trainingDays} accent="warning" />
              <Stat icon={<Timer className="h-4 w-4" />} label="Senaste prov" value={summary.latestExam ? `${summary.latestExam.correct}/${summary.latestExam.total}` : "–"} accent="primary" />
            </div>
          </div>
          <div className="relative mt-6">
            <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-xl sm:w-auto">
              <Link to="/exam">Starta teoriprov <Timer className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {s.wrongQueue.length > 0 && (
          <Link
            to="/stats"
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 transition-colors duration-200 hover:bg-warning/15 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-warning/20 text-warning-foreground"><RotateCcw className="h-5 w-5" /></span>
            <div className="min-w-0">
              <div className="text-sm font-bold">Du har {s.wrongQueue.length} frågor att repetera</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Träna på dina svaga områden</div>
            </div>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        <SubscriptionCountdown compact />

        <div>
          <h2 className="mb-3 font-display text-lg font-bold sm:text-xl">Fler sätt att träna</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <ActionCard to="/quiz" search={{ mode: "quick" }} icon={<Zap className="h-5 w-5" />} title="Snabbquiz" tag="10 frågor" desc="Blandade frågor för snabb repetition." />
            <ActionCard to="/signs" icon={<Signpost className="h-5 w-5" />} title="Vägmärken" tag="Bibliotek" desc="Lär dig märkenas betydelse och regler." />
            <ActionCard to="/forsakring" icon={<ShieldCheck className="h-5 w-5" />} title="Försäkring" tag="Gratis" desc="10 frågor med förklaringar." />
          </div>
        </div>

        {!authLoading && !user && <StudentLogin />}

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
    <div className="flex min-w-0 flex-col overflow-hidden bg-card p-3">
      <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md ${accentBg}`}>
        {icon}
      </div>
      <AutoFitText maxSize={20} minSize={14} className="h-6 font-black leading-6">{value}</AutoFitText>
      <span className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{label}</span>
    </div>
  );
}

function ActionCard({
  to,
  icon,
  title,
  desc,
  tag,
  search,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
  search?: Record<string, unknown>;
}) {
  return (
    <Link
      to={to}
      search={search}
      className="group flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-soft transition-colors duration-200 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring sm:flex-col sm:items-start"
    >
      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-bold">{title}</span>
          {tag && <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{tag}</span>}
        </div>
        <div className="mt-0.5 text-[13px] leading-5 text-muted-foreground">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100 sm:hidden" />
    </Link>
  );
}

function FeatureCard({ to, icon, title, desc, search }: { to: string; icon: React.ReactNode; title: string; desc: string; search?: Record<string, unknown> }) {
  return (
    <Link
      to={to}
      search={search}
      className="group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-electric/40 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hover:translate-y-0"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/10 text-electric">{icon}</span>
      <span className="mt-4 flex items-center justify-between gap-2 font-display text-base font-bold">
        {title}
        <ArrowRight className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
      </span>
      <span className="mt-1 text-[13px] leading-5 text-muted-foreground">{desc}</span>
    </Link>
  );
}
