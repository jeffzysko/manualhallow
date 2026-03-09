import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/manual.css";

/* ── Particles ── */
const PARTICLE_COUNT = 30;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * -20,
  opacity: Math.random() * 0.4 + 0.1,
}));

/* ── Animated phone mockup with app screen ── */
const PhoneMockup = () => (
  <motion.div
    className="pwa-mockup"
    initial={{ opacity: 0, y: 40, rotateY: 15 }}
    animate={{ opacity: 1, y: 0, rotateY: 0 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
  >
    {/* Glow behind phone */}
    <motion.div
      className="pwa-mockup-glow"
      animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Phone frame */}
    <div className="pwa-mockup-frame">
      {/* Status bar */}
      <div className="pwa-mockup-statusbar">
        <span>9:41</span>
        <div className="pwa-mockup-notch" />
        <span style={{ display: "flex", gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" opacity="0"/><rect x="1" y="16" width="4" height="5" rx="1"/><rect x="7" y="12" width="4" height="9" rx="1"/><rect x="13" y="8" width="4" height="13" rx="1"/><rect x="19" y="4" width="4" height="17" rx="1"/></svg>
        </span>
      </div>
      {/* App content preview */}
      <div className="pwa-mockup-screen">
        <div className="pwa-mockup-app-header">
          <span className="pwa-mockup-logo">H</span>
          <div>
            <div className="pwa-mockup-bar" style={{ width: 80 }} />
            <div className="pwa-mockup-bar pwa-mockup-bar--sm" style={{ width: 50 }} />
          </div>
        </div>
        <div className="pwa-mockup-content">
          <div className="pwa-mockup-bar pwa-mockup-bar--gold" style={{ width: "70%" }} />
          <div className="pwa-mockup-bar" style={{ width: "100%" }} />
          <div className="pwa-mockup-bar" style={{ width: "85%" }} />
          <div className="pwa-mockup-bar" style={{ width: "60%" }} />
          <div className="pwa-mockup-card-mini">
            <div className="pwa-mockup-bar pwa-mockup-bar--gold" style={{ width: 40 }} />
            <div className="pwa-mockup-bar" style={{ width: "90%" }} />
            <div className="pwa-mockup-bar" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
      {/* Home indicator */}
      <div className="pwa-mockup-home" />
    </div>
    {/* Floating badge */}
    <motion.div
      className="pwa-mockup-badge"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
    >
      ✦
    </motion.div>
  </motion.div>
);

const IOS_STEPS = [
  { num: "1", title: "Abra no Safari", desc: "Acesse pelo navegador Safari" },
  { num: "2", title: "Toque em ⬆", desc: "Ícone de compartilhar na barra inferior" },
  { num: "3", title: "Adicionar à Tela", desc: "Selecione \"Adicionar à Tela de Início\"" },
  { num: "4", title: "Pronto! ✦", desc: "O app aparece na sua tela inicial" },
];

const ANDROID_STEPS = [
  { num: "1", title: "Abra no Chrome", desc: "Acesse pelo navegador Chrome" },
  { num: "2", title: "Menu ⋮", desc: "Três pontinhos no canto superior direito" },
  { num: "3", title: "Instalar app", desc: "Ou \"Adicionar à tela inicial\"" },
  { num: "4", title: "Pronto! ✦", desc: "O app aparece na sua tela inicial" },
];

const PWAInstallPage = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<"ios" | "android">("android");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(mq.matches || (navigator as any).standalone === true);
  }, []);

  const steps = platform === "ios" ? IOS_STEPS : ANDROID_STEPS;

  return (
    <div className="manual-page pwa-install-page">
      {/* Background particles */}
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

      {/* Radial gradient backdrop */}
      <div className="pwa-backdrop" aria-hidden="true" />

      <div className="pwa-install-layout">
        {/* Hero section with phone mockup */}
        <div className="pwa-hero-section">
          <PhoneMockup />
        </div>

        {/* Content section */}
        <motion.div
          className="pwa-content-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Title */}
          <motion.div
            className="pwa-install-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="pwa-install-title">
              {isStandalone ? (
                <>Tudo pronto <span className="pwa-gold">✦</span></>
              ) : (
                <>Seu manual, <span className="pwa-gold">sempre no bolso</span></>
              )}
            </h1>
            <p className="pwa-install-subtitle">
              {isStandalone
                ? "Você já está usando o Manual Hallow como aplicativo."
                : "Instale como app e tenha acesso rápido, offline e com a experiência completa."}
            </p>
          </motion.div>

          {/* Benefits row */}
          <motion.div
            className="pwa-benefits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: "⚡", line1: "Acesso", line2: "instantâneo" },
              { icon: "📴", line1: "Funciona", line2: "offline" },
              { icon: "🎯", line1: "Tela", line2: "cheia" },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="pwa-benefit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.08 }}
              >
                <span className="pwa-benefit-icon">{b.icon}</span>
                <span className="pwa-benefit-label">{b.line1}<br />{b.line2}</span>
              </motion.div>
            ))}
          </motion.div>

          {!isStandalone && (
            <>
              {/* Platform selector */}
              <motion.div
                className="pwa-platform-tabs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                {(["ios", "android"] as const).map((p) => (
                  <button
                    key={p}
                    className={`pwa-platform-tab ${platform === p ? "pwa-platform-tab--active" : ""}`}
                    onClick={() => setPlatform(p)}
                  >
                    {p === "ios" ? "🍎 iPhone" : "🤖 Android"}
                  </button>
                ))}
              </motion.div>

              {/* Steps — horizontal timeline */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={platform}
                  className="pwa-timeline"
                  initial={{ opacity: 0, x: platform === "ios" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: platform === "ios" ? 20 : -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Connecting line */}
                  <div className="pwa-timeline-line" />
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="pwa-timeline-step"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * i }}
                    >
                      <div className="pwa-timeline-dot">
                        <span>{step.num}</span>
                      </div>
                      <p className="pwa-timeline-title">{step.title}</p>
                      <p className="pwa-timeline-desc">{step.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {/* CTA */}
          <motion.div
            className="pwa-install-cta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="pwa-cta-btn"
              onClick={() => navigate("/", { replace: true })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isStandalone ? "Acessar o Manual" : "Continuar para o Manual"}</span>
              <motion.span
                className="pwa-cta-icon"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                ✦
              </motion.span>
            </motion.button>
            {!isStandalone && (
              <p className="pwa-skip-text">Você pode instalar depois a qualquer momento</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PWAInstallPage;
