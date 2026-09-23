# Premium omdesign av Aurateori

## Mål
Ge hela Aurateori ett enhetligt, modernt 2026-uttryck utan att ändra befintliga funktioner, data, betalningar eller användarflöden. Designen följer den valda riktningen: nordisk marin palett, Urbanist för rubriker, Epilogue för brödtext, fokuserad startsida och ett återhållsamt aura-ljus.

## Genomförande

### 1. Gemensamt designsystem
- Byt till semantiska ljusa och mörka färgtokens med marin bas, sval vit yta, guldaccent och stödblått.
- Ladda Urbanist och Epilogue och standardisera rubriker, brödtext, etiketter, metadata och siffror.
- Samordna radier till 6–8 px, subtila skuggor, avdelare, fokusmarkeringar och rörelser på 150–220 ms.
- Modernisera gemensamma knappar, fält, kort, dialoger, märken, flikar, progress, tomlägen och laddningslägen.
- Säkerställ minst 44 px tryckyta, tydlig tangentbordsfokus, reducerad rörelse och WCAG AA-kontrast.

### 2. Navigation och sidram
- Ge datorvyn en renare, smalare sidomeny med tydlig aktiv markering och elegant Premium-länk.
- Förfina mobilens topprad och bottennavigation med konsekventa ikoner, säkra marginaler och tydlig aktiv sida.
- Standardisera sidbredder, mobilmarginaler, sektionsavstånd och sidrubriker.
- Behåll alla nuvarande länkar, kontomenyer, temaomkopplingar och juridiska länkar.

### 3. Fokuserad startsida
- Återskapa den valda strukturen med körkortsklarhet som primärt fokus, tydligt mål och kompakt statusöversikt.
- Ge snabbträning, fullständigt prov och vägmärken en stark men återhållsam visuell hierarki.
- Visa repetitionskön som en tydlig åtgärd utan att göra varje sektion till ett flytande kort.
- Använd aura-ljuset sparsamt bakom den viktigaste statusytan, inte som en generell gradient.

### 4. Träning och prov
- Standardisera frågekort, stora svarsalternativ, markerat/rätt/fel-läge, progress och återkoppling.
- Optimera quiz och prov för 375–430 px utan överlapp mellan timer, frågenummer, markering och navigation.
- Förbättra resultatsidan och den detaljerade genomgången utan att ändra poängräkning, 70-frågorsflöde eller 52/65-gränsen.

### 5. Innehållssidor
- Vägmärken: renare sökning, filter, rutnät och detaljvisning.
- Snabbplugg: tydligare kortfokus, vändning och progression.
- Genomgångar: visuellt samordna listan och den spelbara 3D-vyn; behåll bilrörelse, växel, svarsfönster och sparning.
- Statistik: förbättra diagramhierarki, svaga områden, historik och repetitionskö.

### 6. Konto, priser och autentisering
- Konto: tydligare körkortsklarhet, mål, genomgångsresultat, profilåtgärder och säker kontoborttagning.
- Priser: premium prispresentation med 149 kr/30 dagar och 499 kr/1 år; behåll Paddle-flödet oförändrat.
- Inloggning och lösenordsåterställning: enklare formulär, tydliga validerings-, fel- och lyckadelägen.
- Juridiska sidor och betalningsbekräftelse får samma typografi och sidstruktur.

### 7. Kvalitetskontroll
- Kontrollera alla innehållssidor för unik svensk metadata.
- Testa 375, 390 och 430 px mobil, surfplatta, 1440 px dator och stor dator.
- Kontrollera textbrytning, tryckytor, fokusordning, modaler, formulär, tomlägen och mörkt läge.
- Kör kärnflöden: starta quiz, genomför svar, öppna prov/resultat, spela genomgång, se sparat kontoresultat och öppna priser.
- Åtgärda eventuella konsol- eller sidfel och verifiera att befintliga integrationer och lagring fortfarande fungerar.

## Tekniska ramar
- Behåll TanStack Start-arkitekturen, befintliga sidor, databasstruktur och serverfunktioner.
- Samla alla visuella värden i semantiska Tailwind v4-tokens; inga hårdkodade färger i sidkomponenter.
- Återanvänd och förbättra de gemensamma UI-komponenterna innan enskilda sidor justeras.
- Dela upp större vyer i små, fokuserade presentationskomponenter när det minskar duplicering, utan att flytta affärslogik.
