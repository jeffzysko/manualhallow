import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import "@/styles/manual.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user arrived via recovery link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidSession(true);
      }
      setChecking(false);
    };

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
        setChecking(false);
      }
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage("Senha atualizada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 0 }}>
        <p style={{ color: "var(--gray)", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Verificando…</p>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 0 }}>
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20,
          padding: "48px 36px", maxWidth: 420, width: "100%", margin: "0 20px", textAlign: "center",
        }}>
          <h1 className="display" style={{ fontSize: 28, color: "var(--red)", marginBottom: 16 }}>Link inválido</h1>
          <p style={{ color: "var(--gray)", fontSize: 14, marginBottom: 24 }}>
            Este link de recuperação expirou ou é inválido. Solicite um novo link.
          </p>
          <button
            onClick={() => navigate("/auth")}
            style={{
              background: "var(--gold)", color: "#09090F", border: "none", borderRadius: 10,
              padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 0 }}>
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20,
        padding: "48px 36px", maxWidth: 420, width: "100%", margin: "0 20px",
      }}>
        <h1 className="display" style={{ fontSize: 32, color: "var(--gold)", marginBottom: 8, textAlign: "center" }}>
          HALLOW
        </h1>
        <p style={{ color: "var(--gray)", fontSize: 13, textAlign: "center", marginBottom: 12, letterSpacing: 2 }}>
          REDEFINIR SENHA
        </p>
        <p style={{ color: "var(--gray)", fontSize: 13, textAlign: "center", marginBottom: 28 }}>
          Digite sua nova senha abaixo.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
              padding: "14px 16px", color: "var(--white)", fontSize: 14, outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
              padding: "14px 16px", color: "var(--white)", fontSize: 14, outline: "none",
            }}
          />

          {error && <p style={{ color: "var(--red)", fontSize: 13 }}>{error}</p>}
          {message && <p style={{ color: "var(--green)", fontSize: 13 }}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--gold)", color: "#09090F", border: "none", borderRadius: 10,
              padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              opacity: loading ? 0.6 : 1, marginTop: 4,
            }}
          >
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
