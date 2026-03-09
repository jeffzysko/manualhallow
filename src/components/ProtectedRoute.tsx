import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [checkingActive, setCheckingActive] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!user) {
      setCheckingActive(false);
      return;
    }

    let cancelled = false;

    const check = async () => {
      setCheckingActive(true);
      const [profileRes, onboardingRes] = await Promise.all([
        supabase.from("profiles").select("is_active").eq("id", user.id).single(),
        supabase.from("user_onboarding").select("id").eq("user_id", user.id).maybeSingle(),
      ]);

      if (cancelled) return;

      if (profileRes.data && !profileRes.data.is_active) {
        setIsActive(false);
        await signOut();
        return;
      }

      setNeedsOnboarding(!onboardingRes.data);
      setCheckingActive(false);
    };

    check();
    return () => { cancelled = true; };
  }, [user, signOut, location.pathname]);

  if (loading || checkingActive) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090F" }}>
        <p style={{ color: "#9E9A92", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Carregando…</p>
      </div>
    );
  }

  if (!user || !isActive) return <Navigate to="/auth" replace />;

  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
