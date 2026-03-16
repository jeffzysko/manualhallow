import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X } from "lucide-react";

/**
 * Shows an update banner only when:
 * 1. The app is running as an installed PWA (standalone mode)
 * 2. A new service worker version is available
 */
export default function PWAUpdatePrompt() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onOfflineReady() {
      console.log("[PWA] App ready for offline use");
    },
  });

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(mq.matches || (navigator as any).standalone === true);

    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const show = isStandalone && needRefresh && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9999] safe-top"
        >
          <div className="mx-3 mt-3 rounded-xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 p-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Nova versão disponível
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Atualize para ter os recursos mais recentes.
              </p>
            </div>

            <button
              onClick={() => updateServiceWorker(true)}
              className="flex-shrink-0 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95"
            >
              Atualizar
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
