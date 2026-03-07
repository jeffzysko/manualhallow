
-- Personal notes/annotations table
CREATE TABLE public.user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  section_id text NOT NULL,
  chapter_id text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, section_id)
);

ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notes" ON public.user_notes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.user_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.user_notes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.user_notes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all notes" ON public.user_notes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add is_active to profiles for user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Admin function to toggle user active status
CREATE OR REPLACE FUNCTION public.admin_toggle_user(target_user_id uuid, active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.profiles SET is_active = active WHERE id = target_user_id;
END;
$$;

-- Admin function to list all users with details
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update admin stats to include notes count
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
        SELECT p.id, p.full_name, p.created_at, p.is_active, u.email
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
