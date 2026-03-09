
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can insert own onboarding" ON public.user_onboarding;
DROP POLICY IF EXISTS "Users can read own onboarding" ON public.user_onboarding;
DROP POLICY IF EXISTS "Users can update own onboarding" ON public.user_onboarding;
DROP POLICY IF EXISTS "Admins can read all onboarding" ON public.user_onboarding;

CREATE POLICY "Users can insert own onboarding"
ON public.user_onboarding FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own onboarding"
ON public.user_onboarding FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
ON public.user_onboarding FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all onboarding"
ON public.user_onboarding FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
