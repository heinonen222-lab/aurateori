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
        signs: ["forbud-infart", "forbud-omkorning", "forbud-stannaparkera", "forbud-svang-vanster"],
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
];
