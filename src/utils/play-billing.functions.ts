import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLAY_PLANS } from "@/lib/play-billing";

export const verifyPlayCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ purchaseToken: z.string().min(10).max(4096), productId: z.enum(PLAY_PLANS) }))
  .handler(async ({ data, context }) => {
    const { verifyPlayPurchase, tokenHash } = await import("@/lib/play-billing.server");
    const verified = await verifyPlayPurchase(data.purchaseToken, data.productId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Tokens are not transferable between Aurateori accounts, including plan replacements.
    for (const token of [data.purchaseToken, verified.purchase.linkedPurchaseToken].filter((v): v is string => Boolean(v))) {
      const { data: owner, error } = await supabaseAdmin.from("google_play_subscriptions").select("user_id").eq("purchase_token_hash", await tokenHash(token)).maybeSingle();
      if (error) throw new Error("Kunde inte kontrollera köpets konto.");
      if (owner && owner.user_id !== context.userId) throw new Error("Köpet är redan kopplat till ett annat Aurateori-konto.");
    }
    const { error } = await supabaseAdmin.rpc("save_google_play_purchase", {
      p_token_hash: await tokenHash(data.purchaseToken), p_token: data.purchaseToken, p_user_id: context.userId,
      p_product_id: verified.item.productId, p_plan_id: data.productId,
      p_status: verified.purchase.subscriptionState === "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" ? "past_due" : verified.purchase.subscriptionState === "SUBSCRIPTION_STATE_CANCELED" ? "canceled" : verified.allowed ? "active" : "expired",
      p_start: verified.purchase.startTime, p_end: verified.item.expiryTime,
      p_cancel: verified.purchase.subscriptionState === "SUBSCRIPTION_STATE_CANCELED",
    });
    if (error) throw new Error("Kunde inte spara köpet på kontot. Försök återställa köpet.");
    await verified.acknowledge();
    return { allowed: verified.allowed };
  });

export const getPlaySubscription = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("google_play_subscriptions").select("*").eq("user_id", context.userId).order("current_period_end", { ascending: false });
    if (error) throw new Error("Kunde inte hämta Google Play-abonnemanget.");
    const { verifyPlayPurchase } = await import("@/lib/play-billing.server");
    for (const row of rows ?? []) {
      // Refresh from Play before granting access; fail closed on stale verification.
      try {
        const verified = await verifyPlayPurchase(row.purchase_token);
        const status = verified.purchase.subscriptionState === "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" ? "past_due" : verified.purchase.subscriptionState === "SUBSCRIPTION_STATE_CANCELED" ? "canceled" : verified.allowed ? "active" : "expired";
        const { error: updateError } = await supabaseAdmin.from("google_play_subscriptions").update({ status, current_period_end: verified.item.expiryTime, cancel_at_period_end: status === "canceled", verified_at: new Date().toISOString() }).eq("purchase_token_hash", row.purchase_token_hash);
        if (updateError) throw new Error("Kunde inte uppdatera abonnemanget.");
        if (verified.allowed) return { price_id: row.plan_id, status, current_period_start: row.current_period_start, current_period_end: verified.item.expiryTime, cancel_at_period_end: status === "canceled", provider: "google_play" as const };
      } catch {
        // No cached Play access when Google's verification is unavailable.
      }
    }
    return null;
  });