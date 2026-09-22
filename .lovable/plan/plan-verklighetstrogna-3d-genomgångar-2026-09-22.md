# Plan: verklighetstrogna 3D-genomgångar

## Mål
- Varje genomgång ska visa verkliga svenska trafiksituationer, inte samma animation med annan text.
- Steg som “1/5, 2/5 …” ska motsvara olika händelser i samma ämne.
- Högerregeln, väjningsplikt, stopplikt, huvudled, cirkulationsplats och andra regler ska visas så som de fungerar i praktiken.
- Texten ska vara pedagogisk, men 3D-scenen ska själv visa regeln med väg, placering, rörelse, skyltar, markeringar och prioritet.

## Princip
Byt dagens breda `SceneKind`-lösning mot en scen per konkret delmoment:

```text
Genomgång
  └─ Steg 1: verklig situation + egen tidslinje + egna objekt
  └─ Steg 2: verklig situation + egen tidslinje + egna objekt
  └─ Steg 3: verklig situation + egen tidslinje + egna objekt
```

Det betyder att “Väjningsregler” inte längre bara är en korsning fem gånger. Den blir fem olika scener: högerregeln, väjningsplikt, stopplikt, huvudled och cirkulationsplats/gångfartsområde.

## 1. Ny scenmodell
- Skapa en `LessonSceneId` per informationssteg, till exempel:
  - `right-hand-rule`
  - `yield-sign`
  - `stop-sign`
  - `priority-road`
  - `roundabout`
  - `reaction-distance`
  - `braking-distance`
  - `motorway-merge`
  - `overtaking-left`
  - `parking-distance-crossing`
  - `headlight-dip-meeting`
  - `icy-road-skid`
- Koppla varje `info`-steg i varje genomgång till exakt en sådan scen.
- Ta bort känslan av “samma bana, ny text” genom att varje scen får egen vägtyp, trafikflöde, skyltning och kamera.

## 2. Väjningsregler görs först och mest noggrant
Den här genomgången blir kvalitetsmallen för resten.

### Högerregeln
- Oskyltad fyrvägskorsning i bostadsområde.
- Din bil närmar sig från nedre vägen.
- Bil från höger markeras och passerar först.
- Din bil bromsar före korsningen och kör först efter att bilen från höger passerat.
- En diskret prioritetspil visar “höger först”.

### Väjningsplikt
- T-korsning med väjningspliktsskylt och väjningslinje.
- Din bil sänker farten före väjningslinjen.
- Trafik på huvudvägen passerar först.
- Din bil kör först när luckan är fri.

### Stopplikt
- Korsning med stoppskylt och stopplinje.
- Din bil stannar helt vid stopplinjen.
- En kort paus visar verklig stillastående stoppunkt.
- Därefter kör bilen vidare när sikten är fri.

### Huvudled
- Gul huvudledsskylt längs huvudväg.
- Sidovägar har väjningsplikt.
- Bilar från sidovägar bromsar/stannar medan huvudledstrafiken fortsätter.
- Parkeringsförbud längs huvudled visas med kantmarkering eller parkeringssymbol som avvisas.

### Cirkulationsplats och gångfartsområde
- Cirkulationsplats med väjningsplikt in, körriktning motsols och blinkning ut.
- Inkommande bil väntar på bil i cirkulationen.
- Separat kort scen för gångfartsområde: bil rullar mycket långsamt och gående har företräde.

## 3. Resterande 11 genomgångar får verkliga ämnesscener
- Hastighet: reaktionssträcka, bromssträcka, hastighetsskyltar och avstånd till framförvarande bil visas med meterlinjer.
- Vägmärken: varje märke visas vid rätt vägkontext, inte som lösa skivor i rad.
- Människan i trafiken: alkohol/trötthet/riskbeteende visas som försämrad reaktion, vinglig placering och för sent beslut.
- Miljö: mjuk acceleration, jämn fart, motorbromsning och onödiga stopp jämförs visuellt.
- Fordonet: däckmönster, bromssträcka och lastens tyngdpunkt visas i separata scener.
- Motorväg: accelerationsfält, filbyte, avfart, nödstopp och förbjudna trafikanter visas i rätt miljö.
- Omkörning: vänster omkörning, sikt, möte, backkrön/korsning och återgång till höger körfält visas med rörelse.
- Stannande/parkering: övergångsställe, korsning, busshållplats, huvudled och 24-timmarsregel visas med avståndsmarkörer.
- Mörker: halvljus, helljus, bländning och siktsträcka visas med ljuskäglor.
- Halka: vinterdäck, friktion, längre stoppsträcka, mjuka rörelser och sladd visas på vinterväg.
- Körkort/ansvar: riskutbildning, provsteg, prövotid och föraransvar visas som en tydlig processmiljö, inte som en vanlig korsning.

## 4. Gemensamma 3D-delar
- Bygg återanvändbara men verklighetsnära objekt:
  - svenska vägmarkeringar
  - väjningslinje, stopplinje, körfältspilar och övergångsställe
  - cirkulationsplats, T-korsning, fyrvägskorsning, motorväg och bostadsgata
  - lågpoly-bilar, gående, cykel/moped-symboler, skyltstolpar och vägskyltar
- Återanvänd objekt, men inte hela scenen. Varje ämne ska ha egen situation.
- Använd tydliga färgmarkeringar för prioritet, risk och rätt placering utan att göra scenen orealistisk.

## 5. Spelare och användarflöde
- Behåll dagens kontroller: spela/pausa, starta om, föregående/nästa.
- Ändra scenräknaren så den visar delmomentets namn tydligare, inte bara “Scen 1 av 5”.
- Låt scenen bytas när användaren byter delmoment, så 3D och text alltid hör ihop.
- Om WebGL saknas visas en enkel statisk reservvy med samma regeltext.

## 6. Teknisk utformning
- `VisualLessonPlayer` skickar både lesson-id och step-index till 3D-vyn.
- En ny konfigurationsfil mappar `lesson.id + info-step-index` till scen-id, kamera, vägtyp, fordon, skyltar och tidslinje.
- `LessonScene` delas upp i mindre komponenter:
  - vägtyper
  - fordon och trafikanter
  - skyltar och markeringar
  - scen-specifika tidslinjer
- Alla rörelser fortsätter drivas med deltasekunder.
- Inga externa 3D-filer krävs i första versionen; procedurbyggda lågpolyobjekt används för snabb och stabil laddning.
- Om en scen senare behöver en namngiven realistisk modell hämtas endast verifierade CC0-modeller.

## 7. Verifiering
- Kontrollera alla 12 genomgångar i webbläsaren.
- Kontrollera särskilt att:
  - högerregeln visar fordon från höger som får köra först
  - cirkulationsplats visar väjningsplikt in och motsols körning
  - stopplikt visar helt stopp vid stopplinje
  - motorväg visar accelerationsfält och filbyte korrekt
  - mörkerkörning visar ljuskäglor och avbländning
  - halka visar längre stoppsträcka och sladdrisk
- Ta mobil- och desktopskärmbilder för minst de viktigaste scenerna.
- Kontrollera att text inte överlappar 3D-vyn eller kontrollerna.
