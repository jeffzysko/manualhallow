import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { translateAuthError } from "@/lib/authErrors";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/manual.css";

/* ── Floating particles ── */
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
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
        }}
        animate={{
          y: [0, -80, -160],
          x: [0, Math.sin(p.id) * 30, 0],
          opacity: [0, p.opacity, 0],
        }}
        transition={{
          duration: p.duration,
          repeat: Infinity,
          delay: p.delay,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

/* ── Animated rings behind logo ── */
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

/* ── Input field ── */
const AuthInput = ({
  id, label, type = "text", placeholder, value, onChange, autoComplete, required = true, autoFocus = false,
}: {
  id: string; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete: string;
  required?: boolean; autoFocus?: boolean;
}) => (
  <motion.div
    className="auth-field-v2"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <label htmlFor={id} className="auth-label-v2">{label}</label>
    <div className="auth-input-wrap">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        inputMode={type === "email" ? "email" : undefined}
        minLength={type === "password" ? 8 : undefined}
        className="auth-input-v2"
      />
      <div className="auth-input-glow" />
    </div>
  </motion.div>
);

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup" | "recovery">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
        email, password,
        options: { data: { full_name: fullName, company }, emailRedirectTo: window.location.origin },
      });
      if (error) {
        setError(translateAuthError(error.message));
      } else {
        try {
          await supabase.functions.invoke("send-auth-email", {
            body: { type: "signup", email, redirectTo: window.location.origin },
          });
        } catch (e) { console.error("Branded email error:", e); }
        setMessage("Verifique seu e-mail para confirmar o cadastro.");
      }
    } else if (mode === "recovery") {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("send-auth-email", {
          body: { type: "recovery", email, redirectTo: `${window.location.origin}/reset-password` },
        });
        if (fnError) setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
        else setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      } catch (e) {
        setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
    }
    setLoading(false);
  }, [mode, email, password, fullName, navigate]);

  const switchMode = (newMode: "login" | "signup" | "recovery") => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: mode === "recovery" ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
    exit: { opacity: 0, x: mode === "recovery" ? 20 : -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="manual-page auth-wrapper-v2">
      {/* Ambient background */}
      <div className="auth-bg-gradient" aria-hidden="true" />
      <div className="auth-bg-noise" aria-hidden="true" />
      <GoldParticles />

      <motion.div
        className="auth-card-v2"
        role="main"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo area */}
        <div className="auth-logo-area">
          <LogoRings />
          <motion.div
            className="auth-monogram"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            H
          </motion.div>
        </div>

        <motion.h1
          className="auth-title-v2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          HALLOW
        </motion.h1>
        <motion.p
          className="auth-subtitle-v2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          MANUAL DE VENDAS
        </motion.p>

        {/* Divider */}
        <motion.div
          className="auth-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {mode !== "recovery" ? (
              <div className="auth-tabs-v2" role="tablist" aria-label="Modo de autenticação">
                <button
                  className={`auth-tab-v2${mode === "login" ? " auth-tab-v2--active" : ""}`}
                  onClick={() => switchMode("login")}
                  role="tab"
                  aria-selected={mode === "login"}
                >
                  <span>ENTRAR</span>
                  {mode === "login" && <motion.div className="auth-tab-indicator" layoutId="tab-indicator" />}
                </button>
                <button
                  className={`auth-tab-v2${mode === "signup" ? " auth-tab-v2--active" : ""}`}
                  onClick={() => switchMode("signup")}
                  role="tab"
                  aria-selected={mode === "signup"}
                >
                  <span>CADASTRAR</span>
                  {mode === "signup" && <motion.div className="auth-tab-indicator" layoutId="tab-indicator" />}
                </button>
              </div>
            ) : (
              <div className="auth-recovery-header-v2">
                <motion.div
                  className="auth-recovery-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </motion.div>
                <p className="auth-recovery-title-v2">Recuperar Senha</p>
                <p className="auth-recovery-desc-v2">Informe seu e-mail para receber o link de redefinição.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-v2" noValidate>
              <AnimatePresence>
                {mode === "signup" && (
                  <>
                    <AuthInput
                      id="auth-company"
                      label="Empresa"
                      placeholder="Nome da sua empresa"
                      value={company}
                      onChange={setCompany}
                      autoComplete="organization"
                    />
                    <AuthInput
                      id="auth-fullname"
                      label="Nome completo"
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="name"
                    />
                  </>
                )}
              </AnimatePresence>

              <AuthInput
                id="auth-email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                autoFocus
              />

              {mode !== "recovery" && (
                <AuthInput
                  id="auth-password"
                  label="Senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    className="auth-error-v2"
                    role="alert"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
                {message && (
                  <motion.p
                    className="auth-success-v2"
                    role="status"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="auth-submit-v2"
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(201,169,106,0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="auth-spinner" />
                ) : (
                  mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"
                )}
              </motion.button>
            </form>

            <div className="auth-footer-v2">
              {mode === "login" && (
                <button className="auth-link-v2" onClick={() => switchMode("recovery")}>
                  Esqueci minha senha
                </button>
              )}
              {mode === "recovery" && (
                <button className="auth-link-v2" onClick={() => switchMode("login")}>
                  ← Voltar para o login
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Bottom branding */}
      <motion.p
        className="auth-branding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        © {new Date().getFullYear()} Hallow Comunicação
      </motion.p>
    </div>
  );
};

export default AuthPage;
