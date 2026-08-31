import type { Question, QuestionSource } from "@/data/questions";

/**
 * Provfrågor i Trafikverkets format (B-behörighet).
 *
 * Trafikverket publicerar inte sina skarpa provfrågor – de är sekretessbelagda.
 * Frågorna nedan följer provets uppbyggnad (kunskapsområden, fyra svarsalternativ,
 * ett rätt svar) och varje fråga är faktakontrollerad mot den officiella källan
 * som länkas i `source`.
 */

export const OFFICIAL_SOURCES = {
  tfo: {
    label: "Trafikförordning (1998:1276)",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/trafikforordning-19981276_sfs-1998-1276/",
  },
  vmf: {
    label: "Vägmärkesförordning (2007:90)",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/vagmarkesforordning-2007-90_sfs-2007-90/",
  },
  tsTrafikregler: {
    label: "Transportstyrelsen – Trafikregler",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/",
  },
  tsGenerella: {
    label: "Transportstyrelsen – Generella trafikregler",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/",
  },
  tsHastighet: {
    label: "Transportstyrelsen – Hastighet",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/hastighet/",
  },
  tsVagmarken: {
    label: "Transportstyrelsen – Vägmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/",
  },
  tsVarning: {
    label: "Transportstyrelsen – Varningsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/varningsmarken/",
  },
  tsForbud: {
    label: "Transportstyrelsen – Förbudsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/forbudsmarken/",
  },
  tsPabud: {
    label: "Transportstyrelsen – Påbudsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/pabudsmarken/",
  },
  tsAnvisning: {
    label: "Transportstyrelsen – Anvisningsmärken",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/anvisningsmarken/",
  },
  tsLokalisering: {
    label: "Transportstyrelsen – Lokaliseringsmärken för vägvisning",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/lokaliseringsmarken-for-vagvisning/",
  },
  tsDack: {
    label: "Transportstyrelsen – Däck",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/",
  },
  tsVinterdack: {
    label: "Transportstyrelsen – Vinterdäck",
    url: "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/dack/vinterdack/",
  },
  tvProv: {
    label: "Trafikverket – Personbil och lätt lastbil (B)",
    url: "https://www.trafikverket.se/korkort/ta-korkort/personbil-och-latt-lastbil/",
  },
  tvForeProvet: {
    label: "Trafikverket – Före provet",
    url: "https://www.trafikverket.se/korkort/ta-korkort/fore-provet/",
  },
  tvSakerhet: {
    label: "Trafikverket – Din säkerhet på vägen",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/",
  },
  tvHastighetsgranser: {
    label: "Trafikverket – Hastighetsgränser på väg",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/",
  },
  tvKrockvald: {
    label: "Trafikverket – Hastighet och krockvåld",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/hastighet-och-krockvald/",
  },
  tvHallbarhet: {
    label: "Trafikverket – Hastighet och hållbarhet",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/hastighetsgranser-pa-vag/hastighet-och-hallbarhet/",
  },
  tvAlkohol: {
    label: "Trafikverket – Alkohol och narkotika i vägtrafiken",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/alkohol-och-narkotika-i-vagtrafiken/",
  },
  tvRattfylleri: {
    label: "Trafikverket – Vad säger lagen om rattfylleri?",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/alkohol-och-narkotika-i-vagtrafiken/vad-sager-lagen-om-rattfylleri/",
  },
  tvAlkoholPaverkan: {
    label: "Trafikverket – Alkohol, så påverkar den",
    url: "https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/alkohol-och-narkotika-i-vagtrafiken/alkohol---sa-paverkar-den/",
  },
} satisfies Record<string, QuestionSource>;

