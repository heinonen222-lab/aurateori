import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_premium_status",
  title: "Premiumstatus",
  description:
    "Read the signed-in Aurateori user's subscription status: plan, state and current period end.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text" as const, text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "price_id, product_id, status, current_period_end, cancel_at_period_end, environment, updated_at",
      )
      .order("updated_at", { ascending: false });

    if (error) {
      return { content: [{ type: "text" as const, text: error.message }], isError: true };
    }

    const active = (data ?? []).find((row) => row.status === "active" || row.status === "trialing");
    return {
      content: [
        {
          type: "text" as const,
          text: active
            ? `Premium aktivt (pris ${active.price_id}, status ${active.status})` +
              (active.current_period_end ? `, gäller till ${active.current_period_end}` : "")
            : "Ingen aktiv prenumeration.",
        },
      ],
      structuredContent: { premium: Boolean(active), subscriptions: data ?? [] },
    };
  },
});
