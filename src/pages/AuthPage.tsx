import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError } from "@/lib/authErrors";
import "@/styles/manual.css";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup" | "recovery">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(translateAuthError(error.message));
      else navigate("/");
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) setError(translateAuthError(error.message));
      else setMessage("Verifique seu e-mail para confirmar o cadastro.");
    } else if (mode === "recovery") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setError(error.message);
      else setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    }
    setLoading(false);
  };

  const switchMode = (newMode: "login" | "signup" | "recovery") => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  return (
    <div className="manual-page auth-wrapper">
      <div className="auth-card">
        <h1 className="display auth-logo">HALLOW</h1>
        <p className="auth-subtitle">MANUAL DE VENDAS</p>

        {mode !== "recovery" ? (
          <div className="auth-tab-group">
            <button
              className={`auth-tab${mode === "login" ? " auth-tab--active" : ""}`}
              onClick={() => switchMode("login")}
            >ENTRAR</button>
            <button
              className={`auth-tab${mode === "signup" ? " auth-tab--active" : ""}`}
              onClick={() => switchMode("signup")}
            >CADASTRAR</button>
          </div>
        ) : (
          <div className="auth-recovery-header">
            <p className="auth-recovery-title">Recuperar Senha</p>
            <p className="auth-recovery-desc">Informe seu e-mail para receber o link de redefinição.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Nome completo"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="auth-input"
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          {mode !== "recovery" && (
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
            />
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
          </button>
        </form>

        <div className="auth-footer">
          {mode === "login" && (
            <button className="auth-link" onClick={() => switchMode("recovery")}>
              Esqueci minha senha
            </button>
          )}
          {mode === "recovery" && (
            <button className="auth-link" onClick={() => switchMode("login")}>
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
