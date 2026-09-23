import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Crown, GraduationCap, Loader2, LogOut, Mail, Play, Trash2, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { deleteAccount } from "@/utils/account.functions";
import { listLessonProgress } from "@/utils/lessons.functions";
import { LESSONS } from "@/data/lessons";
import { store } from "@/lib/store";

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
  const fetchLessonProgress = useServerFn(listLessonProgress);

  const { data: lessonProgress, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: () => fetchLessonProgress({}),
    enabled: Boolean(user),
  });

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
          <h1 className="text-2xl font-black sm:text-3xl">Mitt konto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Se dina kontouppgifter, hantera premium eller ta bort kontot permanent.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Laddar kontouppgifter…
          </div>
        ) : !user ? (
          <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Du är inte inloggad. Logga in för att hantera ditt konto.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Logga in
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <UserIcon className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> E-post
                  </div>
                  <div className="truncate text-sm font-semibold">{user.email}</div>
                </div>
                {isActive && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
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
                <button
                  onClick={() => void signOut()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logga ut
                </button>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-bold">Mina genomgångar</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dina sparade genomgångar. Fortsätt där du slutade.
                  </p>
                </div>
              </div>

              {lessonsLoading ? (
                <p className="text-sm text-muted-foreground">Laddar dina genomgångar…</p>
              ) : !lessonProgress || lessonProgress.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Du har inte börjat på någon genomgång än. De sparas automatiskt när du tittar.
                  </p>
                  <Link
                    to="/genomgangar"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
                  >
                    <Play className="h-4 w-4" />
                    Börja en genomgång
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {lessonProgress.map((row) => {
                    const lesson = LESSONS.find((l) => l.id === row.lesson_id);
                    if (!lesson) return null;
                    const total = row.total_steps || lesson.steps.filter((s) => s.kind === "info").length;
                    const step = Math.min(row.last_step + 1, total);
                    const percent = total ? Math.round((row.completed ? total : step) / total * 100) : 0;
                    return (
                      <li key={row.lesson_id}>
                        <Link
                          to="/genomgangar"
                          search={{ lesson: row.lesson_id }}
                          className="block min-w-0 rounded-2xl border border-border p-4 transition-colors hover:bg-muted"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="min-w-0 text-sm font-bold">{lesson.title}</span>
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold">
                              {row.completed ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Klar
                                </>
                              ) : (
                                <>Scen {step}/{total}</>
                              )}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                          </div>
                          <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                            Senast: {new Date(row.updated_at).toLocaleDateString("sv-SE")} · Fortsätt genomgången
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>


            <div className="space-y-4 rounded-3xl border border-destructive/40 bg-destructive/5 p-6">
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
                <input
                  id="confirm"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="off"
                  placeholder={CONFIRM_WORD}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-destructive"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
                  {error}
                </p>
              )}

              <button
                onClick={() => void handleDelete()}
                disabled={busy || confirm.trim().toUpperCase() !== CONFIRM_WORD}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-bold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Ta bort mitt konto permanent
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
