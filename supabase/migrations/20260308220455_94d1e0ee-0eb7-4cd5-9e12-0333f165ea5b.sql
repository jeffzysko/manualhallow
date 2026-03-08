
-- Fix rate_limits table: add service_role policy so edge functions can use it
CREATE POLICY "Service role full access on rate_limits"
  ON public.rate_limits FOR ALL
  USING (true)
  WITH CHECK (true);
