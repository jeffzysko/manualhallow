import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/manual.css";

const PWAInstallPage = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("android");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
    } else if (/android/.test(ua)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Check if already installed as PWA
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(mq.matches || (navigator as any).standalone === true);
  }, []);

  const handleSkip = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="onboarding-container">
        <div className="onboarding-header">
          <span className="onboarding-icon" style={{ fontSize: 36 }}>📱</span>
          <h1 className="onboarding-title">
            Instale o app no seu celular
          </h1>
          <p className="onboarding-subtitle">
            Acesse o manual como um aplicativo nativo — mais rápido, funciona offline e sempre à mão.
          </p>
        </div>

        {isStandalone ? (
          <div className="pwa-install-success">
            <span style={{ fontSize: 32 }}>✅</span>
            <p style={{ color: "var(--text)", fontSize: 15, fontWeight: 600, margin: "12px 0 4px" }}>
              App já instalado!
            </p>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              Você já está usando o Manual Hallow como aplicativo.
            </p>
          </div>
        ) : (
          <>
            {/* Platform tabs */}
            <div className="pwa-platform-tabs">
              <button
                className={`pwa-platform-tab ${platform === "ios" ? "pwa-platform-tab--active" : ""}`}
                onClick={() => setPlatform("ios")}
              >
                iPhone
              </button>
              <button
                className={`pwa-platform-tab ${platform === "android" ? "pwa-platform-tab--active" : ""}`}
                onClick={() => setPlatform("android")}
              >
                Android
              </button>
            </div>

            <div className="pwa-install-steps">
              {platform === "ios" ? (
                <>
                  <div className="pwa-step">
                    <span className="pwa-step-num">1</span>
                    <div>
                      <p className="pwa-step-title">Abra no Safari</p>
                      <p className="pwa-step-desc">O app só pode ser instalado pelo navegador Safari no iPhone.</p>
                    </div>
                  </div>
                  <div className="pwa-step">
                    <span className="pwa-step-num">2</span>
                    <div>
                      <p className="pwa-step-title">Toque no botão de compartilhar</p>
                      <p className="pwa-step-desc">
                        Toque no ícone <span style={{ fontSize: 16 }}>⬆</span> na barra inferior do Safari.
                      </p>
                    </div>
                  </div>
                  <div className="pwa-step">
                    <span className="pwa-step-num">3</span>
                    <div>
                      <p className="pwa-step-title">Selecione "Adicionar à Tela Início"</p>
                      <p className="pwa-step-desc">
                        Role a lista e toque em <strong>"Adicionar à Tela de Início"</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="pwa-step">
                    <span className="pwa-step-num">4</span>
                    <div>
                      <p className="pwa-step-title">Confirme e pronto!</p>
                      <p className="pwa-step-desc">
                        Toque em "Adicionar". O ícone do Manual Hallow aparecerá na sua tela inicial.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pwa-step">
                    <span className="pwa-step-num">1</span>
                    <div>
                      <p className="pwa-step-title">Abra no Chrome</p>
                      <p className="pwa-step-desc">Acesse este site pelo navegador Chrome no seu Android.</p>
                    </div>
                  </div>
                  <div className="pwa-step">
                    <span className="pwa-step-num">2</span>
                    <div>
                      <p className="pwa-step-title">Toque no menu ⋮</p>
                      <p className="pwa-step-desc">
                        Toque nos três pontinhos no canto superior direito do Chrome.
                      </p>
                    </div>
                  </div>
                  <div className="pwa-step">
                    <span className="pwa-step-num">3</span>
                    <div>
                      <p className="pwa-step-title">Selecione "Instalar aplicativo"</p>
                      <p className="pwa-step-desc">
                        Ou <strong>"Adicionar à tela inicial"</strong>, dependendo da versão do Chrome.
                      </p>
                    </div>
                  </div>
                  <div className="pwa-step">
                    <span className="pwa-step-num">4</span>
                    <div>
                      <p className="pwa-step-title">Confirme e pronto!</p>
                      <p className="pwa-step-desc">
                        O ícone do Manual Hallow aparecerá na sua tela inicial como um app.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        <div className="onboarding-actions" style={{ marginTop: 24 }}>
          <button className="onboarding-btn onboarding-btn--next" onClick={handleSkip} style={{ maxWidth: "100%", flex: 1 }}>
            {isStandalone ? "Acessar o Manual ✦" : "Continuar para o Manual ✦"}
          </button>
        </div>

        {!isStandalone && (
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 12 }}>
            Você pode instalar depois a qualquer momento.
          </p>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPage;
