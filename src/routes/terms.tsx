import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Användarvillkor – Aurateori" },
      {
        name: "description",
        content:
          "Användarvillkor för Aurateori: avtalsparter, tillåten användning, immateriella rättigheter, betalning via Paddle och uppsägning.",
      },
      { property: "og:title", content: "Användarvillkor – Aurateori" },
      {
        property: "og:description",
        content: "Villkor för användning av Aurateori, teoritjänsten för svenskt B-körkort.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell>
      <LegalPage title="Användarvillkor" updated="23 oktober 2026">
        <LegalSection title="1. Vem du ingår avtal med">
          <p>
            Tjänsten Aurateori (”Tjänsten”) tillhandahålls av <strong>Aurateori</strong> (”vi”,
            ”oss”). Genom att skapa konto eller fortsätta använda Tjänsten ingår du ett avtal med
            Aurateori och godkänner dessa villkor. Om du använder Tjänsten för en organisations
            räkning intygar du att du har rätt att binda organisationen. Är du privatperson intygar
            du att du är minst 13 år, eller har vårdnadshavares samtycke.
          </p>
        </LegalSection>

        <LegalSection title="2. Vad Tjänsten är">
          <p>
            Aurateori är ett digitalt studieverktyg för teoriprovet till svenskt B-körkort. Tjänsten
            innehåller övningsfrågor, provsimulator, vägmärkesarkiv, repetition och
            statistik. Aurateori är inte Trafikverket, är inte kopplat till Trafikverket eller
            Transportstyrelsen, och vi kan inte garantera ett godkänt teoriprov. Innehållet är
            studiematerial – vid tvivel gäller alltid gällande lag och Trafikverkets egen
            information.
          </p>
        </LegalSection>

        <LegalSection title="3. Ditt konto">
          <p>
            Du ansvarar för att uppgifterna du lämnar är korrekta och uppdaterade, för att hålla
            dina inloggningsuppgifter hemliga och för all aktivitet som sker via ditt konto.
            Kontakta oss omedelbart om du misstänker obehörig användning.
          </p>
        </LegalSection>

        <LegalSection title="4. Tillåten användning">
          <p>Du får inte:</p>
          <ul>
            <li>använda Tjänsten i strid med lag eller för bedrägeri, spam eller trakasserier,</li>
            <li>
              kränka någons immateriella rättigheter eller kopiera, sälja vidare eller publicera
              vårt innehåll utanför Tjänsten,
            </li>
            <li>
              störa säkerheten i Tjänsten – till exempel genom skadlig kod, sårbarhetsskanning,
              automatiserad skrapning eller kringgående av tekniska begränsningar,
            </li>
            <li>dela ditt premiumkonto med andra eller sälja åtkomst vidare,</li>
            <li>dekompilera eller reverse-engineera Tjänsten.</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Licens och immateriella rättigheter">
          <p>
            Aurateori äger Tjänsten och allt tillhörande innehåll – programvara, frågor,
            förklaringar, texter och varumärken. Du får en begränsad, icke-exklusiv och icke
            överlåtbar rätt att använda Tjänsten personligen inom den plan du valt. Officiella
            vägmärken och laghänvisningar återges från offentliga källor och tillhör respektive
            rättighetshavare.
          </p>
        </LegalSection>

        <LegalSection title="6. Betalning, prenumeration och Paddle">
          <p>
            Premium säljs som löpande prenumeration: 1 månad (249 kr per månad), 3 månader (599 kr var tredje månad) eller 12 månader (1 999 kr per år).
            Priser anges i SEK inklusive tillämplig moms. Prenumerationer förnyas automatiskt vid
            periodens slut till gällande pris, tills du avslutar dem. Du kan avsluta när du vill och
            behåller åtkomsten till periodens slut.
          </p>
          <p>
            Vår orderhantering sköts av vår återförsäljare Paddle.com. Paddle.com är Merchant of
            Record för alla våra ordrar. Paddle hanterar alla kundtjänstfrågor om betalningar samt
            returer. Villkor för betalning, fakturering, skatt, uppsägning och återbetalning framgår
            av{" "}
            <a
              href="https://www.paddle.com/legal/checkout-buyer-terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paddles köpvillkor
            </a>
            . Se även vår <a href="/refund">återbetalningspolicy</a>.
          </p>
        </LegalSection>

        <LegalSection title="7. Tillgänglighet">
          <p>
            Vi arbetar för en stabil tjänst men kan inte garantera att Tjänsten är oavbruten eller
            felfri. Underhåll, uppdateringar och driftstörningar kan förekomma. Vi kan ändra eller
            avveckla funktioner; väsentliga ändringar meddelas i förväg när det är rimligen möjligt.
          </p>
        </LegalSection>

        <LegalSection title="8. Garantifriskrivning och ansvarsbegränsning">
          <p>
            Tjänsten tillhandahålls ”i befintligt skick”. Så långt lagen tillåter friskriver vi oss
            från alla underförstådda garantier, inklusive allmän lämplighet och lämplighet för ett
            särskilt syfte. Vårt sammanlagda ansvar är begränsat till de avgifter du betalat för
            Tjänsten under de tolv månader som föregick anspråket. Vi ansvarar inte för indirekta
            skador, följdskador, utebliven vinst, förlorad data eller goodwill. Inget i dessa
            villkor begränsar ansvar för bedrägeri, dödsfall eller personskada, eller annat ansvar
            som inte kan begränsas enligt lag.
          </p>
        </LegalSection>

        <LegalSection title="9. Avstängning och uppsägning">
          <p>
            Vi kan stänga av eller avsluta din åtkomst vid väsentligt avtalsbrott, utebliven
            betalning, säkerhets- eller bedrägeririsk, eller vid upprepade eller allvarliga
            överträdelser av dessa villkor. Du kan avsluta ditt konto när du vill. Vid avslut upphör
            åtkomsten till premiuminnehåll och dina kontouppgifter raderas eller anonymiseras enligt
            vår integritetspolicy.
          </p>
        </LegalSection>

        <LegalSection title="10. Tillämplig lag och tvister">
          <p>
            Svensk lag gäller för dessa villkor. Tvister prövas av svensk allmän domstol. Som
            konsument kan du även vända dig till Allmänna reklamationsnämnden (ARN).
          </p>
        </LegalSection>

        <LegalSection title="11. Ändringar och överlåtelse">
          <p>
            Vi kan uppdatera villkoren; den senaste versionen publiceras alltid på denna sida med
            datum. Du får inte överlåta avtalet utan vårt samtycke. Vi får överlåta avtalet i
            samband med fusion, förvärv eller överlåtelse av verksamhet. Ingen part ansvarar för
            förseningar orsakade av händelser utanför rimlig kontroll.
          </p>
        </LegalSection>

        <LegalSection title="12. Kontakt">
          <p>
            Frågor om villkoren: <a href="mailto:support@aurateori.se">support@aurateori.se</a>.
            Frågor om betalningar, fakturor och återbetalningar hanteras av Paddle via{" "}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
              paddle.net
            </a>
            .
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
