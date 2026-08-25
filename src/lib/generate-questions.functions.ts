import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CATEGORIES = [
  "Vägmärken",
  "Trafikregler",
  "Miljö",
  "Människan & Trafiken",
  "Fordonskännedom",
] as const;

const inputSchema = z.object({
  category: z.enum(CATEGORIES),
  count: z.number().int().min(1).max(8),
  difficulty: z.enum(["lätt", "medel", "svår"]).default("medel"),
  avoid: z.array(z.string()).max(40).default([]),
});

const generatedQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correct: z.number().int(),
  explanation: z.string(),
  reference: z.string(),
});

const payloadSchema = z.object({
  questions: z.array(generatedQuestionSchema),
});

export interface GeneratedQuestion {
  id: string;
  category: (typeof CATEGORIES)[number];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  reference: string;
}

export interface GenerateResult {
  questions: GeneratedQuestion[];
  sources: string[];
  /** Number of questions persisted to the shared question bank. */
  saved: number;
}

export const generateQuestions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env["PERPLEXITY_API_KEY"];
    if (!apiKey) throw new Error("PERPLEXITY_API_KEY saknas i serverkonfigurationen.");

    const avoidList = data.avoid.length
      ? `\nUndvik frågor som liknar dessa (redan använda):\n- ${data.avoid.slice(0, 40).join("\n- ")}`
      : "";

    const prompt = `Skapa ${data.count} nya flervalsfrågor på svenska för teoriprovet för svenskt B-körkort (personbil).
Kategori: ${data.category}
Svårighetsgrad: ${data.difficulty}

Krav:
- Varje fråga har exakt 4 svarsalternativ, endast ett korrekt.
- "correct" är indexet (0-3) för det korrekta alternativet.
- "explanation" är 1-3 meningar på svenska som förklarar varför svaret är rätt.
- "reference" anger exakt lagrum eller källa, t.ex. "Trafikförordningen 3 kap. 17 §" eller "Vägmärkesförordningen B2".
- Baseras på nu gällande svenska regler enligt Transportstyrelsen, Trafikverket och svensk lagstiftning.
- Ingen markdown, inga numreringar i texten.${avoidList}`;

    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "Du är en svensk trafiklärare och expert på Trafikverkets teoriprov. Du svarar alltid med giltig JSON enligt schemat och baserar allt på aktuella svenska regler.",
          },
          { role: "user", content: prompt },
        ],
        search_domain_filter: [
          "transportstyrelsen.se",
          "trafikverket.se",
          "riksdagen.se",
          "korkortonline.se",
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["questions"],
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["question", "options", "correct", "explanation", "reference"],
                    properties: {
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" } },
                      correct: { type: "integer" },
                      explanation: { type: "string" },
                      reference: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Perplexity request failed [${res.status}]: ${body}`);
      throw new Error(`Perplexity svarade med fel [${res.status}]: ${body.slice(0, 400)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      citations?: string[];
      search_results?: { url?: string }[];
    };

    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: z.infer<typeof payloadSchema>;
    try {
      const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      parsed = payloadSchema.parse(JSON.parse(cleaned));
    } catch {
      console.error("Kunde inte tolka Perplexity-svaret:", content.slice(0, 800));
      throw new Error("Kunde inte tolka svaret från Perplexity. Försök igen.");
    }

    const stamp = Date.now();
    const questions: GeneratedQuestion[] = parsed.questions
      .filter((q) => q.options.length === 4 && q.correct >= 0 && q.correct <= 3)
      .map((q, i) => ({
        id: `ai-${stamp}-${i}`,
        category: data.category,
        question: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        correct: q.correct,
        explanation: q.explanation.trim(),
        reference: q.reference.trim(),
      }));

    if (questions.length === 0) {
      throw new Error("Perplexity returnerade inga användbara frågor. Försök igen.");
    }

    const sources = (json.citations ?? json.search_results?.map((s) => s.url ?? "") ?? [])
      .filter((u): u is string => Boolean(u))
      .slice(0, 8);

    return { questions, sources };
  });
