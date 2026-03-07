import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
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
      if (error) setError(error.message);
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
      if (error) setError(error.message);
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

  return (
    <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 0 }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "48px 36px",
        maxWidth: 420,
        width: "100%",
        margin: "0 20px",
      }}>
        <h1 className="display" style={{ fontSize: 32, color: "var(--gold)", marginBottom: 8, textAlign: "center" }}>
          HALLOW
        </h1>
        <p style={{ color: "var(--gray)", fontSize: 13, textAlign: "center", marginBottom: 32, letterSpacing: 2 }}>
          MANUAL DE VENDAS
        </p>

        {mode !== "recovery" ? (
          <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
            <button
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              style={{
                flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 600, letterSpacing: 1,
                background: mode === "login" ? "var(--gold-dim)" : "transparent",
                color: mode === "login" ? "var(--gold)" : "var(--gray)",
                border: "none", cursor: "pointer",
              }}
            >ENTRAR</button>
            <button
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
              style={{
                flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 600, letterSpacing: 1,
                background: mode === "signup" ? "var(--gold-dim)" : "transparent",
                color: mode === "signup" ? "var(--gold)" : "var(--gray)",
                border: "none", cursor: "pointer",
              }}
            >CADASTRAR</button>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ color: "var(--white)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Recuperar Senha</p>
            <p style={{ color: "var(--gray)", fontSize: 13 }}>Informe seu e-mail para receber o link de redefinição.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Nome completo"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={{
                background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
                padding: "14px 16px", color: "var(--white)", fontSize: 14, outline: "none",
              }}
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
              padding: "14px 16px", color: "var(--white)", fontSize: 14, outline: "none",
            }}
          />
          {mode !== "recovery" && (
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
                padding: "14px 16px", color: "var(--white)", fontSize: 14, outline: "none",
              }}
            />
          )}

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
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
          </button>
        </form>

        {/* Recovery / Back links */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          {mode === "login" && (
            <button
              onClick={() => { setMode("recovery"); setError(""); setMessage(""); }}
              style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 13, cursor: "pointer", textDecoration: "underline", opacity: 0.8 }}
            >
              Esqueci minha senha
            </button>
          )}
          {mode === "recovery" && (
            <button
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 13, cursor: "pointer", textDecoration: "underline", opacity: 0.8 }}
            >
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
