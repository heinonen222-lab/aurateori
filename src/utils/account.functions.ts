import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DeleteAccountResult = { ok: true };

/**
 * Permanently deletes the signed-in user: app rows first, then the auth user.
 * Only ever operates on context.userId – never on an id supplied by the client.
 */
export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DeleteAccountResult> => {
    const userId = context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .delete()
      .eq("user_id", userId);
    if (subError) throw new Error(`Kunde inte ta bort prenumerationsdata: ${subError.message}`);

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (profileError) throw new Error(`Kunde inte ta bort profilen: ${profileError.message}`);

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw new Error(`Kunde inte ta bort kontot: ${authError.message}`);

    return { ok: true };
  });
