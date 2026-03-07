import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import "@/styles/manual.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
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

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/");
    } else {
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
    }
    setLoading(false);
  };

  return (
    <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

        <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
          <button
            onClick={() => { setIsLogin(true); setError(""); setMessage(""); }}
            style={{
              flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 600, letterSpacing: 1,
              background: isLogin ? "var(--gold-dim)" : "transparent",
              color: isLogin ? "var(--gold)" : "var(--gray)",
              border: "none", cursor: "pointer",
            }}
          >ENTRAR</button>
          <button
            onClick={() => { setIsLogin(false); setError(""); setMessage(""); }}
            style={{
              flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 600, letterSpacing: 1,
              background: !isLogin ? "var(--gold-dim)" : "transparent",
              color: !isLogin ? "var(--gold)" : "var(--gray)",
              border: "none", cursor: "pointer",
            }}
          >CADASTRAR</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
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
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
