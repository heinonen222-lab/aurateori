import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/useSubscription";
import { useSubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Tack för ditt köp – Aurateori" },
      { name: "description", content: "Ditt köp är genomfört och premium aktiveras direkt." },
      { property: "og:title", content: "Tack för ditt köp – Aurateori" },
      { property: "og:description", content: "Premium är aktiverat i Aurateori." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { isActive, loading } = useSubscription({ pollUntilActive: true });
  const { planLabel, renewsAt, planCycle } = useSubscriptionCountdown();

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <section className="aura-surface relative overflow-hidden rounded-xl border border-border p-6 text-center shadow-lifted sm:p-8">
          <div className="relative z-10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-success/30 bg-sidebar/75 text-success shadow-soft backdrop-blur-xl">
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold">Tack för ditt köp!</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isActive
                ? "Premium är aktiverat. Lycka till med teoriprovet!"
                : "Betalningen är mottagen. Ditt premium aktiveras inom några sekunder."}
            </p>
            {!isActive && loading && (
              <Loader2 className="mx-auto mt-4 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {isActive && (planLabel || renewsAt) && (
              <dl className="mt-5 grid gap-1.5 rounded-lg border border-border bg-background/60 p-3 text-left text-xs text-muted-foreground backdrop-blur">
                <Row label="Abonnemang" value={planLabel ?? "Premium"} />
                {planCycle && <Row label="Debitering" value={planCycle} />}
                {renewsAt && <Row label="Nästa betalning" value={renewsAt} />}
              </dl>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link to="/">Till startsidan</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/konto">Till Mitt konto</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-h-6 grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start gap-2 leading-4">
      <span className="break-words">{label}</span>
      <span className="min-w-0 break-words text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
