# Premium omdesign

## Källgranskning av frågebanken
- [ ] Granska alla lokala och administrerade frågor, förklaringar och vägmärkesbilder mot officiella källor
- [ ] Rätta bekräftade fel och avlägsna felaktiga testfrågor utan att radera sparad historik
- [ ] Testa frågebankens struktur, rättningar och visning; redovisa återstående osäkerheter

## Renodling till teoriapp
- [x] Ta bort 3D-motor, spelkontroller och genomgångsmenyer; behåll gamla länkar och lagrad historik
- [x] Visa verklig träningsöversikt på kontot och rätta berörda produkttexter
- [x] Verifiera sparat träningssvar, provspärr, inloggat konto och mobilnavigation utan 3D-laddning; betald provstart väntar på aktivt Premium-testkonto

## Swish och BankID
- [ ] Lägg till Swish-engångsköp för en Premium-period utan automatisk förnyelse (väntar på företagsavtal/betalleverantör)
- [ ] Lägg till BankID-inloggning (väntar på BankID-leverantör med OIDC och anslutningsuppgifter)

## Gratisfrågor
- [x] Begränsa offentliga frågor globalt och verifiera träning, ämnen och repetition
- [x] Ersätt gratisfrågorna med tio källkontrollerade försäkringsfrågor och en tillgänglig gratismodul; testa resultat och totalgräns

## Förbättringsbrief – oktober 2026
- [x] Förfina global design och femdelad mobilnavigation utan att dölja befintliga sidor
- [x] Bygg startsidans verkliga översikt och åtta fungerande träningsämnen
- [x] Förbättra svarsåterkoppling samt prov med markering och återbesök
- [x] Visa veckomål, träningshistorik och tydlig gratis/Premium-jämförelse
- [x] Testa sparade resultat, träning, provåtkomst och ljus/mörk mobil- och datorvy
- [ ] Testa ny betalning och uppsägning hos betaltjänsten (kräver kundens betalningsgodkännande; befintligt Premium och provstart verifierade)

## Raderingsnotiser
- [ ] Skicka adminmejl vid raderingsbegäran (väntar på verifierad avsändardomän)

- [x] Lås designriktning och inventera appen
- [x] Uppdatera designsystem, sidram och gemensamma komponenter
- [x] Förfina start, quiz, prov och resultat
- [x] Förfina vägmärken, snabbplugg, genomgångar och statistik
- [x] Förfina konto, priser, autentisering och juridiska sidor
- [x] Verifiera mobil, dator, mörkt läge och kärnflöden
- [x] Anpassa genomgångar, sparade resultat, priser och betalningsstatus till mörka Aura-rymden
- [x] Polera tom-, laddnings- och felvyer för statistik, genomgångar och övningar
- [x] Fylla tom-vyn i övningen med tydlig instruktion, exempel och NaN-skydd
- [x] Fylla tomma övningsvyn med egna frågor och repetition (riktig procent och poäng)
- [x] Betalningsflödet i filmisk Aura-stil: faktura, kreditstatus, avsluta premium
- [x] Snabba upp appen: prov laddar snabbare, 3D laddas bara vid öppnad genomgång

## Android – första Play-versionen
- [x] Bygg och verifiera signerad AAB med Bubblewrap
- [x] Leverera AAB och säkerhetskopiering av uppladdningsnyckeln
- [ ] Koppla publicerad webbplats till Play-signeringscertifikatet (väntar på Play Console)
- [ ] Google Play Billing före produktionslansering (väntar på Play Console-konfiguration)

## Android-köp
- [x] Besvara iPhone-uppladdning: Play Console kan användas i webbläsare; Android behövs för riktig enhetstestning
- [x] Kontrollera kontomenyns hook-krasch och återställ dess tillstånd vid utvecklingsuppdateringar
- [x] Separera Google Play-kassan från Paddle på webben
- [x] Implementera serververifiering och Premium-visning för Android-köp (aktivering ej testad utan Google-tjänstekonto)
- [ ] Testa köp och återställning via Google Play (väntar på Play-produkter, tjänstekonto, appsigneringscertifikat och ny Billing-aktiverad AAB)
