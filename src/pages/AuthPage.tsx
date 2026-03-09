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
      // Create user in Supabase Auth first
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(translateAuthError(error.message));
      } else {
        // Send branded confirmation email via Resend
        try {
          await supabase.functions.invoke("send-auth-email", {
            body: { type: "signup", email, redirectTo: window.location.origin },
          });
        } catch (e) {
          console.error("Error sending branded email:", e);
        }
        setMessage("Verifique seu e-mail para confirmar o cadastro.");
      }
    } else if (mode === "recovery") {
      // Send recovery email via Resend (bypasses default Supabase email)
      try {
        const { data, error: fnError } = await supabase.functions.invoke("send-auth-email", {
          body: { type: "recovery", email, redirectTo: `${window.location.origin}/reset-password` },
        });
        if (fnError) {
          setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
        } else {
          setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        }
      } catch (e) {
        setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
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
      <div className="auth-card" role="main">
        <h1 className="display auth-logo">HALLOW</h1>
        <p className="auth-subtitle">MANUAL DE VENDAS</p>

        {mode !== "recovery" ? (
          <div className="auth-tab-group" role="tablist" aria-label="Modo de autenticação">
            <button
              className={`auth-tab${mode === "login" ? " auth-tab--active" : ""}`}
              onClick={() => switchMode("login")}
              role="tab"
              aria-selected={mode === "login"}
            >ENTRAR</button>
            <button
              className={`auth-tab${mode === "signup" ? " auth-tab--active" : ""}`}
              onClick={() => switchMode("signup")}
              role="tab"
              aria-selected={mode === "signup"}
            >CADASTRAR</button>
          </div>
        ) : (
          <div className="auth-recovery-header">
            <p className="auth-recovery-title">Recuperar Senha</p>
            <p className="auth-recovery-desc">Informe seu e-mail para receber o link de redefinição.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {mode === "signup" && (
            <div className="auth-field">
              <label htmlFor="auth-fullname" className="auth-label">Nome completo</label>
              <input
                id="auth-fullname"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="auth-input"
              />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-label">E-mail</label>
            <input
              id="auth-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              className="auth-input"
            />
          </div>
          {mode !== "recovery" && (
            <div className="auth-field">
              <label htmlFor="auth-password" className="auth-label">Senha</label>
              <input
                id="auth-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="auth-input"
              />
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}

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
