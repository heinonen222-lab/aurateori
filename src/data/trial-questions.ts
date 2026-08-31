import type { Question } from "./questions";

/**
 * Testfrågor ("icke-räknande frågor").
 * I Trafikverkets kunskapsprov för B ingår 70 frågor, varav 5 är testfrågor
 * som inte påverkar resultatet. Dessa fem frågor blandas in i provet men
 * räknas inte i poängen (trial: true).
 * Källa: Trafikverket – Kunskapsprov för behörighet B.
 */
export const TRIAL_QUESTIONS: Question[] = [
  {
    id: "t1",
    trial: true,
    category: "Trafikregler",
    question: "Du närmar dig en korsning med märket ”Väjningsplikt”. Vad innebär det?",
    options: [
      "Du måste alltid stanna helt innan korsningen",
      "Du ska lämna företräde åt fordon på den korsande vägen",
      "Du har företräde framför fordon från höger",
      "Du får köra först om du blinkar",
    ],
    correct: 1,
    explanation:
      "Väjningsplikt betyder att du ska lämna företräde åt korsande trafik. Du behöver inte stanna om vägen är fri, men du måste anpassa farten så att du kan väja.",
    reference: "Trafikförordningen 3 kap. 5 §",
    source: {
      label: "Transportstyrelsen – Väjningsregler",
      url: "https://www.transportstyrelsen.se/sv/vagtrafik/Trafikregler/",
    },
  },
  {
    id: "t2",
    trial: true,
    category: "Människan & Trafiken",
    question: "Vad händer med din reaktionstid när du är trött?",
    options: [
      "Den blir kortare",
      "Den påverkas inte",
      "Den blir längre",
      "Den blir längre bara i mörker",
    ],
    correct: 2,
    explanation:
      "Trötthet förlänger reaktionstiden och försämrar uppmärksamheten. Effekten liknar den av alkohol – enda botemedlet är sömn.",
    reference: "Trafikverket – Trötthet i trafiken",
    source: {
      label: "Trafikverket – Trötthet",
      url: "https://www.trafikverket.se/",
    },
  },
  {
    id: "t3",
    trial: true,
    category: "Fordonskännedom",
    question: "Vilket är minsta tillåtna mönsterdjup på sommardäck för personbil?",
    options: ["1,6 mm", "3,0 mm", "0,8 mm", "5,0 mm"],
    correct: 0,
    explanation:
      "Sommardäck måste ha minst 1,6 mm mönsterdjup. Vinterdäck kräver minst 3 mm under vinterväglag 1 december–31 mars.",
    reference: "Trafikförordningen 4 kap. 18 a §",
    source: {
      label: "Transportstyrelsen – Däck",
      url: "https://www.transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/dack/",
    },
  },
  {
    id: "t4",
    trial: true,
    category: "Miljö",
    question: "Vad ger lägst bränsleförbrukning vid landsvägskörning?",
    options: [
      "Hög växel och jämn hastighet",
      "Låg växel och höga varvtal",
      "Många accelerationer och inbromsningar",
      "Att köra med kall motor korta sträckor",
    ],
    correct: 0,
    explanation:
      "Jämn hastighet på högsta möjliga växel med lågt varvtal ger lägst förbrukning och utsläpp. Kalla korta körningar ger högst förbrukning per kilometer.",
    reference: "Trafikverket – Sparsam körning",
    source: {
      label: "Trafikverket – Sparsam körning",
      url: "https://www.trafikverket.se/",
    },
  },
  {
    id: "t5",
    trial: true,
    category: "Vägmärken",
    question: "Vad betyder ett triangelformat vägmärke med röd ram?",
    options: [
      "Förbud mot viss trafik",
      "Varning för en fara längre fram",
      "Påbud om körriktning",
      "Upplysning om service",
    ],
    correct: 1,
    explanation:
      "Triangulära märken med röd ram är varningsmärken. De varnar för en fara och du ska anpassa hastigheten efter förhållandena.",
    reference: "Vägmärkesförordningen (2007:90) 2 kap.",
    source: {
      label: "Transportstyrelsen – Vägmärken",
      url: "https://www.transportstyrelsen.se/sv/vagtrafik/Vagmarken/",
    },
  },
];
