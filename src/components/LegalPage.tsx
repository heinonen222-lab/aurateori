import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-black sm:text-3xl">{title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Senast uppdaterad {updated} · Aurateori
        </p>
      </header>
      <div className="space-y-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        {children}
      </div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
