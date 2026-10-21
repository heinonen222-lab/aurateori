CREATE TABLE public.google_play_subscriptions (
 purchase_token_hash text PRIMARY KEY,
 purchase_token text NOT NULL,
 user_id uuid NOT NULL,
 product_id text NOT NULL,
 plan_id text NOT NULL,
 status text NOT NULL,
 current_period_start timestamptz,
 current_period_end timestamptz NOT NULL,
 cancel_at_period_end boolean NOT NULL DEFAULT false,
 verified_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.google_play_subscriptions TO service_role;
GRANT SELECT (purchase_token_hash,user_id,product_id,plan_id,status,current_period_start,current_period_end,cancel_at_period_end,verified_at,created_at) ON public.google_play_subscriptions TO authenticated;
ALTER TABLE public.google_play_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own Play entitlement" ON public.google_play_subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX google_play_subscriptions_user_idx ON public.google_play_subscriptions(user_id);
CREATE FUNCTION public.save_google_play_purchase(p_token_hash text,p_token text,p_user_id uuid,p_product_id text,p_plan_id text,p_status text,p_start timestamptz,p_end timestamptz,p_cancel boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.google_play_subscriptions (purchase_token_hash,purchase_token,user_id,product_id,plan_id,status,current_period_start,current_period_end,cancel_at_period_end)
 VALUES (p_token_hash,p_token,p_user_id,p_product_id,p_plan_id,p_status,p_start,p_end,p_cancel)
 ON CONFLICT (purchase_token_hash) DO UPDATE SET status=EXCLUDED.status,current_period_start=EXCLUDED.current_period_start,current_period_end=EXCLUDED.current_period_end,cancel_at_period_end=EXCLUDED.cancel_at_period_end,verified_at=now()
 WHERE google_play_subscriptions.user_id = EXCLUDED.user_id;
 IF NOT FOUND THEN RAISE EXCEPTION 'Purchase belongs to another account'; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.save_google_play_purchase(text,text,uuid,text,text,text,timestamptz,timestamptz,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_google_play_purchase(text,text,uuid,text,text,text,timestamptz,timestamptz,boolean) TO service_role;
CREATE OR REPLACE FUNCTION public.has_active_subscription(check_env text DEFAULT 'live'::text) RETURNS boolean LANGUAGE sql STABLE SET search_path = public AS $$
 SELECT EXISTS (SELECT 1 FROM public.subscriptions WHERE user_id=auth.uid() AND environment=check_env AND ((status IN ('active','trialing','past_due') AND (current_period_end IS NULL OR current_period_end>now())) OR (status='canceled' AND current_period_end>now())))
 OR EXISTS (SELECT 1 FROM public.google_play_subscriptions WHERE user_id=auth.uid() AND status IN ('active','past_due','canceled') AND current_period_end>now() AND verified_at>now()-interval '10 minutes');
$$;