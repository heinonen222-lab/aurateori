import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_practice_questions",
  title: "Övningsfrågor",
  description: "Hämta Premium-övningsfrågor (med svar och förklaring), valfritt filtrerade på kategori. Kräver Premium.",
  inputSchema: {
    category: z.string().max(80).optional().describe("Kategori, t.ex. Trafikregler."),
    limit: z.number().int().min(1).max(20).optional().describe("Antal frågor (1–20, standard 5)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    const db = supabaseForUser(ctx);
    let q = db.from("ai_questions").select("id, category, difficulty, question, options, correct, explanation, reference").limit(limit ?? 5);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) throw new ToolError("Kunde inte hämta frågor.");
    if (!data?.length) return { content: [{ type: "text", text: "Inga frågor tillgängliga (kräver Premium)." }], structuredContent: { questions: [] } };
    const questions = data.map((r) => ({
      id: r.id, category: r.category, difficulty: r.difficulty, question: r.question,
      options: Array.isArray(r.options) ? r.options.map(String) : [],
      correct: r.correct, explanation: r.explanation, reference: r.reference,
    }));
    return {
      content: [{ type: "text", text: questions.map((x, i) => `${i + 1}. ${x.question}`).join("\n") }],
      structuredContent: { questions },
    };
  },
});
