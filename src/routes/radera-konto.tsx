import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  cancelAccountDeletion,
  getDeletionRequest,
  requestAccountDeletion,
  type DeletionRequest,
} from "@/utils/deletion.functions";

export const Route = createFileRoute("/radera-konto")({
  head: () => ({
    meta: [
      { title: "Radera konto – Aurateori" },
      {
        name: "description",
        content:
          "Begär radering av ditt Aurateori-konto och all tillhörande data, – raderas automatiskt efter 30 dagar.",
      },
      { property: "og:title", content: "Radera konto – Aurateori" },
      {
        property: "og:description",
        content: "Så raderar du ditt konto och dina uppgifter i Aurateori.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeleteAccountPage,
});

function DeleteAccountPage() {
  const { user, loading } = useAuth();
  const getReq = useServerFn(getDeletionRequest);
  const requestFn = useServerFn(requestAccountDeletion);
  const cancelFn = useServerFn(cancelAccountDeletion);
  const [req, setReq] = useState<DeletionRequest>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void getReq().then(setReq).catch(() => {});
  }, [user, getReq]);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr(null);
    try {
      await fn();
    } catch {
      setErr("Något gick fel. Försök igen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <LegalPage title="Radera konto och data" updated="16 oktober 2026">
        <LegalSection title="1. Radera direkt i appen">
          <p>
            Vill du radera omedelbart gör du det under <Link to="/konto">Mitt konto</Link> →
            "Radera konto".
          </p>
        </LegalSection>

        <LegalSection title="2. Begär radering inom 30 dagar">
          <p>
            Skicka en begäran så raderas kontot och all tillhörande data automatiskt efter 30
            dagar. Fram till dess kan du ångra dig. Du loggar in för att bekräfta att kontot är
            ditt.
          </p>
          {loading ? null : !user ? (
            <Button asChild>
              <Link to="/auth" search={{ next: "/radera-konto" } as never}>
                Logga in för att begära radering
              </Link>
            </Button>
          ) : req ? (
            <div className="space-y-3 rounded-md border border-border bg-card p-4">
              <p className="font-medium">
                Begäran mottagen {fmt(req.requestedAt)}. Kontot raderas automatiskt{" "}
                {fmt(req.deleteAfter)}.
              </p>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await cancelFn();
                    setReq(null);
                  })
                }
              >
                Ångra begäran
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  setReq(await requestFn());
                })
              }
            >
              Begär radering av {user.email ?? "mitt konto"}
            </Button>
          )}
          {err && <p className="text-destructive">{err}</p>}
          <p>
            Kan du inte logga in? Mejla{" "}
            <a href="mailto:support@aurateori.se">support@aurateori.se</a> från adressen kopplad
            till kontot.
          </p>
        </LegalSection>


        <LegalSection title="3. Vad som raderas">
          <ul>
            <li>Konto och inloggningsuppgifter</li>
            <li>Profil, studiehistorik, provresultat, repetitionskö och sparade genomgångar</li>
            <li>Kopplingen mellan ditt konto och eventuellt abonnemang</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Vad som sparas">
          <p>
            Kvitton och uppgifter om köp sparas så länge bokföringslagen kräver (som regel sju år)
            hos vår återförsäljare Paddle. Tekniska loggar raderas automatiskt inom 90 dagar. Ett
            aktivt abonnemang avslutas i samband med raderingen.
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
