import { Link } from "@tanstack/react-router";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePlayBilling } from "@/hooks/usePlayBilling";
import { PLAY_PACKAGE, PLAY_PLANS } from "@/lib/play-billing";
import { SubscriptionCountdown } from "./SubscriptionCountdown";

const labels = { premium_monthly: "1 månad", premium_quarterly: "3 månader", premium_yearly: "12 månader" };
export function PlayBillingPlans() {
  const { user } = useAuth();
  const billing = usePlayBilling();
  return <section className="space-y-5">
    <h1 className="font-display text-2xl font-bold">Premium via Google Play</h1>
    <SubscriptionCountdown />
    {!billing.available && <p className="text-sm text-muted-foreground">Köp är inte tillgängliga i denna appversion ännu.</p>}
    <div className="grid gap-4 sm:grid-cols-3">{PLAY_PLANS.map((plan) => {
      const product = billing.details.find((item) => item.itemId === plan);
      return <div key={plan} className="space-y-4 rounded-lg border border-border bg-card p-5">
        <h2 className="text-base font-bold">{labels[plan]}</h2>
        <p className="text-xl font-bold">{product ? new Intl.NumberFormat("sv-SE", { style: "currency", currency: product.price.currency }).format(Number(product.price.value)) : "Ej tillgängligt"}</p>
        {user ? <Button className="w-full" disabled={billing.loading || !product} onClick={() => void billing.buy(plan)}><ShoppingBag />Prenumerera</Button> : <Button asChild className="w-full"><Link to="/auth" search={{ next: "/priser" }}>Logga in</Link></Button>}
      </div>;
    })}</div>
    {billing.error && <p role="alert" className="text-sm text-destructive">{billing.error}</p>}
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" disabled={!user || billing.loading || !billing.available} onClick={() => void billing.restore()}><RefreshCw />Återställ köp</Button>
      <Button asChild variant="outline"><a href={`https://play.google.com/store/account/subscriptions?package=${PLAY_PACKAGE}`}>Hantera i Google Play</a></Button>
    </div>
    <p className="text-xs text-muted-foreground">Abonnemanget förnyas automatiskt. Pris och betalningsvillkor visas av Google Play före köp.</p>
  </section>;
}