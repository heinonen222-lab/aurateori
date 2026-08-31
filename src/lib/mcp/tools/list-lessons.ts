import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { LESSONS } from "@/data/lessons";

export default defineTool({
  name: "get_lessons",
  title: "Genomgångar",
  description:
    "List Aurateori's interactive Swedish theory lessons, or fetch one lesson in full (steps, check questions and official Trafikverket/Transportstyrelsen sources).",
  inputSchema: {
    lessonId: z.string().trim().optional().describe("Lesson id; omit to list all lessons."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lessonId }) => {
    if (!lessonId) {
      return {
        content: [
          {
            type: "text" as const,
            text: LESSONS.map(
              (l) => `${l.id}: ${l.title} (${l.category}, ${l.minutes} min) – ${l.summary}`,
            ).join("\n"),
          },
        ],
        structuredContent: {
          lessons: LESSONS.map(({ id, title, category, minutes, summary }) => ({
            id,
            title,
            category,
            minutes,
            summary,
          })),
        },
      };
    }

    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (!lesson) {
      return {
        content: [{ type: "text" as const, text: `Ingen genomgång med id "${lessonId}".` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text" as const, text: JSON.stringify(lesson, null, 2) }],
      structuredContent: { lesson },
    };
  },
});
