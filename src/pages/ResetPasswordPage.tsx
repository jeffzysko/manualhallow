import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { translateAuthError } from "@/lib/authErrors";
import "@/styles/manual.css";

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Fraca", color: "var(--red)" };
  if (score <= 2) return { level: 2, label: "Razoável", color: "var(--gold)" };
  if (score <= 3) return { level: 3, label: "Boa", color: "var(--ch3)" };
  return { level: 4, label: "Forte", color: "var(--green)" };
}

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setValidSession(true);
      setChecking(false);
    };

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
      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="reset-spinner" />
          <p className="auth-recovery-desc">Verificando link de recuperação…</p>
        </div>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="reset-icon-wrap reset-icon-wrap--error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="reset-heading" style={{ color: "var(--red)" }}>Link expirado</h2>
          <p className="auth-recovery-desc">
            Este link de recuperação expirou ou é inválido.<br />Solicite um novo link na tela de login.
          </p>
          <button className="auth-submit" onClick={() => navigate("/auth")} style={{ marginTop: 20 }}>
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="manual-page auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="reset-icon-wrap reset-icon-wrap--success">
            <CheckCircle />
          </div>
          <h2 className="reset-heading" style={{ color: "var(--green)" }}>Senha atualizada!</h2>
          <p className="auth-recovery-desc">Redirecionando para o manual…</p>
          <div className="reset-spinner" style={{ marginTop: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="manual-page auth-wrapper">
      <div className="auth-card">
        <div className="reset-icon-wrap">
          <LockIcon />
        </div>
        <h1 className="display auth-logo">HALLOW</h1>
        <p className="auth-subtitle">REDEFINIR SENHA</p>
        <p className="auth-recovery-desc" style={{ marginBottom: 24 }}>
          Escolha uma senha forte para proteger sua conta.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="reset-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
              autoFocus
            />
            <button
              type="button"
              className="reset-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="reset-strength">
              <div className="reset-strength-bar">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="reset-strength-segment"
                    style={{
                      background: i <= strength.level ? strength.color : "var(--border)",
                    }}
                  />
                ))}
              </div>
              <span className="reset-strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          <div className="reset-input-wrap">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className={`auth-input${passwordsMatch ? " auth-input--valid" : ""}${passwordsMismatch ? " auth-input--error" : ""}`}
            />
            <button
              type="button"
              className="reset-eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {passwordsMatch && (
            <p className="reset-match-msg reset-match-msg--ok">✓ Senhas coincidem</p>
          )}
          {passwordsMismatch && (
            <p className="reset-match-msg reset-match-msg--err">✗ Senhas não coincidem</p>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="auth-submit"
          >
            {loading ? "Atualizando…" : "Atualizar senha"}
          </button>
        </form>

        <div className="auth-footer">
          <button className="auth-link" onClick={() => navigate("/auth")}>
            ← Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
