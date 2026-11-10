import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_premium_status",
  title: "Premium-status",
  description: "Visa den inloggade elevens Premium-status och när tillgången gäller till.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const db = supabaseForUser(ctx);
    const { data, error } = await db
      .from("subscriptions")
      .select("status, current_period_end, cancel_at_period_end")
      .order("current_period_end", { ascending: false })
      .limit(10);
    if (error) throw new ToolError("Kunde inte läsa prenumerationen.");
    const now = Date.now();
    const active = (data ?? []).find(
      (r) => ["active", "trialing", "past_due"].includes(r.status) &&
        (!r.current_period_end || new Date(r.current_period_end).getTime() > now),
    );
    const result = {
      premium: Boolean(active),
      status: active?.status ?? data?.[0]?.status ?? "none",
      validUntil: active?.current_period_end ?? null,
    };
    return {
      content: [{ type: "text", text: result.premium ? `Premium aktivt till ${result.validUntil ?? "tillsvidare"}.` : "Ingen aktiv Premium." }],
      structuredContent: result,
    };
  },
});
