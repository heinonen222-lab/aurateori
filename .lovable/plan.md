# Plan: textpassning, klarhet och 3D-genomgångar

## Mål
- Ingen text ska kunna lämna sin ruta, inte ens på smala mobiler eller med långa svenska sammansatta ord.
- Körkortsklarheten ska sjunka tydligt av felaktiga svar och inte kunna öka bara för att fler frågor besvaras fel.
- Alla 12 genomgångar ska bli styrda, visuella 3D-animationer utan kontrollfrågor.

## 1. Text som alltid ryms
- Inför en återanvändbar textpassning som mäter tillgängligt utrymme och minskar textstorleken inom läsbara gränser när innehållet är långt.
- Lägg generella skydd för radbrytning, avstavning, minsta flexbredd och långa länkar i kort, knappar, listor och informationsrutor.
- Gör rubrik-, list- och nyckel/värde-rader höjdstabila: samma antal reserverade textrader, fasta ikonkolumner och värden som inte trycks ut.
- Jämna ut höjden på startkort, statistikboxar, vägmärkeskort, prisrutor och genomgångskort. Knappar och metadata ska linjera på samma nivå.
- Kontrollera särskilt 320–428 px mobilbredd samt desktop, ljust och mörkt läge.

## 2. Körkortsklarhet där fel reducerar resultatet
- Beräkna aktuell träffsäkerhet från de senaste 50 svaren så att nya fel påverkar direkt.
- Ge kvarvarande fel i repetitionskön en separat, tydlig negativ vikt.
- Väg in genomsnittet från de tre senaste fullständiga proven när sådana finns.
- Använd träningsmängd enbart som en multiplikator för tillförlitlighet, aldrig som en bonus som kan höja klarheten efter ett fel.
- Begränsa resultatet till 0–100 % och verifiera testfall: första rätta, första felaktiga, fel efter en längre korrekt serie, rättad repetitionsfråga och provresultat.

Föreslagen modell:

```text
bas = senaste träffsäkerhet × 50 %
    + felköpoäng × 25 %
    + senaste provresultat × 25 %

klarhet = bas × träningskonfidens
```

## 3. Tolv styrda 3D-genomgångar
- Byt frågestegen mot en gemensam Three.js-spelare med uppspelning/paus, starta om, föregående/nästa scensteg och tydlig förloppsvisning.
- Behåll svensk pedagogisk text och officiella källor som tillgängligt textlager ovanpå 3D-vyn.
- Skapa en scenkonfiguration för samtliga 12 ämnen:
  1. Väjningsregler i korsningar
  2. Hastighet, reaktion och stoppsträcka
  3. Vägmärkenas system
  4. Människan i trafiken
  5. Miljö och sparsam körning
  6. Fordonet: däck, bromsar och last
  7. Motorväg och motortrafikled
  8. Omkörning och körfältsplacering
  9. Stannande och parkering
  10. Mörkerkörning och belysning
  11. Halt väglag och vinterkörning
  12. Körkort, prov och förarens ansvar
- Varje animation visar regeln genom rörelse, färgmarkeringar, vägmarkeringar, skyltar och kameraövergångar. Scenerna använder samma tydliga svenska trafikmiljö men får ämnesspecifika händelser.
- 3D-vyn blir klientstyrd och laddas separat så att övriga appen fortsätter fungera även om WebGL saknas; då visas en begriplig statisk reservvy.
- Optimera för mobil med begränsad detaljnivå, pixelkvot, skuggor och antal objekt. Respektera inställningen för minskad rörelse.

## Teknisk utformning
- React Three Fiber/Three.js används för rendering och tidsbaserade animationer.
- Animationerna drivs med deltasekunder och deterministiska tidslinjer, inte med frågor eller slump.
- Delade väg-, fordon-, skylt- och ljusdelar återanvänds mellan scenerna för jämn kvalitet och låg laddningstid.
- Genomgångssidan får en tydlig lista över 12 visuella avsnitt; vald genomgång öppnas i samma sida och kan lämnas utan att tappa appnavigeringen.

## Verifiering
- Kör kodkontroll och riktade tester för klarhetsformeln.
- Kontrollera alla centrala sidor mot textspill och ojämna rader i mobil- och desktopstorlek.
- Kontrollera samtliga 12 genomgångar i webbläsaren: synlig 3D-scen, fungerande kontroller, faktisk rörelse, rätt ämnestext och inga konsol- eller laddningsfel.
