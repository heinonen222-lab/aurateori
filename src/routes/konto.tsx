import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, BarChart3, Crown, Loader2, LogOut, Mail, Trash2, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AutoFitText } from "@/components/AutoFitText";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { deleteAccount } from "@/utils/account.functions";
import { store, useStore, computeStats } from "@/lib/store";
import { trainingSummary } from "@/lib/practice";
import { Input } from "@/components/ui/input";
import { StudentLogin } from "@/components/StudentLogin";

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
function AccountPage() {
  const { user, loading } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const runDelete = useServerFn(deleteAccount);
  const state = useStore();
  const stats = computeStats(state);
  const summary = trainingSummary(state);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <p className="text-sm text-muted-foreground">
                Du är inte inloggad. Logga in för att hantera ditt konto.
              </p>
              <Button asChild className="mt-4">
                <Link to="/auth">Logga in</Link>
              </Button>
            </div>
            <StudentLogin />
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
                <Button asChild variant="outline">
                  <Link to="/priser">
                    <Crown className="h-4 w-4" />
                    Premium & betalning
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => void signOut()}>
                  <LogOut className="h-4 w-4" />
                  Logga ut
                </Button>
              </div>
            </div>

            <SubscriptionCountdown />

            <section className="space-y-4 border-y border-border py-5" aria-labelledby="training-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="training-heading" className="flex items-center gap-2 text-base font-bold"><BarChart3 className="h-5 w-5 text-primary" /> Min träning</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/stats">Alla resultat <ArrowRight className="h-4 w-4" /></Link></Button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <ResultStat value={`${stats.readiness}%`} label="Körkortsklarhet" />
                <ResultStat value={stats.total} label="Besvarade frågor" />
                <ResultStat value={`${stats.accuracy}%`} label="Rätt svar" />
                <ResultStat value={state.examAttempts.length} label="Genomförda prov" />
              </div>
              {stats.total === 0 && state.examAttempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Du har inte besvarat några frågor ännu.</p>
              ) : (
                <p className="text-sm text-muted-foreground">{stats.correct} av {stats.total} svar rätt · {state.wrongQueue.length} frågor att repetera{summary.latestExam ? ` · Senaste prov: ${summary.latestExam.correct}/${summary.latestExam.total}` : ""}</p>
              )}
              <Button asChild variant="outline"><Link to="/quiz">Fortsätt träna <ArrowRight className="h-4 w-4" /></Link></Button>
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
    <div className="min-w-0 text-center">
      <AutoFitText maxSize={18} minSize={12} className="h-6 font-black leading-6">{value}</AutoFitText>
      <AutoFitText maxSize={10} minSize={8} className="h-8 leading-4 text-muted-foreground">{label}</AutoFitText>
    </div>
  );
}
