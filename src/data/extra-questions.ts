import type { Question, QuestionCategory } from "@/data/questions";
import type { Fact } from "@/data/fact-types";
import { FACTS_A } from "@/data/fact-questions-a";
import { FACTS_B } from "@/data/fact-questions-b";
import { FACTS_C } from "@/data/fact-questions-c";
import { ROAD_SIGNS } from "@/data/signs";
import { seededShuffle } from "@/lib/shuffle";

/**
 * Utökad frågebank. Frågorna byggs deterministiskt (samma resultat på server och klient)
 * från tre källor:
 *  1. Vägmärkesbanken – betydelse, vanlig fälla och märkeskategori för varje skylt.
 *  2. Räkneuppgifter – reaktionssträcka, bromssträcka, stoppsträcka, avstånd och förbrukning.
 *  3. Faktabanken (FACTS_A / FACTS_B) med regler, miljö, människan och fordonskännedom.
 */

function build(
  id: string,
  category: QuestionCategory,
  question: string,
  correctText: string,
  distractors: string[],
  explanation: string,
  reference: string,
  seed: number,
  image?: string,
): Question {
  const options = seededShuffle([correctText, ...distractors.slice(0, 3)], seed);
  return {
    id,
    category,
    question,
    ...(image ? { image } : {}),
    options,
    correct: options.indexOf(correctText),
    explanation,
    reference,
  };
}

/* ------------------------------------------------------------------ */
/* 1. Vägmärkesfrågor                                                  */
/* ------------------------------------------------------------------ */

const SIGN_CATEGORIES = [
  "Varningsmärken",
  "Väjningspliktsmärken",
  "Förbudsmärken",
  "Påbudsmärken",
  "Anvisningsmärken",
  "Information",
  "Lokaliseringsmärken för vägvisning",
  "Lokaliseringsmärken för upplysning om allmänna inrättningar med mera",
];

