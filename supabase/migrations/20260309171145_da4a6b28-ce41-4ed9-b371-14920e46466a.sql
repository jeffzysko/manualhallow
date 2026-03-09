
CREATE OR REPLACE FUNCTION public.get_admin_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'active_users', (SELECT count(*) FROM public.profiles WHERE is_active = true),
    'total_favorites', (SELECT count(*) FROM public.favorites),
    'total_notes', (SELECT count(*) FROM public.user_notes),
    'chapters_completed', (SELECT count(*) FROM public.reading_progress WHERE completed = true),
    'popular_chapters', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT item_chapter as chapter, count(*) as total
        FROM public.favorites
        WHERE item_chapter != ''
        GROUP BY item_chapter
        ORDER BY total DESC
        LIMIT 5
      ) t
    ),
    'recent_users', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT p.id, p.full_name, p.company, p.created_at, p.is_active, u.email
        FROM public.profiles p
        JOIN auth.users u ON u.id = p.id
        ORDER BY p.created_at DESC
        LIMIT 10
      ) t
    ),
    'onboarding_challenges', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT biggest_challenge as challenge, count(*) as total
        FROM public.user_onboarding
        WHERE biggest_challenge != ''
        GROUP BY biggest_challenge
        ORDER BY total DESC
      ) t
    ),
    'onboarding_objections', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT common_objection as objection, count(*) as total
        FROM public.user_onboarding
        WHERE common_objection != ''
        GROUP BY common_objection
        ORDER BY total DESC
      ) t
    ),
    'onboarding_levels', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT confidence_level as level, count(*) as total
        FROM public.user_onboarding
        WHERE confidence_level != ''
        GROUP BY confidence_level
        ORDER BY total DESC
      ) t
    )
  ) INTO result;
  
  RETURN result;
END;
$function$;
