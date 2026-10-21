import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { BillingStatus } from "@/components/BillingStatus";

import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePlayBilling } from "@/hooks/usePlayBilling";
import { PlayBillingPlans } from "@/components/PlayBillingPlans";

export const Route = createFileRoute("/priser")({
  head: () => ({
    meta: [
      { title: "Priser – Aurateori Premium" },
      {
        name: "description",
        content:
          "Lås upp alla teorifrågor, interaktiva genomgångar, provsimulator och statistik. 249 kr/mån, 599 kr för 3 månader eller 1 999 kr för 12 månader.",
      },
      { property: "og:title", content: "Priser – Aurateori Premium" },
      {
        property: "og:description",
        content: "Premium för svenskt B-körkort: 249 kr/mån, 599 kr för 3 månader eller 1 999 kr för 12 månader.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const FEATURES = [
  "Alla teorifrågor i frågebanken",
  "Provsimulator: 70 frågor, 65 poänggrundande, 50 minuter",
  "Upp till 3 fullständiga prov per dag",
  "Förklaringar och referenser till Premium-frågorna",
];

const PLANS = [
  { priceId: "premium_monthly", name: "1 månad", price: "249 kr", per: "/mån", sub: "Per månad", save: null, badge: null, highlight: false, cta: "Välj månadsplan", note: "Dras varje månad – avsluta när du vill" },
  { priceId: "premium_quarterly", name: "3 månader", price: "599 kr", per: "", sub: "≈ 200 kr/mån", save: "Spara 148 kr", badge: "Mest populär", highlight: true, cta: "Välj 3 månader", note: "599 kr dras var tredje månad – ingen månadsdebitering" },
  { priceId: "premium_yearly", name: "12 månader", price: "1 999 kr", per: "", sub: "≈ 167 kr/mån", save: "Spara 989 kr", badge: "Bäst värde", highlight: false, cta: "Välj årsplan", note: "1 999 kr dras en gång per år" },
] as const;

function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const { openCheckout, loading, error } = usePaddleCheckout();
  const play = usePlayBilling();

  const buy = (priceId: string) => {
    if (!user) {
      void navigate({ to: "/auth", search: { next: "/priser" } as never });
      return;
    }
    void openCheckout({
      priceId,
      customerEmail: user.email ?? undefined,
      customData: { userId: user.id },
      successUrl: `${window.location.origin}/checkout/success`,
    });
  };

  if (play.android) return <AppShell><PlayBillingPlans /></AppShell>;

  return (
    <AppShell>
      <PaymentTestModeBanner />
      <div className="space-y-7">
        <header className="relative border-b border-border py-6 text-center sm:py-8">
          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-premium">
              <Sparkles className="h-4 w-4" /> Premium
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Aurateori Premium</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Lär dig snabbare. Öva smartare. Ta körkortet.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-premium" /> Direkt tillgång</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-premium" /> Säker betalning</span>
              <span className="inline-flex items-center gap-1.5"><Crown className="h-4 w-4 text-premium" /> Allt innehåll</span>
            </div>
          </div>
        </header>

        {user && <SubscriptionCountdown />}

        {isActive && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm font-semibold">
            <Crown className="h-4 w-4 text-primary" />
            Du har redan premium – tack!
          </div>
        )}

        <BillingStatus />

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.priceId}
              className={cn(
                "relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card p-5 shadow-soft sm:p-6",
                p.highlight ? "aura-surface border-premium/70 ring-1 ring-premium/40 shadow-lifted" : "border-border",
              )}
            >
              {p.badge && (
                <div className={cn("mb-3 inline-flex self-start rounded-md px-3 py-1 text-[10px] font-bold uppercase leading-none", p.highlight ? "bg-premium text-premium-foreground" : "border border-premium/60 text-premium")}>
                  {p.badge}
                </div>
              )}
              <div className="min-h-5 break-words text-sm font-bold">{p.name}</div>
               <div className="mt-3">
                  <span className="font-display text-4xl font-extrabold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.per}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold">
                <span>{p.sub}</span>
                {p.save && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{p.save}</span>}
              </div>
              <div className="mt-2 mb-4 min-h-8 break-words text-xs leading-4 text-muted-foreground">{p.note}</div>
              <Button
                variant={p.highlight ? "premium" : "default"}
                onClick={() => buy(p.priceId)}
                disabled={loading}
                className="mt-auto w-full"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {user ? p.cta : "Logga in och prenumerera"}
              </Button>
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
            {error}
          </p>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          {[
            "Direkt tillgång – ingen ångerrätt på digital tjänst",
            "Löpande abonnemang – betalningen dras automatiskt varje period",
            "Avsluta prenumerationen när du vill, den gäller till periodens slut",
            "Säker betalning – Paddle är säljare (Merchant of Record)",
          ].map((t) => (
            <div
              key={t}
                className="flex min-h-16 min-w-0 items-start gap-2 overflow-hidden border-t border-border bg-background/55 p-3 text-xs leading-4 first:border-t-0 sm:rounded-lg sm:border"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {t}
            </div>
          ))}
        </div>

        <section className="border-y border-border py-6">
          <h2 className="font-display text-lg font-bold">Gratis eller Premium?</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div><h3 className="text-sm font-semibold">Gratis</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{["10 gratisfrågor totalt med förklaringar", "Vägmärken och snabbplugg", "Genomgångar och repetition", "Din träningsstatistik"].map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{feature}</li>)}</ul></div>
            <div><h3 className="flex items-center gap-2 text-sm font-semibold"><Crown className="h-4 w-4 text-premium" />Premium</h3><p className="mt-3 text-sm text-muted-foreground">Allt i Gratis, plus hela frågebanken och fullständiga teoriprov.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Hantera betalning och avsluta förnyelsen under Premium & betalning. Tillgången gäller till periodens slut.</p></div>
          </div>
        </section>

        <div className="pb-5">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Detta ingår
          </div>
          <ul className="space-y-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
