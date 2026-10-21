# Android-köp: Google Play Billing

Webben använder fortsatt Paddle. Android-köp använder Digital Goods API och Android Publisher API. Ingen Premium-åtkomst ges från klientens betalningssvar utan Google-verifiering.

## Återstår i Play Console
1. Ladda upp nuvarande första AAB till intern testning för att registrera paketet `app.aurateori.android` och aktivera Play App Signing.
2. Skapa tre prenumerationsprodukter med exakt dessa produkt-ID:n och en aktiv, bakåtkompatibel automatisk basplan per produkt:
   - `premium_monthly`: 249 SEK varje månad.
   - `premium_quarterly`: 599 SEK varje tredje månad.
   - `premium_yearly`: 1 999 SEK varje år.
   Android visar alltid priserna från Google Play, inte från Paddle. Kontrollera svenska priser, skatter, produktstatus och basplaner i Play Console.
3. Aktivera Google Play Android Developer API i Google Cloud. Skapa ett tjänstekonto, ge det åtkomst till denna app i Play Console med köp-/abonnemangsläsning och behörighet att hantera abonnemang/bekräfta köp. Spara JSON-nyckeln endast i den säkra hemlighetsdialogen som `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`, aldrig i chatten eller webbprojektet.
4. Kopiera Appsigneringscertifikatets SHA-256 från Appintegritet. Publicera en Digital Asset Links-fil på `https://aurateori.lovable.app/.well-known/assetlinks.json` för paketet och Googles certifikat. Använd inte uppladdningscertifikatet som ersättning.
5. Uppdatera det separata Bubblewrap-projektets `twa-manifest.json`:

```json
{
  "startUrl": "/?play=1",
  "features": { "playBilling": { "enabled": true } },
  "alphaDependencies": { "enabled": true }
}
```

Behåll övriga inställningar. Öka `appVersionCode` från 1 till minst 2 och bygg/signera med befintlig uppladdningsnyckel. Den gamla AAB-filen 1.0.0 innehåller inte detta köpstöd. Granska den genererade Billing Library-versionen mot aktuella Play-krav före uppladdning.

## Testa via intern Play-testning
- Installera från Google Plays interna testlänk med en registrerad licenstestare; en vanlig webbförhandsvisning eller sidoladdning bevisar inte köpstödet.
- Köp varje produkt, kontrollera rätt plan och slutdatum på Mitt konto och att provet kan starta.
- Kontrollera att avbrutet/väntande köp inte låser upp Premium.
- Testa Återställ köp efter ominstallation med samma Aurateori-konto.
- Testa förnyelse, avslut, grace period, account hold och återbetalning.
- Kontrollera att Android aldrig öppnar Paddle när Play-tjänsten saknas.

Köp lagras med unik tokenbindning till ett konto; tokenkolumnen är inte läsbar av appanvändare. Play-status verifieras vid åtkomstkontroll och kontoläsning; frågebankens läsrätt gäller högst tio minuter efter senaste verifieringen. Ingen realtidsnotis från Google är konfigurerad ännu. Köp i Google Play måste avslutas separat innan ett Aurateori-konto raderas.

Officiella källor:
- https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing
- https://developer.android.com/google/play/billing/security
- https://developer.android.com/google/play/billing/lifecycle/subscriptions