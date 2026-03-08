import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { translateAuthError } from "@/lib/authErrors";
import "@/styles/manual.css";

function getStrength(pw: string) {
  if (!pw) return { level: 0, label: "", color: "transparent" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { level: 1, label: "Fraca", color: "var(--red)" };
  if (s <= 2) return { level: 2, label: "Razoável", color: "var(--gold)" };
  if (s <= 3) return { level: 3, label: "Boa", color: "var(--ch3)" };
  return { level: 4, label: "Forte", color: "var(--green)" };
}

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(password), [password]);
  const match = confirmPassword.length > 0 && password === confirmPassword;
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setValidSession(true);
      setChecking(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") { setValidSession(true); setChecking(false); }
    });
    check();
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    if (password !== confirmPassword) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(translateAuthError(error.message)); }
    else { setSuccess(true); setTimeout(() => navigate("/"), 2500); }
    setLoading(false);
  };

  /* --- LOADING --- */
  if (checking) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="reset-spinner" />
          <p className="auth-recovery-desc" style={{ marginTop: 16 }}>Verificando link…</p>
        </div>
      </div>
    );
  }

  /* --- LINK INVÁLIDO --- */
  if (!validSession) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="reset-state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div className="auth-recovery-header" style={{ marginBottom: 0 }}>
            <p className="auth-recovery-title" style={{ color: "var(--red)" }}>Link expirado</p>
            <p className="auth-recovery-desc">Este link de recuperação expirou ou é inválido.<br/>Solicite um novo na tela de login.</p>
          </div>
          <button className="auth-submit" onClick={() => navigate("/auth")} style={{ marginTop: 24 }}>
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  /* --- SUCESSO --- */
  if (success) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="reset-state-icon reset-state-icon--success">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="auth-recovery-header" style={{ marginBottom: 0 }}>
            <p className="auth-recovery-title" style={{ color: "var(--green)" }}>Senha atualizada!</p>
            <p className="auth-recovery-desc">Redirecionando para o manual…</p>
          </div>
          <div className="reset-spinner" style={{ marginTop: 20 }} />
        </div>
      </div>
    );
  }

  /* --- FORMULÁRIO --- */
  return (
    <div className="manual-page auth-wrapper">
      <div className="auth-card">
        <h1 className="display auth-logo">HALLOW</h1>
        <p className="auth-subtitle" style={{ marginBottom: 32 }}>MANUAL DE VENDAS</p>

        <div className="auth-recovery-header">
          <p className="auth-recovery-title">Redefinir Senha</p>
          <p className="auth-recovery-desc">Escolha uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nova senha */}
          <div className="reset-field">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Nova senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
              autoFocus
            />
            <button type="button" className="reset-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1} aria-label="Mostrar senha">
              {showPw ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {/* Barra de força */}
          {password.length > 0 && (
            <div className="reset-strength">
              <div className="reset-strength-track">
                {[1, 2, 3, 4].map(i => (
                  <span key={i} className="reset-strength-seg" style={{ background: i <= strength.level ? strength.color : "var(--border)" }} />
                ))}
              </div>
              <span className="reset-strength-label" style={{ color: strength.color }}>{strength.label}</span>
            </div>
          )}

          {/* Confirmar */}
          <div className="reset-field">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className={`auth-input${match ? " auth-input--ok" : ""}${mismatch ? " auth-input--err" : ""}`}
            />
            <button type="button" className="reset-eye" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} aria-label="Mostrar senha">
              {showConfirm ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {match && <p className="reset-hint reset-hint--ok">✓ Senhas coincidem</p>}
          {mismatch && <p className="reset-hint reset-hint--err">✗ As senhas não coincidem</p>}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading || !password || !confirmPassword} className="auth-submit">
            {loading ? "Atualizando…" : "Atualizar senha"}
          </button>
        </form>

        <div className="auth-footer">
          <button className="auth-link" onClick={() => navigate("/auth")}>← Voltar ao login</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