function signQuestions(): Question[] {
  const out: Question[] = [];
  ROAD_SIGNS.forEach((sign, i) => {
    const others = ROAD_SIGNS.filter((s) => s.id !== sign.id);
    const pool = seededShuffle(others, i + 101);

    out.push(
      build(
        `xs-${sign.id}-meaning`,
        "Vägmärken",
        "Vad innebär vägmärket?",
        sign.meaning,
        pool.slice(0, 3).map((s) => s.meaning),
        `${sign.name}: ${sign.meaning} ${sign.trap}`,
        "Vägmärkesförordning (2007:90)",
        i + 11,
        sign.id,
      ),
    );

    out.push(
      build(
        `xs-${sign.id}-name`,
        "Vägmärken",
        `Vilket märke visas här?`,
        sign.name,
        pool.slice(3, 6).map((s) => s.name),
        `Märket är "${sign.name}". ${sign.meaning}`,
        "Vägmärkesförordning (2007:90)",
        i + 2011,
        sign.id,
      ),
    );

    out.push(
      build(
        `xs-${sign.id}-cat`,
        "Vägmärken",
        `Till vilken grupp av vägmärken hör "${sign.name}"?`,
        sign.category,
        SIGN_CATEGORIES.filter((c) => c !== sign.category),
        `${sign.name} är ett märke i gruppen ${sign.category.toLowerCase()}. ${sign.trap}`,
        "Vägmärkesförordning (2007:90) 2 kap.",
        i + 4011,
        sign.id,
      ),
    );

    out.push(
      build(
        `xs-${sign.id}-trap`,
        "Vägmärken",
        `Vad ska du särskilt tänka på vid "${sign.name}"?`,
        sign.trap,
        pool.slice(6, 9).map((s) => s.trap),
        `${sign.name}: ${sign.trap}`,
        "Vägmärkesförordning (2007:90)",
        i + 6011,
        sign.id,
      ),
    );
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* 2. Räkneuppgifter                                                   */
/* ------------------------------------------------------------------ */

const SPEEDS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

function m(n: number) {
  return `${Math.round(n)} meter`;
}

function numberQuestions(): Question[] {
  const out: Question[] = [];

  // Reaktionssträcka vid 1 sekunds reaktionstid
  SPEEDS.forEach((v, i) => {
    const r = v / 3.6;
    out.push(
      build(
        `xn-react-${v}`,
        "Människan & Trafiken",
        `Hur lång blir reaktionssträckan i ${v} km/h vid 1 sekunds reaktionstid?`,
        m(r),
        [m(r * 0.5), m(r * 1.5), m(r * 2)],
        `Reaktionssträcka = hastighet i m/s × reaktionstid. ${v} km/h ≈ ${(v / 3.6).toFixed(1)} m/s, alltså ca ${Math.round(r)} meter på en sekund.`,
        "Trafikverket – stoppsträcka",
        i + 301,
      ),
    );
  });

  // Bromssträcka på torr asfalt (friktion 0,8)
  SPEEDS.forEach((v, i) => {
    const b = (v / 3.6) ** 2 / (2 * 0.8 * 9.82);
    out.push(
      build(
        `xn-brake-${v}`,
        "Fordonskännedom",
        `Ungefär hur lång är bromssträckan i ${v} km/h på plan väg med friktionstal 0,8 och konstant retardation?`,
        m(b),
        [m(b * 0.5), m(b * 1.6), m(b * 2.4)],
        `Modellberäkning: bromssträcka ≈ v²/(2·μ·g). Med ${v} km/h, μ = 0,8 och g = 9,82 m/s² blir det cirka ${Math.round(b)} meter. Verklig bromssträcka beror även på bil, däck och väglag.`,
        "Modellberäkning: s = v²/(2μg), g = 9,82 m/s²",
        i + 401,
      ),
    );
  });

  // Stoppsträcka (1 s reaktion + broms)
  SPEEDS.forEach((v, i) => {
    const s = v / 3.6 + (v / 3.6) ** 2 / (2 * 0.8 * 9.82);
    out.push(
      build(
        `xn-stop-${v}`,
        "Människan & Trafiken",
        `Ungefär hur lång blir stoppsträckan i ${v} km/h med 1 sekunds reaktionstid och friktionstalet 0,8 på plan väg?`,
        m(s),
        [m(s * 0.6), m(s * 1.5), m(s * 2.2)],
        `Modellberäkning på plan väg med konstant retardation: stoppsträcka = reaktionssträcka + bromssträcka. ${(v / 3.6).toFixed(1)} + ${((v / 3.6) ** 2 / (2 * 0.8 * 9.82)).toFixed(1)} ≈ ${Math.round(s)} meter. Verkliga förhållanden kan ge längre sträcka.`,
        "Modellberäkning: s = vt + v²/(2μg), t = 1 s, μ = 0,8",
        i + 501,
      ),
    );
  });

  // Dubblerad/halverad hastighet
  [
    [30, 60],
    [40, 80],
    [50, 100],
    [60, 120],
  ].forEach(([low, high], i) => {
    out.push(
      build(
        `xn-double-${low}`,
        "Människan & Trafiken",
        `Hur förändras bromssträckan från ${low} till ${high} km/h om väggrepp och bromsförmåga är oförändrade?`,
        "Den blir ungefär fyra gånger så lång",
        [
          "Den blir dubbelt så lång",
          "Den blir tre gånger så lång",
          "Den är i stort sett oförändrad",
        ],
        "Bromssträckan växer med kvadraten på hastigheten – dubbel fart ger fyrdubbel bromssträcka.",
        "Trafikverket – hastighet och krockvåld",
        i + 601,
      ),
    );
    out.push(
      build(
        `xn-half-${high}`,
        "Människan & Trafiken",
        `Du sänker farten från ${high} km/h till ${low} km/h. Hur påverkas rörelseenergin?`,
        "Den minskar till ungefär en fjärdedel",
        ["Den halveras", "Den minskar med en tiondel", "Den är i princip densamma"],
        "Rörelseenergin är proportionell mot hastigheten i kvadrat – halverad fart ger en fjärdedel av energin.",
        "Trafikverket – hastighet och krockvåld",
        i + 701,
      ),
    );
  });

  // Tresekundersregeln
  SPEEDS.forEach((v, i) => {
    const d = (v / 3.6) * 3;
    out.push(
      build(
        `xn-3s-${v}`,
        "Trafikregler",
        `Hur långt avstånd motsvarar tresekundersregeln i ${v} km/h?`,
        m(d),
        [m(d / 3), m(d / 2), m(d * 1.7)],
        `Tre sekunder i ${v} km/h motsvarar cirka ${Math.round(d)} meter. Vid halka bör avståndet vara ännu större.`,
        "Trafikverket – avstånd",
        i + 801,
      ),
    );
  });

  // km/h → m/s
  SPEEDS.forEach((v, i) => {
    const ms = v / 3.6;
    out.push(
      build(
        `xn-ms-${v}`,
        "Människan & Trafiken",
        `Hur många meter per sekund färdas du i ${v} km/h?`,
        `Cirka ${ms.toFixed(1)} m/s`,
        [
          `Cirka ${(ms / 2).toFixed(1)} m/s`,
          `Cirka ${(ms * 1.5).toFixed(1)} m/s`,
          `Cirka ${(ms * 2).toFixed(1)} m/s`,
        ],
        `Dela hastigheten i km/h med 3,6: ${v} / 3,6 ≈ ${ms.toFixed(1)} m/s.`,
        "Trafikverket – hastighet",
        i + 901,
      ),
    );
  });

  // Restid
  [50, 70, 80, 90, 100, 110].forEach((v, i) => {
    const min = (60 / v) * 10;
    out.push(
      build(
        `xn-time-${v}`,
        "Trafikregler",
        `Hur lång tid tar det ungefär att köra 10 km i jämn hastighet ${v} km/h?`,
        `Cirka ${min.toFixed(0)} minuter`,
        [
          `Cirka ${(min * 0.6).toFixed(0)} minuter`,
          `Cirka ${(min * 1.5).toFixed(0)} minuter`,
          `Cirka ${(min * 2).toFixed(0)} minuter`,
        ],
        `Tid = sträcka / hastighet. 10 km i ${v} km/h ≈ ${min.toFixed(0)} minuter – tidsvinsten av högre fart är liten jämfört med riskökningen.`,
        "Trafikverket – hastighet",
        i + 1001,
      ),
    );
  });

  // Förbrukning
  [0.5, 0.6, 0.7, 0.8, 0.9, 1].forEach((l, i) => {
    const per100 = l * 10;
    out.push(
      build(
        `xn-fuel-${i}`,
        "Miljö",
        `En bil drar ${l.toString().replace(".", ",")} liter per mil. Hur mycket går det åt på 100 km?`,
        `${per100.toString().replace(".", ",")} liter`,
        [
          `${(per100 / 2).toString().replace(".", ",")} liter`,
          `${(per100 * 1.5).toString().replace(".", ",")} liter`,
          `${(per100 * 2).toString().replace(".", ",")} liter`,
        ],
        `100 km = 10 mil, alltså ${l.toString().replace(".", ",")} × 10 = ${per100.toString().replace(".", ",")} liter. Beräkningen förutsätter oförändrad förbrukning.`,
        "Enhetsomvandling: 1 mil = 10 km",
        i + 1101,
      ),
    );
  });

  return out;
}

/* ------------------------------------------------------------------ */
/* 3. Faktabanken                                                      */
/* ------------------------------------------------------------------ */

function factQuestions(): Question[] {
  const facts: Fact[] = [...FACTS_A, ...FACTS_B, ...FACTS_C];
  return facts.map(([category, question, correct, d1, d2, d3, explanation, reference], i) =>
    build(
      `xf-${i + 1}`,
      category,
      question,
      correct,
      [d1, d2, d3],
      explanation,
      reference,
      i + 5001,
    ),
  );
}

/** Alla extrafrågor (vägmärken, räkneuppgifter och faktabank). */
export const EXTRA_QUESTIONS: Question[] = [
  ...signQuestions(),
  ...numberQuestions(),
  ...factQuestions(),
];
