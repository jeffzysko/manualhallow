import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, signOut } = useAuth();
  const [checkingActive, setCheckingActive] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!user) {
      setCheckingActive(false);
      return;
    }

    const checkActive = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("is_active")
        .eq("id", user.id)
        .single();

      if (data && !data.is_active) {
        setIsActive(false);
        await signOut();
      }
      setCheckingActive(false);
    };

    checkActive();
  }, [user, signOut]);

  if (loading || checkingActive) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090F" }}>
        <p style={{ color: "#9E9A92", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Carregando…</p>
      </div>
    );
  }

  if (!user || !isActive) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
