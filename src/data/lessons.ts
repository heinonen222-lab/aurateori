import type { QuestionCategory } from "@/data/questions";

export type LessonStep =
  | {
      kind: "info";
      title: string;
      body: string;
      sign?: string;
      bullets?: string[];
    }
  | {
      kind: "check";
      question: string;
      options: string[];
      correct: number;
      explanation: string;
      sign?: string;
    };

export interface Lesson {
  id: string;
  title: string;
  category: QuestionCategory;
  summary: string;
  minutes: number;
  reference: string;
  steps: LessonStep[];
}

export const LESSONS: Lesson[] = [
  {
    id: "vajningsregler",
    title: "Väjningsregler i korsningar",
    category: "Trafikregler",
    summary: "Högerregeln, väjningsplikt, stopplikt och huvudled – i rätt ordning.",
    minutes: 6,
    reference: "Trafikförordningen 3 kap. 18–23 §§",
    steps: [
      {
        kind: "info",
        title: "Grundregeln: högerregeln",
        body: "I en korsning utan skyltar eller signaler gäller högerregeln: du ska lämna företräde åt trafik som kommer från höger.",
        bullets: [
          "Gäller även på parkeringsplatser och inom bostadsområden",
          "Gäller oavsett vägens bredd eller beläggning",
          "Cyklister och mopedister omfattas också",
        ],
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
      },
      {
        kind: "info",
        title: "Väjningsplikt",
        body: "Märket väjningsplikt betyder att du ska lämna företräde åt fordon på den korsande vägen. Du måste inte stanna – men du ska sänka farten och vara beredd att stanna.",
        sign: "vajningsplikt",
      },
      {
        kind: "info",
        title: "Stopplikt",
        body: "Vid stopplikt måste du alltid stanna helt, även om vägen är tom. Stanna vid stopplinjen, eller där du har god sikt om linje saknas.",
        sign: "forbud-stopp",
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
        sign: "forbud-stopp",
      },
      {
        kind: "info",
        title: "Huvudled",
        body: "På huvudled har du företräde mot anslutande vägar. Kom ihåg: parkering är förbjuden på huvudled utanför markerade platser, och när huvudleden upphör gäller högerregeln igen.",
        sign: "anv-huvudled",
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
        sign: "anv-huvudled",
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
    steps: [
      {
        kind: "info",
        title: "Stoppsträckan består av två delar",
        body: "Stoppsträcka = reaktionssträcka + bromssträcka. Reaktionssträckan växer linjärt med hastigheten, men bromssträckan växer med kvadraten på hastigheten.",
        bullets: [
          "Reaktionstid är typiskt 1 sekund",
          "Dubbel hastighet ger fyra gånger längre bromssträcka",
          "Halvt slitna däck eller våt asfalt förlänger bromssträckan kraftigt",
        ],
      },
      {
        kind: "info",
        title: "Tumregel för reaktionssträckan",
        body: "Ta hastigheten, stryk sista siffran och multiplicera med reaktionstiden i sekunder gånger 3. Vid 50 km/h och 1 sekund: 5 × 3 = 15 meter innan du ens börjar bromsa.",
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
      },
      {
        kind: "info",
        title: "Bashastigheter att kunna utantill",
        body: "Utan skyltning gäller 50 km/h inom tättbebyggt område och 70 km/h utanför. Skyltad hastighet gäller alltid före bashastigheten.",
        sign: "info-tatort",
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
      },
      {
        kind: "info",
        title: "Avståndet framåt",
        body: "Använd tresekundersregeln: välj en fast punkt och räkna tre sekunder från att fordonet framför passerar den. Vid halka eller dåligt väder – dubbla avståndet.",
        sign: "varning-halka",
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
    steps: [
      {
        kind: "info",
        title: "Form och färg berättar allt",
        body: "Triangel med röd ram = varning. Rund med röd ram = förbud. Rund med blå botten = påbud. Rektangulär blå = anvisning eller information.",
      },
      {
        kind: "info",
        title: "Varningsmärken",
        body: "Varnar för en fara längre fram. De påbjuder inget – men du ska anpassa hastigheten så att du kan hantera faran.",
        sign: "varning-vilt",
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
        sign: "forbud-infart",
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
      },
      {
        kind: "info",
        title: "Anvisningsmärken",
        body: "Anger vad som gäller inom ett område eller på en sträcka – till exempel gångfartsområde, huvudled eller enkelriktat. Reglerna gäller till motsvarande slutmärke.",
        sign: "anv-gangfartsomrade",
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
      },
      {
        kind: "check",
        question: "Vid vilken alkoholkoncentration i blodet börjar rattfylleri?",
        options: ["0,1 promille", "0,2 promille", "0,5 promille", "1,0 promille"],
        correct: 1,
        explanation:
          "Gränsen för rattfylleri är 0,2 promille. Vid 1,0 promille eller mer räknas det som grovt rattfylleri.",
      },
      {
        kind: "info",
        title: "Trötthet",
        body: "Trötthet ger effekter som liknar alkohol: långsammare reaktion, sämre sidoseende och mikrosömn. Enda fungerande åtgärden är att stanna och sova 15–20 minuter.",
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
      },
      {
        kind: "info",
        title: "Grupptryck och riskbeteende",
        body: "Unga förare har högst olycksrisk, framför allt med passagerare i samma ålder. Att medvetet planera hur du hanterar grupptryck sänker risken mer än ökad körvana.",
      },
    ],
  },
  {
    id: "miljo-ekonomi",
    title: "Miljö och sparsam körning",
    category: "Miljö",
    summary: "Eco-driving, bränsleförbrukning och vad avgaserna faktiskt innehåller.",
    minutes: 5,
    reference: "Trafikverket – Sparsam körning",
    steps: [
      {
        kind: "info",
        title: "Sparsam körning i praktiken",
        body: "Målet är jämn fart och få inbromsningar. Rätt teknik sänker förbrukningen med 10–20 procent.",
        bullets: [
          "Växla upp tidigt, kör på låga varv",
          "Motorbromsa med växeln i – bränslet stängs av",
          "Undvik tomgång: stäng av vid stopp längre än en minut",
          "Kontrollera lufttrycket i däcken varje månad",
        ],
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
      },
      {
        kind: "info",
        title: "Avgaserna",
        body: "Koldioxid (CO₂) påverkar klimatet. Kväveoxider (NOx) och partiklar påverkar hälsan lokalt. Kolmonoxid (CO) är giftigt och försämrar blodets syreupptagning.",
      },
      {
        kind: "check",
        question: "Vilket ämne i avgaserna påverkar främst klimatet?",
        options: ["Kolmonoxid", "Kväveoxider", "Koldioxid", "Partiklar"],
        correct: 2,
        explanation:
          "Koldioxid är den dominerande växthusgasen från vägtrafik. Kväveoxider och partiklar är främst hälsoproblem.",
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
    steps: [
      {
        kind: "info",
        title: "Däck och mönsterdjup",
        body: "Sommardäck kräver minst 1,6 mm mönsterdjup. Vinterdäck ska ha minst 3 mm under vinterväglag.",
        bullets: [
          "Vinterdäck krävs 1 dec–31 mars vid vinterväglag",
          "För lågt lufttryck ger högre förbrukning och sämre styrning",
          "Blanda aldrig dubbat och odubbat olika på samma axel",
        ],
      },
      {
        kind: "check",
        question: "Vilket är det lagliga minsta mönsterdjupet för vinterdäck vid vinterväglag?",
        options: ["1,6 mm", "3 mm", "4 mm", "5 mm"],
        correct: 1,
        explanation:
          "Vinterdäck måste ha minst 3 mm mönsterdjup vid vinterväglag. För sommardäck gäller 1,6 mm.",
      },
      {
        kind: "info",
        title: "Bromsar",
        body: "ABS förhindrar hjullåsning så att du kan styra under full bromsning – men förkortar inte alltid bromssträckan. Vid nödbromsning: tryck hårt och håll kvar, och styr undan.",
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
      },
      {
        kind: "info",
        title: "Last och tyngdpunkt",
        body: "Tung last högt upp eller bak i bilen höjer tyngdpunkten och gör bilen instabil. Placera tungt gods lågt och långt fram, och säkra allt – vid en krock blir en lös väska en projektil.",
      },
    ],
  },
];
