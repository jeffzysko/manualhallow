import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TOC_ITEMS } from "@/data/chapters";
import { jsPDF } from "jspdf";

interface ExportPDFModalProps {
  open: boolean;
  onClose: () => void;
}

interface NotesByChapter {
  [chapterId: string]: { section_id: string; content: string }[];
}

const CHAPTER_ITEMS = TOC_ITEMS.filter(item => item.num.match(/^0[1-9]$/));

const ExportPDFModal = ({ open, onClose }: ExportPDFModalProps) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set(CHAPTER_ITEMS.map(c => c.target)));
  const [includeNotes, setIncludeNotes] = useState(true);
  const [generating, setGenerating] = useState(false);

  const toggleChapter = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === CHAPTER_ITEMS.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(CHAPTER_ITEMS.map(c => c.target)));
    }
  }, [selected.size]);

  const generatePDF = useCallback(async () => {
    if (selected.size === 0 || !user) return;
    setGenerating(true);

    // Fetch notes if requested
    let notesByChapter: NotesByChapter = {};
    if (includeNotes) {
      const { data } = await supabase
        .from("user_notes")
        .select("chapter_id, section_id, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (data) {
        data.forEach(note => {
          if (!notesByChapter[note.chapter_id]) notesByChapter[note.chapter_id] = [];
          notesByChapter[note.chapter_id].push({ section_id: note.section_id, content: note.content });
        });
      }
    }

    // Create PDF
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = margin;

    const addPage = () => {
      doc.addPage();
      y = margin;
    };

    const checkSpace = (needed: number) => {
      if (y + needed > pageH - margin) addPage();
    };

    // Cover page
    doc.setFillColor(9, 9, 15);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setTextColor(201, 169, 106);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("HALLOW", pageW / 2, pageH / 2 - 20, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(244, 240, 232);
    doc.text("Manual de Vendas Premium", pageW / 2, pageH / 2, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(158, 154, 146);
    const userName = user.user_metadata?.full_name || user.email || "";
    doc.text(`Exportado por: ${userName}`, pageW / 2, pageH / 2 + 15, { align: "center" });
    doc.text(new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }), pageW / 2, pageH / 2 + 22, { align: "center" });

    // Chapters
    const selectedChapters = CHAPTER_ITEMS.filter(c => selected.has(c.target));

    for (const chapter of selectedChapters) {
      addPage();

      // Chapter header
      doc.setFillColor(9, 9, 15);
      doc.rect(0, 0, pageW, pageH, "F");

      // Chapter number badge
      doc.setFillColor(201, 169, 106);
      doc.roundedRect(margin, y, 14, 14, 3, 3, "F");
      doc.setTextColor(9, 9, 15);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(chapter.num, margin + 7, y + 9.5, { align: "center" });

      // Chapter title
      doc.setTextColor(244, 240, 232);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(chapter.title, margin + 18, y + 10);
      y += 22;

      // Chapter description
      doc.setTextColor(158, 154, 146);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(chapter.desc, contentW);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 8;

      // Separator
      doc.setDrawColor(201, 169, 106);
      doc.setLineWidth(0.3);
      doc.line(margin, y, margin + contentW, y);
      y += 10;

      // Extract text content from DOM
      const el = document.getElementById(chapter.target);
      if (el) {
        const textEls = el.querySelectorAll("p, li, h3, h4, blockquote");
        for (const textEl of textEls) {
          const text = textEl.textContent?.trim();
          if (!text) continue;

          const tag = textEl.tagName.toLowerCase();
          if (tag === "h3" || tag === "h4") {
            checkSpace(14);
            doc.setTextColor(201, 169, 106);
            doc.setFontSize(tag === "h3" ? 13 : 11);
            doc.setFont("helvetica", "bold");
            const lines = doc.splitTextToSize(text, contentW);
            doc.text(lines, margin, y);
            y += lines.length * 6 + 4;
          } else if (tag === "blockquote") {
            checkSpace(12);
            doc.setTextColor(201, 169, 106);
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            const lines = doc.splitTextToSize(`"${text}"`, contentW - 10);
            doc.text(lines, margin + 5, y);
            y += lines.length * 4.5 + 4;
          } else if (tag === "li") {
            checkSpace(8);
            doc.setTextColor(244, 240, 232);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(`• ${text}`, contentW - 6);
            doc.text(lines, margin + 3, y);
            y += lines.length * 4.5 + 2;
          } else {
            checkSpace(8);
            doc.setTextColor(220, 216, 208);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(text, contentW);
            doc.text(lines, margin, y);
            y += lines.length * 4.5 + 3;
          }
        }
      }

      // Notes for this chapter
      const chapterNotes = notesByChapter[chapter.target];
      if (includeNotes && chapterNotes && chapterNotes.length > 0) {
        checkSpace(20);
        y += 6;
        doc.setDrawColor(100, 155, 213);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + contentW, y);
        y += 8;

        doc.setTextColor(91, 155, 213);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("📝 Suas Anotações", margin, y);
        y += 8;

        for (const note of chapterNotes) {
          checkSpace(12);
          doc.setTextColor(200, 196, 188);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(note.content, contentW - 4);
          doc.text(lines, margin + 2, y);
          y += lines.length * 4.5 + 4;
        }
      }
    }

    // Footer on each page
    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(9, 9, 15);
      doc.setTextColor(100, 96, 88);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Manual Hallow — Página ${i - 1} de ${totalPages - 1}`, pageW / 2, pageH - 8, { align: "center" });
    }

    doc.save("Manual-Hallow.pdf");
    setGenerating(false);
    onClose();
  }, [selected, includeNotes, user, onClose]);

  if (!open) return null;

  return (
    <div className="pdf-export-overlay" onClick={onClose}>
      <div className="pdf-export-modal" onClick={e => e.stopPropagation()}>
        <div className="pdf-export-header">
          <h3 className="pdf-export-title">Exportar PDF</h3>
          <button className="pdf-export-close" onClick={onClose} aria-label="Fechar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="pdf-export-desc">Selecione os capítulos para incluir no seu PDF personalizado.</p>

        <div className="pdf-export-controls">
          <button className="pdf-export-toggle-all" onClick={toggleAll}>
            {selected.size === CHAPTER_ITEMS.length ? "Desmarcar todos" : "Selecionar todos"}
          </button>
          <label className="pdf-export-notes-toggle">
            <input type="checkbox" checked={includeNotes} onChange={e => setIncludeNotes(e.target.checked)} />
            <span>Incluir anotações</span>
          </label>
        </div>

        <div className="pdf-export-chapters">
          {CHAPTER_ITEMS.map(ch => (
            <label key={ch.target} className={`pdf-export-chapter${selected.has(ch.target) ? " pdf-export-chapter--selected" : ""}`}>
              <input
                type="checkbox"
                checked={selected.has(ch.target)}
                onChange={() => toggleChapter(ch.target)}
              />
              <span className="pdf-export-chapter-num">{ch.num}</span>
              <span className="pdf-export-chapter-title">{ch.title}</span>
            </label>
          ))}
        </div>

        <button
          className="pdf-export-btn"
          onClick={generatePDF}
          disabled={generating || selected.size === 0}
        >
          {generating ? (
            <>
              <span className="pdf-export-spinner" />
              Gerando PDF...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exportar {selected.size} capítulo{selected.size !== 1 ? "s" : ""}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportPDFModal;
