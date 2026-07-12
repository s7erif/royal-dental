
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.admin_count() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.admin_count() TO service_role;
