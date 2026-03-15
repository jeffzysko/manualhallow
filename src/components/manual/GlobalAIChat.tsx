import { lazy, Suspense } from "react";
import { useAIChat } from "@/contexts/AIChatContext";

const AIChatDrawer = lazy(() => import("@/components/manual/AIChatDrawer"));

const GlobalAIChat = () => {
  const { aiChatOpen, closeAIChat } = useAIChat();

  if (!aiChatOpen) return null;

  return (
    <Suspense fallback={null}>
      <AIChatDrawer open={aiChatOpen} onClose={closeAIChat} />
    </Suspense>
  );
};

export default GlobalAIChat;
