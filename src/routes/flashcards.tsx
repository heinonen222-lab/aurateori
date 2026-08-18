import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ROAD_SIGNS } from "@/data/signs";
import { SignImage } from "@/components/SignImage";
import { seededShuffle } from "@/lib/shuffle";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Snabbplugg – Aurateori" },
      { name: "description", content: "Interaktiva flashcards för snabb repetition av svenska vägmärken." },
      { property: "og:title", content: "Snabbplugg – Aurateori" },
      { property: "og:description", content: "Interaktiva flashcards för svenska vägmärken." },
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
          <h1 className="text-2xl font-black sm:text-3xl">Snabbplugg</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tryck på kortet för att vända. Kort {i + 1} av {deck.length}.
          </p>
        </div>

        <div className="[perspective:1200px]">
          <button
            onClick={() => setFlipped((f) => !f)}
            className="relative block h-80 w-full [transform-style:preserve-3d] transition-transform duration-500"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-lg [backface-visibility:hidden]">
              <SignImage id={card.id} className="h-40 w-40" />
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vad betyder märket?
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <RotateCw className="h-3.5 w-3.5" /> Vänd
              </div>
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-primary/30 bg-primary p-6 text-primary-foreground shadow-lg [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">{card.category}</div>
              <div className="text-xl font-black">{card.name}</div>
              <p className="text-center text-sm leading-relaxed opacity-90">{card.meaning}</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => go(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            Vänd kortet
          </button>
          <button
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => {
            setFlipped(false);
            setI(0);
            setSeed((n) => n + 1);
          }}
          className="w-full rounded-xl border border-border bg-card py-3 text-sm font-semibold hover:border-primary/40"
        >
          Blanda kortleken
        </button>
      </div>
    </AppShell>
  );
}
