
-- Reading progress table
CREATE TABLE public.reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  chapter_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress" ON public.reading_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.reading_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.reading_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- User roles table for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin can read all profiles, progress, favorites
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read all favorites" ON public.favorites FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read all progress" ON public.reading_progress FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read roles
CREATE POLICY "Admins can read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- View for admin stats
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
    'total_favorites', (SELECT count(*) FROM public.favorites),
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
        SELECT id, full_name, created_at
        FROM public.profiles
        ORDER BY created_at DESC
        LIMIT 10
      ) t
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
