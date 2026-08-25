DELETE FROM public.ai_questions a
USING public.ai_questions b
WHERE a.question = b.question AND a.created_at > b.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS ai_questions_question_key
  ON public.ai_questions (question);