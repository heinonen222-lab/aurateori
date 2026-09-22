import type { QuestionCategory } from "@/data/questions";

export interface LessonSource {
  label: string;
  url: string;
}

export type LessonStep =
  | {
      kind: "info";
      title: string;
      body: string;
      sign?: string;
      signs?: string[];
      bullets?: string[];
      source?: LessonSource;
    }
  | {
      kind: "check";
      question: string;
      options: string[];
      correct: number;
      explanation: string;
      sign?: string;
      signs?: string[];
      source?: LessonSource;
    };

export interface Lesson {
  id: string;
  title: string;
  category: QuestionCategory;
  summary: string;
  minutes: number;
  reference: string;
  sources: LessonSource[];
  steps: LessonStep[];
}

const TV = {
  korkortB: {
    label: "Trafikverket – Personbil och lätt lastbil (B)",
    url: "https://www.trafikverket.se/korkort/ta-korkort/personbil-och-latt-lastbil/",
  },
  sakerhetPaVag: {
    label: "Trafikverket – Din säkerhet på vägen",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/",
  },
  hastighetsgranser: {
    label: "Trafikverket – Hastighetsgränser på väg",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/",
  },
  krockvald: {
    label: "Trafikverket – Hastighet och krockvåld",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/hastighet-och-krockvald/",
  },
  hallbarhet: {
    label: "Trafikverket – Hastighet och hållbarhet",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/hastighet-och-hallbarhet/",
  },
  alkoholNarkotika: {
    label: "Trafikverket – Alkohol och narkotika i vägtrafiken",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/alkohol-och-narkotika-i-vagtrafiken/",
  },
  rattfylleriLagen: {
    label: "Trafikverket – Vad säger lagen om rattfylleri?",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/alkohol-och-narkotika-i-vagtrafiken/vad-sager-lagen-om-rattfylleri/",
  },
  alkoholPaverkan: {
    label: "Trafikverket – Alkohol, så påverkar den",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/alkohol-och-narkotika-i-vagtrafiken/alkohol---sa-paverkar-den/",
  },
} satisfies Record<string, LessonSource>;

const TS = {
  trafikregler: {
    label: "Transportstyrelsen – Trafikregler",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/",
  },
  hastighet: {
    label: "Transportstyrelsen – Hastighet",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/hastighet/",
  },
  vagmarken: {
    label: "Transportstyrelsen – Vägmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/",
  },
  varningsmarken: {
    label: "Transportstyrelsen – Varningsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/varningsmarken/",
  },
  forbudsmarken: {
    label: "Transportstyrelsen – Förbudsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/forbudsmarken/",
  },
  pabudsmarken: {
    label: "Transportstyrelsen – Påbudsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/pabudsmarken/",
  },
  anvisningsmarken: {
    label: "Transportstyrelsen – Anvisningsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/anvisningsmarken/",
  },
  dack: {
    label: "Transportstyrelsen – Däck",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/",
  },
  vinterdack: {
    label: "Transportstyrelsen – Vinterdäck",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/vinterdack/",
  },
  stannaParkera: {
    label: "Transportstyrelsen – Stannande och parkering",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/stannande-och-parkering/",
  },
  omkorning: {
    label: "Transportstyrelsen – Generella trafikregler",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/",
  },
  belysning: {
    label: "Transportstyrelsen – Belysning på fordon",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/belysning/",
  },
  korkortB: {
    label: "Transportstyrelsen – Ta körkort för personbil (B)",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/Korkort/ta-korkort/personbil-b/",
  },
} satisfies Record<string, LessonSource>;

