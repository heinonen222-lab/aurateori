DROP POLICY IF EXISTS "AI questions are readable by everyone" ON public.ai_questions;
REVOKE ALL ON public.ai_questions FROM anon;
GRANT SELECT ON public.ai_questions TO authenticated;
GRANT ALL ON public.ai_questions TO service_role;
CREATE POLICY "Signed-in users can read AI questions" ON public.ai_questions FOR SELECT TO authenticated USING (true);