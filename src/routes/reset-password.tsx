import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage } from "@/lib/auth-errors";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nytt lösenord – Aurateori" },
      {
        name: "description",
        content: "Välj ett nytt lösenord för ditt Aurateori-konto och fortsätt plugga teori.",
      },
      { property: "og:title", content: "Nytt lösenord – Aurateori" },
      { property: "og:description", content: "Välj ett nytt lösenord för ditt Aurateori-konto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Lösenorden matchar inte.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => void navigate({ to: "/" }), 1500);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-5">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black sm:text-3xl">
            <KeyRound className="h-6 w-6 text-primary" />
            Nytt lösenord
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Välj ett nytt lösenord för ditt konto.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          {done ? (
            <p className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm font-semibold">
              Lösenordet är uppdaterat. Skickar dig vidare…
            </p>
          ) : (
            <>
              {!ready && (
                <p className="mb-4 rounded-xl border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                  Öppna den här sidan via länken i återställningsmejlet. Saknar du länken kan du
                  begära en ny på inloggningssidan.
                </p>
              )}
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Nytt lösenord
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Upprepa lösenord
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy || !ready}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Spara nytt lösenord
                </button>
              </form>
            </>
          )}

          {error && (
            <p className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
              {error}
            </p>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/auth" className="text-primary hover:underline">
              Tillbaka till inloggning
            </Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
