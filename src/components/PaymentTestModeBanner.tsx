import { getPaddleEnvironment } from "@/lib/paddle";

export function PaymentTestModeBanner() {
  if (getPaddleEnvironment() !== "sandbox") return null;

  return (
    <div className="w-full border-b border-border bg-secondary px-4 py-2 text-center text-xs text-muted-foreground">
      Alla betalningar i förhandsvisningen sker i testläge.{" "}
      <a
        href="https://docs.lovable.dev/features/payments#test-and-live-environments"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline"
      >
        Läs mer
      </a>
    </div>
  );
}
