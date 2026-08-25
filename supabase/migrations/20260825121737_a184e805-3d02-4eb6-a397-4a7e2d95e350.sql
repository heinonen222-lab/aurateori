REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_active_premium(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_premium(UUID) TO authenticated;