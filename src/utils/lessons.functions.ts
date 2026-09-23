import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface LessonProgressRow {
  lesson_id: string;
  last_step: number;
  total_steps: number;
  completed: boolean;
  answered_checks: number;
  correct_checks: number;
  best_correct_checks: number;
  updated_at: string;
}

/** Hämtar den inloggade användarens sparade genomgångar. */
export const listLessonProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LessonProgressRow[]> => {
    const { data, error } = await context.supabase
      .from("lesson_progress")
      .select("lesson_id, last_step, total_steps, completed, answered_checks, correct_checks, best_correct_checks, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const saveSchema = z.object({
  lessonId: z.string().min(1).max(120),
  lastStep: z.number().int().min(0).max(500),
  totalSteps: z.number().int().min(1).max(500),
  completed: z.boolean(),
  answeredChecks: z.number().int().min(0).max(500),
  correctChecks: z.number().int().min(0).max(500),
  bestCorrectChecks: z.number().int().min(0).max(500),
});

/** Sparar var användaren är i en genomgång. Alltid kopplat till context.userId. */
export const saveLessonProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => saveSchema.parse(data))
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    const { error } = await context.supabase.from("lesson_progress").upsert(
      {
        user_id: context.userId,
        lesson_id: data.lessonId,
        last_step: data.lastStep,
        total_steps: data.totalSteps,
        completed: data.completed,
        answered_checks: data.answeredChecks,
        correct_checks: data.correctChecks,
        best_correct_checks: data.bestCorrectChecks,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
