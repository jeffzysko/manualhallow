
-- Analytics events table for tracking user engagement
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  chapter_id text,
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_chapter ON public.analytics_events(chapter_id);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY "Users can insert own analytics"
  ON public.analytics_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all analytics
CREATE POLICY "Admins can read all analytics"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin function to get analytics summary
CREATE OR REPLACE FUNCTION public.get_analytics_summary(days_back integer DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
  since timestamptz := now() - (days_back || ' days')::interval;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT json_build_object(
    'total_events', (SELECT count(*) FROM analytics_events WHERE created_at >= since),
    'unique_users', (SELECT count(DISTINCT user_id) FROM analytics_events WHERE created_at >= since),
    'chapter_views', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT chapter_id, count(*) as views, count(DISTINCT user_id) as unique_users
        FROM analytics_events
        WHERE event_type = 'chapter_view' AND created_at >= since AND chapter_id IS NOT NULL
        GROUP BY chapter_id ORDER BY views DESC
      ) t
    ),
    'daily_activity', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT date_trunc('day', created_at)::date as day, count(*) as events, count(DISTINCT user_id) as users
        FROM analytics_events
        WHERE created_at >= since
        GROUP BY day ORDER BY day
      ) t
    ),
    'event_breakdown', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT event_type, count(*) as total
        FROM analytics_events
        WHERE created_at >= since
        GROUP BY event_type ORDER BY total DESC
      ) t
    ),
    'avg_reading_seconds', (
      SELECT coalesce(avg(duration_seconds), 0)::integer
      FROM analytics_events
      WHERE event_type = 'reading_time' AND created_at >= since AND duration_seconds > 0
    ),
    'ai_chat_count', (
      SELECT count(*) FROM analytics_events
      WHERE event_type = 'ai_chat' AND created_at >= since
    )
  ) INTO result;

  RETURN result;
END;
$$;
