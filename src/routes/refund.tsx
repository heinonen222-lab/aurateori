import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Återbetalningspolicy – Aurateori" },
      {
        name: "description",
        content:
          "Aurateori Premium levereras direkt som digital tjänst. Så fungerar återbetalningar via Paddle och så avslutar du din prenumeration.",
      },
      { property: "og:title", content: "Återbetalningspolicy – Aurateori" },
      {
        property: "og:description",
        content: "Villkor för återbetalning och uppsägning av Aurateori Premium.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <AppShell>
      <LegalPage title="Återbetalningspolicy" updated="31 augusti 2026">
        <LegalSection title="Digital tjänst med omedelbar leverans">
          <p>
            <strong>Aurateori</strong> Premium är en digital tjänst som levereras direkt när
            betalningen är genomförd. Vid köpet begär du uttryckligen att leveransen påbörjas
            omedelbart och samtycker till att ångerrätten upphör när tjänsten har gjorts
            tillgänglig. Vi erbjuder därför ingen ångerrätt och ingen generell
            pengarna-tillbaka-garanti på genomförda köp.
          </p>
        </LegalSection>

        <LegalSection title="När återbetalning ändå kan ske">
          <p>
            Vi prövar återbetalning från fall till fall vid exempelvis dubbeldebitering, obehörigt
            köp, eller tekniskt fel som gjort tjänsten oanvändbar under en längre tid och som vi
            inte kunnat avhjälpa. Kontakta oss så tittar vi på ditt ärende.
          </p>
        </LegalSection>

        <LegalSection title="Så kontaktar du oss">
          <p>
            Betalningar och eventuella återbetalningar hanteras av vår betalningsleverantör Paddle,
            som är Merchant of Record för alla våra ordrar. Du når support på något av dessa sätt:
          </p>
          <ul>
            <li>
              Gå till{" "}
              <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
                paddle.net
              </a>{" "}
              och ange e-postadressen du använde vid köpet – där hittar du dina ordrar och kvitton.
            </li>
            <li>
              Eller mejla oss på <a href="mailto:support@aurateori.se">support@aurateori.se</a> med
              ditt ordernummer.
            </li>
          </ul>
          <p>
            Godkända återbetalningar återförs till det betalningsmedel du använde och syns normalt
            inom 5–10 bankdagar beroende på din bank eller kortutgivare.
          </p>
        </LegalSection>

        <LegalSection title="Avsluta prenumeration">
          <p>
            Du kan avsluta din prenumeration när du vill. Då debiteras inga fler perioder och du
            behåller premiumåtkomsten till slutet av den period du redan betalat för. Redan
            betalda perioder återbetalas inte. Avslut sker via{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
              paddle.net
            </a>{" "}
            eller genom att kontakta oss.
          </p>
        </LegalSection>

        <LegalSection title="Dina rättigheter som konsument">
          <p>
            Tvingande konsumenträttigheter enligt svensk och EU-lagstiftning gäller alltid, även om
            ångerrätten har upphört – exempelvis rätten att reklamera en felaktig tjänst. Se även{" "}
            <a
              href="https://www.paddle.com/legal/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paddles återbetalningspolicy
            </a>{" "}
            och våra <a href="/terms">användarvillkor</a>.
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
