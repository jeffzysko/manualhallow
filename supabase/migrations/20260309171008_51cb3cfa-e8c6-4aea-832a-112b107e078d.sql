
CREATE TABLE public.user_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  biggest_challenge text NOT NULL DEFAULT '',
  common_objection text NOT NULL DEFAULT '',
  confidence_level text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own onboarding"
ON public.user_onboarding FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding"
ON public.user_onboarding FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
ON public.user_onboarding FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all onboarding"
ON public.user_onboarding FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
