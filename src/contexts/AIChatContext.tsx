import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AIChatContextType {
  aiChatOpen: boolean;
  openAIChat: () => void;
  closeAIChat: () => void;
}

const AIChatContext = createContext<AIChatContextType>({
  aiChatOpen: false,
  openAIChat: () => {},
  closeAIChat: () => {},
});

export const useAIChat = () => useContext(AIChatContext);

export const AIChatProvider = ({ children }: { children: ReactNode }) => {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const openAIChat = useCallback(() => setAiChatOpen(true), []);
  const closeAIChat = useCallback(() => setAiChatOpen(false), []);

  return (
    <AIChatContext.Provider value={{ aiChatOpen, openAIChat, closeAIChat }}>
      {children}
    </AIChatContext.Provider>
  );
};
