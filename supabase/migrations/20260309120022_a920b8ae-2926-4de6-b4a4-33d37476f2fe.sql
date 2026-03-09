CREATE OR REPLACE FUNCTION public.admin_list_users()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  SELECT json_agg(row_to_json(t) ORDER BY t.created_at DESC) INTO result FROM (
    SELECT 
      p.id,
      p.full_name,
      p.company,
      p.created_at,
      p.is_active,
      u.email,
      (SELECT count(*) FROM public.favorites f WHERE f.user_id = p.id) as total_favorites,
      (SELECT count(*) FROM public.reading_progress r WHERE r.user_id = p.id AND r.completed = true) as chapters_read
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
  ) t;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
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
    )
  ) INTO result;
  
  RETURN result;
END;
$$;