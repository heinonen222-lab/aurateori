import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/radera-konto")({
  head: () => ({
    meta: [
      { title: "Radera konto – Aurateori" },
      {
        name: "description",
        content:
          "Begär radering av ditt Aurateori-konto och all tillhörande data, även utan att logga in.",
      },
      { property: "og:title", content: "Radera konto – Aurateori" },
      {
        property: "og:description",
        content: "Så raderar du ditt konto och dina uppgifter i Aurateori.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeleteAccountPage,
});

function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const mailto = `mailto:support@aurateori.se?subject=${encodeURIComponent(
    "Begäran om kontoradering – Aurateori",
  )}&body=${encodeURIComponent(
    `Hej!\n\nJag vill att mitt Aurateori-konto och all tillhörande data raderas.\n\nE-postadress för kontot: ${email.trim()}\n\nTack!`,
  )}`;

  return (
    <AppShell>
      <LegalPage title="Radera konto och data" updated="15 oktober 2026">
        <LegalSection title="1. Radera direkt i appen">
          <p>
            Är du inloggad kan du radera ditt konto direkt under{" "}
            <Link to="/konto">Mitt konto</Link> → "Radera konto". Raderingen sker omedelbart.
          </p>
        </LegalSection>

        <LegalSection title="2. Begär radering utan att logga in">
          <p>
            Ange e-postadressen som kontot är registrerat på. Vi skickar en bekräftelse till
            adressen och raderar kontot inom 30 dagar.
          </p>
          <form
            className="flex flex-col gap-2 pt-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) window.location.href = mailto;
            }}
          >
            <Input
              type="email"
              required
              aria-label="E-postadress"
              placeholder="din@epost.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sm:max-w-xs"
            />
            <Button type="submit" disabled={!valid}>
              Skicka begäran
            </Button>
          </form>
          <p>
            Fungerar inte knappen? Mejla{" "}
            <a href="mailto:support@aurateori.se">support@aurateori.se</a> från adressen kopplad
            till kontot.
          </p>
        </LegalSection>

        <LegalSection title="3. Vad som raderas">
          <ul>
            <li>Konto och inloggningsuppgifter</li>
            <li>Profil, studiehistorik, provresultat, repetitionskö och sparade genomgångar</li>
            <li>Kopplingen mellan ditt konto och eventuellt abonnemang</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Vad som sparas">
          <p>
            Kvitton och uppgifter om köp sparas så länge bokföringslagen kräver (som regel sju år)
            hos vår återförsäljare Paddle. Tekniska loggar raderas automatiskt inom 90 dagar. Ett
            aktivt abonnemang avslutas i samband med raderingen.
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
