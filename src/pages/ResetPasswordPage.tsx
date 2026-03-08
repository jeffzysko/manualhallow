import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { translateAuthError } from "@/lib/authErrors";
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
      setError(translateAuthError(error.message));
    } else {
      setMessage("Senha atualizada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="manual-page auth-wrapper">
        <p className="admin-loading-text" style={{ letterSpacing: 2, textTransform: "uppercase" }}>Verificando…</p>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h1 className="display" style={{ fontSize: 28, color: "var(--red)", marginBottom: 16 }}>Link inválido</h1>
          <p className="auth-recovery-desc" style={{ marginBottom: 24 }}>
            Este link de recuperação expirou ou é inválido. Solicite um novo link.
          </p>
          <button className="auth-submit" onClick={() => navigate("/auth")}>
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manual-page auth-wrapper">
      <div className="auth-card">
        <h1 className="display auth-logo">HALLOW</h1>
        <p className="auth-subtitle">REDEFINIR SENHA</p>
        <p className="auth-recovery-desc" style={{ marginBottom: 28 }}>
          Digite sua nova senha abaixo.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="auth-input"
          />

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
