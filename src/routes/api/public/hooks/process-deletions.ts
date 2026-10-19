import { createFileRoute } from "@tanstack/react-router";

// Called daily by pg_cron. Authorized by a server-only token stored in the database
// (never exposed to browsers); deletes accounts whose 30-day grace period has passed.
export const Route = createFileRoute("/api/public/hooks/process-deletions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("x-cron-token") ?? "";
        if (token.length < 32 || token.length > 200) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: ok } = await supabaseAdmin.rpc("verify_cron_token", { _token: token });
        if (!ok) return new Response("Unauthorized", { status: 401 });

        const { data: due, error } = await supabaseAdmin
          .from("deletion_requests")
          .select("user_id")
          .lte("delete_after", new Date().toISOString())
          .limit(100);
        if (error) return new Response("Error", { status: 500 });

        let deleted = 0;
        for (const { user_id } of due ?? []) {
          await supabaseAdmin.from("subscriptions").delete().eq("user_id", user_id);
          await supabaseAdmin.from("lesson_progress").delete().eq("user_id", user_id);
          await supabaseAdmin.from("profiles").delete().eq("id", user_id);
          const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(user_id);
          if (!authErr || /not found/i.test(authErr.message)) {
            await supabaseAdmin.from("deletion_requests").delete().eq("user_id", user_id);
            deleted++;
          } else {
            console.error("deletion failed", user_id, authErr.message);
          }
        }
        return Response.json({ deleted });
      },
    },
  },
});
