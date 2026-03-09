import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/manual.css";

/* ── Floating particles (matching auth page) ── */
const PARTICLE_COUNT = 25;
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

/* ── Phone mockup icon ── */
const PhoneIcon = () => (
  <motion.div
    className="pwa-phone-icon"
    initial={{ scale: 0, rotate: -15 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
  >
    <motion.div
      className="pwa-phone-glow"
      animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
    <motion.div
      className="pwa-download-arrow"
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </motion.div>
  </motion.div>
);

const IOS_STEPS = [
  { title: "Abra no Safari", desc: "O app só pode ser instalado pelo navegador Safari no iPhone.", icon: "🧭" },
  { title: "Toque em compartilhar", desc: "Toque no ícone ⬆ na barra inferior do Safari.", icon: "⬆️" },
  { title: "\"Adicionar à Tela Início\"", desc: "Role a lista e selecione esta opção.", icon: "➕" },
  { title: "Confirme e pronto!", desc: "O ícone do Manual Hallow aparecerá na sua tela inicial.", icon: "✅" },
];

const ANDROID_STEPS = [
  { title: "Abra no Chrome", desc: "Acesse este site pelo navegador Chrome.", icon: "🌐" },
  { title: "Toque no menu ⋮", desc: "Os três pontinhos no canto superior direito.", icon: "⋮" },
  { title: "\"Instalar aplicativo\"", desc: "Ou \"Adicionar à tela inicial\", dependendo da versão.", icon: "📲" },
  { title: "Confirme e pronto!", desc: "O Manual Hallow vira um app na sua tela.", icon: "✅" },
];

const BENEFITS = [
  { icon: "⚡", label: "Mais rápido" },
  { icon: "📴", label: "Funciona offline" },
  { icon: "🔔", label: "Sempre à mão" },
];

const PWAInstallPage = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<"ios" | "android">("android");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else setPlatform("android");

    const mq = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(mq.matches || (navigator as any).standalone === true);
  }, []);

  const steps = platform === "ios" ? IOS_STEPS : ANDROID_STEPS;

  return (
    <div className="manual-page pwa-install-page">
      <GoldParticles />

      <motion.div
        className="pwa-install-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="pwa-install-header">
          <PhoneIcon />
          <motion.h1
            className="pwa-install-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isStandalone ? "App Instalado!" : "Instale o Manual Hallow"}
          </motion.h1>
          <motion.p
            className="pwa-install-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {isStandalone
              ? "Você já está usando como aplicativo. Experiência completa ativada."
              : "Tenha o manual sempre no bolso. Como um app de verdade."}
          </motion.p>
        </div>

        {/* Benefits */}
        <motion.div
          className="pwa-benefits"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={i}
              className="pwa-benefit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 300 }}
            >
              <span className="pwa-benefit-icon">{b.icon}</span>
              <span className="pwa-benefit-label">{b.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {!isStandalone && (
          <>
            {/* Platform tabs */}
            <motion.div
              className="pwa-platform-tabs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                className={`pwa-platform-tab ${platform === "ios" ? "pwa-platform-tab--active" : ""}`}
                onClick={() => setPlatform("ios")}
              >
                <span>🍎</span> iPhone
              </button>
              <button
                className={`pwa-platform-tab ${platform === "android" ? "pwa-platform-tab--active" : ""}`}
                onClick={() => setPlatform("android")}
              >
                <span>🤖</span> Android
              </button>
            </motion.div>

            {/* Steps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={platform}
                className="pwa-install-steps"
                initial={{ opacity: 0, x: platform === "ios" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: platform === "ios" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="pwa-step"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                  >
                    <span className="pwa-step-num">
                      <span className="pwa-step-emoji">{step.icon}</span>
                    </span>
                    <div>
                      <p className="pwa-step-title">{step.title}</p>
                      <p className="pwa-step-desc">{step.desc}</p>
                    </div>
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
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <button className="pwa-cta-btn" onClick={() => navigate("/", { replace: true })}>
            <span>{isStandalone ? "Acessar o Manual" : "Continuar para o Manual"}</span>
            <span className="pwa-cta-icon">✦</span>
          </button>
          {!isStandalone && (
            <p className="pwa-skip-text">Você pode instalar depois a qualquer momento</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PWAInstallPage;
