import { useState, useRef, useEffect } from "react";
import { useUserNotes } from "@/hooks/useUserNotes";
import { useAuth } from "@/contexts/AuthContext";

interface SectionNoteProps {
  sectionId: string;
  chapterId: string;
}

const SectionNote = ({ sectionId, chapterId }: SectionNoteProps) => {
  const { user } = useAuth();
  const { content, save, saved, loading } = useUserNotes(sectionId, chapterId);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(content); }, [content]);

  if (!user) return null;

  const handleChange = (val: string) => {
    setDraft(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(val), 800);
  };

  const hasNote = content.trim().length > 0;

  return (
    <div className="section-note">
      <button
        className={`section-note__toggle${hasNote ? " section-note__toggle--active" : ""}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTimeout(() => textareaRef.current?.focus(), 100);
        }}
        title={hasNote ? "Ver anotação" : "Adicionar anotação"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        {hasNote ? "Nota" : "Anotar"}
      </button>

      {isOpen && (
        <div className="section-note__editor">
          <textarea
            ref={textareaRef}
            className="section-note__textarea"
            value={draft}
            onChange={e => handleChange(e.target.value)}
            placeholder="Escreva sua anotação pessoal aqui..."
            rows={3}
          />
          <div className="section-note__footer">
            <span className="section-note__status">
              {loading ? "Carregando..." : saved ? "✓ Salvo" : "Salvando..."}
            </span>
            {draft.trim() && (
              <button
                className="section-note__clear"
                onClick={() => { handleChange(""); setIsOpen(false); }}
              >
                Remover
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionNote;
