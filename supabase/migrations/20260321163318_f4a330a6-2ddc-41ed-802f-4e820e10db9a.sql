
DROP POLICY "Users can update own onboarding" ON public.user_onboarding;
CREATE POLICY "Users can update own onboarding"
  ON public.user_onboarding
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
