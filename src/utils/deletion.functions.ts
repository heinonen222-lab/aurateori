import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DeletionRequest = { requestedAt: string; deleteAfter: string } | null;

/** Returns the signed-in user's pending deletion request, if any. */
export const getDeletionRequest = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DeletionRequest> => {
    const { data, error } = await context.supabase
      .from("deletion_requests")
      .select("requested_at, delete_after")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? { requestedAt: data.requested_at, deleteAfter: data.delete_after } : null;
  });

/** Schedules deletion of the signed-in account 30 days from now. Idempotent. */
export const requestAccountDeletion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DeletionRequest> => {
    const email = (context.claims as { email?: string }).email ?? null;
    const { data: existing } = await context.supabase
      .from("deletion_requests")
      .select("requested_at, delete_after")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (existing) return { requestedAt: existing.requested_at, deleteAfter: existing.delete_after };
    const { data, error } = await context.supabase
      .from("deletion_requests")
      .insert({ user_id: context.userId, email })
      .select("requested_at, delete_after")
      .single();
    if (error) throw new Error(`Kunde inte spara begäran: ${error.message}`);
    return { requestedAt: data.requested_at, deleteAfter: data.delete_after };
  });

/** Cancels the signed-in user's pending deletion request. */
export const cancelAccountDeletion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("deletion_requests")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
