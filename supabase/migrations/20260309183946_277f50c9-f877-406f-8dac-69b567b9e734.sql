
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Delete all user data from public tables
  DELETE FROM public.analytics_events WHERE user_id = target_user_id;
  DELETE FROM public.audit_logs WHERE user_id = target_user_id;
  DELETE FROM public.chat_messages WHERE user_id = target_user_id;
  DELETE FROM public.favorites WHERE user_id = target_user_id;
  DELETE FROM public.reading_progress WHERE user_id = target_user_id;
  DELETE FROM public.user_notes WHERE user_id = target_user_id;
  DELETE FROM public.user_onboarding WHERE user_id = target_user_id;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  DELETE FROM public.rate_limits WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- Delete the auth user (cascades automatically but explicit for clarity)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
