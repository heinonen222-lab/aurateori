import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Apple, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { authErrorMessage } from "@/lib/auth-errors";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmsLogin } from "@/components/SmsLogin";
import { oauthReturnPath } from "@/lib/oauth-return-path";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Logga in – Aurateori" },
      {
        name: "description",
        content:
          "Logga in eller skapa konto i Aurateori för att spara din progress och låsa upp premium.",
      },
      { property: "og:title", content: "Logga in – Aurateori" },
      { property: "og:description", content: "Logga in för att spara progress och få premium." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const safePath = (value: string | null): string => oauthReturnPath(value);

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<"google" | "lovable" | "apple" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const next = safePath(
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null,
  );

  useEffect(() => {
    if (!loading && user) void navigate({ to: next });
  }, [loading, user, navigate, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "forgot") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setMessage("Vi har skickat en återställningslänk till din e-post.");
      } else if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${next}` },
        });
        if (err) throw err;
        if (data.session) {
          setMessage("Konto skapat – du är inloggad.");
        } else {
          setMessage(
            "Konto skapat. Bekräfta din e-post via länken vi skickade, sedan kan du logga in.",
          );
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "lovable" | "apple") => {
    setOauthBusy(provider);
    setError(null);
    setMessage(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aurateori:next", next);
    }
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      // useAuth confirms the session before the effect above navigates.
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setOauthBusy(null);
    }
  };

  const google = () => oauth("google");
  const lovableSignIn = () => oauth("lovable");

  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
            {mode === "signin" ? "Logga in" : mode === "signup" ? "Skapa konto" : "Glömt lösenord"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Fyll i din e-post – vi skickar en länk för att välja nytt lösenord."
              : "Logga in med samma e-postadress som din lärare gett Premium. Inget köp behövs för tilldelad Premium."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-lifted sm:p-6">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                E-post
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Lösenord
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={busy || oauthBusy !== null}
              className="w-full"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin"
                ? "Logga in"
                : mode === "signup"
                  ? "Skapa konto"
                  : "Skicka återställningslänk"}
            </Button>
          </form>

          {error && (
            <p role="alert" className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs">
              {error}
            </p>
          )}
          {message && (
            <p aria-live="polite" className="mt-3 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs">
              {message}
            </p>
          )}

          <div className="mt-4 space-y-2 text-center text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMessage(null);
                setMode(mode === "signup" ? "signin" : "signup");
              }}
              className="min-h-11 w-full rounded-lg px-2 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {mode === "signup"
                ? "Har du redan ett konto? Logga in"
                : "Har du inget konto? Skapa ett"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMessage(null);
                setMode(mode === "forgot" ? "signin" : "forgot");
              }}
              className="min-h-11 w-full rounded-lg px-2 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {mode === "forgot" ? "Tillbaka till inloggning" : "Glömt lösenordet?"}
            </button>
          </div>
          {mode !== "forgot" && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <SmsLogin />
              <Button variant="outline" onClick={() => oauth("apple")} disabled={busy || oauthBusy !== null} className="w-full">
                {oauthBusy === "apple" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Apple aria-hidden="true" className="h-4 w-4" />}
                {oauthBusy === "apple" ? "Ansluter till Apple…" : "Fortsätt med Apple"}
              </Button>
              <Button variant="outline" onClick={google} disabled={busy || oauthBusy !== null} className="w-full">Fortsätt med Google</Button>
              <Button variant="outline" onClick={lovableSignIn} disabled={busy || oauthBusy !== null} className="w-full">Fortsätt med Lovable</Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/priser" className="text-primary hover:underline">
            Se priser för premium
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
