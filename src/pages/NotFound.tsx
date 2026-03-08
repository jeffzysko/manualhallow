import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "@/styles/manual.css";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="manual-page auth-wrapper">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="reset-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h1 className="display" style={{ fontSize: 48, color: "var(--gold)", marginBottom: 8 }}>404</h1>
        <p className="auth-recovery-title">Página não encontrada</p>
        <p className="auth-recovery-desc" style={{ marginBottom: 24 }}>
          A página que você procura não existe ou foi movida.
        </p>
        <button className="auth-submit" onClick={() => navigate("/")}>
          Voltar ao Manual
        </button>
      </div>
    </div>
  );
};

export default NotFound;
