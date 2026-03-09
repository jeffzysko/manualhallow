import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt";
import { useOfflineSync } from "./hooks/useOfflineSync";

// Lazy-load all route pages for smaller initial bundle
const ManualPage = lazy(() => import("./pages/ManualPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const PWAInstallPage = lazy(() => import("./pages/PWAInstallPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 min — avoid unnecessary refetches
      gcTime: 10 * 60 * 1000,        // 10 min garbage collection
      retry: 1,                       // single retry on failure
      refetchOnWindowFocus: false,    // don't refetch on tab switch
    },
  },
});

const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  useOfflineSync();
  return <>{children}</>;
};

const PageFallback = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090f" }}>
    <div style={{ width: 32, height: 32, border: "2px solid rgba(201,169,106,0.3)", borderTopColor: "#c9a96a", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SyncProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineBanner />
          <PWAUpdatePrompt />
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<ProtectedRoute><ManualPage /></ProtectedRoute>} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                <Route path="/pwa-install" element={<ProtectedRoute><PWAInstallPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </SyncProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
