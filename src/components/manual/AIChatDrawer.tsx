import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { clampText } from "@/lib/sanitize";
import { useAnalytics } from "@/hooks/useAnalytics";

type MsgContent = string | { type: string; text?: string; image_url?: { url: string } }[];
type Msg = { role: "user" | "assistant"; content: MsgContent };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const SUGGESTIONS = [
  "Como quebrar a objeção de preço?",
  "Script para cliente travado",
  "Como fazer follow-up sem parecer insistente?",
  "Técnica SPIN aplicada a piscinas",
  "Como apresentar o preço premium?",
  "Quais gatilhos mentais usar?",
];

/** Get display text from a message */
function getTextContent(content: MsgContent): string {
  if (typeof content === "string") return content;
  return content.filter(p => p.type === "text").map(p => p.text || "").join("");
}

/** Get image URL from a multimodal message */
function getImageUrl(content: MsgContent): string | null {
  if (typeof content === "string") return null;
  const img = content.find(p => p.type === "image_url");
  return img?.image_url?.url || null;
}

/** Parse dynamic suggestions from the AI response */
function parseSuggestions(text: string): { clean: string; suggestions: string[] } {
  const marker = "---SUGESTOES---";
  const endMarker = "---FIM_SUGESTOES---";
  const idx = text.indexOf(marker);
  if (idx === -1) return { clean: text, suggestions: [] };

  const clean = text.slice(0, idx).trim();
  const endIdx = text.indexOf(endMarker);
  const block = text.slice(idx + marker.length, endIdx === -1 ? undefined : endIdx).trim();
  const suggestions = block
    .split("\n")
    .map(l => l.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return { clean, suggestions };
}

/** Split a response into two parts if the AI used ---PARTE2--- */
function splitParts(text: string): string[] {
  const marker = "---PARTE2---";
  const idx = text.indexOf(marker);
  if (idx === -1) return [text];
  const part1 = text.slice(0, idx).trim();
  const part2 = text.slice(idx + marker.length).trim();
  if (!part2) return [part1];
  return [part1, part2];
}

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const AIChatDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from DB
  useEffect(() => {
    if (!open || !user || historyLoaded) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessages(data.map(d => {
            const role = d.role as "user" | "assistant";
            // Try to reconstruct multimodal messages from stored JSON
            if (d.content.startsWith("{")) {
              try {
                const parsed = JSON.parse(d.content);
                if (parsed.image_url) {
                  const parts: MsgContent = [
                    { type: "text", text: parsed.text || "" },
                    { type: "image_url", image_url: { url: parsed.image_url } },
                  ];
                  return { role, content: parts };
                }
              } catch { /* not JSON, treat as plain text */ }
            }
            return { role, content: d.content };
          }));
        }
        setHistoryLoaded(true);
      });
  }, [open, user, historyLoaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const persistMessage = useCallback(async (role: "user" | "assistant", content: string, imageUrl?: string) => {
    if (!user) return;
    // If there's an image, store as JSON so we can reconstruct on load
    const stored = imageUrl
      ? JSON.stringify({ text: content, image_url: imageUrl })
      : content;
    await supabase.from("chat_messages").insert({ user_id: user.id, role, content: stored });
  }, [user]);

  const { track } = useAnalytics();

  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecione apenas imagens (JPG, PNG, etc.)");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Imagem muito grande. Máximo 4MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      if (!user) throw new Error("Não autenticado");

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("chat-images")
        .upload(path, file, { contentType: file.type });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("chat-images")
        .getPublicUrl(path);

      setPendingImage(urlData.publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [user]);

  const sendMessage = useCallback(async (text: string) => {
    const sanitized = clampText(text, 2000);
    if ((!sanitized && !pendingImage) || isLoading) return;

    let userContent: MsgContent;
    let displayText = sanitized || "📸 Enviando print para análise";

    if (pendingImage) {
      const parts: { type: string; text?: string; image_url?: { url: string } }[] = [];
      parts.push({ type: "text", text: displayText });
      parts.push({ type: "image_url", image_url: { url: pendingImage } });
      userContent = parts;
    } else {
      userContent = sanitized;
    }

    const userMsg: Msg = { role: "user", content: userContent };
    setInput("");
    setPendingImage(null);
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    const imageUrlToSave = pendingImage || undefined;
    persistMessage("user", displayText, imageUrlToSave);

    let assistantSoFar = "";
    // For API: send text-only history + current multimodal message (filter empty, limit to last 50)
    const rawMsgs = [
      ...messages.map(m => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : getTextContent(m.content),
      })),
      { role: userMsg.role, content: typeof userMsg.content === "string" ? userMsg.content : displayText },
    ]
      .filter(m => typeof m.content === "string" && m.content.trim().length > 0)
      .slice(-50);

    // Merge consecutive same-role messages to avoid API rejection
    const apiMessages: { role: string; content: string }[] = [];
    for (const m of rawMsgs) {
      const last = apiMessages[apiMessages.length - 1];
      if (last && last.role === m.role) {
        last.content += "\n" + m.content;
      } else {
        apiMessages.push({ ...m });
      }
    }

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Erro na comunicação");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              const snapshot = assistantSoFar;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: snapshot } : m);
                }
                return [...prev, { role: "assistant", content: snapshot }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (assistantSoFar) {
        // Split into two messages if ---PARTE2--- is present
        const parts = splitParts(assistantSoFar);
        if (parts.length === 2) {
          // Replace the streamed message with just part 1
          setMessages(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx]?.role === "assistant") {
              updated[lastIdx] = { ...updated[lastIdx], content: parts[0] };
            }
            return updated;
          });
          persistMessage("assistant", parts[0]);
          // Add part 2 after a brief delay for natural feel
          await new Promise(r => setTimeout(r, 800));
          setMessages(prev => [...prev, { role: "assistant", content: parts[1] }]);
          persistMessage("assistant", parts[1]);
        } else {
          persistMessage("assistant", assistantSoFar);
        }
      }
    } catch (e: any) {
      const errMsg = `⚠️ ${e.message || "Erro inesperado. Tente novamente."}`;
      setMessages(prev => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, persistMessage, pendingImage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClearHistory = useCallback(async () => {
    if (!user) return;
    await supabase.from("chat_messages").delete().eq("user_id", user.id);
    setMessages([]);
  }, [user]);

  // Extract suggestions from the last assistant message
  const lastAssistantSuggestions = useMemo(() => {
    if (isLoading) return [];
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAssistant) return [];
    const text = getTextContent(lastAssistant.content);
    const { suggestions } = parseSuggestions(text);
    return suggestions;
  }, [messages, isLoading]);

  if (!open) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-drawer" onClick={e => e.stopPropagation()}>
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <span className="ai-chat-icon">✦</span>
            <span className="ai-chat-title">Mentor Hallow</span>
          </div>
          <div className="ai-chat-header-right">
            {messages.length > 0 && (
              <button className="ai-chat-clear" onClick={handleClearHistory} aria-label="Limpar conversa" title="Limpar conversa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            )}
            <button className="ai-chat-close" onClick={onClose} aria-label="Fechar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-chat-empty">
              <span className="ai-chat-empty-icon">✦</span>
              <p>Olá! Sou o Mentor Hallow.</p>
              <p>Pergunte sobre técnicas de venda, objeções, scripts ou envie um <strong>print do WhatsApp</strong> para análise.</p>
              <div className="ai-chat-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="ai-chat-suggestion"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => {
            const isAssistant = msg.role === "assistant";
            const text = getTextContent(msg.content);
            const imageUrl = getImageUrl(msg.content);
            const { clean } = isAssistant ? parseSuggestions(text) : { clean: text };

            return (
              <div key={i} className={`ai-chat-msg ai-chat-msg--${msg.role}`}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Print enviado"
                    className="ai-chat-image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "240px",
                      borderRadius: "8px",
                      marginBottom: "6px",
                      objectFit: "contain",
                    }}
                  />
                )}
                {isAssistant ? (
                  <div className="ai-chat-md">
                    <ReactMarkdown>{clean}</ReactMarkdown>
                  </div>
                ) : (
                  clean && <p>{clean}</p>
                )}
              </div>
            );
          })}

          {/* Dynamic follow-up suggestions */}
          {!isLoading && lastAssistantSuggestions.length > 0 && (
            <div className="ai-chat-dynamic-suggestions">
              {lastAssistantSuggestions.map((s, i) => (
                <button
                  key={i}
                  className="ai-chat-suggestion"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="ai-chat-msg ai-chat-msg--assistant">
              <div className="ai-chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pending image preview */}
        {pendingImage && (
          <div style={{
            padding: "8px 16px",
            background: "hsl(var(--muted))",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderTop: "1px solid hsl(var(--border))",
          }}>
            <img
              src={pendingImage}
              alt="Preview"
              style={{ height: "48px", borderRadius: "6px", objectFit: "cover" }}
            />
            <span style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", flex: 1 }}>
              Imagem pronta para envio
            </span>
            <button
              onClick={() => setPendingImage(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "hsl(var(--muted-foreground))",
                fontSize: "18px",
                padding: "4px",
              }}
              aria-label="Remover imagem"
            >
              ✕
            </button>
          </div>
        )}

        <div className="ai-chat-input-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
          <button
            className="ai-chat-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploadingImage}
            title="Enviar print do WhatsApp"
            style={{
              background: "none",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              padding: "6px",
              color: pendingImage ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              display: "flex",
              alignItems: "center",
              opacity: isLoading ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            {isUploadingImage ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </button>
          <textarea
            ref={inputRef}
            className="ai-chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={pendingImage ? "Descreva o contexto do print..." : "Faça sua pergunta..."}
            rows={1}
            disabled={isLoading}
          />
          <button className="ai-chat-send" onClick={() => sendMessage(input)} disabled={isLoading || (!input.trim() && !pendingImage)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;
