import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-2.5-flash";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

type ChatMessage = z.infer<typeof schema>["messages"][number];

/** Enkel nyckelordsträff för att plocka ut relevant material ur appens egna data. */
function score(haystack: string, words: string[]): number {
  const text = haystack.toLowerCase();
  return words.reduce((sum, w) => (text.includes(w) ? sum + 1 : sum), 0);
}

async function buildContext(question: string): Promise<string> {
  const [{ QUESTIONS }, { EXAM_QUESTIONS }, { EXTRA_QUESTIONS }, { ROAD_SIGNS }, { LESSONS }] =
    await Promise.all([
      import("@/data/questions"),
      import("@/data/exam-questions"),
      import("@/data/extra-questions"),
      import("@/data/signs"),
      import("@/data/lessons"),
    ]);

  const words = question
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9åäö\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const allQuestions = [...QUESTIONS, ...EXAM_QUESTIONS, ...EXTRA_QUESTIONS];

  const questionHits = allQuestions
    .map((q) => ({ q, s: score(`${q.question} ${q.explanation} ${q.reference}`, words) }))
    .filter((h) => h.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map(
      ({ q }) =>
        `FRÅGA [${q.category}]: ${q.question}\n` +
        q.options.map((o, i) => `${i === q.correct ? "RÄTT" : "fel "} ${o}`).join("\n") +
        `\nFörklaring: ${q.explanation}\nRegel: ${q.reference}` +
        (q.source ? `\nKälla: ${q.source.label} – ${q.source.url}` : ""),
    );

  const signHits = ROAD_SIGNS.map((s) => ({
    s,
    n: score(`${s.name} ${s.meaning} ${s.trap}`, words),
  }))
    .filter((h) => h.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
    .map(({ s }) => `VÄGMÄRKE: ${s.name} (${s.category})\n${s.meaning}\nFälla: ${s.trap}`);

  const lessonHits = LESSONS.map((l) => ({
    l,
    n: score(`${l.title} ${l.summary} ${l.category}`, words),
  }))
    .filter((h) => h.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
    .map(
      ({ l }) =>
        `GENOMGÅNG: ${l.title} – ${l.summary}\nKällor: ${l.sources.map((s) => `${s.label} (${s.url})`).join(", ")}`,
    );

  const blocks = [...questionHits, ...signHits, ...lessonHits];
  return blocks.length ? blocks.join("\n\n") : "Inget direkt matchande material i appens data.";
}

const SYSTEM = `Du är Aurateoris studiecoach för svenskt B-körkort.
Svara alltid på enkel, tydlig svenska och håll svaren korta (max ca 120 ord).
Utgå i första hand från materialet under KONTEXT nedan – det kommer från appens egen frågebank, vägmärkesarkiv och genomgångar.
Ge alltid: kort svar, varför det är rätt, och en minnesregel när det passar.
Nämn gällande svenska trafikregler enligt Trafikverket och Transportstyrelsen. Hitta aldrig på regler eller siffror – säg hellre att du är osäker.
Påstå aldrig att frågor är Trafikverkets officiella provfrågor.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<string> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI-tjänsten är inte konfigurerad.");

    const last = data.messages[data.messages.length - 1] as ChatMessage;
    const context = await buildContext(last.content);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "system", content: `KONTEXT:\n${context}` },
          ...data.messages,
        ],
      }),
    });

    if (response.status === 429) throw new Error("För många frågor just nu – försök igen strax.");
    if (response.status === 402) throw new Error("AI-krediterna är slut för den här appen.");
    if (!response.ok) throw new Error(`AI-tjänsten svarade ${response.status}.`);

    const result = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = result.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("AI-tjänsten gav inget svar.");
    return text;
  });
