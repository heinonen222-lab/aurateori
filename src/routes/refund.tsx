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
          "Aurateori har 30 dagars öppet köp. Så begär du återbetalning via Paddle, och så avslutar du din prenumeration.",
      },
      { property: "og:title", content: "Återbetalningspolicy – Aurateori" },
      {
        property: "og:description",
        content: "30 dagars pengarna-tillbaka-garanti på Aurateori Premium.",
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
        <LegalSection title="30 dagars pengarna tillbaka">
          <p>
            <strong>Aurateori</strong> erbjuder 30 dagars öppet köp. Är du inte nöjd med ditt köp
            kan du begära full återbetalning inom 30 dagar från orderdatumet – oavsett om du köpt
            månadsprenumeration, årsprenumeration eller livstidsåtkomst. Du behöver inte ange något
            skäl.
          </p>
        </LegalSection>

        <LegalSection title="Så begär du återbetalning">
          <p>
            Återbetalningar hanteras av vår betalningsleverantör Paddle, som är Merchant of Record
            för alla våra ordrar. Du begär återbetalning på något av dessa sätt:
          </p>
          <ul>
            <li>
              Gå till{" "}
              <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
                paddle.net
              </a>{" "}
              och ange e-postadressen du använde vid köpet – där hittar du dina ordrar och kan
              begära återbetalning.
            </li>
            <li>
              Eller mejla oss på <a href="mailto:support@aurateori.se">support@aurateori.se</a> med
              ditt ordernummer, så hjälper vi dig vidare.
            </li>
          </ul>
          <p>
            Godkända återbetalningar återförs till det betalningsmedel du använde. Beloppet syns
            normalt inom 5–10 bankdagar beroende på din bank eller kortutgivare.
          </p>
        </LegalSection>

        <LegalSection title="Avsluta prenumeration">
          <p>
            Du kan avsluta din prenumeration när du vill. Då debiteras inga fler perioder och du
            behåller premiumåtkomsten till slutet av den period du redan betalat för. Avslut sker
            via{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
              paddle.net
            </a>{" "}
            eller genom att kontakta oss. Livstidsåtkomst är ett engångsköp och behöver inte
            avslutas.
          </p>
        </LegalSection>

        <LegalSection title="Efter 30 dagar">
          <p>
            Efter 30 dagar prövar vi återbetalningar från fall till fall, exempelvis vid tekniska
            fel som gjort tjänsten oanvändbar, vid dubbeldebitering eller vid obehörigt köp.
            Kontakta oss – vi vill att du ska vara nöjd. Dina rättigheter som konsument enligt
            svensk och EU-lagstiftning begränsas inte av denna policy. Se även{" "}
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
