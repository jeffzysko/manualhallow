import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Register service worker with auto-update — checks every 60s for new versions
registerSW({
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 1000); // check every 60 seconds
    }
  },
  onOfflineReady() {
    console.log("[PWA] App ready for offline use");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
