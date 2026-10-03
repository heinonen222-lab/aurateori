import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Crown, LogIn, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

export function AccountMenu({
  variant = "sidebar",
  onNavigate,
}: {
  variant?: "sidebar" | "sheet";
  onNavigate?: () => void;
}) {
  const { user, loading } = useAuth();
  const { isActive } = useSubscription();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    onNavigate?.();
    void navigate({ to: "/auth", replace: true });
  };

  const base = cn(
    "flex min-h-11 w-full items-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring",
    variant === "sidebar" ? "px-3 py-2 focus-visible:ring-sidebar-ring" : "justify-center border border-border py-3",
  );

  if (loading) return null;

  if (!user) {
    return (
      <Link
        to="/auth"
        onClick={onNavigate}
        className={cn(base, variant === "sidebar" ? "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <LogIn className="h-4 w-4" />
        Logga in
      </Link>
    );
  }

  return (
    <div className={cn("space-y-1", variant === "sheet" && "space-y-2")}>
      <div
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-xs text-sidebar-accent-foreground",
          variant === "sheet" && "justify-center",
        )}
      >
        <UserIcon className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 truncate font-semibold">{user.email}</span>
        {isActive && (
          <span className="shrink-0 rounded-md bg-premium px-2 py-0.5 text-[10px] font-bold uppercase text-premium-foreground">
            Premium
          </span>
        )}
      </div>
      <Link
        to="/konto"
        onClick={onNavigate}
        className={cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <UserIcon className="h-4 w-4" />
        Mitt konto
      </Link>
      <Link
        to="/admin"
        onClick={onNavigate}
        className={cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <ShieldCheck className="h-4 w-4" />
        Adminpanel
      </Link>
      <Link
        to="/priser"
        onClick={onNavigate}
        className={cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <Crown className="h-4 w-4" />
        Premium & betalning
      </Link>
      <button
        onClick={() => void signOut()}
        className={cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <LogOut className="h-4 w-4" />
        Logga ut
      </button>
    </div>
  );
}
