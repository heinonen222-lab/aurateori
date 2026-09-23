# Plan: spelbara genomgångar och resultat på kontot

## Mål
- Kontosidan ska visa en riktig resultatöversikt för alla påbörjade och slutförda genomgångar.
- Varje genomgång ska ge poäng genom sina kontrollfrågor och bidra till en separat genomgångsklarhet.
- Genomgångsspelaren ska kännas aktiv på mobil med rörlig bil, manuell H-växel 1–5 + R och tydlig återkoppling på svar.

## 1. Spara kompletta genomgångsresultat
- Utöka sparningen för varje genomgång med antal besvarade kontrollfrågor, antal rätt och bästa uppnådda resultat.
- Behåll befintligt senast besökta steg och slutförd-status, så redan sparade genomgångar fortsätter fungera.
- Spara efter varje svar och scenbyte för inloggade användare.
- Låt äldre sparade resultat börja med 0 besvarade kontrollfrågor utan att radera tidigare framsteg.

## 2. Poäng och körkortsklarhet
- Varje kontrollfråga ger 1 poäng vid rätt svar och 0 poäng vid fel svar.
- Resultatet per genomgång visas som `rätt/antal kontrollfrågor` och procent.
- Genomgångsklarheten räknas från kunskapsresultatet och hur stor del av genomgångarna som faktiskt har testats. Att bara öppna scener ger därför inte full klarhet.
- Målet sätts till 80 % genomgångsklarhet och visas med återstående procentenheter samt en tydlig mätare.
- Översikten visar totalt antal rätt, besvarade kontrollfrågor, slutförda genomgångar och aktuell klarhet.

## 3. Tydliga kontrollfrågor i spelaren
- Behåll informationsscenerna som visuella genomgångar, men visa den kontrollfråga som hör till delmomentet efter scenen.
- Visa fyra stora, tryckvänliga svarsalternativ.
- Efter svar öppnas ett tydligt svarsfönster med rätt/fel, rätt svar, pedagogisk förklaring och källänk när sådan finns.
- Nästa scen blir tillgänglig från svarsfönstret. Ett fel svar sparas och sänker genomgångens klarhet.

## 4. Mobil körning med manuell växel
- Lägg en kompakt H-växel ovanpå eller direkt under 3D-vyn med lägena R, 1, 2, 3, 4 och 5.
- Lägg till gas och broms som stora mobilknappar. Vald växel bestämmer riktning och möjlig fart; neutral uppstår när ingen växel är vald.
- Den egna bilen rör sig mjukt med deltasekunder, acceleration och inbromsning i stället för att hoppa i en fast tidsloop.
- Scenens övriga trafik fortsätter följa den pedagogiska tidslinjen. Spela/pausa och starta om behålls.
- Växeln får en tydlig aktiv markering och kort återkoppling om användaren väljer en olämplig växel för situationen.

## 5. Resultatöversikt på Mitt konto
- Ersätt den enkla listan med en sammanfattning högst upp: genomgångsklarhet, målet 80 %, totalpoäng och slutförda genomgångar.
- Visa alla 12 genomgångar, även ej startade, så målet och återstående arbete blir begripligt.
- Varje rad visar status, poäng, procent, sparat scenläge och knapp för att starta eller fortsätta.
- Färger och status skiljer tydligt mellan ej startad, pågår, behöver repetition och klar.

## 6. Teknisk utformning
- Lägg nya resultatkolumner i `lesson_progress` med en bakåtkompatibel databasändring och ofarliga standardvärden.
- Uppdatera de autentiserade läs- och sparfunktionerna; all data fortsätter vara knuten till den inloggade användaren.
- Låt spelaren hantera både `info`- och `check`-steg i rätt ordning, medan 3D-scenen kopplas till närmast föregående informationssteg.
- Skicka körkommandon som en separat styrsignal till den egna bilen, utan att påverka andra animerade fordon.

## 7. Verifiering
- Testa på mobil att växel, gas, broms, svarsalternativ och svarsfönster inte överlappar varandra.
- Kör en hel genomgång: välj svar, se återkoppling, fortsätt och kontrollera att poäng samt klarhet uppdateras på Mitt konto.
- Testa återbesök till sparat steg och att äldre sparade genomgångar fortfarande visas.
- Kontrollera datorvy, mörkt/ljust läge, reducerad rörelse och att inga fel visas i webbläsaren.