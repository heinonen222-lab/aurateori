import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPaddleEnvironment } from "@/lib/paddle";
import { useAuth } from "@/hooks/useAuth";

const ACTIVE = ["active", "trialing", "past_due"];

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const environment = getPaddleEnvironment();

  const query = useQuery({
    queryKey: ["subscription", userId, environment],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId!)
        .eq("environment", environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("subscriptions-changes")
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
