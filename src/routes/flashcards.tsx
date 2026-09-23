import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ROAD_SIGNS } from "@/data/signs";
import { SignImage } from "@/components/SignImage";
import { seededShuffle } from "@/lib/shuffle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Snabbplugg – Aurateori" },
      {
        name: "description",
        content: "Interaktiva flashcards för snabb repetition av svenska vägmärken.",
      },
      { property: "og:title", content: "Snabbplugg – Aurateori" },
      { property: "og:description", content: "Interaktiva flashcards för svenska vägmärken." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Flashcards,
});

function Flashcards() {
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => seededShuffle(ROAD_SIGNS, seed), [seed]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[i];

  const go = (d: number) => {
    setFlipped(false);
    setI((v) => (v + d + deck.length) % deck.length);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Snabbplugg</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tryck på kortet för att vända. Kort {i + 1} av {deck.length}.
          </p>
        </div>

        <div className="[perspective:1200px]">
          <button
            onClick={() => setFlipped((f) => !f)}
            className="relative block h-80 w-full rounded-xl [transform-style:preserve-3d] transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-ring"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 shadow-lifted [backface-visibility:hidden]">
              <SignImage id={card.id} className="h-40 w-40" />
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vad betyder märket?
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <RotateCw className="h-3.5 w-3.5" /> Vänd
              </div>
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-primary/30 bg-primary p-6 text-primary-foreground shadow-lifted [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                {card.category}
              </div>
              <div className="text-xl font-black">{card.name}</div>
              <p className="text-center text-sm leading-relaxed opacity-90">{card.meaning}</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => go(-1)} aria-label="Föregående kort">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button onClick={() => setFlipped((f) => !f)} className="flex-1">
            Vänd kortet
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => go(1)} aria-label="Nästa kort">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setFlipped(false);
            setI(0);
            setSeed((n) => n + 1);
          }}
          className="w-full"
        >
          Blanda kortleken
        </Button>
      </div>
    </AppShell>
  );
}
