import { Check, ExternalLink, Minus } from "lucide-react";

type Row = {
  name: string;
  price: string;
  model: string;
  unlimitedExams: boolean;
  moneyBack: string;
  source?: { label: string; href: string };
  us?: boolean;
};

const ROWS: Row[] = [
  {
    name: "Aurateori",
    price: "249 kr/mån · 599 kr/3 mån · 1 999 kr/år",
    model: "Avsluta när du vill",
    unlimitedExams: true,
    moneyBack: "–",
    us: true,
  },
  {
    name: "Körkortonline",
    price: "199 kr/30 dagar · 499 kr/90 dagar",
    model: "Tidsbegränsat pass",
    unlimitedExams: true,
    moneyBack: "–",
    source: { label: "korkortonline.se", href: "https://korkortonline.se/teoritest/registrera/" },
  },
  {
    name: "iKörkort",
    price: "från 149 kr/mån (app: engångsköp)",
    model: "Prenumeration",
    unlimitedExams: true,
    moneyBack: "–",
    source: { label: "ikorkort.nu", href: "https://www.ikorkort.nu/" },
  },
  {
    name: "Teorispelet",
    price: "99 kr engång",
    model: "Engångsköp",
    unlimitedExams: true,
    moneyBack: "–",
    source: {
      label: "teorispelet.ai",
      href: "https://teorispelet.ai/guide/basta-korkorts-appen.html",
    },
  },
];

export function PriceComparison() {
  return (
    <section className="border-y border-border py-6">
      <h2 className="font-display text-lg font-bold">Jämför teoriappar</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Priser hämtade från respektive leverantörs egna sidor. Kontrollera alltid aktuellt pris hos
        dem innan du jämför.
      </p>

      <div className="mt-4 space-y-2">
        {ROWS.map((r) => (
          <div
            key={r.name}
            className={
              r.us
                 ? "rounded-lg border border-premium/60 bg-premium/10 p-3 shadow-soft"
                 : "rounded-lg border border-border bg-card p-3"
            }
          >
            <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-start gap-2">
              <span className="min-w-0 break-words text-sm font-bold">{r.name}</span>
              <span className="min-w-0 break-words text-right text-xs font-semibold">{r.price}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span>{r.model}</span>
              <span className="flex items-center gap-1">
                {r.unlimitedExams ? (
                  <Check className="h-3 w-3 text-primary" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                Obegränsade prov
              </span>
              <span>Pengarna tillbaka: {r.moneyBack}</span>
              {r.source && (
                <a
                  href={r.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {r.source.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
