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
  /** True for the 5 non-scored test questions ("testfrågor") in the exam. */
  trial?: boolean;
}

/** The complete free inventory, shared by insurance, practice and repetition. */
export const QUESTIONS: Question[] = [
  {
    "id": "insurance-1",
    "category": "Fordonskännedom",
    "question": "När måste din registrerade personbil vara trafikförsäkrad?",
    "options": [
      "Bara när du kör på motorväg",
      "När den är påställd, även om den inte används",
      "Bara när bilen är ny",
      "Bara när den ska besiktas"
    ],
    "correct": 1,
    "explanation": "En påställd bil ska vara trafikförsäkrad även om den står parkerad eller inte går att köra. Minnesregel: påställd bil – trafikförsäkring.",
    "reference": "Transportstyrelsen – Trafikförsäkring",
    "source": {
      "label": "Transportstyrelsen – Trafikförsäkring",
      "url": "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/aga-kopa-eller-salja-fordon/trafikforsakring/"
    }
  },
  {
    "id": "insurance-2",
    "category": "Fordonskännedom",
    "question": "Vem ansvarar för att bilen har trafikförsäkring?",
    "options": [
      "Den registrerade ägaren",
      "Den som senast tankade",
      "Verkstaden",
      "Alla passagerare"
    ],
    "correct": 0,
    "explanation": "Den registrerade ägaren ansvarar för trafikförsäkringen. Att låna ut bilen flyttar inte automatiskt försäkringsansvaret.",
    "reference": "Trafikförsäkringsföreningen – Om trafikförsäkring",
    "source": {
      "label": "Trafikförsäkringsföreningen – Om trafikförsäkring",
      "url": "https://www.tff.se/sv/krav/om-trafikforsakring/"
    }
  },
  {
    "id": "insurance-3",
    "category": "Fordonskännedom",
    "question": "Du parkerar bilen och tänker inte använda den på flera månader. När upphör det vanliga kravet på trafikförsäkring?",
    "options": [
      "Så fort du slutar köra",
      "När du tar bort batteriet",
      "När bilen blir officiellt avställd",
      "När du ställer den i ett garage"
    ],
    "correct": 2,
    "explanation": "Bilen måste vara registrerad som avställd för att det vanliga försäkringskravet ska upphöra. Parkering är inte avställning. En avställd bil får normalt inte köras; särskilda undantag har egna villkor.",
    "reference": "Transportstyrelsen – Ställa av ditt fordon",
    "source": {
      "label": "Transportstyrelsen – Ställa av ditt fordon",
      "url": "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/aga-kopa-eller-salja-fordon/stall-av-eller-pa-ditt-fordon/stalla-av-ditt-fordon/"
    }
  },
  {
    "id": "insurance-4",
    "category": "Fordonskännedom",
    "question": "Din påställda bil har körförbud. Vad gäller för trafikförsäkringen?",
    "options": [
      "Körförbud ersätter försäkringen",
      "Den behövs bara på helger",
      "Den upphör automatiskt",
      "Bilen måste fortfarande vara trafikförsäkrad"
    ],
    "correct": 3,
    "explanation": "Körförbud är inte samma sak som avställning. Så länge bilen är påställd kvarstår försäkringskravet även när den inte får köras.",
    "reference": "Trafikförsäkringsföreningen – Om trafikförsäkring",
    "source": {
      "label": "Trafikförsäkringsföreningen – Om trafikförsäkring",
      "url": "https://www.tff.se/sv/krav/om-trafikforsakring/"
    }
  },
  {
    "id": "insurance-5",
    "category": "Fordonskännedom",
    "question": "Vad kan hända om en försäkringspliktig bil saknar trafikförsäkring?",
    "options": [
      "Ingenting om bilen står still",
      "Ägaren kan få trafikförsäkringsavgift för varje oförsäkrad dag",
      "Bilen blir automatiskt helförsäkrad",
      "Avgiften betalas bara vid en olycka"
    ],
    "correct": 1,
    "explanation": "Trafikförsäkringsföreningen kan ta ut en avgift för varje dag bilen är oförsäkrad. Avgiften är en sanktion och ersätter inte en trafikförsäkring.",
    "reference": "Trafikförsäkringsföreningen – Avgift för oförsäkrade fordon",
    "source": {
      "label": "Trafikförsäkringsföreningen – Avgift för oförsäkrade fordon",
      "url": "https://www.tff.se/sv/krav/avgift-for-oforsakrade-fordon/"
    }
  },
  {
    "id": "insurance-6",
    "category": "Fordonskännedom",
    "question": "Du orsakar en kollision. Vad ersätter din trafikförsäkring normalt?",
    "options": [
      "Alla skador på din egen bil",
      "Enbart din egen bils lack",
      "Personskador och skador på andras egendom",
      "Bilens service och bränsle"
    ],
    "correct": 2,
    "explanation": "Trafikförsäkringen ersätter personskador och skador på andras egendom. Den ersätter inte skadan på din egen bil. Minnesregel: trafikförsäkring skyddar människor och andras egendom.",
    "reference": "Trafikförsäkringsföreningen – Om trafikförsäkring",
    "source": {
      "label": "Trafikförsäkringsföreningen – Om trafikförsäkring",
      "url": "https://www.tff.se/sv/krav/om-trafikforsakring/"
    }
  },
  {
    "id": "insurance-7",
    "category": "Fordonskännedom",
    "question": "Vilket skydd ingår vanligtvis i en halvförsäkring utöver trafikförsäkringen?",
    "options": [
      "Bland annat stöld-, brand- och glasskydd",
      "Alla kollisionsskador på den egna bilen utan undantag",
      "Gratis reparation av alla slitna delar",
      "Ersättning för varje parkeringsavgift"
    ],
    "correct": 0,
    "explanation": "Halvförsäkring innehåller vanligtvis skydd för bland annat stöld, brand och glas. Det exakta innehållet och undantagen står i villkoren. Vagnskadeförsäkring ingår normalt inte.",
    "reference": "Konsumenternas Försäkringsbyrå – Bilförsäkringar",
    "source": {
      "label": "Konsumenternas Försäkringsbyrå – Bilförsäkringar",
      "url": "https://www.konsumenternas.se/forsakringar/fordonsforsakringar/bilforsakringar/"
    }
  },
  {
    "id": "insurance-8",
    "category": "Fordonskännedom",
    "question": "Vad är den huvudsakliga skillnaden mellan helförsäkring och halvförsäkring?",
    "options": [
      "Helförsäkring behövs bara för lastbilar",
      "Halvförsäkring saknar alltid trafikförsäkring",
      "Helförsäkring saknar självrisk",
      "Helförsäkring innehåller även vagnskadeförsäkring"
    ],
    "correct": 3,
    "explanation": "Helförsäkring består av halvförsäkring plus vagnskadeförsäkring. Vagnskadeskyddet kan ersätta skador på din egen bil, exempelvis vid en kollision, enligt försäkringens villkor.",
    "reference": "Konsumenternas Försäkringsbyrå – Bilförsäkringar",
    "source": {
      "label": "Konsumenternas Försäkringsbyrå – Bilförsäkringar",
      "url": "https://www.konsumenternas.se/forsakringar/fordonsforsakringar/bilforsakringar/"
    }
  },
  {
    "id": "insurance-9",
    "category": "Fordonskännedom",
    "question": "Vad betyder självrisk i en bilförsäkring?",
    "options": [
      "Den totala kostnaden för bilen",
      "Den del av en ersättningsbar skada som du själv betalar",
      "En garanti om att ingen olycka inträffar",
      "En extra försäkring som alltid är gratis"
    ],
    "correct": 1,
    "explanation": "Självrisken är den del av skadekostnaden som du själv står för när den gäller. Belopp och tillämpning varierar med skyddet och villkoren. Minnesregel: självrisk – din egen del.",
    "reference": "Trafikförsäkringsföreningen – Självrisk",
    "source": {
      "label": "Trafikförsäkringsföreningen – Självrisk",
      "url": "https://www.tff.se/sv/skador/sjalvrisk/"
    }
  },
  {
    "id": "insurance-10",
    "category": "Fordonskännedom",
    "question": "Du har varit med om en trafikolycka och alla är i säkerhet. Vad bör du göra med försäkringsärendet?",
    "options": [
      "Vänta tills försäkringen upphör",
      "Låt alltid bli att dokumentera olyckan",
      "Anmäl skadan till försäkringsbolaget så snart som möjligt",
      "Beställ en ny bil utan att kontakta bolaget"
    ],
    "correct": 2,
    "explanation": "Anmäl skadan till försäkringsbolaget så snart som möjligt och spara uppgifter om händelsen. Vilket bolag eller vilken organisation som hanterar skadan beror på omständigheterna. Vid akut fara eller personskada kommer säkerhet och hjälp först.",
    "reference": "Konsumenternas Försäkringsbyrå – Fordonsförsäkringar",
    "source": {
      "label": "Konsumenternas Försäkringsbyrå – Fordonsförsäkringar",
      "url": "https://www.konsumenternas.se/forsakringar/fordonsforsakringar/"
    }
  }
];
