import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Crown, GraduationCap, Loader2, LockKeyhole, LogOut, Mail, Play, Target, Trash2, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { deleteAccount } from "@/utils/account.functions";
import { listLessonProgress } from "@/utils/lessons.functions";
import { LESSONS } from "@/data/lessons";
import { store } from "@/lib/store";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/konto")({
  head: () => ({
    meta: [
      { title: "Mitt konto – Aurateori" },
      {
        name: "description",
        content: "Hantera ditt Aurateori-konto, se din premiumstatus eller ta bort kontot.",
      },
      { property: "og:title", content: "Mitt konto – Aurateori" },
      { property: "og:description", content: "Hantera ditt konto och din premiumstatus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

const CONFIRM_WORD = "TA BORT";
const LESSON_READINESS_TARGET = 80;

function LessonReadinessGauge({ value }: { value: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid h-32 w-32 shrink-0 place-items-center">
      <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="52" cy="52" r={radius} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle cx="52" cy="52" r={radius} fill="none" stroke="var(--primary)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - value / 100 * circumference} className="transition-all duration-700" />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black">{value}%</div>
        <div className="text-[9px] font-bold uppercase text-muted-foreground">Klarhet</div>
      </div>
    </div>
  );
}

function AccountPage() {
  const { user, loading } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const runDelete = useServerFn(deleteAccount);
  const fetchLessonProgress = useServerFn(listLessonProgress);

  const { data: lessonProgress, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: () => fetchLessonProgress({}),
    enabled: Boolean(user),
  });

  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalAvailableChecks = LESSONS.reduce((sum, lesson) => sum + lesson.steps.filter((step) => step.kind === "check").length, 0);
  const totalCorrectChecks = lessonProgress?.reduce((sum, row) => sum + row.correct_checks, 0) ?? 0;
  const totalAnsweredChecks = lessonProgress?.reduce((sum, row) => sum + row.answered_checks, 0) ?? 0;
  const completedLessons = lessonProgress?.filter((row) => row.completed).length ?? 0;
  const lessonReadiness = totalAvailableChecks ? Math.round(totalCorrectChecks / totalAvailableChecks * 100) : 0;
  const remainingToTarget = Math.max(0, LESSON_READINESS_TARGET - lessonReadiness);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  const handleDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await runDelete({});
      store.reset();
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      void navigate({ to: "/auth", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kontot kunde inte tas bort. Försök igen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Mitt konto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Se dina kontouppgifter, hantera premium eller ta bort kontot permanent.
          </p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-soft">
            Laddar kontouppgifter…
          </div>
        ) : !user ? (
          <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">
              Du är inte inloggad. Logga in för att hantera ditt konto.
            </p>
            <Button asChild>
              <Link to="/auth">Logga in</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary">
                  <UserIcon className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> E-post
                  </div>
                  <div className="truncate text-sm font-semibold">{user.email}</div>
                </div>
                {isActive && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-premium px-3 py-1 text-[11px] font-bold uppercase text-premium-foreground">
                    <Crown className="h-3.5 w-3.5" /> Premium
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/priser"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <Crown className="h-4 w-4" />
                  Premium & betalning
                </Link>
                <Button
                  variant="outline"
                  onClick={() => void signOut()}
                  className="h-auto rounded-xl px-4 py-2.5 text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logga ut
                </Button>
              </div>
            </div>

            <SubscriptionCountdown />

            <section className="aura-surface relative space-y-5 overflow-hidden rounded-xl border border-border p-5 shadow-lifted sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-premium/30 bg-background/65">
                  <GraduationCap className="h-5 w-5 text-premium" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-bold">Mina genomgångar</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Poäng från kontrollfrågorna och din väg mot målet.
                  </p>
                </div>
              </div>

              {lessonsLoading ? (
                <p className="text-sm text-muted-foreground">Laddar dina genomgångar…</p>
              ) : (
                <>
                  <div className="grid gap-4 rounded-lg border border-border bg-background/60 p-4 backdrop-blur sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                    <div className="mx-auto"><LessonReadinessGauge value={lessonReadiness} /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-bold"><Target className="h-4 w-4 text-premium" /> Mål: {LESSON_READINESS_TARGET}%</div>
                      <p className="mt-1 text-sm text-muted-foreground">{remainingToTarget === 0 ? "Målet är nått. Fortsätt repetera för att behålla kunskapen." : `${remainingToTarget} procentenheter kvar till målet.`}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <ResultStat value={`${totalCorrectChecks}/${totalAvailableChecks}`} label="Poäng" />
                        <ResultStat value={totalAnsweredChecks} label="Svar" />
                        <ResultStat value={`${completedLessons}/${LESSONS.length}`} label="Klara" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                  {LESSONS.map((lesson) => {
                    const row = lessonProgress?.find((item) => item.lesson_id === lesson.id);
                    const total = row?.total_steps || lesson.steps.filter((s) => s.kind === "info").length;
                    const totalChecks = lesson.steps.filter((s) => s.kind === "check").length;
                    const step = row ? Math.min(row.last_step + 1, total) : 0;
                    const progressPercent = row && total ? Math.round((row.completed ? total : step) / total * 100) : 0;
                    const scorePercent = row?.answered_checks && totalChecks ? Math.round(row.correct_checks / totalChecks * 100) : 0;
                    const status = !row ? "Ej startad" : row.completed && scorePercent >= LESSON_READINESS_TARGET ? "Klar" : row.answered_checks > 0 && scorePercent < LESSON_READINESS_TARGET ? "Repetera" : "Pågår";
                    return (
                      <li key={lesson.id}>
                        <Link
                          to="/genomgangar"
                          search={{ lesson: lesson.id }}
                          className="group block min-w-0 rounded-lg border border-border bg-background/45 p-4 transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-premium/45 hover:bg-background/75 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                            <AutoFitText maxSize={14} minSize={11} className="h-10 min-w-0 font-bold leading-5">{lesson.title}</AutoFitText>
                            <span className={status === "Klar" ? "inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold text-success" : status === "Repetera" ? "inline-flex shrink-0 items-center gap-1 rounded-full bg-warning/20 px-2 py-1 text-[10px] font-bold text-warning-foreground" : "inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold"}>
                              {status === "Klar" ? <CheckCircle2 className="h-3 w-3" /> : status === "Ej startad" ? <LockKeyhole className="h-3 w-3" /> : <Play className="h-3 w-3" />}{status}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs">
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-premium transition-[width] duration-700" style={{ width: `${progressPercent}%` }} /></div>
                            <span className="shrink-0 font-bold">{row ? `${row.correct_checks}/${totalChecks} poäng` : `0/${totalChecks} poäng`}</span>
                          </div>
                          <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                            {row ? `Scen ${step}/${total} · ${scorePercent}% klarhet · ${new Date(row.updated_at).toLocaleDateString("sv-SE")}` : "Starta genomgången"}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                  </ul>
                </>
              )}
            </section>


            <div className="space-y-4 rounded-lg border border-destructive/40 bg-destructive/5 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <h2 className="text-base font-bold">Ta bort kontot</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kontot, din profil och din betalningskoppling tas bort permanent. Det går inte
                    att ångra. Har du en aktiv prenumeration bör du avsluta den under Premium &
                    betalning först, så att den inte förnyas.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="block text-xs font-semibold">
                  Skriv <span className="font-black">{CONFIRM_WORD}</span> för att bekräfta
                </label>
                <Input
                  id="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="off"
                  placeholder={CONFIRM_WORD}
                  className="focus-visible:border-destructive focus-visible:ring-destructive/25"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
                  {error}
                </p>
              )}

              <Button
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={busy || confirm.trim().toUpperCase() !== CONFIRM_WORD}
                className="h-12 w-full rounded-xl font-bold"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Ta bort mitt konto permanent
              </Button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function ResultStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-background p-2 text-center">
      <AutoFitText maxSize={18} minSize={12} className="h-6 font-black leading-6">{value}</AutoFitText>
      <AutoFitText maxSize={10} minSize={8} className="h-4 uppercase leading-4 text-muted-foreground">{label}</AutoFitText>
    </div>
  );
}
