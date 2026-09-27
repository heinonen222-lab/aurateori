import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { BillingStatus } from "@/components/BillingStatus";
import { PriceComparison } from "@/components/PriceComparison";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionCountdown } from "@/components/SubscriptionCountdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/priser")({
  head: () => ({
    meta: [
      { title: "Priser – Aurateori Premium" },
      {
        name: "description",
        content:
          "Lås upp alla teorifrågor, interaktiva genomgångar, provsimulator och statistik. 149 kr per 30 dagar eller 499 kr per år.",
      },
      { property: "og:title", content: "Priser – Aurateori Premium" },
      {
        property: "og:description",
        content: "Premium för svenskt B-körkort: 149 kr per 30 dagar eller 499 kr per år.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const FEATURES = [
  "Alla teorifrågor i frågebanken",
  "Interaktiva genomgångar av alla nyckelkunskaper",
  "Provsimulator: 65 frågor, 50 minuter",
  "Vägmärkesarkiv med fällor och förklaringar",
  "Statistik och repetition av felsvar",
];

const PLANS = [
  {
    priceId: "premium_monthly",
    name: "Premium Månad",
    price: "149 kr",
    per: "/mån",
    note: "Förnyas automatiskt varje månad – avsluta när du vill",
    highlight: false,
    cta: "Starta månadsabonnemang",
  },
  {
    priceId: "premium_yearly",
    name: "Premium År",
    price: "499 kr",
    per: "/år",
    note: "Förnyas automatiskt varje år – ≈ 42 kr/mån, spara ca 72 %",
    highlight: true,
    cta: "Starta årsabonnemang",
  },
] as const;

function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const { openCheckout, loading, error } = usePaddleCheckout();

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

  return (
    <AppShell>
      <PaymentTestModeBanner />
      <div className="space-y-7">
        <header className="aura-surface relative overflow-hidden rounded-xl border border-border px-5 py-8 text-center shadow-lifted sm:px-8 sm:py-10">
          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-premium">
              <Sparkles className="h-4 w-4" /> Premium
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">All teori. Ett tydligt mål.</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Lås upp hela frågebanken, provsimulatorn, statistik och alla interaktiva 3D-genomgångar.
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

        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.priceId}
              className={cn(
                "relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card p-5 shadow-soft sm:p-6",
                p.highlight ? "aura-surface border-premium/70 ring-1 ring-premium/40 shadow-lifted" : "border-border",
              )}
            >
              {p.highlight && (
                <div className="mb-3 inline-flex self-start rounded-md bg-premium px-3 py-1 text-[10px] font-bold uppercase leading-none text-premium-foreground">
                  Bäst värde
                </div>
              )}
              <div className="min-h-5 break-words text-sm font-bold">{p.name}</div>
               <div className="mt-3">
                  <span className="font-display text-4xl font-extrabold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.per}</span>
              </div>
              <div className="mt-1 min-h-10 break-words text-xs leading-4 text-muted-foreground">{p.note}</div>
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

        <PriceComparison />

        <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
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
