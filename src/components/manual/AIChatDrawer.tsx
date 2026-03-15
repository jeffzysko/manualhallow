import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import diAvatar from "@/assets/di-avatar.png";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { clampText } from "@/lib/sanitize";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "sonner";

type ContentPart = 
  | { type: "text"; text?: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "input_audio"; input_audio: { data: string; format: string } }
  | { type: "file_url"; file_url: { url: string; mime_type: string; name: string } };

type MsgContent = string | ContentPart[];
type Msg = { role: "user" | "assistant"; content: MsgContent; id?: string; rating?: number };

type PendingFile = {
  url: string;
  type: "image" | "audio" | "document";
  name: string;
  mimeType: string;
  base64?: string; // for audio
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const SUGGESTIONS = [
  "Como quebrar a objeção de preço?",
  "Script para cliente travado",
  "Como fazer follow-up sem parecer insistente?",
  "Técnica SPIN aplicada a piscinas",
  "Como apresentar o preço premium?",
  "Quais gatilhos mentais usar?",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_TYPES: Record<string, "image" | "audio" | "document"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/m4a": "audio",
  "audio/x-m4a": "audio",
  "audio/mp4": "audio",
  "audio/webm": "audio",
  "application/pdf": "document",
  "text/plain": "document",
  "text/csv": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
};

const ACCEPT_STRING = Object.keys(ACCEPTED_TYPES).join(",");

function getFileTypeCategory(mimeType: string): "image" | "audio" | "document" {
  return ACCEPTED_TYPES[mimeType] || "document";
}

/** Get display text from a message */
function getTextContent(content: MsgContent): string {
  if (typeof content === "string") return content;
  return content.filter(p => p.type === "text").map(p => (p as any).text || "").join("");
}

/** Get all image URLs from a multimodal message */
function getImageUrls(content: MsgContent): string[] {
  if (typeof content === "string") return [];
  return content.filter(p => p.type === "image_url").map(p => (p as any)?.image_url?.url).filter(Boolean);
}

/** Get all attached files info from a message */
function getAttachedFiles(content: MsgContent): { type: string; name: string; url?: string }[] {
  if (typeof content === "string") return [];
  const results: { type: string; name: string; url?: string }[] = [];
  for (const p of content) {
    if (p.type === "input_audio") results.push({ type: "audio", name: "Áudio" });
    if (p.type === "file_url") results.push({ type: "document", name: (p as any).file_url?.name || "Documento", url: (p as any).file_url?.url });
  }
  return results;
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

/** Convert file to base64 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get pure base64
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Get file extension from mime type */
function getAudioFormat(mimeType: string): string {
  const map: Record<string, string> = {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/m4a": "m4a",
    "audio/x-m4a": "m4a",
    "audio/mp4": "mp4",
    "audio/webm": "webm",
  };
  return map[mimeType] || "mp3";
}

/** Feedback buttons component */
function FeedbackButtons({ rating, onRate }: { rating?: number; onRate: (r: number) => void }) {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
      <button
        onClick={() => onRate(1)}
        style={{
          background: rating === 1 ? "hsl(var(--primary) / 0.2)" : "transparent",
          border: rating === 1 ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid transparent",
          borderRadius: "6px", padding: "3px 8px", cursor: "pointer",
          fontSize: "14px", opacity: rating === -1 ? 0.3 : 1,
          transition: "all 0.2s",
        }}
        title="Boa resposta"
      >👍</button>
      <button
        onClick={() => onRate(-1)}
        style={{
          background: rating === -1 ? "hsl(var(--destructive) / 0.15)" : "transparent",
          border: rating === -1 ? "1px solid hsl(var(--destructive) / 0.3)" : "1px solid transparent",
          borderRadius: "6px", padding: "3px 8px", cursor: "pointer",
          fontSize: "14px", opacity: rating === 1 ? 0.3 : 1,
          transition: "all 0.2s",
        }}
        title="Resposta ruim"
      >👎</button>
    </div>
  );
}

const AIChatDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
                if (parsed.audio) {
                  const parts: MsgContent = [
                    { type: "text", text: parsed.text || "" },
                    { type: "input_audio", input_audio: { data: "", format: "mp3" } },
                  ];
                  return { role, content: parts };
                }
                if (parsed.file_url) {
                  const parts: MsgContent = [
                    { type: "text", text: parsed.text || "" },
                    { type: "file_url", file_url: { url: parsed.file_url, mime_type: parsed.mime_type || "", name: parsed.file_name || "Documento" } },
                  ];
                  return { role, content: parts };
                }
              } catch { /* not JSON */ }
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

  // Close attach menu on outside click
  useEffect(() => {
    if (!attachMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [attachMenuOpen]);

  const persistMessage = useCallback(async (role: "user" | "assistant", content: string, fileInfo?: { type: string; url?: string; name?: string; mimeType?: string }) => {
    if (!user) return;
    let stored = content;
    if (fileInfo) {
      if (fileInfo.type === "image") {
        stored = JSON.stringify({ text: content, image_url: fileInfo.url });
      } else if (fileInfo.type === "audio") {
        stored = JSON.stringify({ text: content, audio: true, audio_url: fileInfo.url });
      } else if (fileInfo.type === "document") {
        stored = JSON.stringify({ text: content, file_url: fileInfo.url, mime_type: fileInfo.mimeType, file_name: fileInfo.name });
      }
    }
    await supabase.from("chat_messages").insert({ user_id: user.id, role, content: stored });
  }, [user]);

  const { track } = useAnalytics();

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesToProcess = Array.from(files);
    
    // Validate all files first
    for (const file of filesToProcess) {
      if (!ACCEPTED_TYPES[file.type]) {
        alert(`Formato não suportado: ${file.name}. Envie imagens, áudios, PDFs ou documentos de texto.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`Arquivo muito grande: ${file.name}. Máximo 10MB por arquivo.`);
        return;
      }
    }

    // Limit total pending files to 10
    if (pendingFiles.length + filesToProcess.length > 10) {
      alert("Máximo de 10 arquivos por mensagem.");
      return;
    }

    setIsUploadingFile(true);
    try {
      if (!user) throw new Error("Não autenticado");

      const newFiles: PendingFile[] = [];

      for (const file of filesToProcess) {
        const fileType = getFileTypeCategory(file.type);
        const ext = file.name.split(".").pop() || "bin";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

        const { error } = await supabase.storage
          .from("chat-images")
          .upload(path, file, { contentType: file.type });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("chat-images")
          .getPublicUrl(path);

        const pending: PendingFile = {
          url: urlData.publicUrl,
          type: fileType,
          name: file.name,
          mimeType: file.type,
        };

        if (fileType === "audio") {
          pending.base64 = await fileToBase64(file);
        }

        newFiles.push(pending);
      }

      setPendingFiles(prev => [...prev, ...newFiles]);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Erro ao enviar arquivo. Tente novamente.");
    } finally {
      setIsUploadingFile(false);
      // Reset all file inputs
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (audioInputRef.current) audioInputRef.current.value = "";
      if (docInputRef.current) docInputRef.current.value = "";
    }
  }, [user, pendingFiles]);

  // ── Audio Recording ──
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        setRecordingDuration(0);

        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (blob.size < 1000) return; // too short

        setIsUploadingFile(true);
        try {
          if (!user) throw new Error("Não autenticado");
          const ext = mimeType.includes("webm") ? "webm" : "ogg";
          const path = `${user.id}/${Date.now()}-voice.${ext}`;
          const file = new File([blob], `gravacao.${ext}`, { type: mimeType });

          const { error } = await supabase.storage
            .from("chat-images")
            .upload(path, file, { contentType: mimeType });
          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from("chat-images")
            .getPublicUrl(path);

          const base64 = await fileToBase64(file);

          const pending: PendingFile = {
            url: urlData.publicUrl,
            type: "audio",
            name: `Gravação de voz`,
            mimeType,
            base64,
          };
          setPendingFiles([pending]);
          // Auto-send the voice message
          setTimeout(() => {
            const voiceText = "🎤 Áudio gravado para análise";
            // We'll trigger send via a ref-based approach
            sendMessageRef.current?.(voiceText);
          }, 100);
        } catch (err) {
          console.error("Upload error:", err);
          toast.error("Erro ao enviar gravação. Tente novamente.");
        } finally {
          setIsUploadingFile(false);
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access error:", err);
      toast.error("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  }, [user]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      mediaRecorderRef.current.stop();
      audioChunksRef.current = []; // clear so onstop does nothing useful
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingDuration(0);
  }, []);

  // Ref to allow onstop callback to call sendMessage
  const sendMessageRef = useRef<((text: string) => void) | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const hasPendingFiles = pendingFiles.length > 0;
    const sanitized = clampText(text, 2000);
    if ((!sanitized && !hasPendingFiles) || isLoading) return;

    const fileCount = pendingFiles.length;
    const fileTypes = [...new Set(pendingFiles.map(f => f.type))];
    const fileEmoji = fileTypes.includes("image") ? "📸" : fileTypes.includes("audio") ? "🎤" : "📄";
    const fileLabel = fileCount === 1
      ? (pendingFiles[0].type === "image" ? "print" : pendingFiles[0].type === "audio" ? "áudio" : "documento")
      : `${fileCount} arquivos`;
    let displayText = sanitized || `${fileEmoji} Enviando ${fileLabel} para análise`;

    let userContent: MsgContent;

    if (hasPendingFiles) {
      const parts: ContentPart[] = [];
      parts.push({ type: "text", text: displayText });

      for (const pf of pendingFiles) {
        if (pf.type === "image") {
          parts.push({ type: "image_url", image_url: { url: pf.url } });
        } else if (pf.type === "audio" && pf.base64) {
          parts.push({ type: "input_audio", input_audio: { data: pf.base64, format: getAudioFormat(pf.mimeType) } });
        } else if (pf.type === "document") {
          parts.push({ type: "file_url", file_url: { url: pf.url, mime_type: pf.mimeType, name: pf.name } });
        }
      }

      userContent = parts;
    } else {
      userContent = sanitized;
    }

    const userMsg: Msg = { role: "user", content: userContent };
    setInput("");
    const currentPendingFiles = [...pendingFiles];
    setPendingFiles([]);
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Persist with first file info for backwards compat
    const firstFile = currentPendingFiles[0];
    persistMessage("user", displayText, firstFile ? {
      type: firstFile.type,
      url: firstFile.url,
      name: firstFile.name,
      mimeType: firstFile.mimeType,
    } : undefined);

    let assistantSoFar = "";

    // Build API messages: send multimodal content for current message, text-only for history
    const historyMsgs = messages.map(m => ({
      role: m.role,
      content: typeof m.content === "string" ? m.content : getTextContent(m.content),
    })).filter(m => typeof m.content === "string" && m.content.trim().length > 0);

    // For the current message, send the full multimodal content
    const currentApiContent = typeof userMsg.content === "string"
      ? userMsg.content
      : userMsg.content;

    const rawMsgs = [
      ...historyMsgs,
      { role: userMsg.role, content: currentApiContent },
    ].slice(-50);

    // Merge consecutive same-role text messages
    const apiMessages: { role: string; content: any }[] = [];
    for (const m of rawMsgs) {
      const last = apiMessages[apiMessages.length - 1];
      if (last && last.role === m.role && typeof last.content === "string" && typeof m.content === "string") {
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
        const parts = splitParts(assistantSoFar);
        if (parts.length === 2) {
          setMessages(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx]?.role === "assistant") {
              updated[lastIdx] = { ...updated[lastIdx], content: parts[0] };
            }
            return updated;
          });
          persistMessage("assistant", parts[0]);
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
  }, [input, isLoading, messages, persistMessage, pendingFiles]);

  // Keep ref in sync for audio recording callback
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

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

  /** Handle feedback (👍/👎) on an assistant message */
  const handleFeedback = useCallback(async (msgIndex: number, rating: number) => {
    if (!user) return;
    const msg = messages[msgIndex];
    if (!msg || msg.role !== "assistant") return;

    // Find the user question that preceded this answer
    let question = "";
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        question = getTextContent(messages[i].content);
        break;
      }
    }

    const answer = getTextContent(msg.content);
    const { clean } = parseSuggestions(answer);

    // Toggle: if same rating, remove it
    const newRating = msg.rating === rating ? 0 : rating;

    // Update local state
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, rating: newRating } : m));

    try {
      if (newRating === 0) {
        // Remove insight if rating cleared
        if (msg.id) {
          await supabase.from("chat_insights").delete().eq("id", msg.id);
        }
      } else if (msg.id) {
        // Update existing
        await supabase.from("chat_insights").update({ rating: newRating }).eq("id", msg.id);
      } else {
        // Insert new
        const { data } = await supabase.from("chat_insights").insert({
          user_id: user.id,
          question: question.slice(0, 500),
          answer: clean.slice(0, 1000),
          rating: newRating,
        }).select("id").single();
        if (data) {
          setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, id: data.id } : m));
        }
      }
      toast.success(newRating === 1 ? "Feedback salvo ✓" : newRating === -1 ? "Feedback salvo ✓" : "Feedback removido");
    } catch {
      toast.error("Erro ao salvar feedback");
    }
  }, [user, messages]);

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

  const getPlaceholder = () => {
    if (pendingFiles.some(f => f.type === "image")) return "Descreva o contexto dos prints...";
    if (pendingFiles.some(f => f.type === "audio")) return "Adicione contexto sobre os áudios...";
    if (pendingFiles.length > 0) return "Pergunte algo sobre os documentos...";
    return "Faça sua pergunta...";
  };

  const getFileIcon = (type: string) => {
    if (type === "image") return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
    if (type === "audio") return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  };

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-drawer" onClick={e => e.stopPropagation()}>
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <img src={diAvatar} alt="Di" className="ai-chat-avatar" />
            <span className="ai-chat-title">Di - Especialista em Vendas</span>
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
              <img src={diAvatar} alt="Di" className="ai-chat-empty-avatar" />
              <p>Olá! Sou a Di, sua especialista em vendas.</p>
              <p>Envie <strong>textos, áudios ou imagens</strong>. Peça scripts prontos, tire dúvidas sobre objeções ou solicite análises de propostas. Estou aqui para te apoiar em campo!</p>
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
            const imageUrls = getImageUrls(msg.content);
            const attachedFiles = getAttachedFiles(msg.content);
            const { clean } = isAssistant ? parseSuggestions(text) : { clean: text };

            return (
              <div key={i} className={`ai-chat-msg ai-chat-msg--${msg.role}`}>
                {imageUrls.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                    {imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Print enviado"
                        className="ai-chat-image"
                        style={{
                          maxWidth: imageUrls.length > 1 ? "48%" : "100%",
                          maxHeight: "240px",
                          borderRadius: "8px",
                          objectFit: "contain",
                        }}
                      />
                    ))}
                  </div>
                )}
                {attachedFiles.map((af, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: isAssistant ? "hsl(var(--muted) / 0.5)" : "hsl(var(--primary) / 0.15)",
                    marginBottom: "6px",
                    fontSize: "13px",
                  }}>
                    {getFileIcon(af.type)}
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {af.name}
                    </span>
                    {af.url && (
                      <a href={af.url} target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--primary))", fontSize: "12px", flexShrink: 0 }}>
                        Abrir
                      </a>
                    )}
                  </div>
                ))}
                {isAssistant ? (
                  <div className="ai-chat-md">
                    <ReactMarkdown>{clean}</ReactMarkdown>
                  </div>
                ) : (
                  clean && <p>{clean}</p>
                )}
                {/* Feedback buttons for assistant messages */}
                {isAssistant && !isLoading && clean && !clean.startsWith("⚠️") && (
                  <FeedbackButtons
                    rating={msg.rating}
                    onRate={(rating) => handleFeedback(i, rating)}
                  />
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

        {/* Pending files preview */}
        {pendingFiles.length > 0 && (
          <div style={{
            padding: "8px 16px",
            background: "hsl(var(--muted))",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            borderTop: "1px solid hsl(var(--border))",
            maxHeight: "140px",
            overflowY: "auto",
          }}>
            {pendingFiles.map((pf, idx) => (
              <div key={idx} style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 8px",
                borderRadius: "8px",
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                maxWidth: "200px",
              }}>
                {pf.type === "image" ? (
                  <img
                    src={pf.url}
                    alt="Preview"
                    style={{ height: "36px", width: "36px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    height: "36px",
                    width: "36px",
                    borderRadius: "4px",
                    background: "hsl(var(--primary) / 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "hsl(var(--primary))",
                    flexShrink: 0,
                  }}>
                    {getFileIcon(pf.type)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--foreground))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {pf.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "hsl(var(--muted-foreground))" }}>
                    {pf.type === "image" ? "Imagem" : pf.type === "audio" ? "Áudio" : "Documento"}
                  </div>
                </div>
                <button
                  onClick={() => setPendingFiles(prev => prev.filter((_, i) => i !== idx))}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "hsl(var(--muted-foreground))",
                    fontSize: "14px",
                    padding: "2px",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                  aria-label="Remover arquivo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="ai-chat-input-area">
          {/* Hidden file inputs for each type */}
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple style={{ display: "none" }} onChange={handleFileSelect} />
          <input ref={audioInputRef} type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/x-m4a,audio/mp4,audio/webm" multiple style={{ display: "none" }} onChange={handleFileSelect} />
          <input ref={docInputRef} type="file" accept="application/pdf,text/plain,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple style={{ display: "none" }} onChange={handleFileSelect} />

          {/* WhatsApp-style attach menu v2 */}
          <div style={{ position: "relative", flexShrink: 0 }} ref={attachMenuRef}>
            {attachMenuOpen && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 14px)",
                left: 0,
                background: "linear-gradient(160deg, rgba(20, 18, 14, 0.98), rgba(12, 11, 9, 0.99))",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "18px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(191,163,107,0.2), inset 0 1px 0 rgba(191,163,107,0.08)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                minWidth: "210px",
                zIndex: 100,
                animation: "attachMenuIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                {/* Foto */}
                <button
                  onClick={() => { imageInputRef.current?.click(); setAttachMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "11px 14px", border: "none", background: "transparent",
                    cursor: "pointer", borderRadius: "12px", fontSize: "14px",
                    color: "#f0e6d2", width: "100%", textAlign: "left",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(191,163,107,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #A47B3B, #D4A853)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: "0 4px 12px rgba(164,123,59,0.35)",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </span>
                  <div>
                    <span style={{ fontWeight: 600, display: "block", letterSpacing: "0.01em" }}>Foto / Imagem</span>
                    <span style={{ fontSize: "11px", color: "rgba(240,230,210,0.5)", marginTop: "1px", display: "block" }}>JPG, PNG, WebP, GIF</span>
                  </div>
                </button>

                <div style={{ height: "1px", background: "rgba(191,163,107,0.1)", margin: "2px 14px" }} />

                {/* Documento */}
                <button
                  onClick={() => { docInputRef.current?.click(); setAttachMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "11px 14px", border: "none", background: "transparent",
                    cursor: "pointer", borderRadius: "12px", fontSize: "14px",
                    color: "#f0e6d2", width: "100%", textAlign: "left",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(191,163,107,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B7355, #BFA36B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: "0 4px 12px rgba(139,115,85,0.35)",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </span>
                  <div>
                    <span style={{ fontWeight: 600, display: "block", letterSpacing: "0.01em" }}>Documento</span>
                    <span style={{ fontSize: "11px", color: "rgba(240,230,210,0.5)", marginTop: "1px", display: "block" }}>PDF, DOCX, TXT, CSV</span>
                  </div>
                </button>

                <div style={{ height: "1px", background: "rgba(191,163,107,0.1)", margin: "2px 14px" }} />

                {/* Áudio */}
                <button
                  onClick={() => { audioInputRef.current?.click(); setAttachMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "11px 14px", border: "none", background: "transparent",
                    cursor: "pointer", borderRadius: "12px", fontSize: "14px",
                    color: "#f0e6d2", width: "100%", textAlign: "left",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(191,163,107,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #6B5D3E, #A4893B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: "0 4px 12px rgba(107,93,62,0.35)",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                    </svg>
                  </span>
                  <div>
                    <span style={{ fontWeight: 600, display: "block", letterSpacing: "0.01em" }}>Áudio</span>
                    <span style={{ fontSize: "11px", color: "rgba(240,230,210,0.5)", marginTop: "1px", display: "block" }}>MP3, WAV, M4A, OGG</span>
                  </div>
                </button>
              </div>
            )}

            <button
              onClick={() => setAttachMenuOpen(!attachMenuOpen)}
              disabled={isLoading || isUploadingFile}
              title="Anexar arquivo"
              style={{
                background: "none",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                padding: "6px",
                color: attachMenuOpen || pendingFiles.length > 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                display: "flex",
                alignItems: "center",
                opacity: isLoading ? 0.5 : 1,
                flexShrink: 0,
                transition: "transform 0.2s, color 0.2s",
                transform: attachMenuOpen ? "rotate(45deg)" : "none",
              }}
            >
              {isUploadingFile ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </button>
          </div>

          {/* Recording UI */}
          {isRecording ? (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: "10px",
              padding: "0 8px",
            }}>
              <button
                onClick={cancelRecording}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "hsl(var(--destructive))", fontSize: "20px", padding: "4px",
                  flexShrink: 0,
                }}
                title="Cancelar gravação"
              >✕</button>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: "hsl(var(--destructive))",
                  animation: "pulse 1.2s infinite",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: "14px", color: "hsl(var(--foreground))",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {Math.floor(recordingDuration / 60).toString().padStart(2, "0")}:{(recordingDuration % 60).toString().padStart(2, "0")}
                </span>
                <span style={{ fontSize: "13px", color: "hsl(var(--muted-foreground))" }}>
                  Gravando...
                </span>
              </div>
              <button
                onClick={stopRecording}
                style={{
                  background: "linear-gradient(135deg, #A47B3B, #D4A853)",
                  border: "none", borderRadius: "50%",
                  width: "38px", height: "38px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(164,123,59,0.4)",
                  flexShrink: 0,
                }}
                title="Enviar gravação"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <textarea
                ref={inputRef}
                className="ai-chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getPlaceholder()}
                rows={1}
                disabled={isLoading}
              />
              {/* Show send button when there's text/files, mic button when empty */}
              {(input.trim() || pendingFiles.length > 0) ? (
                <button className="ai-chat-send" onClick={() => sendMessage(input)} disabled={isLoading}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              ) : (
                <button
                  className="ai-chat-send"
                  onClick={startRecording}
                  disabled={isLoading || isUploadingFile}
                  title="Gravar áudio"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;