export const LESSONS: Lesson[] = [
  {
    id: "vajningsregler",
    title: "Väjningsregler i korsningar",
    category: "Trafikregler",
    summary: "Högerregeln, väjningsplikt, stopplikt och huvudled – i rätt ordning.",
    minutes: 6,
    reference: "Trafikförordningen 3 kap. 18–23 §§",
    sources: [TS.trafikregler, TS.vagmarken, TV.korkortB],
    steps: [
      {
        kind: "info",
        title: "Grundregeln: högerregeln",
        body: "I en korsning utan skyltar eller signaler gäller högerregeln: du ska lämna företräde åt trafik som kommer från höger.",
        signs: ["varning-korsning"],
        bullets: [
          "Gäller även på parkeringsplatser och inom bostadsområden",
          "Gäller oavsett vägens bredd eller beläggning",
          "Cyklister och mopedister omfattas också",
        ],
        source: TS.trafikregler,
      },
      {
        kind: "check",
        question:
          "Du kör på en gata utan vägmärken. En bil närmar sig korsningen från höger. Vad gäller?",
        options: [
          "Du har företräde eftersom du redan är i rörelse",
          "Du ska lämna företräde åt bilen från höger",
          "Den som kommer till korsningen först har företräde",
          "Bredaste vägen har alltid företräde",
        ],
        correct: 1,
        explanation:
          "Utan vägmärken gäller högerregeln. Bilen från höger har företräde – oavsett vem som kom fram först.",
        sign: "varning-korsning",
        source: TS.trafikregler,
      },
      {
        kind: "info",
        title: "Väjningsplikt",
        body: "Märket väjningsplikt betyder att du ska lämna företräde åt fordon på den korsande vägen. Du måste inte stanna – men du ska sänka farten och vara beredd att stanna.",
        sign: "vajningsplikt",
        source: TS.vagmarken,
      },
      {
        kind: "info",
        title: "Stopplikt",
        body: "Vid stopplikt måste du alltid stanna helt, även om vägen är tom. Stanna vid stopplinjen, eller där du har god sikt om linje saknas.",
        sign: "forbud-stopp",
        source: TS.vagmarken,
      },
      {
        kind: "check",
        question: "Vad är skillnaden mellan väjningsplikt och stopplikt?",
        options: [
          "Ingen skillnad i praktiken",
          "Stopplikt kräver helt stillastående, väjningsplikt kräver bara att du lämnar företräde",
          "Väjningsplikt gäller bara i tätort",
          "Stopplikt gäller bara när det finns en stopplinje",
        ],
        correct: 1,
        explanation:
          "Stopplikt innebär att fordonet måste stå helt still innan du kör vidare. Väjningsplikt innebär att du ska lämna företräde, men får rulla vidare om vägen är fri.",
        signs: ["vajningsplikt", "forbud-stopp"],
        source: TS.vagmarken,
      },
      {
        kind: "info",
        title: "Huvudled",
        body: "På huvudled har du företräde mot anslutande vägar. Kom ihåg: parkering är förbjuden på huvudled utanför markerade platser, och när huvudleden upphör gäller högerregeln igen.",
        signs: ["anv-huvudled", "anv-slut-huvudled", "forbud-parkering"],
        source: TS.anvisningsmarken,
      },
      {
        kind: "check",
        question: "Du kör på huvudled. Vad gäller för parkering?",
        options: [
          "Parkering är tillåten om du står helt utanför körbanan",
          "Parkering är förbjuden, utom på markerade parkeringsplatser",
          "Parkering är alltid tillåten på huvudled",
          "Parkering är tillåten max 24 timmar",
        ],
        correct: 1,
        explanation:
          "Det är förbjudet att parkera på huvudled annat än på särskilt anordnade parkeringsplatser. Att stanna för på- och avstigning är dock tillåtet.",
        signs: ["anv-huvudled", "info-parkering"],
        source: TS.trafikregler,
      },
      {
        kind: "info",
        title: "Cirkulationsplats och gångfartsområde",
        body: "I en cirkulationsplats gäller normalt väjningsplikt in i rondellen och du kör motsols. I ett gångfartsområde får du köra högst gångfart och har alltid väjningsplikt mot gående.",
        signs: ["pabud-rondellen", "anv-gangfartsomrade", "anv-slut-gangfart"],
        source: TS.pabudsmarken,
      },
    ],
  },
  {
    id: "hastighet-stoppstracka",
    title: "Hastighet, reaktion och stoppsträcka",
    category: "Trafikregler",
    summary: "Hur farten påverkar bromssträckan – och tumregeln du kan räkna i huvudet.",
    minutes: 7,
    reference: "Trafikförordningen 3 kap. 14–17 §§",
    sources: [TV.hastighetsgranser, TV.krockvald, TS.hastighet],
    steps: [
      {
        kind: "info",
        title: "Stoppsträckan består av två delar",
        body: "Stoppsträcka = reaktionssträcka + bromssträcka. Reaktionssträckan växer linjärt med hastigheten, men bromssträckan växer med kvadraten på hastigheten.",
        signs: ["forbud-hastighet-50", "forbud-hastighet-30"],
        bullets: [
          "Reaktionstid är typiskt 1 sekund",
          "Dubbel hastighet ger fyra gånger längre bromssträcka",
          "Halvt slitna däck eller våt asfalt förlänger bromssträckan kraftigt",
        ],
        source: TV.krockvald,
      },
      {
        kind: "info",
        title: "Tumregel för reaktionssträckan",
        body: "Ta hastigheten, stryk sista siffran och multiplicera med reaktionstiden i sekunder gånger 3. Vid 50 km/h och 1 sekund: 5 × 3 = 15 meter innan du ens börjar bromsa.",
        sign: "forbud-hastighet-50",
        source: TV.hastighetsgranser,
      },
      {
        kind: "check",
        question: "Du dubblar hastigheten från 50 till 100 km/h. Vad händer med bromssträckan?",
        options: [
          "Den blir dubbelt så lång",
          "Den blir ungefär tre gånger så lång",
          "Den blir ungefär fyra gånger så lång",
          "Den påverkas knappt om bromsarna är bra",
        ],
        correct: 2,
        explanation:
          "Bromssträckan är proportionell mot hastigheten i kvadrat. Dubbel hastighet ger fyra gånger längre bromssträcka.",
        signs: ["forbud-hastighet-50", "info-motorvag"],
        source: TV.krockvald,
      },
      {
        kind: "info",
        title: "Bashastigheter att kunna utantill",
        body: "Utan skyltning gäller 50 km/h inom tättbebyggt område och 70 km/h utanför. Skyltad hastighet gäller alltid före bashastigheten.",
        signs: ["info-tatort", "forbud-hastighet-30", "pabud-minsta-hastighet"],
        source: TS.hastighet,
      },
      {
        kind: "check",
        question:
          "Vilken hastighet gäller direkt efter märket 'Tättbebyggt område' om inget annat anges?",
        options: ["30 km/h", "40 km/h", "50 km/h", "70 km/h"],
        correct: 2,
        explanation:
          "Bashastigheten inom tättbebyggt område är 50 km/h. Kommunen kan sänka den lokalt med skyltning.",
        sign: "info-tatort",
        source: TS.hastighet,
      },
      {
        kind: "info",
        title: "Avståndet framåt",
        body: "Använd tresekundersregeln: välj en fast punkt och räkna tre sekunder från att fordonet framför passerar den. Vid halka eller dåligt väder – dubbla avståndet.",
        signs: ["varning-halka", "varning-kurva", "varning-vagarbete"],
        source: TV.hastighetsgranser,
      },
      {
        kind: "check",
        question:
          "Du närmar dig detta märke på en väg med 90 km/h och det är blött i vägbanan. Vad gör du?",
        options: [
          "Håller hastigheten – märket är bara en rekommendation",
          "Sänker farten och ökar avståndet till fordonet framför",
          "Bromsar hårt precis vid märket",
          "Byter fil och ökar farten för att komma förbi faran",
        ],
        correct: 1,
        explanation:
          "Varningsmärken kräver ingen exakt hastighet, men du ska anpassa farten till faran. Vid halka förlängs bromssträckan kraftigt – sänk farten och öka avståndet.",
        sign: "varning-halka",
        source: TS.varningsmarken,
      },
    ],
  },
  {
    id: "vagmarken-system",
    title: "Vägmärkenas system",
    category: "Vägmärken",
    summary: "Läs av form och färg och du kan tolka märken du aldrig sett förut.",
    minutes: 5,
    reference: "Vägmärkesförordningen (2007:90)",
    sources: [
      TS.vagmarken,
      TS.varningsmarken,
      TS.forbudsmarken,
      TS.pabudsmarken,
      TS.anvisningsmarken,
    ],
    steps: [
      {
        kind: "info",
        title: "Form och färg berättar allt",
        body: "Triangel med röd ram = varning. Rund med röd ram = förbud. Rund med blå botten = påbud. Rektangulär blå = anvisning eller information.",
        signs: ["varning-vilt", "forbud-trafik", "pabud-hoger", "anv-huvudled"],
        source: TS.vagmarken,
      },
      {
        kind: "info",
        title: "Varningsmärken",
        body: "Varnar för en fara längre fram. De påbjuder inget – men du ska anpassa hastigheten så att du kan hantera faran.",
        signs: ["varning-vilt", "varning-barn", "varning-mote", "varning-avsmalnande"],
        source: TS.varningsmarken,
      },
      {
        kind: "info",
        title: "Förbudsmärken",
        body: "Anger att något är förbjudet. De gäller från märket fram till nästa korsning om inget annat anges med tilläggstavla.",
        signs: [
          "forbud-infart",
          "forbud-omkorning",
          "forbud-stannaparkera",
          "forbud-svang-vanster",
        ],
        source: TS.forbudsmarken,
      },
      {
        kind: "check",
        question: "Ett runt märke med röd ram och en vit stapel på rött – vad är det?",
        options: [
          "Varning för avsmalnande väg",
          "Förbud mot infart med fordon",
          "Påbjuden körriktning",
          "Slut på huvudled",
        ],
        correct: 1,
        explanation:
          "Rund form med röd ram betyder förbud. Vit stapel på rött är förbud mot infart med fordon – enkelriktat mot dig.",
        signs: ["forbud-infart", "anv-enkelriktat"],
        source: TS.forbudsmarken,
      },
      {
        kind: "info",
        title: "Påbudsmärken",
        body: "Blå rund botten talar om vad du måste göra: körriktning, cirkulationsplats eller vilken trafik banan är avsedd för.",
        signs: ["pabud-vanster", "pabud-rondellen", "pabud-cykel", "pabud-gangbana"],
        source: TS.pabudsmarken,
      },
      {
        kind: "check",
        question: "Vad innebär ett runt märke med blå botten och vita pilar i ring?",
        options: [
          "Varning för korsning",
          "Påbjuden cirkulationsplats – du ska köra motsols i rondellen",
          "Förbud att köra in i rondellen",
          "Rekommenderad hastighet i rondell",
        ],
        correct: 1,
        explanation:
          "Blå rund botten betyder påbud. Märket anger cirkulationsplats där du kör motsols runt rondellen.",
        sign: "pabud-rondellen",
        source: TS.pabudsmarken,
      },
      {
        kind: "info",
        title: "Anvisningsmärken",
        body: "Anger vad som gäller inom ett område eller på en sträcka – till exempel gångfartsområde, huvudled eller enkelriktat. Reglerna gäller till motsvarande slutmärke.",
        signs: ["anv-gangfartsomrade", "anv-slut-gangfart", "anv-overgang", "anv-enkelriktat"],
        source: TS.anvisningsmarken,
      },
      {
        kind: "info",
        title: "Lokaliserings- och informationsmärken",
        body: "Rektangulära märken som visar vägnummer, vägtyp och service. På motorväg och motortrafikled gäller särskilda regler: inga gående, cyklar eller U-vändningar.",
        signs: ["info-motorvag", "info-motortrafikled", "info-vagnr", "info-sjukhus"],
        source: TS.vagmarken,
      },
      {
        kind: "check",
        question: "Vilket märke visar att motorvägens särskilda regler upphör?",
        options: [
          "Märket för motortrafikled",
          "Märket för slut på motorväg",
          "Märket för tättbebyggt område",
          "Märket för slut på huvudled",
        ],
        correct: 1,
        explanation:
          "Slut på motorväg upphäver motorvägsreglerna. Därefter kan du möta korsande trafik, gående och lägre hastigheter.",
        signs: ["info-motorvag-slut", "info-motorvag"],
        source: TS.vagmarken,
      },
    ],
  },
  {
    id: "manniskan-trafiken",
    title: "Människan i trafiken",
    category: "Människan & Trafiken",
    summary: "Alkohol, trötthet, mediciner och riskbeteende – vad lagen säger och vad kroppen gör.",
    minutes: 6,
    reference: "Trafikbrottslagen 4 och 4 a §§",
    sources: [TV.alkoholNarkotika, TV.rattfylleriLagen, TV.alkoholPaverkan, TV.sakerhetPaVag],
    steps: [
      {
        kind: "info",
        title: "Promillegränser",
        body: "Rattfylleri börjar vid 0,2 promille. Grovt rattfylleri gäller från 1,0 promille och kan ge fängelse.",
        bullets: [
          "Kroppen bryter ner cirka 0,10–0,15 promille per timme",
          "Kaffe, mat eller dusch påskyndar inte nedbrytningen",
          "Alkohol försämrar omdöme före reaktionsförmåga",
        ],
        source: TV.rattfylleriLagen,
      },
      {
        kind: "check",
        question: "Vid vilken alkoholkoncentration i blodet börjar rattfylleri?",
        options: ["0,1 promille", "0,2 promille", "0,5 promille", "1,0 promille"],
        correct: 1,
        explanation:
          "Gränsen för rattfylleri är 0,2 promille. Vid 1,0 promille eller mer räknas det som grovt rattfylleri.",
        source: TV.rattfylleriLagen,
      },
      {
        kind: "info",
        title: "Trötthet",
        body: "Trötthet ger effekter som liknar alkohol: långsammare reaktion, sämre sidoseende och mikrosömn. Enda fungerande åtgärden är att stanna och sova 15–20 minuter.",
        signs: ["info-parkering"],
        source: TV.sakerhetPaVag,
      },
      {
        kind: "check",
        question: "Du blir trött under en längre körning. Vad är rätt åtgärd?",
        options: [
          "Öppna fönstret och höj musiken",
          "Stanna på säker plats och ta en kort sömn",
          "Öka hastigheten för att komma fram snabbare",
          "Drick energidryck och fortsätt i minst två timmar",
        ],
        correct: 1,
        explanation:
          "Frisk luft och musik döljer bara symtomen. Det enda som verkligen hjälper är vila – en kort tupplur på 15–20 minuter.",
        sign: "info-parkering",
        source: TV.sakerhetPaVag,
      },
      {
        kind: "info",
        title: "Oskyddade trafikanter",
        body: "Barn, cyklister och gående är svårast att upptäcka och tar mest skada. Sänk farten där de finns – vid 30 km/h överlever de flesta en påkörning, vid 50 km/h gör de det oftast inte.",
        signs: ["varning-barn", "varning-cyklande", "anv-overgang", "forbud-hastighet-30"],
        source: TV.krockvald,
      },
      {
        kind: "check",
        question: "Varför är just detta märke ett skäl att sänka farten mer än vanligt?",
        options: [
          "Barn rör sig oförutsägbart och är svåra att upptäcka bakom parkerade bilar",
          "Det är alltid 20 km/h vid märket",
          "Märket innebär stopplikt",
          "Märket gäller bara skoltid",
        ],
        correct: 0,
        explanation:
          "Varning för barn sätts där barn ofta rör sig. Barn kan inte bedöma hastigheter och kan springa ut plötsligt – anpassa farten så att du kan stanna.",
        sign: "varning-barn",
        source: TS.varningsmarken,
      },
      {
        kind: "info",
        title: "Grupptryck och riskbeteende",
        body: "Unga förare har högst olycksrisk, framför allt med passagerare i samma ålder. Att medvetet planera hur du hanterar grupptryck sänker risken mer än ökad körvana.",
        source: TV.sakerhetPaVag,
      },
    ],
  },
  {
    id: "miljo-ekonomi",
    title: "Miljö och sparsam körning",
    category: "Miljö",
    summary: "Eco-driving, bränsleförbrukning och vad avgaserna faktiskt innehåller.",
    minutes: 5,
    reference: "Trafikverket – hastighet och hållbarhet",
    sources: [TV.hallbarhet, TV.hastighetsgranser, TS.dack],
    steps: [
      {
        kind: "info",
        title: "Sparsam körning i praktiken",
        body: "Målet är jämn fart och få inbromsningar. Rätt teknik sänker förbrukningen med 10–20 procent.",
        signs: ["forbud-hastighet-50", "info-tatort"],
        bullets: [
          "Växla upp tidigt, kör på låga varv",
          "Motorbromsa med växeln i – bränslet stängs av",
          "Undvik tomgång: stäng av vid stopp längre än en minut",
          "Kontrollera lufttrycket i däcken varje månad",
        ],
        source: TV.hallbarhet,
      },
      {
        kind: "check",
        question: "Vad sänker bränsleförbrukningen mest vid stadskörning?",
        options: [
          "Att accelerera snabbt och sedan rulla",
          "Att planera framåt och hålla jämn låg fart med tidiga uppväxlingar",
          "Att ha extra lågt lufttryck i däcken",
          "Att köra på höga varv i låg växel",
        ],
        correct: 1,
        explanation:
          "Framförhållning och jämn fart minskar antalet accelerationer, vilket är den största bränsleposten i stadstrafik.",
        sign: "info-tatort",
        source: TV.hallbarhet,
      },
      {
        kind: "info",
        title: "Hastighet och utsläpp",
        body: "Bränsleförbrukningen ökar kraftigt med hastigheten. Att sänka farten från 110 till 100 km/h på motorväg minskar både utsläpp och krockvåld – och kostar bara någon minut restid.",
        signs: ["info-motorvag", "forbud-hastighet-50"],
        source: TV.hallbarhet,
      },
      {
        kind: "info",
        title: "Avgaserna",
        body: "Koldioxid (CO₂) påverkar klimatet. Kväveoxider (NOx) och partiklar påverkar hälsan lokalt. Kolmonoxid (CO) är giftigt och försämrar blodets syreupptagning.",
        source: TV.hallbarhet,
      },
      {
        kind: "check",
        question: "Vilket ämne i avgaserna påverkar främst klimatet?",
        options: ["Kolmonoxid", "Kväveoxider", "Koldioxid", "Partiklar"],
        correct: 2,
        explanation:
          "Koldioxid är den dominerande växthusgasen från vägtrafik. Kväveoxider och partiklar är främst hälsoproblem.",
        source: TV.hallbarhet,
      },
    ],
  },
  {
    id: "fordonet",
    title: "Fordonet: däck, bromsar och last",
    category: "Fordonskännedom",
    summary: "Mönsterdjup, vinterdäcksregler, bromssystem och hur lasten påverkar körningen.",
    minutes: 6,
    reference: "Trafikförordningen 4 kap. 18 a §, Fordonsförordningen",
    sources: [TS.dack, TS.vinterdack, TV.korkortB],
    steps: [
      {
        kind: "info",
        title: "Däck och mönsterdjup",
        body: "Sommardäck kräver minst 1,6 mm mönsterdjup. Vinterdäck ska ha minst 3 mm under vinterväglag.",
        signs: ["varning-halka"],
        bullets: [
          "Vinterdäck krävs 1 dec–31 mars vid vinterväglag",
          "För lågt lufttryck ger högre förbrukning och sämre styrning",
          "Blanda aldrig dubbat och odubbat olika på samma axel",
        ],
        source: TS.vinterdack,
      },
      {
        kind: "check",
        question: "Vilket är det lagliga minsta mönsterdjupet för vinterdäck vid vinterväglag?",
        options: ["1,6 mm", "3 mm", "4 mm", "5 mm"],
        correct: 1,
        explanation:
          "Vinterdäck måste ha minst 3 mm mönsterdjup vid vinterväglag. För sommardäck gäller 1,6 mm.",
        sign: "varning-halka",
        source: TS.vinterdack,
      },
      {
        kind: "info",
        title: "Bromsar",
        body: "ABS förhindrar hjullåsning så att du kan styra under full bromsning – men förkortar inte alltid bromssträckan. Vid nödbromsning: tryck hårt och håll kvar, och styr undan.",
        signs: ["varning-mote", "varning-kurva"],
        source: TV.krockvald,
      },
      {
        kind: "check",
        question: "Vad är den viktigaste fördelen med ABS-bromsar?",
        options: [
          "Alltid kortare bromssträcka",
          "Du behåller styrförmågan vid full bromsning",
          "Bromsarna slits mindre",
          "Bilen bromsar automatiskt vid hinder",
        ],
        correct: 1,
        explanation:
          "ABS hindrar hjulen från att låsa sig, vilket gör att du kan fortsätta styra. Bromssträckan kan i vissa fall till och med bli längre, t.ex. i grus.",
        sign: "varning-kurva",
        source: TV.krockvald,
      },
      {
        kind: "info",
        title: "Last och tyngdpunkt",
        body: "Tung last högt upp eller bak i bilen höjer tyngdpunkten och gör bilen instabil. Placera tungt gods lågt och långt fram, och säkra allt – vid en krock blir en lös väska en projektil.",
        signs: ["varning-avsmalnande", "varning-vagarbete"],
        source: TV.korkortB,
      },
    ],
  },
  {
    id: "motorvag",
    title: "Motorväg och motortrafikled",
    category: "Trafikregler",
    summary: "Påfart, körfältsval, avfart och vad som är förbjudet på motorväg.",
    minutes: 6,
    reference: "Trafikförordningen 9 kap.",
    sources: [TS.trafikregler, TS.anvisningsmarken, TV.korkortB],
    steps: [
      {
        kind: "info",
        title: "Vem får köra där?",
        body: "Motorväg och motortrafikled är till för snabb, mötesfri trafik. Ditt fordon måste kunna och få köra minst 40 km/h. Gående, cyklar, mopeder klass II och traktorer är förbjudna.",
        signs: ["info-motorvag", "info-motortrafikled"],
        bullets: [
          "Motorväg har alltid skilda körbanor och planskilda korsningar",
          "Motortrafikled kan ha ett körfält i varje riktning – möte kan förekomma",
          "Hastigheten anges med vägmärke, ofta 80–120 km/h",
        ],
        source: TS.anvisningsmarken,
      },
      {
        kind: "check",
        question: "Vilket fordon får köras på motorväg?",
        options: [
          "Moped klass II",
          "Fordon som kan och får köra minst 40 km/h",
          "Traktor med släp",
          "Cykel om du håller till höger",
        ],
        correct: 1,
        explanation:
          "Kravet är att fordonet både kan och får framföras i minst 40 km/h. Gående, cyklar, mopeder och traktorer är förbjudna på motorväg.",
        sign: "info-motorvag",
        source: TS.trafikregler,
      },
      {
        kind: "info",
        title: "Påfart: anpassa farten i accelerationsfältet",
        body: "Använd hela accelerationsfältet för att komma upp i samma fart som trafiken på motorvägen. Väv in i en lucka – du har väjningsplikt mot fordonen i körfältet, men de bör hjälpa dig genom att byta körfält.",
        bullets: [
          "Titta växelvis framåt och över vänster axel",
          "Stanna aldrig i accelerationsfältet om det går att undvika",
          "Blinka vänster i god tid",
        ],
        source: TS.trafikregler,
      },
      {
        kind: "info",
        title: "Körfält och avfart",
        body: "Kör i höger körfält. Vänster körfält används för omkörning och lämnas så snart du är klar. Lämna motorvägen via retardationsfältet och bromsa först när du är inne i fältet.",
        signs: ["info-motorvag-slut"],
        source: TS.trafikregler,
      },
      {
        kind: "check",
        question: "Du har kört om ett fordon i vänster körfält. Vad gör du?",
        options: [
          "Ligger kvar i vänster fält – där är det lugnast",
          "Byter tillbaka till höger körfält när du har god marginal",
          "Ökar farten ytterligare",
          "Bromsar och släpper förbi",
        ],
        correct: 1,
        explanation:
          "Vänster körfält är ett omkörningsfält. Så snart omkörningen är klar och du har god marginal går du tillbaka till höger körfält.",
        source: TS.trafikregler,
      },
      {
        kind: "info",
        title: "Förbjudet på motorväg",
        body: "Du får inte backa, vända, köra på vägrenen eller stanna annat än vid nödsituation. Får du motorstopp: ställ bilen så långt höger som möjligt, sätt ut varningstriangeln och gå bakom vägräcket.",
        signs: ["forbud-stannaparkera"],
        source: TV.sakerhetPaVag,
      },
    ],
  },
  {
    id: "omkorning",
    title: "Omkörning och körfältsplacering",
    category: "Trafikregler",
    summary: "När du får köra om, när det är förbjudet och hur du gör det säkert.",
    minutes: 6,
    reference: "Trafikförordningen 3 kap. 30–40 §§",
    sources: [TS.omkorning, TS.forbudsmarken, TV.sakerhetPaVag],
    steps: [
      {
        kind: "info",
        title: "Omkörning sker till vänster",
        body: "Grundregeln är omkörning till vänster. Du får köra om till höger när fordonet framför tydligt saktat in och svänger vänster, samt i köande trafik med flera körfält i samma riktning.",
        signs: ["forbud-omkorning"],
        bullets: [
          "Kontrollera backspeglar och döda vinkeln före körfältsbyte",
          "Blinka, håll jämn hög fart och kom in framför i god tid",
          "Tveka aldrig mitt i en omkörning – avbryt istället tidigt",
        ],
        source: TS.omkorning,
      },
      {
        kind: "check",
        question: "När får du köra om till höger?",
        options: [
          "Aldrig",
          "När fordonet framför har saktat in och svänger till vänster",
          "När du har bråttom",
          "På alla vägar utanför tättbebyggt område",
        ],
        correct: 1,
        explanation:
          "Höger omkörning är tillåten bland annat när fordonet framför tydligt minskat farten för att svänga vänster, och i köande flerfältstrafik där fälten rör sig olika fort.",
        source: TS.omkorning,
      },
      {
        kind: "info",
        title: "Här är omkörning förbjuden",
        body: "Kör aldrig om strax före eller på ett övergångsställe, en cykelöverfart eller cykelpassage utan trafiksignal. Omkörning är också förbjuden när sikten är skymd av backkrön eller kurva, och där vägmärket förbjuder omkörning.",
        signs: ["forbud-omkorning", "anv-overgang"],
        bullets: [
          "Vid järnvägskorsning utan bommar: kör inte om",
          "Möt aldrig en omkörning i en kurva – du ser inte mötande",
          "Omkörning kräver fri sikt hela vägen tillbaka till eget körfält",
        ],
        source: TS.forbudsmarken,
      },
      {
        kind: "check",
        question: "Du närmar dig ett obevakat övergångsställe och bilen framför saktar in. Vad gäller?",
        options: [
          "Du får köra om till vänster om det är fri väg",
          "Du får inte köra om – förbud gäller strax före och på övergångsstället",
          "Du får köra om om ingen gående syns",
          "Du får köra om till höger",
        ],
        correct: 1,
        explanation:
          "Omkörning är förbjuden omedelbart före och på ett obevakat övergångsställe. Bilen framför kan sakta in för en gående du inte ser.",
        sign: "anv-overgang",
        source: TS.omkorning,
      },
      {
        kind: "info",
        title: "Minnesregel",
        body: "Sikt – lucka – marginal. Saknas något av de tre: kör inte om. En omkörning som sparar en minut är aldrig värd risken.",
        source: TV.sakerhetPaVag,
      },
    ],
  },
  {
    id: "stanna-parkera",
    title: "Stannande och parkering",
    category: "Trafikregler",
    summary: "Skillnaden mellan att stanna och parkera – och alla avstånd du måste kunna.",
    minutes: 7,
    reference: "Trafikförordningen 3 kap. 47–55 §§",
    sources: [TS.stannaParkera, TS.forbudsmarken, TV.korkortB],
    steps: [
      {
        kind: "info",
        title: "Stanna eller parkera?",
        body: "Att stanna är ett kort stopp för att släppa av passagerare eller lasta. Allt annat frivilligt stillastående räknas som parkering. Där det är förbjudet att stanna är det alltid även förbjudet att parkera.",
        signs: ["forbud-parkering", "forbud-stannaparkera"],
        bullets: [
          "Blå skylt med rött streck = förbud att parkera",
          "Blå skylt med rött kryss = förbud att stanna och parkera",
          "Stopp för trafiksignal eller kö räknas inte som stannande",
        ],
        source: TS.forbudsmarken,
      },
      {
        kind: "info",
        title: "Avstånden du måste kunna",
        body: "Du får inte stanna eller parkera i en korsning eller närmare än 10 meter före korsande körbanas närmaste ytterkant. Samma 10 meter gäller före ett övergångsställe, en cykelöverfart, cykelpassage eller järnvägskorsning.",
        bullets: [
          "10 m före korsning, övergångsställe, cykelpassage och cykelöverfart",
          "Efter ett övergångsställe får du stanna – men skym aldrig sikten",
          "Aldrig i ett cykelfält, på en busshållplats eller framför en utfart",
        ],
        source: TS.stannaParkera,
      },
      {
        kind: "check",
        question: "Hur nära före ett övergångsställe får du parkera?",
        options: ["Direkt före", "5 meter", "10 meter", "20 meter"],
        correct: 2,
        explanation:
          "Du måste hålla minst 10 meter före övergångsstället. Parkerar du närmare skyms sikten mellan gående och förare – en klassisk olycksorsak.",
        sign: "anv-overgang",
        source: TS.stannaParkera,
      },
      {
        kind: "info",
        title: "Huvudled, vänster sida och 24-timmarsregeln",
        body: "På huvudled utanför tättbebyggt område är parkering förbjuden. Du ska stanna och parkera på höger sida i färdriktningen – på enkelriktad gata får båda sidor användas. På allmän plats inom tättbebyggt område gäller högst 24 timmar i följd på vardagar utom dag före söndag och helgdag.",
        signs: ["anv-huvudled", "anv-enkelriktat"],
        source: TS.stannaParkera,
      },
      {
        kind: "check",
        question: "Var får du normalt stanna och parkera på en dubbelriktad gata?",
        options: [
          "På vänster sida i färdriktningen",
          "På höger sida i färdriktningen",
          "Vilken sida som helst",
          "Alltid på trottoaren",
        ],
        correct: 1,
        explanation:
          "På dubbelriktad gata gäller höger sida i färdriktningen. Undantaget är enkelriktad gata, där båda sidor är tillåtna om inget annat anges.",
        sign: "anv-enkelriktat",
        source: TS.stannaParkera,
      },
    ],
  },
  {
    id: "morker-belysning",
    title: "Mörkerkörning och belysning",
    category: "Trafiksäkerhet" as QuestionCategory extends "Trafiksäkerhet" ? QuestionCategory : "Människan & Trafiken",
    summary: "Hel- och halvljus, mötande trafik och varför mörker kräver lägre fart.",
    minutes: 6,
    reference: "Trafikförordningen 3 kap. 66–77 §§",
    sources: [TS.belysning, TV.sakerhetPaVag, TV.korkortB],
    steps: [
      {
        kind: "info",
        title: "Halvljus är grundinställningen",
        body: "Halvljus ska användas i mörker, gryning, skymning och vid dålig sikt. Bilen ska dessutom ha ljus på dygnet runt – varselljus eller halvljus räcker i dagsljus, men positionsljus (parkeringsljus) är aldrig tillräckligt för körning.",
        signs: ["varning-mote"],
        bullets: [
          "Halvljus lyser betydligt kortare än helljus",
          "Varselljus lyser inte bakåt – byt till halvljus i dimma och regn",
          "Kontrollera att alla lampor fungerar innan du kör",
        ],
        source: TS.belysning,
      },
      {
        kind: "check",
        question: "Vilken belysning räcker inte när du kör i mörker?",
        options: ["Halvljus", "Helljus på fri väg", "Positionsljus", "Halvljus med dimbakljus i dimma"],
        correct: 2,
        explanation:
          "Positionsljus (parkeringsljus) är bara till för att markera ett stillastående fordon. I mörker ska du köra på halvljus, och helljus när det inte stör någon.",
        source: TS.belysning,
      },
      {
        kind: "info",
        title: "Helljus – och när du måste blända av",
        body: "Använd helljus så mycket som möjligt på mörka vägar, men blända av i god tid när du möter någon, när du kör upp bakom ett fordon och på belysta gator. Blir du själv bländad: sänk farten och titta mot vägens högra kant.",
        signs: ["varning-mote", "varning-vilt"],
        source: TS.belysning,
      },
      {
        kind: "info",
        title: "Anpassa farten efter ljuset",
        body: "Du ska kunna stanna inom den sträcka du ser. På halvljus innebär det ofta betydligt lägre fart än skyltad hastighet. Räkna med vilt, mörkklädda gående och cyklister utan reflex.",
        signs: ["varning-vilt", "varning-barn"],
        bullets: [
          "Mörker + regn = allra sämst sikt, våt asfalt reflekterar bort ljuset",
          "Titta inte in i mötande ljus – titta mot höger vägkant",
          "Rena rutor och strålkastare ger märkbart bättre sikt",
        ],
        source: TV.sakerhetPaVag,
      },
      {
        kind: "check",
        question: "Du blir bländad av ett mötande fordon. Vad är rätt?",
        options: [
          "Slå på helljuset tillbaka",
          "Sänk farten och titta mot vägens högra kant",
          "Blunda en kort stund",
          "Öka farten så att mötet går fort",
        ],
        correct: 1,
        explanation:
          "Sänk farten så att du kan stanna på den sikt du har, och rikta blicken mot höger vägkant eller kantlinjen för att behålla din referens.",
        sign: "varning-mote",
        source: TV.sakerhetPaVag,
      },
    ],
  },
  {
    id: "halt-vaglag",
    title: "Halt väglag och vinterkörning",
    category: "Trafiksäkerhet" as QuestionCategory extends "Trafiksäkerhet" ? QuestionCategory : "Människan & Trafiken",
    summary: "Vinterdäck, avstånd, vattenplaning och hur du hanterar sladd.",
    minutes: 6,
    reference: "Trafikförordningen 4 kap. 18 a §",
    sources: [TS.vinterdack, TS.dack, TV.sakerhetPaVag],
    steps: [
      {
        kind: "info",
        title: "Vinterdäck och friktion",
        body: "Vid vinterväglag 1 december–31 mars ska bilen ha vinterdäck med minst 3 mm mönsterdjup. På is kan bromssträckan bli flera gånger längre än på torr asfalt – friktionen är det som avgör, inte bilens teknik.",
        signs: ["varning-halka"],
        bullets: [
          "Dubbdäck är tillåtna 1 oktober–15 april, och i övrigt vid vinterväglag",
          "Blanda inte dubbat och odubbat på samma axel",
          "Fyrhjulsdrift hjälper dig att komma igång – inte att bromsa",
        ],
        source: TS.vinterdack,
      },
      {
        kind: "check",
        question: "Vad hjälper fyrhjulsdrift dig med på halt väglag?",
        options: [
          "Kortare bromssträcka",
          "Bättre acceleration och framkomlighet",
          "Bättre kurvtagning på is",
          "Kortare reaktionstid",
        ],
        correct: 1,
        explanation:
          "Fyrhjulsdrift ger bättre framkomlighet vid start, men bromsning och kurvtagning begränsas av däckens grepp precis som för alla andra bilar.",
        sign: "varning-halka",
        source: TV.sakerhetPaVag,
      },
      {
        kind: "info",
        title: "Öka avståndet och kör mjukt",
        body: "Använd minst 3 sekunders avstånd på torr väg och dubbla det vid halka. Allt du gör ska vara mjukt: gasa, bromsa och styr lite i taget. Testa gärna bromsarna försiktigt när ingen är bakom dig.",
        bullets: [
          "Broms och styrning samtidigt på is överskrider ofta greppet",
          "Var extra vaksam på broar, i skugga och tidiga morgnar – underkylt regn",
          "Kramsnö och lös snö ger också vattenplaningsliknande grepptapp",
        ],
        source: TV.sakerhetPaVag,
      },
      {
        kind: "info",
        title: "Vattenplaning och sladd",
        body: "Vid vattenplaning tappar däcket kontakten med vägbanan: släpp gasen, håll ratten rakt och bromsa inte. Vid överstyrning (bakvagnen glider ut) släpper du gasen och styr dit du vill åka.",
        signs: ["varning-halka", "varning-kurva"],
        source: TV.sakerhetPaVag,
      },
      {
        kind: "check",
        question: "Bilen börjar vattenplana. Vad gör du?",
        options: [
          "Bromsar hårt",
          "Släpper gasen, håller ratten rakt och undviker att bromsa",
          "Ökar farten för att få grepp",
          "Styr snabbt undan",
        ],
        correct: 1,
        explanation:
          "Under vattenplaning har däcken inget grepp – broms och styrning gör bara situationen värre. Släpp gasen, håll rakt och vänta in att greppet kommer tillbaka.",
        sign: "varning-halka",
        source: TV.sakerhetPaVag,
      },
    ],
  },
  {
    id: "korkort-ansvar",
    title: "Körkort, prov och förarens ansvar",
    category: "Människan & Trafiken",
    summary: "Vägen till B-körkort, prövotid och vad du ansvarar för som förare.",
    minutes: 6,
    reference: "Körkortslagen och körkortsförordningen",
    sources: [TS.korkortB, TV.korkortB, TS.trafikregler],
    steps: [
      {
        kind: "info",
        title: "Stegen till B-körkort",
        body: "Du ansöker om körkortstillstånd, övningskör (från 16 år med godkänd handledare eller i trafikskola), går riskutbildning del 1 och 2 och gör sedan kunskapsprov och körprov.",
        bullets: [
          "Riskutbildningen ska vara klar innan kunskaps- och körprov",
          "Handledare och elev behöver godkänt handledartillstånd",
          "Körkortet får utfärdas tidigast vid 18 års ålder",
        ],
        source: TS.korkortB,
      },
      {
        kind: "info",
        title: "Provet och giltigheten",
        body: "Kunskapsprovet för B har 70 frågor på 50 minuter. Fem frågor är testfrågor som inte räknas, och du behöver minst 52 rätt av de 65 som bedöms. Från och med 19 augusti 2026 är ett godkänt kunskapsprov giltigt i ett år.",
        bullets: [
          "Både kunskapsprov och körprov måste vara godkända",
          "Du behöver godkänd legitimation på provdagen",
          "Aurateoris frågor är egna övningsfrågor, inte Trafikverkets riktiga frågor",
        ],
        source: TV.korkortB,
      },
      {
        kind: "check",
        question: "Hur många rätt krävs för godkänt kunskapsprov för B?",
        options: ["52 av 65 bedömda frågor", "60 av 70 frågor", "50 av 65 frågor", "65 av 70 frågor"],
        correct: 0,
        explanation:
          "Provet har 70 frågor, varav 5 är testfrågor som inte räknas. Av de 65 bedömda frågorna krävs minst 52 rätt.",
        source: TV.korkortB,
      },
      {
        kind: "info",
        title: "Prövotid i två år",
        body: "Nytt körkort har två års prövotid. Återkallas körkortet under prövotiden måste du göra om både kunskapsprov och körprov för att få ett nytt.",
        source: TS.korkortB,
      },
      {
        kind: "info",
        title: "Förarens ansvar",
        body: "Som förare ansvarar du för att fordonet är trafiksäkert, att lasten är säkrad och att alla under 15 år använder bilbälte eller skyddsanordning. Passagerare över 15 år ansvarar själva för sitt bälte.",
        signs: ["varning-barn"],
        bullets: [
          "Barn kortare än 135 cm ska använda bilbarnstol eller kudde",
          "Bakåtvänd barnstol får aldrig sitta framför aktiv krockkudde",
          "Mobil i handen under körning är förbjudet",
        ],
        source: TS.trafikregler,
      },
      {
        kind: "check",
        question: "Vem ansvarar för att ett barn på 8 år använder bilbälte?",
        options: ["Barnet självt", "Föraren", "En vuxen passagerare", "Ingen – det är frivilligt"],
        correct: 1,
        explanation:
          "Föraren ansvarar för att passagerare under 15 år använder bälte eller annan skyddsanordning. Från 15 år ansvarar passageraren själv.",
        sign: "varning-barn",
        source: TS.trafikregler,
      },
    ],
  },
];
