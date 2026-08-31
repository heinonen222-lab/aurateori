export type QuestionCategory =
  | "Vägmärken"
  | "Trafikregler"
  | "Miljö"
  | "Människan & Trafiken"
  | "Fordonskännedom";

export interface QuestionSource {
  label: string;
  url: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  question: string;
  image?: string; // sign id or emoji
  options: string[];
  correct: number;
  explanation: string;
  reference: string;
  /** Official source page (Trafikverket, Transportstyrelsen or lagtext). */
  source?: QuestionSource;
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "Trafikregler",
    question:
      "Vilken är den högsta tillåtna hastigheten inom tättbebyggt område om inget annat anges?",
    options: ["30 km/h", "40 km/h", "50 km/h", "70 km/h"],
    correct: 2,
    explanation:
      "Bashastigheten inom tättbebyggt område är 50 km/h. Kommuner kan sänka den lokalt.",
    reference: "Trafikförordningen 3 kap. 17 §",
  },
  {
    id: "q2",
    category: "Trafikregler",
    question: "Du närmar dig ett obevakat övergångsställe. Vad gäller?",
    options: [
      "Gående ska alltid vänta tills bilar passerat",
      "Du måste lämna företräde åt gående som gått ut eller är på väg ut",
      "Du behöver bara sakta ner om någon vinkar",
      "Övergångsstället gäller endast dagtid",
    ],
    correct: 1,
    explanation:
      "Vid obevakat övergångsställe har du väjningsplikt mot gående som gått ut på eller precis ska gå ut på övergångsstället.",
    reference: "Trafikförordningen 3 kap. 61 §",
  },
  {
    id: "q3",
    category: "Vägmärken",
    image: "forbud-stopp",
    question: "Vad betyder detta vägmärke?",
    options: [
      "Väjningsplikt – sakta ner",
      "Stopplikt – du måste stanna helt",
      "Förbud mot infart",
      "Huvudled upphör",
    ],
    correct: 1,
    explanation:
      "Stopplikt innebär att du måste stanna helt, även om vägen är fri, och lämna företräde.",
    reference: "Vägmärkesförordning B2",
  },
  {
    id: "q4",
    category: "Vägmärken",
    image: "anv-huvudled",
    question: "Vilken skylt indikerar huvudled?",
    options: [
      "Gul romb med vit kant",
      "Blå kvadrat med pil",
      "Röd triangel",
      "Vit cirkel med röd kant",
    ],
    correct: 0,
    explanation:
      "Huvudled markeras med en gul romb med vit kant. På huvudled har du företräde vid korsningar.",
    reference: "Vägmärkesförordning B4",
  },
  {
    id: "q5",
    category: "Miljö",
    question: "Vilket körsätt är mest miljövänligt?",
    options: [
      "Hög varvtal och snabba accelerationer",
      "Motorbromsning och mjuk körning i högsta möjliga växel",
      "Tomgångskörning vid rödljus",
      "Konstant hög hastighet",
    ],
    correct: 1,
    explanation:
      "Ecodriving innebär mjuka accelerationer, motorbromsning och att köra på högsta möjliga växel med lågt varvtal.",
    reference: "Miljöanpassad körning – Trafikverket",
  },
  {
    id: "q6",
    category: "Miljö",
    question: "Hur länge får du låta motorn gå på tomgång i stillastående inom tättbebyggt område?",
    options: ["30 sekunder", "1 minut", "3 minuter", "Så länge du vill"],
    correct: 1,
    explanation:
      "Tomgångskörning är begränsad till max 1 minut inom tättbebyggt område enligt lokala föreskrifter.",
    reference: "Miljöbalken – lokala hälsoskyddsföreskrifter",
  },
  {
    id: "q7",
    category: "Människan & Trafiken",
    question: "Vilken promillegräns gäller för rattfylleri i Sverige?",
    options: ["0,0 ‰", "0,2 ‰", "0,5 ‰", "0,8 ‰"],
    correct: 1,
    explanation:
      "Rattfylleri gäller från 0,2 promille. Från 1,0 promille räknas det som grovt rattfylleri.",
    reference: "Trafikbrottslagen 4 §",
  },
  {
    id: "q8",
    category: "Människan & Trafiken",
    question: "Hur påverkas din reaktionstid av trötthet?",
    options: [
      "Den blir kortare",
      "Ingen påverkan",
      "Den förlängs avsevärt, jämförbart med alkoholpåverkan",
      "Endast synen försämras",
    ],
    correct: 2,
    explanation:
      "Trötthet påverkar reaktionstiden lika mycket som alkohol. 17 timmars vakenhet motsvarar 0,5 promille.",
    reference: "VTI-rapporter om trötthet i trafiken",
  },
  {
    id: "q9",
    category: "Fordonskännedom",
    question: "Vad är det minsta mönsterdjupet för sommardäck?",
    options: ["1,0 mm", "1,6 mm", "3,0 mm", "4,0 mm"],
    correct: 1,
    explanation:
      "Sommardäck måste ha minst 1,6 mm mönsterdjup. Rekommendationen är dock minst 3 mm.",
    reference: "Fordonsförordningen 4 kap.",
  },
  {
    id: "q10",
    category: "Fordonskännedom",
    question: "När måste vinterdäck användas i Sverige?",
    options: [
      "Från 1 oktober till 30 april",
      "Från 1 december till 31 mars vid vinterväglag",
      "Endast när det snöar",
      "Aldrig obligatoriskt",
    ],
    correct: 1,
    explanation:
      "Vinterdäck krävs 1 december–31 mars när det råder vinterväglag (snö, is, snömodd eller frost).",
    reference: "Trafikförordningen 4 kap. 18a §",
  },
  {
    id: "q11",
    category: "Trafikregler",
    question: "Vad innebär högerregeln?",
    options: [
      "Du har alltid företräde",
      "Du ska lämna företräde åt fordon som kommer från höger",
      "Endast på huvudled",
      "Bara vid rondeller",
    ],
    correct: 1,
    explanation:
      "Vid korsning utan skyltning gäller högerregeln – lämna företräde åt fordon från höger.",
    reference: "Trafikförordningen 3 kap. 18 §",
  },
  {
    id: "q12",
    category: "Vägmärken",
    image: "forbud-hastighet-50",
    question: "Detta märke gäller tills...",
    options: [
      "Nästa korsning",
      "Nästa hastighetsmärke eller när tättbebyggt område upphör",
      "Slutet av dagen",
      "Nästa rondell",
    ],
    correct: 1,
    explanation:
      "Hastighetsbegränsningen gäller tills ett nytt hastighetsmärke eller tätortsmärkets slut passeras.",
    reference: "Vägmärkesförordning C31",
  },
  {
    id: "q13",
    category: "Trafikregler",
    image: "pabud-rondellen",
    question: "Vad gäller när du kör i en cirkulationsplats?",
    options: [
      "Fordon som ska in har företräde",
      "Fordon som är i cirkulationen har företräde; blinka höger vid utfart",
      "Ingen blinkning behövs",
      "Blinka vänster vid ingång",
    ],
    correct: 1,
    explanation:
      "Fordon i rondellen har företräde. Blinka höger när du lämnar rondellen – aldrig vid ingång.",
    reference: "Trafikförordningen 3 kap.",
  },
  {
    id: "q14",
    category: "Människan & Trafiken",
    question: "Hur mycket ökar bromssträckan om du fördubblar hastigheten?",
    options: ["2 gånger", "3 gånger", "4 gånger", "Ingen skillnad"],
    correct: 2,
    explanation:
      "Bromssträckan ökar med kvadraten av hastigheten. Fördubblad hastighet ger 4 ggr längre bromssträcka.",
    reference: "Fysikens lagar – kinetisk energi",
  },
  {
    id: "q15",
    category: "Fordonskännedom",
    question: "Vad ska du göra om ABS-lampan tänds under körning?",
    options: [
      "Stanna omedelbart – bilen får inte köras",
      "Fortsätt köra försiktigt till verkstad; vanliga bromsar fungerar men utan ABS",
      "Ignorera – det är bara en varning",
      "Slå av tändningen och starta om",
    ],
    correct: 1,
    explanation:
      "Vanliga bromsar fungerar fortfarande men låsningsskyddet är ur funktion. Kör försiktigt till verkstad.",
    reference: "Bilens instruktionsbok / Trafikverket",
  },
  {
    id: "q16",
    category: "Vägmärken",
    image: "varning-vilt",
    question: "Vad varnar detta märke för?",
    options: ["Tama djur på vägen", "Vilt (t.ex. älg)", "Hundpark", "Ridväg"],
    correct: 1,
    explanation:
      "Varning för vilt – oftast älg eller rådjur. Sänk hastigheten och håll extra uppsikt i skymningen.",
    reference: "Vägmärkesförordning A18",
  },
  {
    id: "q17",
    category: "Miljö",
    question: "Vilken faktor påverkar bränsleförbrukningen MEST negativt?",
    options: [
      "Att köra i rätt växel",
      "Aggressiv körning med hastiga accelerationer",
      "Att hålla jämn hastighet",
      "Rätt lufttryck i däcken",
    ],
    correct: 1,
    explanation:
      "Aggressiv körning kan öka förbrukningen med upp till 40%. Mjuk körning sparar både bränsle och miljö.",
    reference: "Energimyndigheten – Sparsam körning",
  },

  // ---- Trafikregler ----
  {
    id: "q18",
    category: "Trafikregler",
    question: "Vilken hastighet gäller normalt på landsväg om inget vägmärke finns?",
    options: ["50 km/h", "70 km/h", "80 km/h", "90 km/h"],
    correct: 1,
    explanation:
      "Utanför tättbebyggt område är bashastigheten 70 km/h om inget annat anges med vägmärke.",
    reference: "Trafikförordningen 3 kap. 17 §",
  },
  {
    id: "q19",
    category: "Trafikregler",
    question: "Får du parkera 8 meter före ett övergångsställe?",
    options: [
      "Ja, om det inte står stoppförbud",
      "Nej, det är förbjudet inom 10 meter före ett övergångsställe",
      "Ja, i högst 10 minuter",
      "Endast nattetid",
    ],
    correct: 1,
    explanation:
      "Du får inte stanna eller parkera inom 10 meter före ett övergångsställe, korsning eller cykelöverfart.",
    reference: "Trafikförordningen 3 kap. 53 §",
  },
  {
    id: "q20",
    category: "Trafikregler",
    question: "Vad gäller vid en järnvägskorsning utan bommar?",
    options: [
      "Du har alltid företräde",
      "Du måste anpassa hastigheten och lämna företräde åt tåg",
      "Du måste alltid stanna helt",
      "Endast om ljussignalen blinkar vitt",
    ],
    correct: 1,
    explanation:
      "Tåg har alltid företräde. Utan bommar måste du sänka farten och försäkra dig om att spåret är fritt.",
    reference: "Trafikförordningen 3 kap. 43 §",
  },
  {
    id: "q21",
    category: "Trafikregler",
    question: "Var är det tillåtet att köra om till höger?",
    options: [
      "Aldrig",
      "När framförvarande fordon svänger vänster, i köbildning eller på väg med två körfält i samma riktning inom tättbebyggt område",
      "På motorväg när det är fritt",
      "Vid vägarbete",
    ],
    correct: 1,
    explanation:
      "Högeromkörning är tillåten bland annat när fordonet framför svänger vänster, vid köbildning, och i flerfältstrafik inom tättbebyggt område.",
    reference: "Trafikförordningen 3 kap. 34 §",
  },
  {
    id: "q22",
    category: "Trafikregler",
    question: "Vad innebär en heldragen linje mitt i vägen?",
    options: [
      "Du får korsa den om vägen är fri",
      "Du får inte köra på eller korsa linjen",
      "Den är endast en rekommendation",
      "Den markerar busskörfält",
    ],
    correct: 1,
    explanation:
      "En heldragen mittlinje får inte köras på eller korsas. Undantag finns endast vid hinder som gör det nödvändigt.",
    reference: "Vägmärkesförordningen M1/M3",
  },
  {
    id: "q23",
    category: "Trafikregler",
    question: "Vad gäller när du ska svänga vänster i en korsning?",
    options: [
      "Mötande trafik ska väja för dig",
      "Du ska lämna företräde åt mötande trafik och gående som korsar den väg du svänger in på",
      "Du behöver bara väja för bilar, inte gående",
      "Du får svänga först om du blinkar",
    ],
    correct: 1,
    explanation:
      "Vid vänstersväng har du väjningsplikt mot mötande trafik samt gående och cyklister på den korsande vägen.",
    reference: "Trafikförordningen 3 kap. 60 §",
  },
  {
    id: "q24",
    category: "Trafikregler",
    question: "Hur långt före en sväng bör du ge tecken (blinkers)?",
    options: [
      "Direkt när du svänger",
      "I god tid så att andra hinner uppfatta din avsikt",
      "Minst 200 meter före",
      "Bara om det finns andra fordon",
    ],
    correct: 1,
    explanation:
      "Tecken ska ges i god tid före manövern och avbrytas efteråt. Tecken ger dock aldrig förtur.",
    reference: "Trafikförordningen 3 kap. 64 §",
  },
  {
    id: "q25",
    category: "Trafikregler",
    question: "Vad gäller för fordon i ett busskörfält markerat med gul heldragen linje?",
    options: [
      "Alla fordon får köra där",
      "Endast bussar, taxi och fordon som anges på tilläggstavla",
      "Endast nattetid för alla",
      "Bara utryckningsfordon",
    ],
    correct: 1,
    explanation:
      "Körfältet är reserverat för bussar i linjetrafik och de fordon som anges på tilläggstavla, t.ex. taxi.",
    reference: "Trafikförordningen 8 kap.",
  },
  {
    id: "q26",
    category: "Trafikregler",
    question: "Får du använda mobiltelefon under körning?",
    options: [
      "Ja, alltid",
      "Endast om du inte håller den i handen",
      "Ja, om du kör under 30 km/h",
      "Ja, om du stannar i vägrenen",
    ],
    correct: 1,
    explanation:
      "Det är förbjudet att hålla mobiltelefon i handen under körning. Handsfree är tillåtet men får inte störa körningen.",
    reference: "Trafikförordningen 4 kap. 10 e §",
  },
  {
    id: "q27",
    category: "Trafikregler",
    question: "Vad gäller på en gågata?",
    options: [
      "Högsta hastighet 30 km/h",
      "Gångfart, gående har företräde och parkering är endast tillåten på markerade platser",
      "Fri fart om inga gående syns",
      "Motorfordon är alltid förbjudna",
    ],
    correct: 1,
    explanation:
      "På gågata och gångfartsområde gäller gångfart (ca 7 km/h), väjningsplikt mot gående och parkering endast på markerade platser.",
    reference: "Trafikförordningen 8 kap. 1 §",
  },
  {
    id: "q28",
    category: "Trafikregler",
    question: "Vad ska du göra när ett utryckningsfordon närmar sig med blåljus och siren?",
    options: [
      "Bromsa tvärt där du är",
      "Lämna fri väg, kör åt sidan och stanna vid behov på säker plats",
      "Öka farten för att komma undan",
      "Fortsätta som vanligt",
    ],
    correct: 1,
    explanation:
      "Du ska lämna fri väg men får inte skapa fara – kör åt sidan när det är säkert, blockera inte korsningar.",
    reference: "Trafikförordningen 2 kap. 4 §",
  },
  {
    id: "q29",
    category: "Trafikregler",
    question: "Vad gäller vid stopp för rött ljus tillsammans med grön pil åt höger?",
    options: [
      "Du får inte köra alls",
      "Du får svänga höger men har väjningsplikt mot korsande trafik och gående",
      "Du har företräde före alla",
      "Grön pil betyder bara varning",
    ],
    correct: 1,
    explanation:
      "Grön pil tillåter körning i pilens riktning, men du har väjningsplikt mot trafik som har grönt.",
    reference: "Vägmärkesförordningen 3 kap.",
  },
  // ---- Vägmärken ----
  {
    id: "q30",
    category: "Vägmärken",
    image: "varning-halka",
    question: "Vad varnar detta märke för?",
    options: ["Grusväg", "Slirig väg", "Ojämn väg", "Vägarbete"],
    correct: 1,
    explanation: "Märket varnar för att vägbanan kan vara hal, t.ex. vid regn, is eller lös grus.",
    reference: "Vägmärkesförordning A17",
  },
  {
    id: "q31",
    category: "Vägmärken",
    image: "forbud-omkorning",
    question: "Vilka fordon får du köra om trots detta märke?",
    options: [
      "Personbilar",
      "Moped klass II och fordon som inte är motordrivna, t.ex. cyklar",
      "Lastbilar",
      "Inga fordon alls",
    ],
    correct: 1,
    explanation:
      "Förbudet gäller omkörning av motordrivna fordon med fler än två hjul. Cyklar och moped klass II får köras om.",
    reference: "Vägmärkesförordning C27",
  },
  {
    id: "q32",
    category: "Vägmärken",
    image: "varning-barn",
    question: "Vad innebär detta märke för din hastighet?",
    options: [
      "Hastigheten sänks automatiskt till 30 km/h",
      "Ingen automatisk sänkning – du måste själv anpassa hastigheten",
      "Du måste stanna",
      "Hastigheten höjs till 50 km/h",
    ],
    correct: 1,
    explanation:
      "Varningsmärket ändrar inte hastighetsgränsen, men du är skyldig att anpassa farten efter risken.",
    reference: "Vägmärkesförordning A14",
  },
  {
    id: "q33",
    category: "Vägmärken",
    image: "vajningsplikt",
    question: "Vad betyder detta märke?",
    options: [
      "Stopplikt – stanna alltid",
      "Väjningsplikt – lämna företräde men du behöver inte stanna om vägen är fri",
      "Huvudled börjar",
      "Förbud mot infart",
    ],
    correct: 1,
    explanation:
      "Väjningsplikt innebär att du ska lämna företräde. Du måste stanna endast om det behövs.",
    reference: "Vägmärkesförordning B1",
  },
  {
    id: "q34",
    category: "Vägmärken",
    image: "forbud-parkering",
    question: "Vad betyder detta märke?",
    options: [
      "Förbud att stanna och parkera",
      "Förbud att parkera – du får stanna för av- och påstigning",
      "Parkering tillåten i 24 timmar",
      "Endast lastning förbjuden",
    ],
    correct: 1,
    explanation:
      "Parkeringsförbud tillåter kortare stopp för av-/påstigning eller lastning, men inte parkering.",
    reference: "Vägmärkesförordning C35",
  },
  {
    id: "q35",
    category: "Vägmärken",
    image: "forbud-stannaparkera",
    question: "Vad innebär märket med två röda kryssande streck i röd cirkel?",
    options: [
      "Parkering förbjuden men stannande tillåtet",
      "Förbud att stanna och parkera",
      "Tillfällig parkering tillåten",
      "Förbud mot infart",
    ],
    correct: 1,
    explanation:
      "Märket förbjuder både stannande och parkering, utom vid trafiksignal eller för att undvika fara.",
    reference: "Vägmärkesförordning C39",
  },
  {
    id: "q36",
    category: "Vägmärken",
    image: "info-motorvag",
    question: "Vad gäller på motorväg?",
    options: [
      "Backning och U-sväng är tillåten på vägrenen",
      "Endast motorfordon som kan och får köra minst 40 km/h får framföras",
      "Alla fordon inklusive moped klass II får köra",
      "Ingen hastighetsgräns",
    ],
    correct: 1,
    explanation:
      "På motorväg är endast fordon som kan köra minst 40 km/h tillåtna. Backning, U-sväng och stannande är förbjudet.",
    reference: "Trafikförordningen 9 kap.",
  },
  {
    id: "q37",
    category: "Vägmärken",
    image: "varning-vagarbete",
    question: "Vad ska du tänka på vid detta märke?",
    options: [
      "Öka hastigheten för att snabbt passera",
      "Sänk hastigheten, håll extra avstånd och räkna med vägarbetare nära körbanan",
      "Märket gäller endast vardagar",
      "Du får köra om fritt",
    ],
    correct: 1,
    explanation:
      "Vid vägarbete gäller ofta tillfälliga hastighetsgränser och personal kan befinna sig nära körbanan.",
    reference: "Vägmärkesförordning A20",
  },
  {
    id: "q38",
    category: "Vägmärken",
    image: "anv-enkelriktat",
    question: "Vad betyder märket med vit pil på blå rektangel?",
    options: [
      "Påbjuden körriktning",
      "Enkelriktad trafik i pilens riktning",
      "Motorväg börjar",
      "Återvändsgata",
    ],
    correct: 1,
    explanation: "Anvisningsmärket visar att vägen är enkelriktad. Mötande trafik förekommer inte.",
    reference: "Vägmärkesförordning E16",
  },
  {
    id: "q39",
    category: "Vägmärken",
    image: "pabud-hoger",
    question: "Vad kräver detta blå runda märke med pil?",
    options: [
      "Rekommenderad körriktning",
      "Påbjuden körriktning – du måste köra åt det håll pilen visar",
      "Varning för kurva",
      "Förbud att svänga",
    ],
    correct: 1,
    explanation:
      "Blå runda märken är påbudsmärken – de anger vad du måste göra, till skillnad från rekommendationer.",
    reference: "Vägmärkesförordning D1",
  },
  // ---- Miljö ----
  {
    id: "q40",
    category: "Miljö",
    question: "Vilket ämne bidrar mest till växthuseffekten från bilavgaser?",
    options: ["Kolmonoxid (CO)", "Koldioxid (CO2)", "Kväveoxider (NOx)", "Svaveldioxid"],
    correct: 1,
    explanation:
      "Koldioxid är den största klimatpåverkande gasen från förbränning av fossila drivmedel.",
    reference: "Naturvårdsverket – utsläpp från vägtrafik",
  },
  {
    id: "q41",
    category: "Miljö",
    question: "Vad orsakar kväveoxider (NOx) främst?",
    options: [
      "Global uppvärmning",
      "Försurning, övergödning och luftvägsproblem",
      "Ozonlagrets uttunning",
      "Inget alls",
    ],
    correct: 1,
    explanation:
      "Kväveoxider bidrar till försurning, övergödning och marknära ozon samt irriterar luftvägarna.",
    reference: "Naturvårdsverket",
  },
  {
    id: "q42",
    category: "Miljö",
    question: "Hur påverkar för lågt lufttryck i däcken miljön?",
    options: [
      "Ingen påverkan",
      "Ökat rullmotstånd ger högre bränsleförbrukning och mer utsläpp",
      "Minskar bränsleförbrukningen",
      "Endast däckslitaget påverkas",
    ],
    correct: 1,
    explanation:
      "För lågt däcktryck ökar rullmotståndet, vilket ger högre förbrukning, mer utsläpp och snabbare däckslitage.",
    reference: "Energimyndigheten – Sparsam körning",
  },
  {
    id: "q43",
    category: "Miljö",
    question: "Vad är katalysatorns uppgift?",
    options: [
      "Öka motoreffekten",
      "Omvandla skadliga avgaser till mindre skadliga ämnen",
      "Sänka bränsleförbrukningen",
      "Rena motoroljan",
    ],
    correct: 1,
    explanation:
      "Katalysatorn omvandlar kolmonoxid, kolväten och kväveoxider till koldioxid, vatten och kväve. Den fungerar bäst när den är varm.",
    reference: "Transportstyrelsen – avgasrening",
  },
  {
    id: "q44",
    category: "Miljö",
    question: "När släpper bilen ut mest skadliga avgaser?",
    options: [
      "Vid landsvägskörning",
      "Vid kallstart och korta körsträckor",
      "Vid motorbromsning",
      "På motorväg",
    ],
    correct: 1,
    explanation:
      "Vid kallstart är katalysatorn inte varm och renar dåligt. Korta resor ger därför störst utsläpp per kilometer.",
    reference: "Naturvårdsverket",
  },
  {
    id: "q45",
    category: "Miljö",
    question: "Vilket drivmedel räknas som förnybart?",
    options: ["Bensin", "Diesel (MK1)", "HVO100 och etanol E85", "Naturgas från fossila källor"],
    correct: 2,
    explanation:
      "HVO100 och etanol tillverkas av förnybar råvara och ger lägre nettoutsläpp av fossil koldioxid.",
    reference: "Energimyndigheten – förnybara drivmedel",
  },
  {
    id: "q46",
    category: "Miljö",
    question: "Hur mycket bränsle kan sparas genom sparsam körning (ecodriving)?",
    options: ["Cirka 1 %", "Cirka 5 %", "Cirka 10–20 %", "Över 50 %"],
    correct: 2,
    explanation:
      "Sparsam körning kan minska förbrukningen med runt 10–20 % utan att restiden ökar nämnvärt.",
    reference: "Trafikverket – Sparsam körning",
  },
  {
    id: "q47",
    category: "Miljö",
    question: "Vad bör du göra med takboxen när den inte används?",
    options: [
      "Låta den sitta kvar – ingen skillnad",
      "Ta av den, den ökar luftmotståndet och bränsleförbrukningen",
      "Vända den bakåt",
      "Fylla den med last för balans",
    ],
    correct: 1,
    explanation: "En tom takbox kan öka förbrukningen med 10–20 % på grund av ökat luftmotstånd.",
    reference: "Energimyndigheten",
  },
  // ---- Människan & Trafiken ----
  {
    id: "q48",
    category: "Människan & Trafiken",
    question: "Vad är normal reaktionstid för en pigg förare?",
    options: ["0,1–0,3 sekunder", "Cirka 0,5–1 sekund", "3 sekunder", "5 sekunder"],
    correct: 1,
    explanation:
      "Reaktionstiden är normalt 0,5–1 sekund men förlängs av trötthet, alkohol, stress och distraktion.",
    reference: "Trafikverket – reaktionstid",
  },
  {
    id: "q49",
    category: "Människan & Trafiken",
    question: "Vilken tidslucka rekommenderas till framförvarande fordon vid god sikt?",
    options: ["1 sekund", "Minst 3 sekunder", "0,5 sekunder", "10 sekunder"],
    correct: 1,
    explanation:
      "Tresekundersregeln ger marginal för reaktion och inbromsning. Vid halka bör avståndet fördubblas.",
    reference: "Trafikverket – säkerhetsavstånd",
  },
  {
    id: "q50",
    category: "Människan & Trafiken",
    question: "Hur snabbt bryts alkohol ned i kroppen ungefär?",
    options: [
      "0,05 promille per timme",
      "Cirka 0,15 promille per timme",
      "0,5 promille per timme",
      "1 promille per timme",
    ],
    correct: 1,
    explanation:
      "Kroppen bryter ned ungefär 0,15 promille per timme. Kaffe, dusch eller mat påskyndar inte processen.",
    reference: "Trafikverket – alkohol i trafiken",
  },
  {
    id: "q51",
    category: "Människan & Trafiken",
    question: "Vad är den vanligaste orsaken till dödsolyckor bland unga förare?",
    options: [
      "Tekniska fel på bilen",
      "Hög hastighet i kombination med bristande erfarenhet och risktagande",
      "Dåliga vägmärken",
      "För låg hastighet",
    ],
    correct: 1,
    explanation:
      "Unga förare överskattar ofta sin förmåga. Hastighet, alkohol och bristande bältesanvändning dominerar statistiken.",
    reference: "Trafikanalys – olycksstatistik",
  },
  {
    id: "q52",
    category: "Människan & Trafiken",
    question: "Vad innebär tunnelseende vid hög hastighet?",
    options: [
      "Synfältet blir bredare",
      "Synfältet smalnar av och du upptäcker mindre i periferin",
      "Du ser bättre i mörker",
      "Ingen förändring sker",
    ],
    correct: 1,
    explanation:
      "Ju högre hastighet, desto smalare blir synfältet. Detta gör att du missar risker vid vägkanten.",
    reference: "VTI – syn och hastighet",
  },
  {
    id: "q53",
    category: "Människan & Trafiken",
    question: "Vad ökar risken för trötthet mest vid längre körning?",
    options: [
      "Att ta pauser var annan timme",
      "Monoton körning, värme i kupén och för lite sömn",
      "Att lyssna på radio",
      "Att köra på morgonen",
    ],
    correct: 1,
    explanation:
      "Monotoni, varm kupé och sömnbrist ökar tröttheten kraftigt. Ta paus minst varannan timme.",
    reference: "Trafikverket – trötthet i trafiken",
  },
  {
    id: "q54",
    category: "Människan & Trafiken",
    question: "Hur påverkar läkemedel med varningstriangel din körning?",
    options: [
      "Inte alls",
      "De kan försämra reaktionsförmåga och omdöme – körning kan vara olämplig",
      "De ökar koncentrationen",
      "De påverkar bara nattetid",
    ],
    correct: 1,
    explanation:
      "Röd varningstriangel på förpackningen betyder att läkemedlet kan påverka körförmågan. Kör inte utan att kontrollera med läkare.",
    reference: "Läkemedelsverket / Transportstyrelsen",
  },
  {
    id: "q55",
    category: "Människan & Trafiken",
    question: "Vad är stoppsträcka?",
    options: [
      "Endast bromssträckan",
      "Reaktionssträcka plus bromssträcka",
      "Sträckan efter att bilen har stannat",
      "Avståndet till framförvarande",
    ],
    correct: 1,
    explanation:
      "Stoppsträckan består av reaktionssträckan (medan du reagerar) och bromssträckan (medan bilen bromsar).",
    reference: "Trafikverket – stoppsträcka",
  },
  {
    id: "q56",
    category: "Människan & Trafiken",
    question: "Hur bör du agera mot en cyklist du ska köra om?",
    options: [
      "Passera nära och snabbt",
      "Håll gott sidoavstånd, minst 1,5 meter, och sänk farten",
      "Tuta för att varna",
      "Kör om i kurva",
    ],
    correct: 1,
    explanation:
      "Cyklister är oskyddade trafikanter och kan vingla. Ett sidoavstånd på minst 1,5 meter rekommenderas.",
    reference: "Trafikverket – oskyddade trafikanter",
  },
  // ---- Fordonskännedom ----
  {
    id: "q57",
    category: "Fordonskännedom",
    question: "Vilket mönsterdjup krävs minst på vinterdäck vid vinterväglag?",
    options: ["1,6 mm", "3,0 mm", "4,0 mm", "5,0 mm"],
    correct: 1,
    explanation: "Vinterdäck måste ha minst 3 mm mönsterdjup när vinterväglag råder.",
    reference: "Trafikförordningen 4 kap. 18 a §",
  },
  {
    id: "q58",
    category: "Fordonskännedom",
    question: "Vad innebär det om varningslampan för motorolja (röd oljekanna) tänds?",
    options: [
      "Dags för service snart",
      "Lågt oljetryck – stanna omedelbart och stäng av motorn",
      "Oljan behöver bytas inom 1000 km",
      "Endast en påminnelse",
    ],
    correct: 1,
    explanation:
      "Röd oljelampa betyder lågt oljetryck. Fortsatt körning kan förstöra motorn – stanna säkert och stäng av.",
    reference: "Transportstyrelsen / instruktionsbok",
  },
  {
    id: "q59",
    category: "Fordonskännedom",
    question: "Vad är servostyrningens funktion?",
    options: [
      "Att bromsa hjulen",
      "Att förstärka din kraft på ratten så styrningen blir lättare",
      "Att hålla hastigheten konstant",
      "Att styra bilen automatiskt",
    ],
    correct: 1,
    explanation:
      "Servon förstärker rattkraften. Om den slutar fungera går bilen fortfarande att styra, men det krävs mycket mer kraft.",
    reference: "Fordonsteknik – styrsystem",
  },
  {
    id: "q60",
    category: "Fordonskännedom",
    question: "Hur ofta ska en personbil normalt besiktigas efter första besiktningen?",
    options: [
      "Varje halvår",
      "Årligen enligt Transportstyrelsens besiktningsperiod",
      "Vart tredje år alltid",
      "Aldrig efter första gången",
    ],
    correct: 1,
    explanation:
      "Nya bilar besiktigas första gången efter 3 år, sedan efter 2 år och därefter årligen.",
    reference: "Fordonsförordningen / Transportstyrelsen",
  },
  {
    id: "q61",
    category: "Fordonskännedom",
    question: "Vad betyder ESP/ESC i en bil?",
    options: [
      "Låsningsfria bromsar",
      "Antisladdsystem som bromsar enskilda hjul för att hålla bilen stabil",
      "Farthållare",
      "Parkeringssensor",
    ],
    correct: 1,
    explanation:
      "ESP (antisladdsystem) upptäcker sladd och bromsar enskilda hjul samt reducerar motoreffekt för att stabilisera bilen.",
    reference: "Fordonsteknik – aktiv säkerhet",
  },
  {
    id: "q62",
    category: "Fordonskännedom",
    question: "Vad händer med bilens köregenskaper med last i bagageutrymmet?",
    options: [
      "Ingen förändring",
      "Tyngdpunkten flyttas bakåt, styrningen blir lättare fram och bromssträckan kan öka",
      "Bilen bromsar bättre",
      "Strålkastarna riktas nedåt automatiskt alltid",
    ],
    correct: 1,
    explanation:
      "Last bakåt avlastar framaxeln, försämrar styrförmågan och ökar bromssträckan. Justera strålkastarhöjden.",
    reference: "Transportstyrelsen – lastning",
  },
  {
    id: "q63",
    category: "Fordonskännedom",
    question: "När ska du använda halvljus?",
    options: [
      "Endast i mörker",
      "Vid färd i mörker, gryning, skymning och vid dålig sikt – varselljus räcker ej i mörker",
      "Aldrig i tunnlar",
      "Endast på motorväg",
    ],
    correct: 1,
    explanation:
      "Halvljus ska användas i mörker och vid nedsatt sikt. Varselljus lyser inte bakåt och räcker inte i mörker.",
    reference: "Trafikförordningen 3 kap. 72 §",
  },
  {
    id: "q64",
    category: "Fordonskännedom",
    question: "Vad gäller för dimbakljus?",
    options: [
      "Får användas alltid i mörker",
      "Får endast användas vid dimma eller kraftigt nedsatt sikt – bländar annars bakomvarande",
      "Ska vara på vid regn",
      "Är obligatoriskt vintertid",
    ],
    correct: 1,
    explanation:
      "Dimbakljus är mycket starkt och får bara användas vid kraftigt nedsatt sikt, annars bländar det bakomvarande.",
    reference: "Trafikförordningen 3 kap. 74 §",
  },
  {
    id: "q65",
    category: "Fordonskännedom",
    question: "Vad är vattenplaning?",
    options: [
      "När bromsarna blir våta",
      "När däcket tappar kontakten med vägbanan och flyter på en vattenfilm",
      "När vindrutan immar igen",
      "När motorn får vatten i luftfiltret",
    ],
    correct: 1,
    explanation:
      "Vid vattenplaning tappar däcket greppet. Släpp gasen, styr rakt och undvik att bromsa hårt. Bra mönsterdjup minskar risken.",
    reference: "Trafikverket – halka och vatten",
  },
  {
    id: "q66",
    category: "Fordonskännedom",
    question:
      "Vad är den högsta tillåtna totalvikten för en släpvagn du får dra med B-körkort (utan utökad behörighet)?",
    options: [
      "Fri vikt",
      "Bil + släp får väga högst 3 500 kg totalvikt, eller släp max 750 kg",
      "Alltid max 1 500 kg släp",
      "Släp är inte tillåtet med B",
    ],
    correct: 1,
    explanation:
      "Med B får du dra släp på max 750 kg, eller tyngre om bilens och släpets sammanlagda totalvikt är högst 3 500 kg.",
    reference: "Körkortslagen – behörighet B",
  },
  {
    id: "q67",
    category: "Trafikregler",
    question: "Vilken hastighet gäller vid bogsering av ett fordon?",
    options: ["30 km/h", "Högst 30 km/h", "50 km/h", "70 km/h"],
    correct: 1,
    explanation:
      "Vid bogsering med lina eller stång gäller högst 30 km/h. Bogsering på motorväg är endast tillåten till närmaste avfart.",
    reference: "Trafikförordningen 5 kap.",
  },
  {
    id: "q68",
    category: "Trafikregler",
    question: "Vad gäller för barn under 135 cm i bilen?",
    options: [
      "Vanligt bälte räcker",
      "Ska använda bilbarnstol, bälteskudde eller annan särskild skyddsanordning",
      "Får åka i knä",
      "Ska alltid sitta fram",
    ],
    correct: 1,
    explanation:
      "Barn kortare än 135 cm ska använda särskild skyddsanordning. Bakåtvänt så länge som möjligt, minst till 4 års ålder.",
    reference: "Trafikförordningen 4 kap. 10 §",
  },
  {
    id: "q69",
    category: "Vägmärken",
    image: "varning-cyklande",
    question: "Vad varnar detta märke för?",
    options: [
      "Cykelverkstad",
      "Cyklande och mopedförare kan korsa eller färdas på vägen",
      "Cykelparkering",
      "Cykelförbud",
    ],
    correct: 1,
    explanation:
      "Märket varnar för korsande eller utsatt cykeltrafik. Sänk farten och håll uppsikt.",
    reference: "Vägmärkesförordning A16",
  },
  {
    id: "q70",
    category: "Vägmärken",
    image: "info-parkering",
    question: "Vad betyder blå skylt med vitt P?",
    options: [
      "Parkering förbjuden",
      "Parkering tillåten enligt eventuella tilläggstavlor",
      "Privat väg",
      "Polisstation",
    ],
    correct: 1,
    explanation:
      "Märket anger parkeringsplats. Tilläggstavlor kan begränsa tid, avgift eller vilka fordon som får stå.",
    reference: "Vägmärkesförordning E19",
  },
  {
    id: "q71",
    category: "Miljö",
    question: "Vad gäller i en miljözon klass 2 i svenska städer?",
    options: [
      "Alla fordon får köra",
      "Endast bensin- och dieselbilar som uppfyller vissa utsläppsklasser får köra in",
      "Endast elbilar",
      "Zonen gäller bara lastbilar",
    ],
    correct: 1,
    explanation:
      "Miljözon klass 2 ställer krav på utsläppsklass (Euro-standard) för personbilar, lätta bussar och lätta lastbilar.",
    reference: "Trafikförordningen 10 kap. – miljözoner",
  },
  {
    id: "q72",
    category: "Människan & Trafiken",
    question: "Vad bör du göra först vid en trafikolycka?",
    options: [
      "Ringa försäkringsbolaget",
      "Varna andra trafikanter, larma 112 och ge första hjälpen",
      "Flytta alla fordon direkt",
      "Fotografera skadorna",
    ],
    correct: 1,
    explanation:
      "Prioritera säkerhet: varna (varningstriangel och varningsblinkers), larma 112 och rädda liv innan dokumentation.",
    reference: "Trafikförordningen 2 kap. 8 § / första hjälpen",
  },
];
