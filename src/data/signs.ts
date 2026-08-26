export type SignCategory =
  | "Varningsmärken"
  | "Förbudsmärken"
  | "Påbudsmärken"
  | "Anvisningsmärken"
  | "Information";

export interface RoadSign {
  id: string;
  name: string;
  category: SignCategory;
  meaning: string;
  trap: string;
  svg: string; // inline SVG markup
}

// Common SVG primitives for Swedish road signs
const warnTri = (inner: string) => `
<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,6 114,102 6,102" fill="#fff" stroke="#d1121a" stroke-width="8" stroke-linejoin="round"/>
  ${inner}
</svg>`;

const prohibCircle = (inner: string) => `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="52" fill="#fff" stroke="#d1121a" stroke-width="10"/>
  ${inner}
</svg>`;

const mandateCircle = (inner: string) => `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="54" fill="#0a5cad"/>
  ${inner}
</svg>`;

const infoSquare = (bg: string, inner: string) => `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="6" width="108" height="108" rx="6" fill="${bg}" stroke="#1a1a1a" stroke-width="2"/>
  ${inner}
</svg>`;

export const ROAD_SIGNS: RoadSign[] = [
  {
    id: "varning-kurva",
    name: "Varning för kurva",
    category: "Varningsmärken",
    meaning: "Varnar för en kurva där hastigheten kan behöva sänkas.",
    trap: "Pilen visar kurvans riktning – höger eller vänster.",
    svg: warnTri(
      `<path d="M45 80 Q45 45 75 45 L75 55 L92 40 L75 25 L75 35 Q35 35 35 80 Z" fill="#111"/>`,
    ),
  },
  {
    id: "varning-barn",
    name: "Varning för barn",
    category: "Varningsmärken",
    meaning: "Varnar för plats där barn ofta uppehåller sig, t.ex. skola eller lekplats.",
    trap: "Innebär INTE nedsatt hastighetsgräns automatiskt – anpassa hastigheten själv.",
    svg: warnTri(
      `<circle cx="52" cy="58" r="6" fill="#111"/><path d="M46 66 h12 v14 h-4 v14 h-4 v-14 h-4z" fill="#111"/><circle cx="72" cy="58" r="5" fill="#111"/><path d="M68 64 h10 v10 h-3 v12 h-4 v-12 h-3z" fill="#111"/>`,
    ),
  },
  {
    id: "varning-vilt",
    name: "Varning för vilt",
    category: "Varningsmärken",
    meaning: "Varnar för vilda djur, oftast älg eller rådjur.",
    trap: "Gäller ofta en längre sträcka – var uppmärksam även efter skylten.",
    svg: warnTri(
      `<path d="M40 85 L45 60 L55 55 L60 40 L70 45 L80 40 L82 50 L78 60 L82 85 L74 85 L72 68 L58 70 L58 85 Z" fill="#111"/>`,
    ),
  },
  {
    id: "varning-halka",
    name: "Varning för slirig väg",
    category: "Varningsmärken",
    meaning: "Vägen kan vara hal p.g.a. regn, is, löv eller grus.",
    trap: "Sänk hastigheten och undvik plötsliga rattrörelser.",
    svg: warnTri(
      `<path d="M35 75 Q55 55 65 75 T95 65" stroke="#111" stroke-width="6" fill="none"/><path d="M40 88 L52 82 M62 90 L72 82 M80 88 L92 80" stroke="#111" stroke-width="4"/>`,
    ),
  },
  {
    id: "forbud-stopp",
    name: "Stopplikt",
    category: "Förbudsmärken",
    meaning: "Du måste stanna helt och lämna företräde innan du kör vidare.",
    trap: "Även om vägen är fri måste du stanna helt – inte bara sakta ner.",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="35,6 85,6 114,35 114,85 85,114 35,114 6,85 6,35" fill="#d1121a" stroke="#fff" stroke-width="6"/>
      <text x="60" y="72" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="26" fill="#fff" font-weight="900">STOP</text>
    </svg>`,
  },
  {
    id: "forbud-hastighet-50",
    name: "Hastighetsbegränsning 50",
    category: "Förbudsmärken",
    meaning: "Högsta tillåtna hastighet 50 km/h tills nytt märke.",
    trap: "Gäller tills annat hastighetsmärke eller tätbebyggt område upphör.",
    svg: prohibCircle(
      `<text x="60" y="76" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="42" fill="#111" font-weight="900">50</text>`,
    ),
  },
  {
    id: "forbud-omkorning",
    name: "Förbud mot omkörning",
    category: "Förbudsmärken",
    meaning: "Det är förbjudet att köra om andra motordrivna fordon utom moped klass II.",
    trap: 'Gäller tills märket "slut på omkörningsförbud" eller korsning kommer.',
    svg: prohibCircle(`
      <rect x="30" y="45" width="22" height="35" rx="3" fill="#111"/>
      <rect x="60" y="45" width="22" height="35" rx="3" fill="#d1121a"/>
    `),
  },
  {
    id: "forbud-infart",
    name: "Förbud mot infart",
    category: "Förbudsmärken",
    meaning: "Fordonstrafik i riktning mot märket är förbjuden.",
    trap: 'Röd med vit balk – förväxla inte med "förbud mot trafik" som är helt röd med svart cykel/bil.',
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="52" fill="#d1121a" stroke="#fff" stroke-width="6"/>
      <rect x="20" y="52" width="80" height="16" fill="#fff"/>
    </svg>`,
  },
  {
    id: "pabud-hoger",
    name: "Påbjuden körriktning höger",
    category: "Påbudsmärken",
    meaning: "Du måste köra i pilens riktning.",
    trap: "Påbudsmärken är runda och blå – till skillnad från anvisningsmärken.",
    svg: mandateCircle(
      `<path d="M40 60 L75 60 L65 45 L90 60 L65 75 L75 60" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`,
    ),
  },
  {
    id: "pabud-cykel",
    name: "Påbjuden cykelbana",
    category: "Påbudsmärken",
    meaning: "Cyklister och mopedister klass II måste använda banan.",
    trap: "Även gående får använda banan om trottoar saknas.",
    svg: mandateCircle(
      `<circle cx="42" cy="78" r="12" fill="none" stroke="#fff" stroke-width="5"/><circle cx="78" cy="78" r="12" fill="none" stroke="#fff" stroke-width="5"/><path d="M42 78 L60 55 L78 78 M55 55 L70 55" stroke="#fff" stroke-width="5" fill="none"/><circle cx="65" cy="42" r="6" fill="#fff"/>`,
    ),
  },
  {
    id: "pabud-rondellen",
    name: "Cirkulationsplats",
    category: "Påbudsmärken",
    meaning: "Fordon i rondellen har företräde. Kör motsols.",
    trap: "Blinka höger när du ska lämna rondellen – inte vid ingång.",
    svg: mandateCircle(`
      <path d="M60 30 A30 30 0 1 1 30 60" fill="none" stroke="#fff" stroke-width="6"/>
      <path d="M60 30 A30 30 0 0 1 90 60" fill="none" stroke="#fff" stroke-width="6"/>
      <path d="M90 60 A30 30 0 0 1 60 90" fill="none" stroke="#fff" stroke-width="6"/>
      <polygon points="60,25 66,35 54,35" fill="#fff"/>
      <polygon points="88,58 95,66 82,68" fill="#fff"/>
      <polygon points="62,88 55,80 68,80" fill="#fff"/>
    `),
  },
  {
    id: "anv-huvudled",
    name: "Huvudled",
    category: "Anvisningsmärken",
    meaning: "Du kör på huvudled och har företräde vid korsningar.",
    trap: 'Huvudleden gäller tills märket "slut på huvudled" – inte bara till nästa korsning.',
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="60,10 110,60 60,110 10,60" fill="#111"/>
      <polygon points="60,20 100,60 60,100 20,60" fill="#f5c518"/>
      <polygon points="60,32 88,60 60,88 32,60" fill="#fff"/>
    </svg>`,
  },
  {
    id: "anv-overgang",
    name: "Övergångsställe",
    category: "Anvisningsmärken",
    meaning: "Här finns ett övergångsställe – lämna företräde åt gående som ska korsa.",
    trap: "Även vid obevakat övergångsställe måste du släppa förbi gående.",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,10 110,10 110,110 10,110" fill="#0a5cad"/>
      <polygon points="20,80 60,20 100,80" fill="#fff"/>
      <circle cx="55" cy="45" r="5" fill="#111"/>
      <path d="M50 52 h10 v10 l4 8 h-4 v10 h-4 v-10 l-6 -8 z" fill="#111"/>
      <rect x="30" y="85" width="8" height="15" fill="#fff"/>
      <rect x="45" y="85" width="8" height="15" fill="#fff"/>
      <rect x="60" y="85" width="8" height="15" fill="#fff"/>
      <rect x="75" y="85" width="8" height="15" fill="#fff"/>
    </svg>`,
  },
  {
    id: "info-motorvag",
    name: "Motorväg",
    category: "Information",
    meaning: "Här börjar motorväg. Endast motorfordon med minst 40 km/h får köra.",
    trap: "På motorväg är stannande, U-sväng och backning förbjudet.",
    svg: infoSquare(
      "#0a7d3f",
      `
      <path d="M25 90 L45 40 L75 40 L95 90 L82 90 L68 55 L52 55 L38 90 Z" fill="#fff"/>
      <rect x="15" y="95" width="90" height="6" fill="#fff"/>
    `,
    ),
  },
  {
    id: "info-tatort",
    name: "Tättbebyggt område",
    category: "Information",
    meaning: "Här börjar tättbebyggt område – bashastighet 50 km/h om ej annat anges.",
    trap: "När du passerar upphör-märket gäller landsvägshastighet 70 km/h igen.",
    svg: infoSquare(
      "#0a5cad",
      `
      <rect x="30" y="55" width="18" height="45" fill="#fff"/>
      <rect x="52" y="35" width="20" height="65" fill="#fff"/>
      <rect x="76" y="60" width="16" height="40" fill="#fff"/>
      <rect x="35" y="62" width="4" height="6" fill="#0a5cad"/>
      <rect x="57" y="42" width="4" height="6" fill="#0a5cad"/>
      <rect x="63" y="42" width="4" height="6" fill="#0a5cad"/>
      <rect x="80" y="68" width="4" height="6" fill="#0a5cad"/>
    `,
    ),
  },

  {
    id: "varning-vagarbete",
    name: "Varning för vägarbete",
    category: "Varningsmärken",
    meaning: "Vägarbete pågår. Personal och maskiner kan finnas nära eller på körbanan.",
    trap: "Tillfälliga hastighetsmärken vid vägarbete gäller före de ordinarie.",
    svg: warnTri(
      `<rect x="55" y="42" width="8" height="30" fill="#111"/><path d="M40 88 h40 l-6 -14 h-28 z" fill="#111"/><path d="M62 46 l22 -10 l6 12 l-22 8 z" fill="#111"/>`,
    ),
  },
  {
    id: "varning-cyklande",
    name: "Varning för cyklande och mopedförare",
    category: "Varningsmärken",
    meaning: "Varnar för cykeltrafik som korsar eller färdas längs vägen.",
    trap: "Gäller även moped klass II – ge gott sidoavstånd vid omkörning (minst 1,5 m).",
    svg: warnTri(
      `<circle cx="45" cy="82" r="10" fill="none" stroke="#111" stroke-width="5"/><circle cx="78" cy="82" r="10" fill="none" stroke="#111" stroke-width="5"/><path d="M45 82 L60 60 L78 82 M56 60 L70 60" stroke="#111" stroke-width="5" fill="none"/><circle cx="66" cy="50" r="5" fill="#111"/>`,
    ),
  },
  {
    id: "varning-korsning",
    name: "Varning för vägkorsning",
    category: "Varningsmärken",
    meaning: "Korsning där högerregeln gäller om inget annat anges.",
    trap: "Märket ger dig inte företräde – högerregeln gäller fortfarande.",
    svg: warnTri(
      `<rect x="55" y="35" width="10" height="60" fill="#111"/><rect x="30" y="65" width="60" height="10" fill="#111"/>`,
    ),
  },
  {
    id: "varning-avsmalnande",
    name: "Varning för avsmalnande väg",
    category: "Varningsmärken",
    meaning: "Vägen blir smalare, ofta så att möte försvåras.",
    trap: "Märket reglerar inte vem som har företräde – anpassa och samverka.",
    svg: warnTri(
      `<path d="M42 95 L52 50" stroke="#111" stroke-width="6"/><path d="M78 95 L68 50" stroke="#111" stroke-width="6"/>`,
    ),
  },
  {
    id: "varning-mote",
    name: "Varning för mötande trafik",
    category: "Varningsmärken",
    meaning: "Du kommer till en vägdel med mötande trafik, t.ex. efter enkelriktad sträcka.",
    trap: "Vanligt efter vägarbete eller där två körfält blir ett.",
    svg: warnTri(
      `<path d="M48 92 L48 52 L40 60 M48 52 L56 60" stroke="#111" stroke-width="5" fill="none"/><path d="M74 52 L74 92 L66 84 M74 92 L82 84" stroke="#111" stroke-width="5" fill="none"/>`,
    ),
  },
  {
    id: "vajningsplikt",
    name: "Väjningsplikt",
    category: "Förbudsmärken",
    meaning: "Du har väjningsplikt mot fordon på den korsande vägen.",
    trap: "Du behöver inte stanna om vägen är fri – men du måste kunna stanna.",
    svg: `<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
      <polygon points="60,104 114,8 6,8" fill="#fff" stroke="#d1121a" stroke-width="10" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: "forbud-parkering",
    name: "Förbud att parkera",
    category: "Förbudsmärken",
    meaning: "Parkering är förbjuden på den sida av vägen där märket sitter.",
    trap: "Du får stanna kort för av- och påstigning eller lastning – men inte parkera.",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="52" fill="#0a5cad" stroke="#d1121a" stroke-width="10"/>
      <text x="60" y="78" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="46" fill="#fff" font-weight="900">P</text>
      <line x1="24" y1="96" x2="96" y2="24" stroke="#d1121a" stroke-width="10"/>
    </svg>`,
  },
  {
    id: "forbud-stannaparkera",
    name: "Förbud att stanna och parkera",
    category: "Förbudsmärken",
    meaning: "Både stannande och parkering är förbjudet.",
    trap: "Undantag gäller för trafiksignal, köbildning eller för att undvika fara.",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="52" fill="#0a5cad" stroke="#d1121a" stroke-width="10"/>
      <line x1="24" y1="96" x2="96" y2="24" stroke="#d1121a" stroke-width="10"/>
      <line x1="24" y1="24" x2="96" y2="96" stroke="#d1121a" stroke-width="10"/>
    </svg>`,
  },
  {
    id: "forbud-trafik",
    name: "Förbud mot trafik med motordrivet fordon",
    category: "Förbudsmärken",
    meaning: "Motordrivna fordon får inte passera märket.",
    trap: "Förväxla inte med förbud mot infart – detta gäller båda riktningarna.",
    svg: prohibCircle(
      `<path d="M32 68 h56 v-10 l-8 -12 h-14 l-6 -8 h-16 v30z" fill="#111"/><circle cx="44" cy="72" r="6" fill="#111"/><circle cx="76" cy="72" r="6" fill="#111"/>`,
    ),
  },
  {
    id: "forbud-hastighet-30",
    name: "Hastighetsbegränsning 30",
    category: "Förbudsmärken",
    meaning: "Högsta tillåtna hastighet 30 km/h.",
    trap: "Vanligt vid skolor – gäller dygnet runt om inte tilläggstavla anger tid.",
    svg: prohibCircle(
      `<text x="60" y="76" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="42" fill="#111" font-weight="900">30</text>`,
    ),
  },
  {
    id: "forbud-svang-vanster",
    name: "Förbud mot sväng i korsning (vänster)",
    category: "Förbudsmärken",
    meaning: "Det är förbjudet att svänga vänster i korsningen.",
    trap: "Förbudet gäller endast närmaste korsning efter märket.",
    svg: prohibCircle(
      `<path d="M72 88 L72 58 L48 58 L58 48 M48 58 L58 68" stroke="#111" stroke-width="7" fill="none"/><line x1="24" y1="96" x2="96" y2="24" stroke="#d1121a" stroke-width="9"/>`,
    ),
  },
  {
    id: "pabud-gangbana",
    name: "Påbjuden gångbana",
    category: "Påbudsmärken",
    meaning: "Banan är avsedd för gående.",
    trap: "Cyklar får normalt inte användas här om inte tilläggstavla anger det.",
    svg: mandateCircle(
      `<circle cx="60" cy="40" r="8" fill="#fff"/><path d="M52 50 h16 v18 l8 22 h-8 l-6 -16 l-8 16 h-8 l6 -22z" fill="#fff"/>`,
    ),
  },
  {
    id: "pabud-vanster",
    name: "Påbjuden körriktning vänster",
    category: "Påbudsmärken",
    meaning: "Du måste köra i pilens riktning, till vänster.",
    trap: "Blå rund pil = påbud (måste), blå rektangulär pil = anvisning (enkelriktat).",
    svg: mandateCircle(
      `<path d="M80 60 L45 60 L55 45 L30 60 L55 75 L45 60" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`,
    ),
  },
  {
    id: "pabud-minsta-hastighet",
    name: "Påbjuden minsta hastighet",
    category: "Påbudsmärken",
    meaning: "Du måste hålla minst den angivna hastigheten om förhållandena tillåter.",
    trap: "Förväxla inte med hastighetsbegränsning – detta är ett minimum, inte ett maximum.",
    svg: mandateCircle(
      `<text x="60" y="76" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="40" fill="#fff" font-weight="900">30</text>`,
    ),
  },
  {
    id: "anv-enkelriktat",
    name: "Enkelriktad trafik",
    category: "Anvisningsmärken",
    meaning: "Vägen är enkelriktad i pilens riktning – ingen mötande trafik.",
    trap: "Även om det inte möter trafik gäller vanliga regler för cyklister som kan färdas i båda riktningarna där det tillåts.",
    svg: `<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="112" height="54" rx="4" fill="#0a5cad"/>
      <path d="M28 35 L82 35 L70 22 L98 35 L70 48 L82 35" fill="#fff" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: "anv-slut-huvudled",
    name: "Huvudled upphör",
    category: "Anvisningsmärken",
    meaning: "Huvudleden slutar. Efter märket gäller normalt högerregeln.",
    trap: "Många glömmer att företrädet försvinner direkt efter detta märke.",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="60,10 110,60 60,110 10,60" fill="#111"/>
      <polygon points="60,20 100,60 60,100 20,60" fill="#f5c518"/>
      <polygon points="60,32 88,60 60,88 32,60" fill="#fff"/>
      <line x1="20" y1="100" x2="100" y2="20" stroke="#111" stroke-width="7"/>
    </svg>`,
  },
  {
    id: "anv-gangfartsomrade",
    name: "Gångfartsområde",
    category: "Anvisningsmärken",
    meaning:
      "Fordon får framföras i gångfart, gående har företräde och parkering endast på markerade platser.",
    trap: "Gångfart är cirka 7 km/h – hastighetsmätaren visar knappt utslag.",
    svg: infoSquare(
      "#0a5cad",
      `
      <circle cx="42" cy="34" r="7" fill="#fff"/>
      <path d="M35 44 h14 v16 l6 20 h-7 l-5 -14 l-7 14 h-7 l6 -20z" fill="#fff"/>
      <circle cx="80" cy="40" r="6" fill="#fff"/>
      <path d="M60 92 h44 v-8 l-8 -10 h-20 l-6 -6 h-10 z" fill="#fff"/>
    `,
    ),
  },
  {
    id: "anv-slut-gangfart",
    name: "Gångfartsområde upphör",
    category: "Anvisningsmärken",
    meaning: "Efter märket gäller vanliga trafikregler och bashastighet igen.",
    trap: "Glöm inte att gående inte längre har generellt företräde.",
    svg: infoSquare(
      "#0a5cad",
      `
      <circle cx="42" cy="34" r="7" fill="#fff"/>
      <path d="M35 44 h14 v16 l6 20 h-7 l-5 -14 l-7 14 h-7 l6 -20z" fill="#fff"/>
      <path d="M60 92 h44 v-8 l-8 -10 h-20 l-6 -6 h-10 z" fill="#fff"/>
      <line x1="14" y1="106" x2="106" y2="14" stroke="#d1121a" stroke-width="8"/>
    `,
    ),
  },
  {
    id: "info-parkering",
    name: "Parkering",
    category: "Information",
    meaning: "Anger plats där parkering är tillåten, ofta med villkor på tilläggstavla.",
    trap: "Tilläggstavlor styr tid, avgift och fordonsslag – läs dem alltid.",
    svg: infoSquare(
      "#0a5cad",
      `<text x="60" y="82" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="60" fill="#fff" font-weight="900">P</text>`,
    ),
  },
  {
    id: "info-motorvag-slut",
    name: "Motorväg upphör",
    category: "Information",
    meaning: "Motorvägen slutar – räkna med mötande trafik, korsningar och lägre hastighet.",
    trap: "Sänk farten i god tid; hastighetsintrycket gör att 70 km/h känns långsamt.",
    svg: infoSquare(
      "#0a7d3f",
      `
      <path d="M25 90 L45 40 L75 40 L95 90 L82 90 L68 55 L52 55 L38 90 Z" fill="#fff"/>
      <rect x="15" y="95" width="90" height="6" fill="#fff"/>
      <line x1="14" y1="106" x2="106" y2="14" stroke="#d1121a" stroke-width="8"/>
    `,
    ),
  },
  {
    id: "info-motortrafikled",
    name: "Motortrafikled",
    category: "Information",
    meaning: "Liknande regler som motorväg men ofta bara ett körfält per riktning.",
    trap: "Mötande trafik kan förekomma – omkörning kräver stor försiktighet.",
    svg: infoSquare(
      "#0a7d3f",
      `
      <path d="M30 88 h60 v-10 l-10 -14 h-24 l-8 -8 h-18 z" fill="#fff"/>
      <circle cx="44" cy="94" r="7" fill="#fff"/>
      <circle cx="78" cy="94" r="7" fill="#fff"/>
      <rect x="14" y="24" width="92" height="6" fill="#fff"/>
    `,
    ),
  },
  {
    id: "info-vagnr",
    name: "Vägnummer (Europaväg)",
    category: "Information",
    meaning: "Visar vilken väg du färdas på – E-vägar har grön botten.",
    trap: "Grön skylt betyder Europaväg, blå betyder övriga riksvägar/länsvägar.",
    svg: infoSquare(
      "#0a7d3f",
      `<text x="60" y="76" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="34" fill="#fff" font-weight="900">E4</text>`,
    ),
  },
  {
    id: "info-sjukhus",
    name: "Sjukhus",
    category: "Information",
    meaning: "Anger väg till sjukhus med akutmottagning.",
    trap: "Ett serviceinformationsmärke – ger inga trafikregler eller företräde.",
    svg: infoSquare(
      "#0a5cad",
      `<rect x="52" y="28" width="16" height="64" fill="#fff"/><rect x="28" y="52" width="64" height="16" fill="#fff"/>`,
    ),
  },
];
