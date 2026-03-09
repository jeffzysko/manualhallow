import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Register SW early — ensures old cached SWs get replaced even before React mounts
const updateSW = registerSW({
  onNeedRefresh() {
    // PWAUpdatePrompt component handles the UI prompt via useRegisterSW
  },
  onOfflineReady() {
    console.log("[PWA] App ready for offline use");
  },
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      setInterval(() => registration.update(), 60 * 1000);
    }
  },
});

createRoot(document.getElementById("root")!).render(<App />);
