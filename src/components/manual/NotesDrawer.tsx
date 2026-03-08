import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CHAPTERS from "@/data/chapters";

interface Note {
  id: string;
  section_id: string;
  chapter_id: string;
  content: string;
  updated_at: string;
}

interface NotesDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotesDrawer = ({ open, onClose }: NotesDrawerProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeChapter, setActiveChapter] = useState("ch1");
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"edit" | "all">("edit");

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_notes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setNotes((data as Note[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (open && user) fetchNotes();
  }, [open, user, fetchNotes]);

  useEffect(() => {
    const existing = notes.find(n => n.section_id === activeChapter);
    setDraft(existing?.content || "");
  }, [activeChapter, notes]);

  const saveNote = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    if (!draft.trim()) {
      await supabase
        .from("user_notes")
        .delete()
        .eq("user_id", user.id)
        .eq("section_id", activeChapter);
      setNotes(prev => prev.filter(n => n.section_id !== activeChapter));
    } else {
      const chapterInfo = CHAPTERS.find(c => c.id === activeChapter);
      await supabase
        .from("user_notes")
        .upsert({
          user_id: user.id,
          section_id: activeChapter,
          chapter_id: chapterInfo?.label || activeChapter,
          content: draft,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,section_id" });
      await fetchNotes();
    }
    setSaving(false);
  }, [user, activeChapter, draft, fetchNotes]);

  // Auto-save
  useEffect(() => {
    if (!open || !user) return;
    const existing = notes.find(n => n.section_id === activeChapter);
    if (draft === (existing?.content || "")) return;
    const timer = setTimeout(() => { saveNote(); }, 1500);
    return () => clearTimeout(timer);
  }, [draft, open, user, activeChapter, notes, saveNote]);

  const notesForChapter = (chId: string) => notes.some(n => n.section_id === chId && n.content.trim());
  const totalNotes = notes.filter(n => n.content.trim()).length;
  const activeChapterData = CHAPTERS.find(c => c.id === activeChapter);

  if (!open) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-drawer nd-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <svg className="ai-chat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="ai-chat-title">Anotações</span>
            <span style={{ fontSize: 11, color: "var(--gray)", marginLeft: 4 }}>
              {totalNotes} nota{totalNotes !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="ai-chat-header-right">
            <button className="ai-chat-close" onClick={onClose} aria-label="Fechar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="nd-tabs">
          <button className={`nd-tab${view === "edit" ? " nd-tab--active" : ""}`} onClick={() => setView("edit")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Editar
          </button>
          <button className={`nd-tab${view === "all" ? " nd-tab--active" : ""}`} onClick={() => setView("all")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Todas ({totalNotes})
          </button>
        </div>

        {view === "edit" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Chapter chips */}
            <div className="nd-chapters">
              {CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  className={`nd-chip${activeChapter === ch.id ? " nd-chip--active" : ""}`}
                  onClick={() => setActiveChapter(ch.id)}
                  style={activeChapter === ch.id ? { borderColor: ch.color, color: ch.color, background: `color-mix(in srgb, ${ch.color} 10%, transparent)` } : undefined}
                >
                  {notesForChapter(ch.id) && (
                    <span className="nd-chip__dot" style={{ background: ch.color }} />
                  )}
                  {ch.label.split(" · ")[0]}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="nd-editor">
              <div className="nd-editor__label" style={{ color: activeChapterData?.color }}>
                <span className="nd-editor__label-line" style={{ background: activeChapterData?.color }} />
                {activeChapterData?.label}
              </div>
              <textarea
                className="nd-textarea"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Suas ideias, insights e anotações sobre este capítulo..."
                rows={10}
              />
              <div className="nd-editor__bar">
                <span className="nd-editor__status">
                  {loading ? (
                    <><span className="nd-pulse" /> Carregando...</>
                  ) : saving ? (
                    <><span className="nd-pulse nd-pulse--saving" /> Salvando...</>
                  ) : (
                    <><span className="nd-check-icon">✓</span> Salvo automaticamente</>
                  )}
                </span>
                {draft.trim() && (
                  <button className="nd-editor__delete" onClick={() => { setDraft(""); }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="nd-all">
            {totalNotes === 0 ? (
              <div className="nd-all__empty">
                <div className="nd-all__empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <p>Nenhuma anotação ainda.</p>
                <span>Selecione um capítulo e comece a escrever.</span>
              </div>
            ) : (
              notes.filter(n => n.content.trim()).map(n => {
                const ch = CHAPTERS.find(c => c.id === n.section_id);
                return (
                  <div
                    key={n.id}
                    className="nd-note-card"
                    onClick={() => { setActiveChapter(n.section_id); setView("edit"); }}
                  >
                    <div className="nd-note-card__head">
                      <span className="nd-note-card__badge" style={{ color: ch?.color, borderColor: ch?.color, background: `color-mix(in srgb, ${ch?.color || 'var(--gold)'} 10%, transparent)` }}>
                        {ch?.label.split(" · ")[0]}
                      </span>
                      <span className="nd-note-card__time">
                        {new Date(n.updated_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className="nd-note-card__chapter">{ch?.label.split(" · ")[1]}</p>
                    <p className="nd-note-card__text">{n.content.length > 120 ? n.content.slice(0, 120) + "…" : n.content}</p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesDrawer;
