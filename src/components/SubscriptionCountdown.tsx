import { Link } from "@tanstack/react-router";
import { CalendarClock, Crown, AlertTriangle, ArrowRight } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

const PLAN_LABEL: Record<string, string> = {
  premium_monthly: "Premium Månad",
  premium_yearly: "Premium År",
};

const PLAN_CYCLE: Record<string, string> = {
  premium_monthly: "149 kr dras varje månad",
  premium_yearly: "499 kr dras varje år",
};

const DAY_MS = 86_400_000;

function fmtDate(value: string | null | undefined) {
  if (!value) return null;
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value),
  );
}

export function useSubscriptionCountdown() {
  const { subscription, isActive, isPastDue } = useSubscription();
  const end = subscription?.current_period_end ?? null;
  const daysLeft =
    end !== null ? Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / DAY_MS)) : null;
  return {
    subscription,
    isActive,
    isPastDue,
    daysLeft,
    renewsAt: fmtDate(end),
    planLabel: subscription ? (PLAN_LABEL[subscription.price_id] ?? subscription.price_id) : null,
    planCycle: subscription ? (PLAN_CYCLE[subscription.price_id] ?? "Löpande abonnemang") : null,
    cancelAtPeriodEnd: Boolean(subscription?.cancel_at_period_end),
  };
}

/** Visar hur många dagar som återstår av abonnemanget och när nästa betalning sker. Syns alltid, även utan abonnemang. */
export function SubscriptionCountdown({ compact = false }: { compact?: boolean }) {
  const {
    isActive,
    isPastDue,
    daysLeft,
    renewsAt,
    planLabel,
    planCycle,
    cancelAtPeriodEnd,
  } = useSubscriptionCountdown();

  if (!isActive) {
    return (
      <Link
        to="/priser"
        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-soft transition-colors hover:border-premium/50"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-premium/15">
          <Crown className="h-5 w-5 text-premium" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-bold">Inget aktivt abonnemang</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Starta månadsabonnemanget för 149 kr/mån och lås upp allt innehåll.
          </div>
        </div>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  const headline = isPastDue
    ? "Betalningen misslyckades"
    : cancelAtPeriodEnd
      ? "Abonnemanget avslutas"
      : planLabel;

  const detail = isPastDue
    ? "Uppdatera ditt betalkort så att du inte tappar tillgången."
    : cancelAtPeriodEnd
      ? `Tillgången gäller till ${renewsAt ?? "periodens slut"}.`
      : `${planCycle}${renewsAt ? ` · nästa betalning ${renewsAt}` : ""}`;

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-4 shadow-soft",
        isPastDue ? "border-destructive/50 bg-destructive/10" : "border-premium/40 bg-premium/10",
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-background/70">
        {isPastDue ? (
          <AlertTriangle className="h-5 w-5 text-destructive" />
        ) : (
          <CalendarClock className="h-5 w-5 text-premium" />
        )}
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-bold">{headline}</div>
        <div className="mt-0.5 break-words text-xs leading-4 text-muted-foreground">{detail}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-display text-2xl font-extrabold leading-none">{daysLeft ?? "–"}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {daysLeft === 1 ? "dag kvar" : "dagar kvar"}
        </div>
      </div>
    </div>
  );
}
