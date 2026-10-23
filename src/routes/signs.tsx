import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ROAD_SIGNS, type RoadSign, type SignCategory } from "@/data/signs";
import { SignImage } from "@/components/SignImage";
import { cn } from "@/lib/utils";
import { AutoFitText } from "@/components/AutoFitText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/signs")({
  head: () => ({
    meta: [
      { title: "Vägmärkesarkiv – Aurateori" },
      {
        name: "description",
        content:
          "Sök och bläddra bland svenska vägmärken – varnings-, förbuds-, påbuds-, anvisnings- och informationsmärken.",
      },
      { property: "og:title", content: "Vägmärkesarkiv – Aurateori" },
      { property: "og:description", content: "Sök och bläddra bland svenska vägmärken." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignsPage,
});

const CATS: (SignCategory | "Alla")[] = [
  "Alla",
  "Varningsmärken",
  "Väjningspliktsmärken",
  "Förbudsmärken",
  "Påbudsmärken",
  "Anvisningsmärken",
  "Lokaliseringsmärken för vägvisning",
  "Lokaliseringsmärken för upplysning om allmänna inrättningar med mera",
];

function SignsPage() {
  const [cat, setCat] = useState<SignCategory | "Alla">("Alla");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<RoadSign | null>(null);

  const list = useMemo(() => {
    return ROAD_SIGNS.filter((s) => cat === "Alla" || s.category === cat).filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.meaning.toLowerCase().includes(q.toLowerCase()),
    );
  }, [cat, q]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Vägmärken</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ROAD_SIGNS.length} märken · tryck för detaljer och vanliga fallgropar.
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sök märke…"
            className="bg-card pl-9 pr-4"
            aria-label="Sök bland vägmärken"
          />
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-11 shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition-[background-color,border-color,color] focus-visible:ring-2 focus-visible:ring-ring",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
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
              className="group flex min-h-44 h-full min-w-0 flex-col items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 text-center shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ring hover:shadow-lifted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SignImage id={s.id} className="h-20 w-20 transition group-hover:scale-105" />
              <div className="w-full min-w-0">
                <AutoFitText maxSize={12} minSize={9} className="h-10 font-bold leading-5">{s.name}</AutoFitText>
                <AutoFitText maxSize={10} minSize={8} className="mt-1 h-8 uppercase leading-4 tracking-wider text-muted-foreground">{s.category}</AutoFitText>
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-lifted"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {sign.category}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Stäng">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid place-items-center bg-muted/50 px-6 py-8">
          <SignImage id={sign.id} className="h-40 w-40" />
        </div>
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-black">{sign.name}</h2>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Betydelse
            </div>
            <p className="mt-1 text-sm leading-relaxed">{sign.meaning}</p>
          </div>
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-warning-foreground">
              Vanlig fallgrop
            </div>
            <p className="mt-1 text-sm leading-relaxed">{sign.trap}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
