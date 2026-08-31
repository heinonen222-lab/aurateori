import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Integritetspolicy – Aurateori" },
      {
        name: "description",
        content:
          "Så behandlar Aurateori dina personuppgifter: vilka uppgifter vi samlar in, varför, rättslig grund, mottagare, lagringstid och dina rättigheter enligt GDPR.",
      },
      { property: "og:title", content: "Integritetspolicy – Aurateori" },
      {
        property: "og:description",
        content: "Information om personuppgiftsbehandling, cookies och dina GDPR-rättigheter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell>
      <LegalPage title="Integritetspolicy" updated="31 augusti 2026">
        <LegalSection title="1. Personuppgiftsansvarig">
          <p>
            <strong>Aurateori</strong> är personuppgiftsansvarig för de personuppgifter som behandlas
            i tjänsten Aurateori. Det innebär att vi bestämmer varför och hur dina uppgifter
            behandlas. Kontakt:{" "}
            <a href="mailto:support@aurateori.se">support@aurateori.se</a>.
          </p>
        </LegalSection>

        <LegalSection title="2. Vilka uppgifter vi behandlar och varför">
          <ul>
            <li>
              <strong>Kontouppgifter</strong> (e-postadress, lösenord i krypterad form, eller
              Google-ID vid inloggning med Google) – för att skapa och säkra ditt konto. Rättslig
              grund: fullgörande av avtal.
            </li>
            <li>
              <strong>Studiedata</strong> (besvarade frågor, resultat, kategorier, streak, sparade
              felsvar) – för att visa din progress, statistik och repetitionskö. Rättslig grund:
              fullgörande av avtal.
            </li>
            <li>
              <strong>Prenumerations- och åtkomstdata</strong> (plan, status, period, kundreferens
              från Paddle) – för att ge dig rätt åtkomst till premiuminnehåll. Rättslig grund:
              fullgörande av avtal.
            </li>
            <li>
              <strong>Teknisk data och loggar</strong> (IP-adress, enhets- och webbläsarinformation,
              felmeddelanden) – för drift, säkerhet och att förhindra bedrägeri och missbruk.
              Rättslig grund: berättigat intresse.
            </li>
            <li>
              <strong>Supportärenden</strong> (meddelanden du skickar till oss) – för att besvara
              din fråga. Rättslig grund: berättigat intresse.
            </li>
            <li>
              <strong>Användningsstatistik</strong> i aggregerad form – för att förbättra innehåll och
              funktioner. Rättslig grund: berättigat intresse, eller samtycke där lag kräver det.
            </li>
          </ul>
          <p>
            Betalkortsuppgifter behandlas aldrig av oss. Betalningar hanteras av Paddle, som är
            Merchant of Record och egen personuppgiftsansvarig för betalningsdata.
          </p>
        </LegalSection>

        <LegalSection title="3. Vem vi delar uppgifter med">
          <ul>
            <li>
              <strong>Leverantörer och underbiträden</strong> för drift: hosting, databas och
              autentisering (Supabase), plattform och leverans (Lovable), samt felrapportering.
            </li>
            <li>
              <strong>Merchant of Record (Paddle)</strong> – för försäljning, prenumerations- och
              betalningshantering, fakturering och skatteefterlevnad.
            </li>
            <li>
              <strong>Inloggningsleverantör</strong> (Google) om du väljer att logga in med Google.
            </li>
            <li>
              <strong>Professionella rådgivare</strong> (juridik, redovisning) vid behov.
            </li>
            <li>
              <strong>Myndigheter</strong> när vi är skyldiga enligt lag.
            </li>
          </ul>
          <p>Vi säljer aldrig dina personuppgifter.</p>
        </LegalSection>

        <LegalSection title="4. Överföring utanför EU/EES">
          <p>
            Vissa leverantörer kan behandla uppgifter utanför EU/EES. Sådan överföring sker med
            lämpliga skyddsåtgärder – EU-kommissionens standardavtalsklausuler (SCC) eller ett
            beslut om adekvat skyddsnivå – tillsammans med kompletterande tekniska åtgärder som
            kryptering.
          </p>
        </LegalSection>

        <LegalSection title="5. Lagringstid">
          <p>
            Kontouppgifter och studiedata sparas så länge du har ett aktivt konto och därefter i upp
            till 12 månader, om du inte begär radering tidigare. Uppgifter kopplade till köp sparas
            så länge bokföringslagen kräver (som regel sju år). Tekniska loggar sparas normalt i upp
            till 90 dagar. Därefter raderas eller anonymiseras uppgifterna.
          </p>
        </LegalSection>

        <LegalSection title="6. Dina rättigheter">
          <p>
            Du har rätt att begära tillgång till dina uppgifter, rättelse, radering, begränsning av
            behandling och dataportabilitet, samt att invända mot behandling som sker med stöd av
            berättigat intresse. Har du lämnat samtycke kan du återkalla det när som helst. Kontakta
            oss på <a href="mailto:support@aurateori.se">support@aurateori.se</a> – vi svarar normalt
            inom en månad. Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten
            (IMY).
          </p>
        </LegalSection>

        <LegalSection title="7. Säkerhet">
          <p>
            Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina uppgifter,
            bland annat kryptering i transit, hashade lösenord, åtkomstkontroll på radnivå i
            databasen och behörighetsstyrning för administrativ åtkomst.
          </p>
        </LegalSection>

        <LegalSection title="8. Cookies och lokal lagring">
          <p>
            Vi använder nödvändiga cookies och lokal lagring (localStorage) för inloggningssession,
            temaval och din studieprogress. Dessa krävs för att tjänsten ska fungera. Använder vi
            analys- eller marknadsföringscookies inhämtar vi ditt samtycke först, och du kan då ändra
            ditt val när som helst. Du kan även blockera eller radera cookies i din webbläsare, vilket
            kan påverka funktionaliteten.
          </p>
        </LegalSection>

        <LegalSection title="9. Barn">
          <p>
            Tjänsten riktar sig till personer som förbereder sig för svenskt B-körkort. Konton för
            barn under 13 år skapas inte medvetet; kontakta oss om du tror att så har skett.
          </p>
        </LegalSection>

        <LegalSection title="10. Ändringar">
          <p>
            Vi kan uppdatera denna policy. Den senaste versionen publiceras alltid här med datum, och
            vid väsentliga ändringar informerar vi dig i tjänsten eller via e-post.
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
