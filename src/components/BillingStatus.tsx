import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, Loader2, Receipt, RefreshCw } from "lucide-react";
import { getBillingStatus } from "@/utils/billing.functions";
import { getPaddleEnvironment } from "@/lib/paddle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const dateFmt = new Intl.DateTimeFormat("sv-SE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function fmtDate(value: string | null) {
  if (!value) return "–";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "–" : dateFmt.format(d);
}

const PLAN_LABEL: Record<string, string> = {
  premium_monthly: "Premium Månad",
  premium_yearly: "Premium År",
};

const PLAN_CYCLE: Record<string, string> = {
  premium_monthly: "149 kr dras varje månad",
  premium_yearly: "499 kr dras varje år",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Aktiv",
  trialing: "Provperiod",
  past_due: "Förfallen betalning",
  paused: "Pausad",
  canceled: "Avslutad",
  completed: "Genomförd",
  billed: "Fakturerad",
  ready: "Väntar",
  draft: "Utkast",
  paid: "Betald",
};

export function BillingStatus() {
  const { user } = useAuth();
  const environment = getPaddleEnvironment();
  const fetchStatus = useServerFn(getBillingStatus);

  const query = useQuery({
    queryKey: ["billing-status", user?.id, environment],
    enabled: Boolean(user?.id),
    refetchInterval: 60_000,
    queryFn: () => fetchStatus({ data: { environment } }),
  });

  if (!user) return null;

  const data = query.data;

  return (
    <section className="aura-surface overflow-hidden rounded-lg border border-border p-5 shadow-soft">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <div className="mb-1 inline-flex items-center gap-2 text-[10px] font-bold uppercase text-premium"><CreditCard className="h-3.5 w-3.5" /> Ditt abonnemang</div>
          <h2 className="font-display text-lg font-bold">Betalningsstatus</h2>
          <p className="text-xs text-muted-foreground">
            {environment === "live" ? "Skarpa betalningar" : "Testläge (sandbox)"} · direkt från
            Paddle
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => void query.refetch()}
          className="shrink-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", query.isFetching && "animate-spin")} />
          Uppdatera
        </Button>
      </div>

      {query.isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Hämtar status…
        </div>
      )}

      {query.isError && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs">
          Kunde inte hämta betalningsstatus just nu.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Aktiva prenumerationer" value={String(data.activeCount)} />
            <Stat label="Skarpa transaktioner" value={String(data.liveTransactionCount)} />
            <Stat
              label="Förfallna"
              value={String(data.subscriptions.filter((s) => s.isPastDue || s.isExpired).length)}
            />
          </div>

          {data.subscriptions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Inga prenumerationer registrerade på ditt konto ännu.
            </p>
          )}

          {data.subscriptions.map((sub) => {
            const tone = sub.isPastDue
              ? "border-destructive/50 bg-destructive/10"
              : sub.isExpired
                ? "border-border bg-secondary/40"
                : "border-primary/40 bg-primary/10";
            const Icon = sub.isPastDue ? AlertTriangle : sub.isExpired ? Clock : CheckCircle2;
            return (
              <div key={sub.id} className={cn("rounded-lg border p-4", tone)}>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Icon className="h-4 w-4" />
                  {STATUS_LABEL[sub.status] ?? sub.status}
                  {sub.isExpired && !sub.isPastDue && " · perioden har gått ut"}
                </div>
                <dl className="mt-3 grid gap-1.5 rounded-lg border border-border bg-background/50 p-3 text-xs text-muted-foreground sm:grid-cols-2">
                  <Row label="Plan" value={PLAN_LABEL[sub.priceId] ?? sub.priceId} />
                  <Row label="Betalning" value={PLAN_CYCLE[sub.priceId] ?? "Löpande abonnemang"} />
                  <Row label="Period slutar" value={fmtDate(sub.currentPeriodEnd)} />
                  <Row
                    label={sub.cancelAtPeriodEnd ? "Avslutas" : "Nästa debitering"}
                    value={fmtDate(sub.cancelAtPeriodEnd ? sub.currentPeriodEnd : sub.nextBilledAt)}
                  />
                  <Row label="Prenumerations-ID" value={sub.id} />
                </dl>
                {(sub.updatePaymentMethodUrl || sub.cancelUrl) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sub.updatePaymentMethodUrl && (
                      <Button asChild variant="outline" size="sm">
                        <a href={sub.updatePaymentMethodUrl} target="_blank" rel="noopener noreferrer">
                          Uppdatera betalkort
                        </a>
                      </Button>
                    )}
                    {sub.cancelUrl && !sub.cancelAtPeriodEnd && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-destructive/35 text-destructive hover:bg-destructive/10"
                      >
                        <a href={sub.cancelUrl} target="_blank" rel="noopener noreferrer">
                          Avsluta prenumeration
                        </a>
                      </Button>
                    )}
                  </div>
                )}
                {sub.isPastDue && (
                  <p className="mt-2 text-xs font-semibold">
                    Betalningen misslyckades. Paddle gör nya försök – uppdatera kortet via kvittot i
                    din e-post för att behålla åtkomsten.
                  </p>
                )}
                {sub.isExpired && !sub.isPastDue && (
                  <p className="mt-2 text-xs font-semibold">
                    Prenumerationen är förfallen. Välj en plan nedan för att aktivera premium igen.
                  </p>
                )}
              </div>
            );
          })}

          {data.transactions.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" />
                Fakturor
              </div>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {data.transactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 bg-background px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold">{t.total ?? "–"}</div>
                      <div className="truncate text-muted-foreground">
                        {fmtDate(t.billedAt ?? t.createdAt)} · {STATUS_LABEL[t.status] ?? t.status}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        t.isLive
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {t.isLive ? "Skarp" : "Test"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.paddleError && (
            <p className="text-xs text-muted-foreground">
              Vissa uppgifter kunde inte hämtas från Paddle just nu – visar senast kända status.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-background/55 p-2 text-center backdrop-blur sm:p-3">
      <div className="text-xl font-black">{value}</div>
      <div className="min-h-8 break-words text-[9px] font-semibold uppercase leading-4 tracking-wider text-muted-foreground sm:text-[10px]">
        {label}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-h-8 grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start gap-2 leading-4">
      <span className="break-words">{label}</span>
      <span className="min-w-0 break-all text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
