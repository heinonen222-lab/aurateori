import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Crown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/priser")({
  head: () => ({
    meta: [
      { title: "Priser – Aurateori Premium" },
      {
        name: "description",
        content:
          "Lås upp alla teorifrågor, interaktiva genomgångar, provsimulator och statistik. 39 kr/mån, 249 kr/år eller 149 kr engångsköp.",
      },
      { property: "og:title", content: "Priser – Aurateori Premium" },
      {
        property: "og:description",
        content: "Premium för svenskt B-körkort: 39 kr/mån, 249 kr/år eller 149 kr engång.",
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
    price: "39 kr",
    per: "/mån",
    note: "Avsluta när du vill",
    highlight: false,
  },
  {
    priceId: "premium_yearly",
    name: "Premium År",
    price: "249 kr",
    per: "/år",
    note: "≈ 21 kr/mån – spara ca 47 %",
    highlight: true,
  },
  {
    priceId: "lifetime_once",
    name: "Livstid",
    price: "149 kr",
    per: " engång",
    note: "Full åtkomst för alltid",
    highlight: false,
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
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black sm:text-3xl">Aurateori Premium</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Full tillgång till hela frågebanken, provsimulatorn och alla interaktiva genomgångar mot
            gällande svenska trafikregler.
          </p>
        </div>

        {isActive && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm font-semibold">
            <Crown className="h-4 w-4 text-primary" />
            Du har redan premium – tack!
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.priceId}
              className={cn(
                "flex flex-col rounded-3xl border bg-card p-5 shadow-sm",
                p.highlight ? "border-primary ring-1 ring-primary" : "border-border",
              )}
            >
              {p.highlight && (
                <div className="mb-2 self-start rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Bäst värde
                </div>
              )}
              <div className="text-sm font-bold">{p.name}</div>
              <div className="mt-2">
                <span className="text-3xl font-black">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.per}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{p.note}</div>
              <button
                onClick={() => buy(p.priceId)}
                disabled={loading}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {user ? "Köp" : "Logga in och köp"}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
            {error}
          </p>
        )}

        <div className="rounded-3xl border border-border bg-secondary/40 p-5">
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
