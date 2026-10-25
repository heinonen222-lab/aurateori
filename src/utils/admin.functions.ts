import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: { rpc: (fn: "has_role", args: { _user_id: string; _role: "admin" }) => PromiseLike<{ data: boolean | null; error: unknown }> }; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Behörighet saknas");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export type AdminUser = {
  id: string;
  email: string | null;
  createdAt: string;
  plan: "free" | "paddle" | "play" | "manual";
  premiumUntil: string | null;
  manualUntil: string | null;
};

const ACTIVE = ["active", "trialing", "past_due"];

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    const db = await assertAdmin(context as unknown as Ctx);
    const [{ data: profiles, error }, { data: subs }, { data: play }] = await Promise.all([
      db.from("profiles").select("id,email,created_at").order("created_at", { ascending: false }).limit(1000),
      db.from("subscriptions").select("user_id,status,current_period_end,paddle_subscription_id"),
      db.from("google_play_subscriptions").select("user_id,status,current_period_end"),
    ]);
    if (error) throw new Error("Kunde inte hämta elever.");
    const now = new Date().toISOString();
    return (profiles ?? []).map((p) => {
      let plan: AdminUser["plan"] = "free";
      let premiumUntil: string | null = null;
      let manualUntil: string | null = null;
      for (const s of subs ?? []) {
        if (s.user_id !== p.id) continue;
        const end = s.current_period_end;
        const valid = (ACTIVE.includes(s.status) || (s.status === "canceled" && !!end)) && (!end || end > now);
        if (!valid) continue;
        const manual = s.paddle_subscription_id.startsWith("manual_");
        if (manual) manualUntil = end;
        if (plan === "free" || plan === "manual") plan = manual ? "manual" : "paddle";
        if (!premiumUntil || (end && end > premiumUntil)) premiumUntil = end;
      }
      for (const g of play ?? []) {
        if (g.user_id === p.id && g.current_period_end > now && g.status !== "expired") {
          if (plan === "free") plan = "play";
          if (!premiumUntil || g.current_period_end > premiumUntil) premiumUntil = g.current_period_end;
        }
      }
      return { id: p.id, email: p.email, createdAt: p.created_at, plan, premiumUntil, manualUntil };
    });
  });

export const adminSetManualPremium = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      userId: z.string().uuid(),
      environment: z.enum(["sandbox", "live"]),
      until: z.string().datetime().nullable(), // null = återkalla
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context as unknown as Ctx);
    const subId = `manual_${data.userId}_${data.environment}`;
    if (data.until === null) {
      const { error } = await db.from("subscriptions").update({ status: "canceled", current_period_end: new Date().toISOString() }).eq("paddle_subscription_id", subId);
      if (error) throw new Error("Kunde inte återkalla Premium.");
      return { ok: true };
    }
    if (new Date(data.until).getTime() <= Date.now()) throw new Error("Slutdatum måste ligga i framtiden.");
    const { error } = await db.from("subscriptions").upsert(
      {
        user_id: data.userId,
        paddle_subscription_id: subId,
        paddle_customer_id: "manual",
        product_id: "premium_manual",
        price_id: "manual",
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: data.until,
        cancel_at_period_end: true,
        environment: data.environment,
      },
      { onConflict: "paddle_subscription_id" },
    );
    if (error) throw new Error("Kunde inte spara Premium.");
    return { ok: true };
  });

export type AdminDeletion = { id: string; userId: string; email: string | null; requestedAt: string; deleteAfter: string };

export const adminListDeletions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminDeletion[]> => {
    const db = await assertAdmin(context as unknown as Ctx);
    const { data, error } = await db.from("deletion_requests").select("*").order("delete_after", { ascending: true });
    if (error) throw new Error("Kunde inte hämta raderingskön.");
    return (data ?? []).map((r) => ({ id: r.id, userId: r.user_id, email: r.email, requestedAt: r.requested_at, deleteAfter: r.delete_after }));
  });

export const adminCancelDeletion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context as unknown as Ctx);
    const { error } = await db.from("deletion_requests").delete().eq("id", data.id);
    if (error) throw new Error("Kunde inte avbryta begäran.");
    return { ok: true };
  });

export const adminDeleteNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await assertAdmin(context as unknown as Ctx);
    const { data: req, error } = await db.from("deletion_requests").select("user_id").eq("id", data.id).maybeSingle();
    if (error || !req) throw new Error("Begäran finns inte längre.");
    const uid = req.user_id;
    if (uid === context.userId) throw new Error("Du kan inte radera ditt eget adminkonto här.");
    await db.from("google_play_subscriptions").delete().eq("user_id", uid);
    await db.from("subscriptions").delete().eq("user_id", uid);
    await db.from("lesson_progress").delete().eq("user_id", uid);
    await db.from("profiles").delete().eq("id", uid);
    const { error: authErr } = await db.auth.admin.deleteUser(uid);
    if (authErr && !/not found/i.test(authErr.message)) throw new Error("Kontot kunde inte raderas.");
    await db.from("deletion_requests").delete().eq("id", data.id);
    return { ok: true };
  });
