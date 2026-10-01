DROP POLICY IF EXISTS "Signed-in users can read AI questions" ON public.ai_questions;
CREATE POLICY "Premium users can read AI questions" ON public.ai_questions FOR SELECT TO authenticated
USING (public.has_active_subscription('live') OR public.has_active_subscription('sandbox'));