export type RoadLayout =
  | "cross"
  | "t-crossing"
  | "priority-road"
  | "roundabout"
  | "straight"
  | "sign-context"
  | "residential"
  | "eco"
  | "vehicle-pad"
  | "motorway"
  | "overtake"
  | "parking"
  | "night"
  | "winter"
  | "process";

export interface LessonSceneConfig {
  id: string;
  label: string;
  layout: RoadLayout;
  camera: [number, number, number];
  focus: [number, number, number];
  weather?: "day" | "night" | "winter";
}

const SCENE_LIBRARY = {
  "right-hand-rule": {
    id: "right-hand-rule",
    label: "Högerregeln: bilen från höger kör först",
    layout: "cross",
    camera: [9, 10, 12],
    focus: [0, 0, 0],
  },
  "yield-sign": {
    id: "yield-sign",
    label: "Väjningsplikt: sänk fart och lämna lucka",
    layout: "t-crossing",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "stop-sign": {
    id: "stop-sign",
    label: "Stopplikt: helt stopp vid stopplinjen",
    layout: "cross",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "priority-road": {
    id: "priority-road",
    label: "Huvudled: sidotrafik väntar",
    layout: "priority-road",
    camera: [8, 8, 13],
    focus: [0, 0, 0],
  },
  "roundabout-walking": {
    id: "roundabout-walking",
    label: "Cirkulationsplats: väj in, kör motsols",
    layout: "roundabout",
    camera: [9, 10, 12],
    focus: [0, 0, 0],
  },
  "reaction-distance": {
    id: "reaction-distance",
    label: "Reaktionssträcka: bilen rullar innan bromsning",
    layout: "straight",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
  },
  "braking-distance": {
    id: "braking-distance",
    label: "Bromssträcka: högre fart ger mycket längre stopp",
    layout: "straight",
    camera: [8, 8, 13],
    focus: [0, 0, 0],
  },
  "speed-limits-basic": {
    id: "speed-limits-basic",
    label: "Bashastigheter: tätort, landsväg och motorväg",
    layout: "sign-context",
    camera: [8, 8, 13],
    focus: [0, 0, 0],
  },
  "safe-following-distance": {
    id: "safe-following-distance",
    label: "Avstånd: tresekundersregeln i trafik",
    layout: "straight",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
  },
  "sign-shapes": {
    id: "sign-shapes",
    label: "Form och färg: varning, förbud, påbud och information",
    layout: "sign-context",
    camera: [8, 8, 12],
    focus: [0, 0, -1],
  },
  "warning-sign-context": {
    id: "warning-sign-context",
    label: "Varningsmärke före verklig fara",
    layout: "sign-context",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "prohibition-sign-context": {
    id: "prohibition-sign-context",
    label: "Förbudsmärke begränsar det du får göra",
    layout: "sign-context",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "mandatory-sign-context": {
    id: "mandatory-sign-context",
    label: "Påbudsmärke visar vad du måste följa",
    layout: "roundabout",
    camera: [9, 10, 12],
    focus: [0, 0, 0],
  },
  "instruction-sign-context": {
    id: "instruction-sign-context",
    label: "Anvisningsmärke visar vägtyp eller plats",
    layout: "priority-road",
    camera: [8, 8, 13],
    focus: [0, 0, 0],
  },
  "information-sign-context": {
    id: "information-sign-context",
    label: "Information och lokalisering hjälper dig hitta rätt",
    layout: "motorway",
    camera: [8, 8, 14],
    focus: [0, 0, -1],
  },
  "alcohol-reaction": {
    id: "alcohol-reaction",
    label: "Alkohol: sen reaktion och sämre kontroll",
    layout: "residential",
    camera: [7, 8, 13],
    focus: [0, 0, 0],
  },
  "fatigue-drift": {
    id: "fatigue-drift",
    label: "Trötthet: vinglig placering i körfältet",
    layout: "straight",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
  },
  "vulnerable-road-users": {
    id: "vulnerable-road-users",
    label: "Oskyddade trafikanter: sänk fart och ge utrymme",
    layout: "residential",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "peer-pressure-risk": {
    id: "peer-pressure-risk",
    label: "Riskbeteende: kort avstånd och stress ökar risken",
    layout: "straight",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
  },
  "eco-smooth-driving": {
    id: "eco-smooth-driving",
    label: "Sparsam körning: mjukt, jämnt och planerat",
    layout: "eco",
    camera: [8, 8, 13],
    focus: [0, 0, 0],
  },
  "speed-emissions": {
    id: "speed-emissions",
    label: "Hög fart ger högre förbrukning",
    layout: "eco",
    camera: [8, 8, 13],
    focus: [0, 0, 0],
  },
  "exhaust-idling": {
    id: "exhaust-idling",
    label: "Tomgång och avgaser: undvik onödig förbrukning",
    layout: "eco",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "tyre-tread": {
    id: "tyre-tread",
    label: "Däck: mönsterdjup och väggrepp",
    layout: "vehicle-pad",
    camera: [7, 6, 10],
    focus: [0, 0, 0],
  },
  "brake-check": {
    id: "brake-check",
    label: "Bromsar: kontroll och jämn inbromsning",
    layout: "vehicle-pad",
    camera: [7, 7, 12],
    focus: [0, 0, 0],
  },
  "load-balance": {
    id: "load-balance",
    label: "Last: låg tyngdpunkt och säkring",
    layout: "vehicle-pad",
    camera: [7, 6, 10],
    focus: [0, 0, 0],
  },
  "motorway-allowed": {
    id: "motorway-allowed",
    label: "Motorväg: rätt fordon och rätt vägtyp",
    layout: "motorway",
    camera: [8, 8, 14],
    focus: [0, 0, -1],
  },
  "motorway-merge": {
    id: "motorway-merge",
    label: "Påfart: accelerera och hitta lucka",
    layout: "motorway",
    camera: [8, 8, 14],
    focus: [0, 0, -1],
  },
  "motorway-exit-lanes": {
    id: "motorway-exit-lanes",
    label: "Körfält och avfart: planera i tid",
    layout: "motorway",
    camera: [8, 8, 14],
    focus: [0, 0, -1],
  },
  "motorway-stop-ban": {
    id: "motorway-stop-ban",
    label: "Förbud på motorväg: inga stopp eller långsamma trafikanter",
    layout: "motorway",
    camera: [8, 8, 14],
    focus: [0, 0, -1],
  },
  "overtake-left": {
    id: "overtake-left",
    label: "Omkörning: passera normalt till vänster",
    layout: "overtake",
    camera: [8, 8, 14],
    focus: [0, 0, 0],
  },
  "overtake-forbidden": {
    id: "overtake-forbidden",
    label: "Omkörningsförbud: sikt, möte och heldragen linje",
    layout: "overtake",
    camera: [8, 8, 14],
    focus: [0, 0, 0],
  },
  "overtake-return": {
    id: "overtake-return",
    label: "Minnesregel: spegel, signal, säker lucka, tillbaka höger",
    layout: "overtake",
    camera: [8, 8, 14],
    focus: [0, 0, 0],
  },
  "stop-vs-park": {
    id: "stop-vs-park",
    label: "Stanna eller parkera: kort ärende är också parkering",
    layout: "parking",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "parking-distances": {
    id: "parking-distances",
    label: "Avstånd: korsning och övergångsställe kräver fri zon",
    layout: "parking",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "parking-main-road": {
    id: "parking-main-road",
    label: "Huvudled och 24-timmarsregel",
    layout: "parking",
    camera: [8, 8, 12],
    focus: [0, 0, 0],
  },
  "low-beam-default": {
    id: "low-beam-default",
    label: "Halvljus: grundläge och synlighet",
    layout: "night",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
    weather: "night",
  },
  "high-beam-dip": {
    id: "high-beam-dip",
    label: "Helljus: blända av vid möte",
    layout: "night",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
    weather: "night",
  },
  "sight-speed-night": {
    id: "sight-speed-night",
    label: "Siktsträcka: farten måste passa ljuset",
    layout: "night",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
    weather: "night",
  },
  "winter-tyres-friction": {
    id: "winter-tyres-friction",
    label: "Vinterdäck: bättre grepp på vinterväg",
    layout: "winter",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
    weather: "winter",
  },
  "winter-distance-smooth": {
    id: "winter-distance-smooth",
    label: "Halka: längre avstånd och mjuka rörelser",
    layout: "winter",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
    weather: "winter",
  },
  "hydroplaning-skid": {
    id: "hydroplaning-skid",
    label: "Vattenplaning och sladd: greppet försvinner",
    layout: "winter",
    camera: [7, 7, 13],
    focus: [0, 0, 0],
    weather: "winter",
  },
  "license-steps": {
    id: "license-steps",
    label: "Vägen till B-körkort: utbildning, risk och prov",
    layout: "process",
    camera: [7, 7, 12],
    focus: [0, 0, 0],
  },
  "exam-validity": {
    id: "exam-validity",
    label: "Prov och giltighet: teorin ska hänga ihop med körprovet",
    layout: "process",
    camera: [7, 7, 12],
    focus: [0, 0, 0],
  },
  "probation-period": {
    id: "probation-period",
    label: "Prövotid: två år med extra ansvar",
    layout: "process",
    camera: [7, 7, 12],
    focus: [0, 0, 0],
  },
  "driver-responsibility": {
    id: "driver-responsibility",
    label: "Föraransvar: fordon, passagerare och beslut",
    layout: "process",
    camera: [7, 7, 12],
    focus: [0, 0, 0],
  },
} as const satisfies Record<string, LessonSceneConfig>;

const lessonSceneIds: Record<string, (keyof typeof SCENE_LIBRARY)[]> = {
  vajningsregler: ["right-hand-rule", "yield-sign", "stop-sign", "priority-road", "roundabout-walking"],
  "hastighet-stoppstracka": ["reaction-distance", "braking-distance", "speed-limits-basic", "safe-following-distance"],
  "vagmarken-system": [
    "sign-shapes",
    "warning-sign-context",
    "prohibition-sign-context",
    "mandatory-sign-context",
    "instruction-sign-context",
    "information-sign-context",
  ],
  "manniskan-trafiken": ["alcohol-reaction", "fatigue-drift", "vulnerable-road-users", "peer-pressure-risk"],
  "miljo-ekonomi": ["eco-smooth-driving", "speed-emissions", "exhaust-idling"],
  fordonet: ["tyre-tread", "brake-check", "load-balance"],
  motorvag: ["motorway-allowed", "motorway-merge", "motorway-exit-lanes", "motorway-stop-ban"],
  omkorning: ["overtake-left", "overtake-forbidden", "overtake-return"],
  "stanna-parkera": ["stop-vs-park", "parking-distances", "parking-main-road"],
  "morker-belysning": ["low-beam-default", "high-beam-dip", "sight-speed-night"],
  "halt-vaglag": ["winter-tyres-friction", "winter-distance-smooth", "hydroplaning-skid"],
  "korkort-ansvar": ["license-steps", "exam-validity", "probation-period", "driver-responsibility"],
};

export const FALLBACK_SCENE = SCENE_LIBRARY["right-hand-rule"];

export function getLessonScene(lessonId: string, infoStepIndex: number): LessonSceneConfig {
  const ids = lessonSceneIds[lessonId];
  const id = ids?.[infoStepIndex];
  return id ? SCENE_LIBRARY[id] : FALLBACK_SCENE;
}
