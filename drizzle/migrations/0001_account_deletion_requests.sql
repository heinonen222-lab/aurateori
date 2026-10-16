CREATE TABLE public.deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  delete_after timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);
GRANT SELECT, INSERT, DELETE ON public.deletion_requests TO authenticated;
GRANT ALL ON public.deletion_requests TO service_role;
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own deletion request" ON public.deletion_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own deletion request" ON public.deletion_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND delete_after >= now() + interval '29 days');
CREATE POLICY "Users cancel own deletion request" ON public.deletion_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
CREATE TABLE private.cron_config (key text PRIMARY KEY, value text NOT NULL);
INSERT INTO private.cron_config VALUES ('deletion_token', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''));

CREATE OR REPLACE FUNCTION public.verify_cron_token(_token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = private AS $$
  SELECT EXISTS (SELECT 1 FROM private.cron_config WHERE key = 'deletion_token' AND value = _token)
$$;
REVOKE EXECUTE ON FUNCTION public.verify_cron_token(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_cron_token(text) TO service_role;

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule('process-account-deletions', '15 3 * * *', $$
  SELECT net.http_post(
    url := 'https://aurateori.lovable.app/api/public/hooks/process-deletions',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-token',(SELECT value FROM private.cron_config WHERE key='deletion_token')),
    body := '{}'::jsonb
  );
$$);