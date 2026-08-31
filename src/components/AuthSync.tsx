import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const NEXT_KEY = "aurateori:next";

function safePath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

/**
 * Single source of session reactivity: keeps router + query cache in sync and
 * finishes the OAuth round-trip by sending the user to the page they wanted.
 */
export function AuthSync() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;

      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();

      if (event === "SIGNED_IN" && session && typeof window !== "undefined") {
        const next = safePath(sessionStorage.getItem(NEXT_KEY));
        sessionStorage.removeItem(NEXT_KEY);
        const path = window.location.pathname;
        if (next && next !== path) {
          void router.navigate({ to: next as never, replace: true });
        } else if (path === "/auth") {
          void router.navigate({ to: "/", replace: true });
        }
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return null;
}
