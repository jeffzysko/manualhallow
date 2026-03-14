
-- Table to store positively rated AI interactions for adaptive learning
CREATE TABLE public.chat_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  rating smallint NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_insights ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can insert own insights"
ON public.chat_insights FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can read own insights
CREATE POLICY "Users can read own insights"
ON public.chat_insights FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Users can update own insights (for changing rating)
CREATE POLICY "Users can update own insights"
ON public.chat_insights FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Admins can read all insights
CREATE POLICY "Admins can read all insights"
ON public.chat_insights FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Index for fetching top-rated insights efficiently
CREATE INDEX idx_chat_insights_rating ON public.chat_insights (rating DESC, created_at DESC);
CREATE INDEX idx_chat_insights_user ON public.chat_insights (user_id);
