import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ROAD_SIGNS, type RoadSign, type SignCategory } from "@/data/signs";
import { SignImage } from "@/components/SignImage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signs")({
  head: () => ({
    meta: [
      { title: "Vägmärkesarkiv – Aurateori" },
      { name: "description", content: "Sök och bläddra bland svenska vägmärken – varnings-, förbuds-, påbuds-, anvisnings- och informationsmärken." },
      { property: "og:title", content: "Vägmärkesarkiv – Aurateori" },
      { property: "og:description", content: "Sök och bläddra bland svenska vägmärken." },
    ],
  }),
  component: SignsPage,
});

const CATS: (SignCategory | "Alla")[] = [
  "Alla",
  "Varningsmärken",
  "Förbudsmärken",
  "Påbudsmärken",
  "Anvisningsmärken",
  "Information",
];

function SignsPage() {
  const [cat, setCat] = useState<(SignCategory | "Alla")>("Alla");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<RoadSign | null>(null);

  const list = useMemo(() => {
    return ROAD_SIGNS.filter((s) => cat === "Alla" || s.category === cat).filter(
      (s) => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.meaning.toLowerCase().includes(q.toLowerCase()),
    );
  }, [cat, q]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Vägmärken</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ROAD_SIGNS.length} märken · tryck för detaljer och vanliga fallgropar.
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sök märke…"
            className="w-full rounded-xl border border-border bg-card py-3 pl-9 pr-4 text-sm outline-none transition focus:border-primary"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <SignImage id={s.id} className="h-20 w-20 transition group-hover:scale-105" />
              <div>
                <div className="text-xs font-bold leading-tight">{s.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{s.category}</div>
              </div>
            </button>
          ))}
          {list.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
              Inga märken matchade sökningen.
            </div>
          )}
        </div>
      </div>

      {active && <SignModal sign={active} onClose={() => setActive(null)} />}
    </AppShell>
  );
}

function SignModal({ sign, onClose }: { sign: RoadSign; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {sign.category}
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid place-items-center bg-muted/50 px-6 py-8">
          <SignImage id={sign.id} className="h-40 w-40" />
        </div>
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-black">{sign.name}</h2>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Betydelse</div>
            <p className="mt-1 text-sm leading-relaxed">{sign.meaning}</p>
          </div>
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-warning-foreground">Vanlig fallgrop</div>
            <p className="mt-1 text-sm leading-relaxed">{sign.trap}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
