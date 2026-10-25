import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="student-login-title" className="border-y border-border py-5">
      <h2 id="student-login-title" className="font-display text-xl font-bold">Elevinloggning</h2>
      <p className="mt-1 text-sm text-muted-foreground">Har du fått Premium av din lärare? Logga in med samma e-postadress. Inget köp behövs.</p>
      <form onSubmit={submit} className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="min-w-0 space-y-1.5">
          <label htmlFor="student-email" className="text-sm font-semibold">E-post</label>
          <Input id="student-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} />
        </div>
        <div className="min-w-0 space-y-1.5">
          <label htmlFor="student-password" className="text-sm font-semibold">Lösenord</label>
          <Input id="student-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} />
        </div>
        <Button type="submit" disabled={busy} className="min-h-11">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}Logga in</Button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <Button asChild variant="link" className="mt-2 h-auto min-h-11 px-0"><Link to="/auth">Skapa konto eller återställ lösenord</Link></Button>
    </section>
  );
}