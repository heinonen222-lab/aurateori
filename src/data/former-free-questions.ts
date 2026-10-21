import type { Question } from "./questions";

export const FORMER_FREE_QUESTIONS: Question[] = [
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
];
