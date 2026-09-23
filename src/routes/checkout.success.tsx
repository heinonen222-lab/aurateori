import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Tack för ditt köp – Aurateori" },
      { name: "description", content: "Ditt köp är genomfört och premium aktiveras direkt." },
      { property: "og:title", content: "Tack för ditt köp – Aurateori" },
      { property: "og:description", content: "Premium är aktiverat i Aurateori." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { isActive, loading } = useSubscription({ pollUntilActive: true });


  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-center shadow-lifted">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h1 className="text-2xl font-black">Tack för ditt köp!</h1>
        <p className="text-sm text-muted-foreground">
          {isActive
            ? "Premium är aktiverat. Lycka till med teoriprovet!"
            : "Betalningen är mottagen. Ditt premium aktiveras inom några sekunder."}
        </p>
        {!isActive && loading && (
          <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
        )}
        <Button asChild><Link to="/">Till startsidan</Link></Button>
      </div>
    </AppShell>
  );
}
