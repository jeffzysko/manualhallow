import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Note {
  id: string;
  section_id: string;
  chapter_id: string;
  content: string;
  updated_at: string;
}

const CHAPTERS = [
  { id: "ch1", label: "01 · O Jogo do Premium" },
  { id: "ch2", label: "02 · Diagnóstico" },
  { id: "ch3", label: "03 · Espelhamento" },
  { id: "ch4", label: "04 · Escada do SIM" },
  { id: "ch5", label: "05 · Valor & Preço" },
  { id: "ch6", label: "06 · Persuasão" },
  { id: "ch7", label: "07 · Fechamento" },
  { id: "ch8", label: "08 · Experiência" },
  { id: "ch9", label: "09 · Planejamento" },
];

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

  // Load draft when switching chapters
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

  // Auto-save on blur or after 1.5s idle
  useEffect(() => {
    const timer = setTimeout(() => {
      const existing = notes.find(n => n.section_id === activeChapter);
      if (draft !== (existing?.content || "")) {
        saveNote();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [draft]);

  const notesForChapter = (chId: string) => notes.some(n => n.section_id === chId && n.content.trim());

  if (!open) return null;

  return (
    <>
      <div className="notes-drawer-overlay" onClick={onClose} />
      <div className="notes-drawer">
        <div className="notes-drawer__header">
          <h3 className="notes-drawer__title">Minhas Anotações</h3>
          <button className="notes-drawer__close" onClick={onClose} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="notes-drawer__chapters">
          {CHAPTERS.map(ch => (
            <button
              key={ch.id}
              className={`notes-drawer__chip${activeChapter === ch.id ? " notes-drawer__chip--active" : ""}${notesForChapter(ch.id) ? " notes-drawer__chip--has-note" : ""}`}
              onClick={() => setActiveChapter(ch.id)}
            >
              {notesForChapter(ch.id) && <span className="notes-drawer__dot" />}
              {ch.label.split(" · ")[0]}
            </button>
          ))}
        </div>

        <div className="notes-drawer__body">
          <p className="notes-drawer__chapter-label">
            {CHAPTERS.find(c => c.id === activeChapter)?.label}
          </p>
          <textarea
            className="notes-drawer__textarea"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Escreva suas anotações sobre este capítulo..."
            rows={8}
          />
          <div className="notes-drawer__footer">
            <span className="notes-drawer__status">
              {loading ? "Carregando..." : saving ? "Salvando..." : "✓ Auto-save ativo"}
            </span>
            {draft.trim() && (
              <button className="notes-drawer__clear" onClick={() => { setDraft(""); saveNote(); }}>
                Remover nota
              </button>
            )}
          </div>
        </div>

        {/* All notes summary */}
        {notes.filter(n => n.content.trim()).length > 0 && (
          <div className="notes-drawer__summary">
            <p className="notes-drawer__summary-title">Todas as notas ({notes.filter(n => n.content.trim()).length})</p>
            {notes.filter(n => n.content.trim()).map(n => (
              <div key={n.id} className="notes-drawer__summary-item" onClick={() => setActiveChapter(n.section_id)}>
                <span className="notes-drawer__summary-chapter">{n.chapter_id}</span>
                <p className="notes-drawer__summary-text">{n.content.length > 80 ? n.content.slice(0, 80) + "..." : n.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NotesDrawer;
