import type { LucideIcon } from "lucide-react";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AuraStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "default" | "success" | "danger";
  compact?: boolean;
  className?: string;
};

export function AuraState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  tone = "default",
  compact = false,
  className,
}: AuraStateProps) {
  return (
    <section
      className={cn(
        "aura-cockpit relative isolate overflow-hidden rounded-lg border p-6 text-center shadow-lifted sm:p-8",
        tone === "danger" ? "border-destructive/30" : "border-border",
        compact ? "min-h-52" : "min-h-72",
        className,
      )}
      aria-live={tone === "danger" ? "assertive" : "polite"}
    >
      <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center">
        <div
          className={cn(
            "relative mb-5 grid h-16 w-16 place-items-center rounded-lg border bg-background/65 shadow-soft backdrop-blur-xl",
            tone === "danger"
              ? "border-destructive/30 text-destructive"
              : tone === "success"
                ? "border-success/30 text-success"
                : "border-premium/30 text-premium",
          )}
        >
          <div className="absolute inset-2 rounded-full bg-current opacity-10 blur-md" aria-hidden="true" />
          <Icon className="relative h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
        {actionLabel && onAction && (
          <Button
            variant={tone === "danger" ? "outline" : "premium"}
            onClick={onAction}
            className={cn("mt-6", tone === "danger" && "border-destructive/35 text-destructive hover:bg-destructive/10")}
          >
            {tone === "danger" && <AlertTriangle aria-hidden="true" />}
            {actionLabel}
          </Button>
        )}
      </div>
    </section>
  );
}

export function AuraLoading({ label = "Laddar innehåll…", compact = false }: { label?: string; compact?: boolean }) {
  return (
    <section
      className={cn(
        "aura-cockpit relative overflow-hidden rounded-lg border border-border p-6 shadow-lifted",
        compact ? "min-h-40" : "min-h-72",
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
      <div className="mx-auto flex h-full max-w-lg flex-col justify-center gap-5" aria-hidden="true">
        <div className="flex items-center gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-premium/20 bg-background/50 text-premium">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded-md bg-foreground/10" />
            <div className="h-2.5 w-20 animate-pulse rounded-md bg-foreground/5" />
          </div>
        </div>
        <div className="h-20 animate-pulse rounded-lg border border-border bg-background/30" />
        <div className="space-y-2">
          <div className="h-2.5 w-full animate-pulse rounded-md bg-foreground/10" />
          <div className="h-2.5 w-4/5 animate-pulse rounded-md bg-foreground/5" />
        </div>
      </div>
    </section>
  );
}