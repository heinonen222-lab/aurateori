// @refresh reset
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useServerFn } from "@tanstack/react-start";
import { getPlaySubscription } from "@/utils/play-billing.functions";

const ACTIVE = ["active", "trialing", "past_due"];

type SubRow = { status: string; current_period_end: string | null; created_at: string | null };

/**
 * A user may hold more than one subscription row (sandbox + live, or a manual
 * grant next to an old cancellation). Pick the row that actually grants access:
 * an active row wins, then a canceled row still inside its paid period, and
 * finally the most recent row. This mirrors the server-side entitlement check,
 * which also reads every row regardless of payment environment.
 */
export function pickSubscription<T extends SubRow>(rows: T[]): T | null {
  if (!rows.length) return null;
  const score = (r: T) => {
    const inPeriod = !r.current_period_end || new Date(r.current_period_end) > new Date();
    if (ACTIVE.includes(r.status) && inPeriod) return 2;
    if (r.status === "canceled" && inPeriod) return 1;
    return 0;
  };
  return [...rows].sort((a, b) => {
    const d = score(b) - score(a);
    if (d !== 0) return d;
    const endD = new Date(b.current_period_end ?? 0).getTime() - new Date(a.current_period_end ?? 0).getTime();
    if (endD !== 0) return endD;
    return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
  })[0];
}

export function useSubscription(options?: { pollUntilActive?: boolean }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchPlay = useServerFn(getPlaySubscription);
  const userId = user?.id;
  const pollUntilActive = options?.pollUntilActive ?? false;

  const query = useQuery({
    queryKey: ["subscription", userId],
    enabled: Boolean(userId),
    // Efter ett köp kan webhooken dröja några sekunder – poll:a tills raden finns.
    refetchInterval: pollUntilActive
      ? (q) => {
          const row = q.state.data as { status?: string } | null | undefined;
          const active = row ? ACTIVE.includes(row.status ?? "") : false;
          return active ? false : 2000;
        }
      : 5 * 60_000,
    queryFn: async () => {
      if (!userId) return null;
      const play = await fetchPlay({});
      if (play) return play;
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return pickSubscription(data ?? []);
    },
  });


  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`subscriptions-changes-${userId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${userId}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["subscription", userId, environment] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, environment, queryClient]);

  const sub = query.data;
  const periodOk = !sub?.current_period_end || new Date(sub.current_period_end) > new Date();
  const isActive = Boolean(
    sub &&
    ((ACTIVE.includes(sub.status) && periodOk) ||
      (sub.status === "canceled" && sub.current_period_end
        ? new Date(sub.current_period_end) > new Date()
        : false)),
  );

  return {
    subscription: sub ?? null,
    isActive,
    isPastDue: sub?.status === "past_due",
    loading: query.isLoading,
  };
}
