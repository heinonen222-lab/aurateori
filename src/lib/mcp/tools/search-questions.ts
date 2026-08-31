import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { QUESTIONS } from "@/data/questions";
import { EXAM_QUESTIONS } from "@/data/exam-questions";
import { EXTRA_QUESTIONS } from "@/data/extra-questions";

const ALL = [...QUESTIONS, ...EXAM_QUESTIONS, ...EXTRA_QUESTIONS];

export default defineTool({
  name: "search_theory_questions",
  title: "Sök teorifrågor",
  description:
    "Search Aurateori's Swedish B-licence theory question bank by free text and/or category. Returns question, options, correct answer, explanation and official source.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free text matched against question text."),
    category: z
      .enum(["Vägmärken", "Trafikregler", "Miljö", "Människan & Trafiken", "Fordonskännedom"])
      .optional(),
    limit: z.number().int().min(1).max(25).default(5),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, limit }) => {
    const q = query?.toLowerCase();
    const matches = ALL.filter(
      (item) =>
        (!category || item.category === category) &&
        (!q ||
          item.question.toLowerCase().includes(q) ||
          item.explanation.toLowerCase().includes(q)),
    ).slice(0, limit);

    return {
      content: [
        {
          type: "text" as const,
          text: matches.length
            ? matches
                .map(
                  (item) =>
                    `[${item.category}] ${item.question}\n` +
                    item.options
                      .map((o, i) => `${i === item.correct ? "✔" : "·"} ${o}`)
                      .join("\n") +
                    `\nFörklaring: ${item.explanation}\nRegel: ${item.reference}` +
                    (item.source ? `\nKälla: ${item.source.label} – ${item.source.url}` : ""),
                )
                .join("\n\n")
            : "Inga frågor matchade sökningen.",
        },
      ],
      structuredContent: { count: matches.length, questions: matches },
    };
  },
});
