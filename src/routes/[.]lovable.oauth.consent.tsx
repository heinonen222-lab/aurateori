import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

type OAuthResult = { data: any; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({ meta: [{ title: "Koppla app – Aurateori" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s["authorization_id"] === "string" ? s["authorization_id"] : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Länken saknar auktoriserings-ID.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth", search: { next: location.pathname + location.searchStr } as never });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(id);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <AppShell><div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
      <h1 className="font-display text-xl font-bold">Kopplingen kunde inte laddas</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
    </div></AppShell>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = details?.client?.name ?? "En app";
  const scopes: string[] = String(details?.scope ?? "").split(" ").filter(Boolean);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve ? await oauth().approveAuthorization(authorization_id) : await oauth().denyAuthorization(authorization_id);
    const target = data?.redirect_url ?? data?.redirect_to;
    if (error || !target) { setBusy(false); setError(error?.message ?? "Inget svar från inloggningsservern."); return; }
    window.location.href = target;
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-4 rounded-lg border border-border bg-card p-6">
        <h1 className="font-display text-xl font-bold">Koppla {name} till Aurateori</h1>
        <p className="text-sm text-muted-foreground">{name} kommer att kunna använda Aurateoris verktyg som dig: läsa din Premium-status och hämta övningsfrågor.</p>
        {details?.client?.redirect_uri && <p className="text-xs text-muted-foreground break-all">Skickas till: {details.client.redirect_uri}</p>}
        {scopes.length > 0 && (
          <ul className="list-disc pl-5 text-sm">
            {scopes.map((s) => <li key={s}>{s === "email" ? "Dela din e-postadress" : s === "profile" ? "Dela din grundprofil" : s === "openid" ? "Bekräfta vem du är" : `Ytterligare behörighet: ${s}`}</li>)}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">Detta kringgår inte appens behörigheter.</p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button disabled={busy} onClick={() => decide(true)}>Godkänn</Button>
          <Button variant="outline" disabled={busy} onClick={() => decide(false)}>Avbryt koppling</Button>
        </div>
      </div>
    </AppShell>
  );
}
