import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { translateAuthError } from "@/lib/authErrors";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/manual.css";

/* ── Password requirements checker ── */
const pwRules = [
  { key: "len", label: "Mínimo 8 caracteres", test: (pw: string) => pw.length >= 8 },
  { key: "lower", label: "Letra minúscula", test: (pw: string) => /[a-z]/.test(pw) },
  { key: "upper", label: "Letra maiúscula", test: (pw: string) => /[A-Z]/.test(pw) },
  { key: "num", label: "Número", test: (pw: string) => /[0-9]/.test(pw) },
  { key: "special", label: "Caractere especial", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
] as const;

const PasswordRequirements = ({ password }: { password: string }) => {
  if (!password) return null;
  return (
    <motion.div
      className="auth-pw-reqs"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      {pwRules.map((r) => {
        const ok = r.test(password);
        return (
          <div key={r.key} className={`auth-pw-req ${ok ? "auth-pw-req--ok" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {ok ? <polyline points="20 6 9 17 4 12" /> : <line x1="18" y1="6" x2="6" y2="18" />}
            </svg>
            <span>{r.label}</span>
          </div>
        );
      })}
    </motion.div>
  );
};

/* ── Floating particles (same as AuthPage) ── */
const PARTICLE_COUNT = 35;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * -20,
  opacity: Math.random() * 0.4 + 0.1,
}));

const GoldParticles = () => (
  <div className="auth-particles" aria-hidden="true">
    {particles.map((p) => (
      <motion.div
        key={p.id}
        className="auth-particle"
        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
        animate={{ y: [0, -80, -160], x: [0, Math.sin(p.id) * 30, 0], opacity: [0, p.opacity, 0] }}
        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
      />
    ))}
  </div>
);

const LogoRings = () => (
  <div className="auth-rings" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="auth-ring"
        style={{ width: 120 + i * 60, height: 120 + i * 60 }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 30 + i * 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    ))}
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

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

  const match = confirmPassword.length > 0 && password === confirmPassword;
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const allValid = pwRules.every((r) => r.test(password));

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
    if (!allValid) { setError("A senha não atende todos os requisitos."); return; }
    if (password !== confirmPassword) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(translateAuthError(error.message)); }
    else { setSuccess(true); setTimeout(() => navigate("/"), 2500); }
    setLoading(false);
  };

  /* --- State screens (loading, invalid, success) --- */
  const renderStateScreen = (content: React.ReactNode) => (
    <div className="manual-page auth-wrapper-v2">
      <div className="auth-bg-gradient" aria-hidden="true" />
      <div className="auth-bg-noise" aria-hidden="true" />
      <GoldParticles />
      <motion.div className="auth-card-v2" variants={cardVariants} initial="hidden" animate="visible">
        <div className="auth-logo-area">
          <LogoRings />
          <motion.div className="auth-monogram" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>H</motion.div>
        </div>
        <motion.h1 className="auth-title-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>HALLOW</motion.h1>
        <motion.p className="auth-subtitle-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>MANUAL DE VENDAS</motion.p>
        <motion.div className="auth-divider" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        {content}
      </motion.div>
      <motion.p className="auth-branding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        © {new Date().getFullYear()} Hallow Comunicação
      </motion.p>
    </div>
  );

  if (checking) {
    return renderStateScreen(
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div className="auth-spinner" />
        <p className="auth-recovery-desc-v2" style={{ marginTop: 12 }}>Verificando link…</p>
      </div>
    );
  }

  if (!validSession) {
    return renderStateScreen(
      <div style={{ textAlign: "center" }}>
        <div className="auth-recovery-header-v2">
          <motion.div className="auth-recovery-icon" style={{ borderColor: "rgba(224,92,92,0.2)", background: "var(--red-dim)" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </motion.div>
          <p className="auth-recovery-title-v2" style={{ color: "var(--red)" }}>Link expirado</p>
          <p className="auth-recovery-desc-v2">Este link de recuperação expirou ou é inválido. Solicite um novo na tela de login.</p>
        </div>
        <motion.button className="auth-submit-v2" onClick={() => navigate("/auth")}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          Voltar ao login
        </motion.button>
      </div>
    );
  }

  if (success) {
    return renderStateScreen(
      <div style={{ textAlign: "center" }}>
        <div className="auth-recovery-header-v2">
          <motion.div className="auth-recovery-icon" style={{ borderColor: "rgba(92,184,138,0.2)", background: "var(--green-dim)" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </motion.div>
          <p className="auth-recovery-title-v2" style={{ color: "var(--green)" }}>Senha atualizada!</p>
          <p className="auth-recovery-desc-v2">Redirecionando para o manual…</p>
        </div>
        <div className="auth-spinner" style={{ margin: "12px auto 0" }} />
      </div>
    );
  }

  /* --- FORMULÁRIO --- */
  return (
    <div className="manual-page auth-wrapper-v2">
      <div className="auth-bg-gradient" aria-hidden="true" />
      <div className="auth-bg-noise" aria-hidden="true" />
      <GoldParticles />

      <motion.div className="auth-card-v2" role="main" variants={cardVariants} initial="hidden" animate="visible">
        <div className="auth-logo-area">
          <LogoRings />
          <motion.div className="auth-monogram" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>H</motion.div>
        </div>

        <motion.h1 className="auth-title-v2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>HALLOW</motion.h1>
        <motion.p className="auth-subtitle-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>MANUAL DE VENDAS</motion.p>
        <motion.div className="auth-divider" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />

        <div className="auth-recovery-header-v2">
          <motion.div className="auth-recovery-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </motion.div>
          <p className="auth-recovery-title-v2">Redefinir Senha</p>
          <p className="auth-recovery-desc-v2">Escolha uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-v2" noValidate>
          {/* Nova senha */}
          <motion.div className="auth-field-v2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <label htmlFor="reset-password" className="auth-label-v2">Nova senha</label>
            <div className="auth-input-wrap auth-pw-wrap">
              <input
                id="reset-password"
                type={showPw ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                autoFocus
                className="auth-input-v2 auth-input-v2--pw"
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} tabIndex={-1}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}>
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
              <div className="auth-input-glow" />
            </div>
            <AnimatePresence>
              <PasswordRequirements password={password} />
            </AnimatePresence>
          </motion.div>

          {/* Confirmar senha */}
          <motion.div className="auth-field-v2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label htmlFor="reset-confirm" className="auth-label-v2">Confirmar senha</label>
            <div className="auth-input-wrap auth-pw-wrap">
              <input
                id="reset-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className={`auth-input-v2 auth-input-v2--pw${match ? " auth-input-v2--ok" : ""}${mismatch ? " auth-input-v2--err" : ""}`}
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}
                aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}>
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
              <div className="auth-input-glow" />
            </div>
          </motion.div>

          {match && (
            <motion.p className="auth-success-v2" style={{ padding: "6px 10px", fontSize: "12px" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Senhas coincidem
            </motion.p>
          )}
          {mismatch && (
            <motion.p className="auth-error-v2" style={{ padding: "6px 10px", fontSize: "12px" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              As senhas não coincidem
            </motion.p>
          )}

          <AnimatePresence>
            {error && (
              <motion.p className="auth-error-v2" role="alert"
                initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button type="submit" disabled={loading || !password || !confirmPassword}
            className="auth-submit-v2" whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(201,169,106,0.4)" }} whileTap={{ scale: 0.98 }}>
            {loading ? <div className="auth-spinner" /> : "Atualizar senha"}
          </motion.button>
        </form>

        <div className="auth-footer-v2">
          <button className="auth-link-v2" onClick={() => navigate("/auth")}>← Voltar ao login</button>
        </div>
      </motion.div>

      <motion.p className="auth-branding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
        © {new Date().getFullYear()} Hallow Comunicação
      </motion.p>
    </div>
  );
};

export default ResetPasswordPage;
