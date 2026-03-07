import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--gray)", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Carregando…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
