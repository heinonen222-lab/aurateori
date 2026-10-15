import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/terms", label: "Användarvillkor" },
  { to: "/refund", label: "Återbetalningspolicy" },
  { to: "/privacy", label: "Integritetspolicy" },
  { to: "/radera-konto", label: "Radera konto" },
  { to: "/priser", label: "Priser" },
] as const;

export function LegalFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">
      <details className="group">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1 opacity-60 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span>Juridisk information</span>
          <span aria-hidden className="transition-transform group-open:rotate-180">
            ⌄
          </span>
        </summary>
        <div className="px-2 pt-3">
          <nav
            aria-label="Juridisk information"
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-foreground hover:underline">
                {l.label}
              </Link>
            ))}
            <a href="mailto:support@aurateori.se" className="hover:text-foreground hover:underline">
              Kontakt
            </a>
          </nav>
          <p className="mt-3 leading-relaxed">
            © {new Date().getFullYear()} Aurateori. Studiematerial för svenskt B-körkort – inte
            kopplat till Trafikverket. Vår orderhantering sköts av vår återförsäljare Paddle.com,
            som är Merchant of Record för alla våra ordrar och hanterar kundtjänstfrågor och
            returer.
          </p>
        </div>
      </details>
    </footer>
  );
}
