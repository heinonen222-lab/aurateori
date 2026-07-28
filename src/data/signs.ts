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
    svg: warnTri(`<path d="M45 80 Q45 45 75 45 L75 55 L92 40 L75 25 L75 35 Q35 35 35 80 Z" fill="#111"/>`),
  },
  {
    id: "varning-barn",
    name: "Varning för barn",
    category: "Varningsmärken",
    meaning: "Varnar för plats där barn ofta uppehåller sig, t.ex. skola eller lekplats.",
    trap: "Innebär INTE nedsatt hastighetsgräns automatiskt – anpassa hastigheten själv.",
    svg: warnTri(`<circle cx="52" cy="58" r="6" fill="#111"/><path d="M46 66 h12 v14 h-4 v14 h-4 v-14 h-4z" fill="#111"/><circle cx="72" cy="58" r="5" fill="#111"/><path d="M68 64 h10 v10 h-3 v12 h-4 v-12 h-3z" fill="#111"/>`),
  },
  {
    id: "varning-vilt",
    name: "Varning för vilt",
    category: "Varningsmärken",
    meaning: "Varnar för vilda djur, oftast älg eller rådjur.",
    trap: "Gäller ofta en längre sträcka – var uppmärksam även efter skylten.",
    svg: warnTri(`<path d="M40 85 L45 60 L55 55 L60 40 L70 45 L80 40 L82 50 L78 60 L82 85 L74 85 L72 68 L58 70 L58 85 Z" fill="#111"/>`),
  },
  {
    id: "varning-halka",
    name: "Varning för slirig väg",
    category: "Varningsmärken",
    meaning: "Vägen kan vara hal p.g.a. regn, is, löv eller grus.",
    trap: "Sänk hastigheten och undvik plötsliga rattrörelser.",
    svg: warnTri(`<path d="M35 75 Q55 55 65 75 T95 65" stroke="#111" stroke-width="6" fill="none"/><path d="M40 88 L52 82 M62 90 L72 82 M80 88 L92 80" stroke="#111" stroke-width="4"/>`),
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
    svg: prohibCircle(`<text x="60" y="76" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="42" fill="#111" font-weight="900">50</text>`),
  },
  {
    id: "forbud-omkorning",
    name: "Förbud mot omkörning",
    category: "Förbudsmärken",
    meaning: "Det är förbjudet att köra om andra motordrivna fordon utom moped klass II.",
    trap: "Gäller tills märket \"slut på omkörningsförbud\" eller korsning kommer.",
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
    trap: "Röd med vit balk – förväxla inte med \"förbud mot trafik\" som är helt röd med svart cykel/bil.",
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
    svg: mandateCircle(`<path d="M40 60 L75 60 L65 45 L90 60 L65 75 L75 60" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`),
  },
  {
    id: "pabud-cykel",
    name: "Påbjuden cykelbana",
    category: "Påbudsmärken",
    meaning: "Cyklister och mopedister klass II måste använda banan.",
    trap: "Även gående får använda banan om trottoar saknas.",
    svg: mandateCircle(`<circle cx="42" cy="78" r="12" fill="none" stroke="#fff" stroke-width="5"/><circle cx="78" cy="78" r="12" fill="none" stroke="#fff" stroke-width="5"/><path d="M42 78 L60 55 L78 78 M55 55 L70 55" stroke="#fff" stroke-width="5" fill="none"/><circle cx="65" cy="42" r="6" fill="#fff"/>`),
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
    trap: "Huvudleden gäller tills märket \"slut på huvudled\" – inte bara till nästa korsning.",
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
    svg: infoSquare("#0a7d3f", `
      <path d="M25 90 L45 40 L75 40 L95 90 L82 90 L68 55 L52 55 L38 90 Z" fill="#fff"/>
      <rect x="15" y="95" width="90" height="6" fill="#fff"/>
    `),
  },
  {
    id: "info-tatort",
    name: "Tättbebyggt område",
    category: "Information",
    meaning: "Här börjar tättbebyggt område – bashastighet 50 km/h om ej annat anges.",
    trap: "När du passerar upphör-märket gäller landsvägshastighet 70 km/h igen.",
    svg: infoSquare("#0a5cad", `
      <rect x="30" y="55" width="18" height="45" fill="#fff"/>
      <rect x="52" y="35" width="20" height="65" fill="#fff"/>
      <rect x="76" y="60" width="16" height="40" fill="#fff"/>
      <rect x="35" y="62" width="4" height="6" fill="#0a5cad"/>
      <rect x="57" y="42" width="4" height="6" fill="#0a5cad"/>
      <rect x="63" y="42" width="4" height="6" fill="#0a5cad"/>
      <rect x="80" y="68" width="4" height="6" fill="#0a5cad"/>
    `),
  },
];