export const EXAM_QUESTIONS: Question[] = [
  // ---------- Trafikregler ----------
  {
    id: "tv-tr-1",
    category: "Trafikregler",
    question:
      "Du kör på en väg utan vägmärken om hastighet, utanför tättbebyggt område. Vilken hastighet gäller?",
    options: ["50 km/h", "70 km/h", "80 km/h", "90 km/h"],
    correct: 1,
    explanation:
      "Bashastigheten utanför tättbebyggt område är 70 km/h. Andra hastigheter måste anges med vägmärke.",
    reference: "Trafikförordningen 3 kap. 17 §",
    source: OFFICIAL_SOURCES.tsHastighet,
  },
  {
    id: "tv-tr-2",
    category: "Trafikregler",
    image: "anv-huvudled",
    question: "Du kör på en huvudled och närmar dig en korsning. Vad gäller?",
    options: [
      "Högerregeln gäller ändå i korsningen",
      "Korsande trafik har väjningsplikt mot dig",
      "Du har väjningsplikt mot trafik från höger",
      "Du måste alltid stanna innan korsningen",
    ],
    correct: 1,
    explanation:
      "På huvudled har korsande trafik väjningsplikt. Högerregeln gäller inte, men du måste ändå anpassa hastigheten.",
    reference: "Trafikförordningen 3 kap. 21 §",
    source: OFFICIAL_SOURCES.tsAnvisning,
  },
  {
    id: "tv-tr-3",
    category: "Trafikregler",
    image: "vajningsplikt",
    question: "Vad innebär märket väjningsplikt?",
    options: [
      "Du måste alltid stanna helt före korsningen",
      "Du ska lämna företräde men behöver inte stanna om vägen är fri",
      "Du har företräde framför korsande trafik",
      "Endast tunga fordon behöver väja",
    ],
    correct: 1,
    explanation:
      "Väjningsplikt betyder att du i god tid ska sänka hastigheten eller stanna och bara köra vidare om det kan ske utan fara eller hinder.",
    reference: "Vägmärkesförordningen B1",
    source: OFFICIAL_SOURCES.vmf,
  },
  {
    id: "tv-tr-4",
    category: "Trafikregler",
    image: "forbud-stopp",
    question: "Vad krävs vid detta märke?",
    options: [
      "Sänka hastigheten och köra vidare om vägen är fri",
      "Stanna helt vid stopplinjen, även om vägen är fri",
      "Endast blinka innan du kör ut",
      "Stanna bara när sikten är skymd",
    ],
    correct: 1,
    explanation:
      "Stopplikt innebär att fordonet måste stanna helt vid stopplinjen eller före korsningen, oavsett om vägen är fri.",
    reference: "Vägmärkesförordningen B2",
    source: OFFICIAL_SOURCES.tsForbud,
  },
  {
    id: "tv-tr-5",
    category: "Trafikregler",
    image: "pabud-rondellen",
    question: "Vad gäller när du ska köra in i en cirkulationsplats med detta märke före?",
    options: [
      "Högerregeln gäller inne i cirkulationen",
      "Du har väjningsplikt mot fordon som redan befinner sig i cirkulationen",
      "Du har alltid företräde vid infart",
      "Du måste alltid stanna före infarten",
    ],
    correct: 1,
    explanation:
      "Märket cirkulationsplats kombineras normalt med väjningsplikt: du lämnar företräde åt trafik som redan kör i cirkulationen.",
    reference: "Vägmärkesförordningen D3 + B1",
    source: OFFICIAL_SOURCES.tsPabud,
  },
  {
    id: "tv-tr-6",
    category: "Trafikregler",
    image: "anv-gangfartsomrade",
    question: "Vad gäller i ett gångfartsområde?",
    options: [
      "Högst 30 km/h och parkering överallt",
      "Gångfart, väjningsplikt mot gående och parkering endast på markerade platser",
      "Fordonstrafik är helt förbjuden",
      "Gående ska gå på trottoaren",
    ],
    correct: 1,
    explanation:
      "I gångfartsområde får du inte köra fortare än gångfart, du har väjningsplikt mot gående och får bara parkera på särskilt anordnade platser.",
    reference: "Trafikförordningen 8 kap. 1 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-tr-7",
    category: "Trafikregler",
    question: "Var är det förbjudet att stanna eller parkera?",
    options: [
      "10 meter före ett övergångsställe",
      "På en parkeringsficka utanför tätort",
      "20 meter efter en busshållplats",
      "På höger sida i en enkelriktad gata",
    ],
    correct: 0,
    explanation:
      "Det är förbjudet att stanna eller parkera i en korsning eller närmare än 10 meter före ett övergångsställe, en cykelöverfart eller en korsande körbana.",
    reference: "Trafikförordningen 3 kap. 53 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-tr-8",
    category: "Trafikregler",
    image: "forbud-omkorning",
    question: "Vad förbjuder detta märke?",
    options: [
      "Omkörning av motorfordon på fler än två hjul",
      "All körning med personbil",
      "Att köra om cyklister",
      "Att byta körfält",
    ],
    correct: 0,
    explanation:
      "Märket betyder förbud mot omkörning av motordrivet fordon på fler än två hjul. Du får fortfarande köra om t.ex. moped klass II och cykel.",
    reference: "Vägmärkesförordningen C27",
    source: OFFICIAL_SOURCES.tsForbud,
  },
  {
    id: "tv-tr-9",
    category: "Trafikregler",
    question: "Du ska köra om en långtradare på en landsväg. Vad är viktigast?",
    options: [
      "Att ligga nära bakom för att korta omkörningen",
      "Att ha god sikt, tillräcklig fri sträcka och att omkörningen kan ske utan fara",
      "Att tuta innan du kör om",
      "Att köra om till höger om lastbilen väjer",
    ],
    correct: 1,
    explanation:
      "Omkörning får bara ske när den kan göras utan fara. Håll avstånd före omkörningen för bättre sikt och kortare omkörningssträcka.",
    reference: "Trafikförordningen 3 kap. 30–39 §§",
    source: OFFICIAL_SOURCES.tsGenerella,
  },
  {
    id: "tv-tr-10",
    category: "Trafikregler",
    image: "info-motorvag",
    question: "Vilket fordon får köras på motorväg?",
    options: [
      "Moped klass I (45 km/h)",
      "Personbil med släp konstruerad för 60 km/h",
      "Traktor",
      "Cykel med elassistans",
    ],
    correct: 1,
    explanation:
      "På motorväg får endast fordon som kan och får köra minst 40 km/h framföras. Moped, cykel och traktor är förbjudna.",
    reference: "Trafikförordningen 9 kap. 1 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-tr-11",
    category: "Trafikregler",
    question: "Vad gäller vid en obevakad cykelöverfart där du ska svänga?",
    options: [
      "Cyklisten ska alltid väja för bilar",
      "Du har väjningsplikt mot cyklande på eller på väg ut på cykelöverfarten",
      "Väjningsplikten gäller bara i tätort",
      "Du måste stanna helt varje gång",
    ],
    correct: 1,
    explanation:
      "Vid en cykelöverfart har fordonsförare väjningsplikt mot cyklande och förare av moped klass II som är ute på eller just ska färdas ut på överfarten.",
    reference: "Trafikförordningen 3 kap. 61 a §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-tr-12",
    category: "Trafikregler",
    image: "forbud-stannaparkera",
    question: "Vad betyder detta märke?",
    options: [
      "Förbud mot att parkera men du får stanna",
      "Förbud mot att stanna och parkera",
      "Endast lastning tillåten",
      "Parkering mot avgift",
    ],
    correct: 1,
    explanation:
      "Märket C39 betyder förbud mot att stanna och parkera fordon. Stopp för att undvika fara eller på grund av trafikförhållandena räknas inte som stannande.",
    reference: "Vägmärkesförordningen C39",
    source: OFFICIAL_SOURCES.tsForbud,
  },
  {
    id: "tv-tr-13",
    category: "Trafikregler",
    question: "Ett utryckningsfordon med blåljus och siren närmar sig bakifrån. Vad gör du?",
    options: [
      "Bromsar kraftigt och stannar mitt i körbanan",
      "Fortsätter i samma hastighet",
      "Underlättar passagen genom att i god tid köra åt sidan och vid behov stanna",
      "Kör snabbare för att komma undan",
    ],
    correct: 2,
    explanation:
      "Du ska lämna fri väg för utryckningsfordon och underlätta passagen – gärna genom att köra åt sidan, utan att skapa en farlig situation.",
    reference: "Trafikförordningen 2 kap. 4 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-tr-14",
    category: "Trafikregler",
    image: "anv-enkelriktat",
    question: "Vad gäller på en gata med detta märke?",
    options: [
      "Trafik i båda riktningarna men parkering endast åt ett håll",
      "Trafiken går i pilens riktning – du får inte köra mot enkelriktat",
      "Endast bussar får köra",
      "Märket anger rekommenderad färdväg",
    ],
    correct: 1,
    explanation:
      "Anvisningsmärket enkelriktad trafik visar att fordonstrafiken bara får köra i pilens riktning på gatan.",
    reference: "Vägmärkesförordningen E16",
    source: OFFICIAL_SOURCES.tsAnvisning,
  },

  // ---------- Vägmärken ----------
  {
    id: "tv-vm-1",
    category: "Vägmärken",
    image: "varning-vilt",
    question: "Vad ska du göra när du ser detta märke?",
    options: [
      "Öka hastigheten för att snabbt passera sträckan",
      "Sänka hastigheten och vara beredd på vilt, särskilt i gryning och skymning",
      "Tuta kontinuerligt",
      "Byta till helljus även i möte",
    ],
    correct: 1,
    explanation:
      "Varningsmärket varnar för risk för vilt på vägen. Sänk hastigheten och håll uppsikt mot vägkanterna – flera djur kan följa efter varandra.",
    reference: "Vägmärkesförordningen A17",
    source: OFFICIAL_SOURCES.tsVarning,
  },
  {
    id: "tv-vm-2",
    category: "Vägmärken",
    image: "varning-halka",
    question: "Vad varnar detta märke för?",
    options: ["Ojämn väg", "Risk för halka", "Vägarbete", "Kurvig väg"],
    correct: 1,
    explanation:
      "Märket varnar för att vägen kan vara extra hal, t.ex. vid regn, is eller lövhalka. Anpassa hastigheten och undvik tvära manövrar.",
    reference: "Vägmärkesförordningen A31",
    source: OFFICIAL_SOURCES.tsVarning,
  },
  {
    id: "tv-vm-3",
    category: "Vägmärken",
    image: "forbud-infart",
    question: "Vad betyder detta märke?",
    options: [
      "Förbud mot infart med fordon",
      "Förbud mot att parkera",
      "Stopp för tull",
      "Vändplats",
    ],
    correct: 0,
    explanation:
      "Märket C1 betyder förbud mot infart med fordon och sätts oftast upp där gatan är enkelriktad åt andra hållet.",
    reference: "Vägmärkesförordningen C1",
    source: OFFICIAL_SOURCES.tsForbud,
  },
  {
    id: "tv-vm-4",
    category: "Vägmärken",
    image: "pabud-hoger",
    question: "Vad innebär detta påbudsmärke?",
    options: [
      "Rekommenderad färdriktning",
      "Påbjuden körriktning – du måste svänga höger",
      "Varning för korsning",
      "Förbud mot att svänga vänster nästa korsning",
    ],
    correct: 1,
    explanation:
      "Påbudsmärken talar om vad du måste göra. Detta märke anger påbjuden körriktning – höger.",
    reference: "Vägmärkesförordningen D1",
    source: OFFICIAL_SOURCES.tsPabud,
  },
  {
    id: "tv-vm-5",
    category: "Vägmärken",
    image: "info-tatort",
    question: "Vad gäller när du passerar detta märke?",
    options: [
      "70 km/h om inget annat anges",
      "50 km/h om inget annat anges, samt tätortsregler",
      "30 km/h alltid",
      "Endast en ortsangivelse utan regelbetydelse",
    ],
    correct: 1,
    explanation:
      "Märket anger att tättbebyggt område börjar. Bashastigheten blir 50 km/h om inget annat anges och tätortens parkeringsregler gäller.",
    reference: "Trafikförordningen 3 kap. 17 §, VMF E5",
    source: OFFICIAL_SOURCES.tsHastighet,
  },
  {
    id: "tv-vm-6",
    category: "Vägmärken",
    image: "anv-slut-huvudled",
    question: "Vad gäller direkt efter detta märke?",
    options: [
      "Du har fortfarande företräde",
      "Huvudleden upphör – normala väjningsregler, ofta högerregeln, gäller",
      "Stopplikt i nästa korsning",
      "Motorvägen börjar",
    ],
    correct: 1,
    explanation:
      "När huvudleden upphör gäller vanliga väjningsregler igen. Det innebär oftast högerregeln i nästa korsning.",
    reference: "Vägmärkesförordningen E20",
    source: OFFICIAL_SOURCES.tsAnvisning,
  },
  {
    id: "tv-vm-7",
    category: "Vägmärken",
    image: "pabud-gangbana",
    question: "Vad anger detta märke?",
    options: [
      "Påbjuden gång- och cykelbana",
      "Förbud mot gångtrafik",
      "Busshållplats",
      "Lekområde",
    ],
    correct: 0,
    explanation:
      "Märket anger påbjuden gång- och cykelbana. Bilister får inte köra där, och gående respektive cyklande ska använda banan.",
    reference: "Vägmärkesförordningen D6",
    source: OFFICIAL_SOURCES.tsPabud,
  },
  {
    id: "tv-vm-8",
    category: "Vägmärken",
    image: "varning-vagarbete",
    question: "Vad gäller vid vägarbete?",
    options: [
      "Skyltad hastighet vid vägarbete är endast en rekommendation",
      "Du ska följa den tillfälliga skyltningen och anpassa hastigheten efter vägarbetare och maskiner",
      "Vägarbetsskyltar gäller bara på vardagar",
      "Du får köra om arbetsfordon var som helst",
    ],
    correct: 1,
    explanation:
      "Vid vägarbete gäller den tillfälliga skyltningen fullt ut. Sänk hastigheten – vägarbetare rör sig nära trafiken.",
    reference: "Vägmärkesförordningen A20",
    source: OFFICIAL_SOURCES.tvSakerhet,
  },
  {
    id: "tv-vm-9",
    category: "Vägmärken",
    image: "info-vagnr",
    question: "Vilken typ av märke är vägnummermärket?",
    options: ["Varningsmärke", "Lokaliseringsmärke för vägvisning", "Förbudsmärke", "Påbudsmärke"],
    correct: 1,
    explanation:
      "Vägnummermärken hör till lokaliseringsmärken för vägvisning och hjälper dig hitta rätt väg – de innehåller ingen regel du måste följa.",
    reference: "Vägmärkesförordningen 2 kap.",
    source: OFFICIAL_SOURCES.tsLokalisering,
  },
  {
    id: "tv-vm-10",
    category: "Vägmärken",
    image: "anv-overgang",
    question: "Vad gäller vid ett obevakat övergångsställe?",
    options: [
      "Gående ska alltid vänta på fordon",
      "Du har väjningsplikt mot gående som gått ut på eller just ska gå ut på övergångsstället",
      "Du måste alltid stanna, även om ingen är där",
      "Väjningsplikten gäller bara dagtid",
    ],
    correct: 1,
    explanation:
      "Vid obevakat övergångsställe har föraren väjningsplikt mot gående som gått ut på eller just ska gå ut på övergångsstället.",
    reference: "Trafikförordningen 3 kap. 61 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-vm-11",
    category: "Vägmärken",
    image: "varning-avsmalnande",
    question: "Vad varnar märket för?",
    options: ["Avsmalnande väg", "Vägen delar sig", "Bro med begränsad bärighet", "Tunnel"],
    correct: 0,
    explanation:
      "Märket varnar för att vägen smalnar av. Sänk hastigheten och var beredd på att samsas om utrymmet vid möte.",
    reference: "Vägmärkesförordningen A22",
    source: OFFICIAL_SOURCES.tsVarning,
  },
  {
    id: "tv-vm-12",
    category: "Vägmärken",
    image: "forbud-hastighet-30",
    question: "Var upphör en hastighetsbegränsning som angetts med förbudsmärke?",
    options: [
      "Efter 500 meter",
      "Vid nästa korsning",
      "Där ett nytt hastighetsmärke eller märket 'slut på begränsning' anges",
      "När du lämnar bebyggelse",
    ],
    correct: 2,
    explanation:
      "Begränsningen gäller tills ett nytt hastighetsmärke sätts upp eller tills tättbebyggt område börjar/upphör och en annan bashastighet tar över.",
    reference: "Vägmärkesförordningen C31",
    source: OFFICIAL_SOURCES.tsForbud,
  },

  // ---------- Människan & Trafiken ----------
  {
    id: "tv-mt-1",
    category: "Människan & Trafiken",
    question: "Vilken är gränsen för rattfylleri i Sverige?",
    options: ["0,1 promille", "0,2 promille", "0,5 promille", "1,0 promille"],
    correct: 1,
    explanation:
      "Gränsen för rattfylleri är 0,2 promille alkohol i blodet. Vid 1,0 promille eller mer räknas det som grovt rattfylleri.",
    reference: "Lag (1951:649) om straff för vissa trafikbrott",
    source: OFFICIAL_SOURCES.tvRattfylleri,
  },
  {
    id: "tv-mt-2",
    category: "Människan & Trafiken",
    question: "Hur påverkas kroppen av alkohol i trafiken?",
    options: [
      "Reaktionstiden förkortas",
      "Omdömet försämras och reaktionstiden förlängs, samtidigt som självförtroendet ökar",
      "Endast synen påverkas",
      "Effekten försvinner om du dricker kaffe",
    ],
    correct: 1,
    explanation:
      "Alkohol försämrar omdöme, koordination och reaktionsförmåga, samtidigt som riskbenägenheten ökar. Kaffe eller dusch påskyndar inte nedbrytningen.",
    reference: "Trafikverket – alkohol i vägtrafiken",
    source: OFFICIAL_SOURCES.tvAlkoholPaverkan,
  },
  {
    id: "tv-mt-3",
    category: "Människan & Trafiken",
    question: "Du känner dig trött under en längre körning. Vad är rätt åtgärd?",
    options: [
      "Öppna fönstret och höja musiken",
      "Ta paus och sova en kort stund innan du fortsätter",
      "Köra fortare för att komma fram tidigare",
      "Dricka energidryck och fortsätta i flera timmar",
    ],
    correct: 1,
    explanation:
      "Trötthet går inte att vädra bort. Den enda effektiva åtgärden är vila – en kort tupplur på 15–20 minuter plus paus.",
    reference: "Trafikverket – trötthet i trafiken",
    source: OFFICIAL_SOURCES.tvAlkohol,
  },
  {
    id: "tv-mt-4",
    category: "Människan & Trafiken",
    question: "Varför ökar krockvåldet så kraftigt med hastigheten?",
    options: [
      "Krockvåldet ökar linjärt med hastigheten",
      "Rörelseenergin ökar med kvadraten på hastigheten",
      "Bilens vikt ökar vid högre fart",
      "Bromsarna slutar fungera över 70 km/h",
    ],
    correct: 1,
    explanation:
      "Rörelseenergin ökar med kvadraten på hastigheten – dubbel hastighet ger fyrdubbelt krockvåld och betydligt längre stoppsträcka.",
    reference: "Trafikverket – hastighet och krockvåld",
    source: OFFICIAL_SOURCES.tvKrockvald,
  },
  {
    id: "tv-mt-5",
    category: "Människan & Trafiken",
    question: "Vad gäller för bilbälte i personbil?",
    options: [
      "Endast föraren måste använda bälte",
      "Alla i bilen ska använda bilbälte där sådant finns",
      "Bälte krävs bara utanför tätort",
      "Passagerare i baksätet är undantagna",
    ],
    correct: 1,
    explanation:
      "Alla som färdas i en personbil ska använda bilbälte på platser som har bälte. Föraren ansvarar för att barn under 15 år är rätt skyddade.",
    reference: "Trafikförordningen 4 kap. 10 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-mt-6",
    category: "Människan & Trafiken",
    question: "Hur får du använda mobiltelefon under körning?",
    options: [
      "Fritt så länge du kör långsamt",
      "Inte på ett sätt som är trafikfarligt – handhållen användning av mobil är förbjuden",
      "Endast för att skicka meddelanden",
      "Bara i tätort",
    ],
    correct: 1,
    explanation:
      "Det är förbjudet att hålla mobiltelefon eller annan kommunikationsutrustning i handen under körning. Föraren ska alltid ha full uppmärksamhet på trafiken.",
    reference: "Trafikförordningen 4 kap. 10 e §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-mt-7",
    category: "Människan & Trafiken",
    question: "Vad är reaktionssträcka?",
    options: [
      "Sträckan bilen rullar från att du upptäcker faran tills du börjar bromsa",
      "Sträckan från att bromsarna tar tills bilen står still",
      "Hela stoppsträckan",
      "Avståndet till framförvarande fordon",
    ],
    correct: 0,
    explanation:
      "Stoppsträcka = reaktionssträcka + bromssträcka. Reaktionssträckan ökar rakt av med hastigheten och förlängs av trötthet, alkohol och distraktion.",
    reference: "Trafikverket – hastighet och säkerhet",
    source: OFFICIAL_SOURCES.tvHastighetsgranser,
  },

  // ---------- Fordonskännedom ----------
  {
    id: "tv-fk-1",
    category: "Fordonskännedom",
    question: "När är vinterdäck obligatoriskt på personbil i Sverige?",
    options: [
      "1 november–31 mars oavsett väglag",
      "1 december–31 mars när vinterväglag råder",
      "Endast norr om Dalälven",
      "Aldrig, det är en rekommendation",
    ],
    correct: 1,
    explanation:
      "Vinterdäck eller likvärdig utrustning krävs 1 december–31 mars när vinterväglag råder.",
    reference: "Trafikförordningen 4 kap. 18 a §",
    source: OFFICIAL_SOURCES.tsVinterdack,
  },
  {
    id: "tv-fk-2",
    category: "Fordonskännedom",
    question: "Vilket är minsta tillåtna mönsterdjup på vinterdäck vid vinterväglag?",
    options: ["1,6 mm", "3,0 mm", "4,0 mm", "5,0 mm"],
    correct: 1,
    explanation:
      "Vid vinterväglag ska vinterdäck ha minst 3 mm mönsterdjup. För sommardäck gäller minst 1,6 mm.",
    reference: "Trafikförordningen 4 kap. 18 a §",
    source: OFFICIAL_SOURCES.tsDack,
  },
  {
    id: "tv-fk-3",
    category: "Fordonskännedom",
    question: "Vad händer med bilen om däcktrycket är för lågt?",
    options: [
      "Bränsleförbrukningen minskar",
      "Bränsleförbrukningen ökar, däcken slits ojämnt och väghållningen försämras",
      "Bromssträckan blir kortare",
      "Ingenting märkbart",
    ],
    correct: 1,
    explanation:
      "För lågt lufttryck ger högre rullmotstånd och bränsleförbrukning, ökat slitage på däckkanterna samt sämre stabilitet.",
    reference: "Transportstyrelsen – däck",
    source: OFFICIAL_SOURCES.tsDack,
  },
  {
    id: "tv-fk-4",
    category: "Fordonskännedom",
    question: "En röd varningslampa tänds under körning. Vad gör du?",
    options: [
      "Fortsätter till nästa verkstadsbesök",
      "Stannar på säker plats så snart det går och kontrollerar felet",
      "Kopplar ur säkringen",
      "Ignorerar den om bilen känns normal",
    ],
    correct: 1,
    explanation:
      "Röd varningslampa betyder allvarligt fel – stanna säkert och åtgärda. Gul/orange lampa betyder att något bör kontrolleras snart.",
    reference: "Fordonets instruktionsbok",
    source: OFFICIAL_SOURCES.tvProv,
  },
  {
    id: "tv-fk-5",
    category: "Fordonskännedom",
    question: "Vad gäller för lasten i och på en personbil?",
    options: [
      "Lasten får skjuta ut fritt bakåt utan markering",
      "Lasten ska vara säkrad och får inte skymma sikt eller belysning; utskjutande last ska markeras",
      "Endast lasten i bagageutrymmet behöver säkras",
      "Takräcke kräver ingen lastsäkring",
    ],
    correct: 1,
    explanation:
      "Last ska vara säkrad så att den inte kan förskjutas. Den får inte skymma förarens sikt eller fordonets lyktor och skyltar, och utskjutande last ska markeras.",
    reference: "Trafikförordningen 3 kap. 81 §",
    source: OFFICIAL_SOURCES.tfo,
  },
  {
    id: "tv-fk-6",
    category: "Fordonskännedom",
    question: "Vad innebär ABS-bromsar?",
    options: [
      "Bromssträckan blir alltid kortare på alla underlag",
      "Hjulen hindras från att låsa sig så att du kan styra under kraftig inbromsning",
      "Bilen bromsar automatiskt vid hinder",
      "Motorbromsen förstärks",
    ],
    correct: 1,
    explanation:
      "ABS förhindrar hjullåsning så att styrförmågan behålls vid hård inbromsning. På lös grus eller snö kan bromssträckan bli något längre.",
    reference: "Transportstyrelsen – fordonsregler",
    source: OFFICIAL_SOURCES.tsDack,
  },
  {
    id: "tv-fk-7",
    category: "Fordonskännedom",
    question:
      "Vad gäller om bilen inte är godkänd vid kontrollbesiktning med föreläggande om körförbud?",
    options: [
      "Bilen får köras fritt i två veckor",
      "Bilen får inte köras annat än till verkstad eller besiktning kortaste lämpliga väg",
      "Körförbud gäller endast i tätort",
      "Ägaren kan själv upphäva körförbudet",
    ],
    correct: 1,
    explanation:
      "Vid körförbud får fordonet i princip bara köras kortaste lämpliga väg till verkstad eller till en ny besiktning.",
    reference: "Fordonsförordningen (2009:211)",
    source: OFFICIAL_SOURCES.tsTrafikregler,
  },

  // ---------- Miljö ----------
  {
    id: "tv-mi-1",
    category: "Miljö",
    question: "Vilket körsätt sänker bränsleförbrukningen mest?",
    options: [
      "Snabba accelerationer och sena inbromsningar",
      "Jämn hastighet, tidiga växlingar och att använda motorbromsen",
      "Att köra på högsta växel i låg fart med hög belastning",
      "Att låta motorn gå på tomgång i väntan",
    ],
    correct: 1,
    explanation:
      "Sparsam körning – jämn fart, tidig växling upp, planerade inbromsningar och rullande motorbroms – kan sänka förbrukningen tydligt.",
    reference: "Trafikverket – hastighet och hållbarhet",
    source: OFFICIAL_SOURCES.tvHallbarhet,
  },
  {
    id: "tv-mi-2",
    category: "Miljö",
    question: "Hur påverkar högre hastighet miljön?",
    options: [
      "Utsläppen minskar eftersom resan blir kortare",
      "Luftmotståndet och bränsleförbrukningen ökar kraftigt, vilket ger högre utsläpp",
      "Hastigheten har ingen betydelse för utsläpp",
      "Endast dieselbilar påverkas",
    ],
    correct: 1,
    explanation:
      "Luftmotståndet ökar med kvadraten på hastigheten. Högre fart ger därför märkbart högre bränsleförbrukning och koldioxidutsläpp.",
    reference: "Trafikverket – hastighet och hållbarhet",
    source: OFFICIAL_SOURCES.tvHallbarhet,
  },
  {
    id: "tv-mi-3",
    category: "Miljö",
    question: "Vilket ämne från vägtrafiken bidrar mest till växthuseffekten?",
    options: ["Koldioxid (CO₂)", "Kolmonoxid (CO)", "Kväveoxider (NOx)", "Partiklar (PM10)"],
    correct: 0,
    explanation:
      "Koldioxid är den dominerande växthusgasen från vägtrafiken och står i direkt proportion till mängden förbränt bränsle.",
    reference: "Trafikverket – trafik och miljö",
    source: OFFICIAL_SOURCES.tvHallbarhet,
  },
  {
    id: "tv-mi-4",
    category: "Miljö",
    question:
      "Varifrån kommer merparten av de partiklar (PM10) som bildas i svensk vägtrafik vintertid?",
    options: [
      "Avgaser från bensinbilar",
      "Slitage av vägbanan, främst från dubbdäck",
      "Bromsvätska",
      "Kylarvätska",
    ],
    correct: 1,
    explanation:
      "Dubbdäck sliter på asfalten och ger stora mängder inandningsbara partiklar i tätort. Därför är dubbdäck förbjudna på vissa gator.",
    reference: "Transportstyrelsen – däck",
    source: OFFICIAL_SOURCES.tsDack,
  },
  {
    id: "tv-mi-5",
    category: "Miljö",
    question: "Vad är rätt om tomgångskörning?",
    options: [
      "Motorn ska värmas i minst 10 minuter innan körning",
      "Tomgångskörning är i många kommuner begränsad till max 1 minut",
      "Tomgång är alltid tillåten på privat mark",
      "Tomgång sparar bränsle jämfört med att starta om",
    ],
    correct: 1,
    explanation:
      "Många kommuner begränsar tomgångskörning till högst en minut. Modern motor värms bäst genom att köras försiktigt direkt.",
    reference: "Kommunala lokala föreskrifter",
    source: OFFICIAL_SOURCES.tvHallbarhet,
  },
  {
    id: "tv-mi-6",
    category: "Miljö",
    question: "Vilket alternativ minskar din klimatpåverkan mest vid bilkörning?",
    options: [
      "Ta bort takboxen när den inte används och samåk när det går",
      "Köra med lågt däcktryck",
      "Alltid använda högsta växel oavsett varvtal",
      "Fylla tanken helt varje gång",
    ],
    correct: 0,
    explanation:
      "Onödigt luftmotstånd från takbox eller takräcke ökar förbrukningen märkbart. Samåkning och färre resor ger störst effekt.",
    reference: "Trafikverket – hastighet och hållbarhet",
    source: OFFICIAL_SOURCES.tvHallbarhet,
  },
];
