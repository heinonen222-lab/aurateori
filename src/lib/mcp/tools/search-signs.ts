import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { ROAD_SIGNS } from "@/data/signs";

export default defineTool({
  name: "search_road_signs",
  title: "Sök vägmärken",
  description:
    "Search Aurateori's Swedish road sign library by free text and/or category. Returns name, meaning and the common exam trap for each match.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free text matched against name and meaning."),
    category: z
      .enum(["Varningsmärken", "Förbudsmärken", "Påbudsmärken", "Anvisningsmärken", "Information"])
      .optional()
      .describe("Restrict to one sign category."),
    limit: z.number().int().min(1).max(40).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, limit }) => {
    const q = query?.toLowerCase();
    const matches = ROAD_SIGNS.filter(
      (s) =>
        (!category || s.category === category) &&
        (!q || s.name.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q)),
    ).slice(0, limit);

    return {
      content: [
        {
          type: "text" as const,
          text: matches.length
            ? matches
                .map((s) => `${s.name} (${s.category})\nBetydelse: ${s.meaning}\nFälla: ${s.trap}`)
                .join("\n\n")
            : "Inga vägmärken matchade sökningen.",
        },
      ],
      structuredContent: { count: matches.length, signs: matches },
    };
  },
});
