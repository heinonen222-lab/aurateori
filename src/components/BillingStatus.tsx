import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, Loader2, RefreshCw } from "lucide-react";
import { getBillingStatus } from "@/utils/billing.functions";
import { getPaddleEnvironment } from "@/lib/paddle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

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
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Betalningsstatus</h2>
          <p className="text-xs text-muted-foreground">
            {environment === "live" ? "Skarpa betalningar" : "Testläge (sandbox)"} · direkt från
            Paddle
          </p>
        </div>
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="flex items-center gap-1.5 rounded-xl border border-border px-2.5 py-1.5 text-xs font-semibold transition hover:bg-secondary"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", query.isFetching && "animate-spin")} />
          Uppdatera
        </button>
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
              <div key={sub.id} className={cn("rounded-2xl border p-4", tone)}>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Icon className="h-4 w-4" />
                  {STATUS_LABEL[sub.status] ?? sub.status}
                  {sub.isExpired && !sub.isPastDue && " · perioden har gått ut"}
                </div>
                <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                  <Row label="Plan" value={sub.priceId} />
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
                      <a
                        href={sub.updatePaymentMethodUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:border-primary/60"
                      >
                        Uppdatera betalkort
                      </a>
                    )}
                    {sub.cancelUrl && !sub.cancelAtPeriodEnd && (
                      <a
                        href={sub.cancelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:border-destructive/60"
                      >
                        Avsluta prenumeration
                      </a>
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
                <CreditCard className="h-3.5 w-3.5" />
                Transaktioner
              </div>
              <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
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
    <div className="rounded-2xl border border-border bg-secondary/40 p-3 text-center">
      <div className="text-xl font-black">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span>{label}</span>
      <span className="truncate font-semibold text-foreground">{value}</span>
    </div>
  );
}
