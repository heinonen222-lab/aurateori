import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { checkPremiumAccess } from "./billing.functions";
import type { Question, QuestionCategory } from "@/data/questions";

export const getPremiumQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Question[]> => {
    if (!(await checkPremiumAccess()).allowed) return [];
    // Paid content is imported only inside the authorized server boundary.
    const [{ PREMIUM_QUESTIONS }, { EXAM_QUESTIONS }, { EXTRA_QUESTIONS }, { TRIAL_QUESTIONS }] = await Promise.all([
      import("@/data/premium-questions"), import("@/data/exam-questions"),
      import("@/data/extra-questions"), import("@/data/trial-questions"),
    ]);
    const { data, error } = await context.supabase.from("ai_questions")
      .select("id,category,question,options,correct,explanation,reference,image").order("created_at");
    if (error) throw new Error(error.message);
    const bank: Question[] = (data ?? []).flatMap((row) => {
      if (!Array.isArray(row.options) || row.options.length !== 4) return [];
      return [{ id: `ai-${row.id}`, category: row.category as QuestionCategory, question: row.question,
        options: row.options.map(String), correct: row.correct, explanation: row.explanation,
        reference: row.reference, ...(row.image ? { image: row.image } : {}) }];
    });
    return [...PREMIUM_QUESTIONS, ...EXAM_QUESTIONS, ...EXTRA_QUESTIONS, ...TRIAL_QUESTIONS, ...bank];
  });