import type { QuestionCategory } from "@/data/questions";

/**
 * Kompakt faktapost: [kategori, fråga, rätt svar, fel 1, fel 2, fel 3, förklaring, referens]
 * Alternativens ordning randomiseras deterministiskt när frågorna byggs.
 */
export type Fact = [
  QuestionCategory,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
