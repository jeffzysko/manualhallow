import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TOC_ITEMS } from "@/data/chapters";
import { jsPDF } from "jspdf";
import HiddenChapterRenderer from "./pdf/HiddenChapterRenderer";
import { extractBlocks, renderBlocksToPDF, sanitize, C, paintBg, addPage, checkSpace, drawGoldLine, type PDFCtx } from "./pdf/pdfRenderer";

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
  const [renderForPDF, setRenderForPDF] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const pendingGenerateRef = useRef(false);

  // When renderForPDF becomes true and DOM is ready, proceed with generation
  useEffect(() => {
    if (!renderForPDF || !pendingGenerateRef.current) return;
    // Wait for lazy components to load
    const timer = setTimeout(() => {
      pendingGenerateRef.current = false;
      actuallyGeneratePDF();
    }, 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderForPDF]);

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

  const generatePDF = useCallback(() => {
    if (selected.size === 0 || !user) return;
    setGenerating(true);
    pendingGenerateRef.current = true;
    setRenderForPDF(true);
  }, [selected, user]);

  const actuallyGeneratePDF = useCallback(async () => {
    if (!user) return;
    console.log("[PDF] Starting generation...");

    try {

      // Step 2: Fetch notes
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

      // Step 3: Build PDF
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = pageW - margin * 2;
      const ctx: PDFCtx = { doc, y: margin, margin, contentW, pageW, pageH };

      // ── Cover page ──
      paintBg(ctx);
      // Decorative gold line at top
      doc.setFillColor(...C.gold);
      doc.rect(0, 0, pageW, 2, "F");
      
      // Center content
      ctx.y = pageH / 2 - 35;
      // Gold ornament
      doc.setDrawColor(...C.gold);
      doc.setLineWidth(0.5);
      doc.line(pageW / 2 - 30, ctx.y, pageW / 2 + 30, ctx.y);
      ctx.y += 12;
      
      doc.setTextColor(...C.gold);
      doc.setFontSize(42);
      doc.setFont("helvetica", "bold");
      doc.text("HALLOW", pageW / 2, ctx.y, { align: "center" });
      ctx.y += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.gray);
      doc.text("C O M U N I C A C A O", pageW / 2, ctx.y, { align: "center" });
      ctx.y += 16;
      
      doc.setDrawColor(...C.gold);
      doc.setLineWidth(0.3);
      doc.line(pageW / 2 - 20, ctx.y, pageW / 2 + 20, ctx.y);
      ctx.y += 12;
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...C.white);
      doc.text("Manual de Vendas Premium", pageW / 2, ctx.y, { align: "center" });
      ctx.y += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.gray);
      doc.text("Splash Piscinas · Edicao 2026", pageW / 2, ctx.y, { align: "center" });
      ctx.y += 20;
      
      // User info
      doc.setFontSize(9);
      doc.setTextColor(...C.gray);
      const userName = user.user_metadata?.full_name || user.email || "";
      doc.text(`Exportado por: ${sanitize(userName)}`, pageW / 2, ctx.y, { align: "center" });
      ctx.y += 6;
      doc.text(
        new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
        pageW / 2, ctx.y, { align: "center" }
      );
      
      // Bottom gold line
      doc.setFillColor(...C.gold);
      doc.rect(0, pageH - 2, pageW, 2, "F");

      // ── Table of Contents ──
      addPage(ctx);
      doc.setFillColor(...C.gold);
      doc.rect(0, 0, pageW, 2, "F");
      ctx.y = margin + 5;
      
      doc.setTextColor(...C.gold);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("INDICE", margin, ctx.y);
      ctx.y += 4;
      drawGoldLine(ctx);
      ctx.y += 4;

      const selectedChapters = CHAPTER_ITEMS.filter(c => selected.has(c.target));
      for (const ch of selectedChapters) {
        // Number badge
        doc.setFillColor(...C.gold);
        doc.roundedRect(margin, ctx.y - 3, 10, 7, 1.5, 1.5, "F");
        doc.setTextColor(...C.bg);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(ch.num, margin + 5, ctx.y + 1.5, { align: "center" });
        // Title
        doc.setTextColor(...C.white);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(sanitize(ch.title), margin + 14, ctx.y + 1);
        // Dots + description
        doc.setTextColor(...C.gray);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const descText = sanitize(ch.desc).slice(0, 80);
        doc.text(descText, margin + 14, ctx.y + 6);
        ctx.y += 14;
      }

      // ── Chapters ──
      for (const chapter of selectedChapters) {
        addPage(ctx);
        // Top gold accent
        doc.setFillColor(...C.gold);
        doc.rect(0, 0, pageW, 2, "F");
        ctx.y = margin + 2;

        // Chapter number badge
        doc.setFillColor(...C.gold);
        doc.roundedRect(margin, ctx.y, 16, 16, 3, 3, "F");
        doc.setTextColor(...C.bg);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(chapter.num, margin + 8, ctx.y + 11, { align: "center" });

        // Chapter title
        doc.setTextColor(...C.white);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(sanitize(chapter.title), contentW - 22);
        doc.text(titleLines, margin + 20, ctx.y + 11);
        ctx.y += Math.max(titleLines.length * 10, 18) + 4;

        // Chapter description
        doc.setTextColor(...C.gray);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(sanitize(chapter.desc), contentW);
        doc.text(descLines, margin, ctx.y);
        ctx.y += descLines.length * 5 + 6;

        // Separator
        drawGoldLine(ctx);
        ctx.y += 4;

        // Extract and render structured blocks from DOM
        const hiddenEl = hiddenRef.current?.querySelector(`[data-chapter-id="${chapter.target}"]`) as HTMLElement | null;
        if (hiddenEl) {
          const blocks = extractBlocks(hiddenEl);
          if (blocks.length > 0) {
            renderBlocksToPDF(ctx, blocks);
          }
        }

        // ── Notes ──
        const chapterNotes = notesByChapter[chapter.target];
        if (includeNotes && chapterNotes && chapterNotes.length > 0) {
          checkSpace(ctx, 20);
          ctx.y += 6;
          doc.setDrawColor(...C.blue);
          doc.setLineWidth(0.3);
          doc.line(margin, ctx.y, margin + contentW, ctx.y);
          ctx.y += 8;

          doc.setTextColor(...C.blue);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text("Suas Anotacoes", margin, ctx.y);
          ctx.y += 8;

          for (const note of chapterNotes) {
            checkSpace(ctx, 12);
            // Note card
            const noteLines = doc.splitTextToSize(sanitize(note.content), contentW - 16);
            doc.setFontSize(9);
            const noteH = noteLines.length * 4.5 + 8;
            doc.setFillColor(18, 18, 26);
            doc.roundedRect(margin, ctx.y, contentW, noteH, 2, 2, "F");
            doc.setDrawColor(...C.blue);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin, ctx.y, contentW, noteH, 2, 2, "S");
            // Blue left accent
            doc.setFillColor(...C.blue);
            doc.rect(margin, ctx.y, 2, noteH, "F");
            
            doc.setTextColor(...C.white);
            doc.setFont("helvetica", "normal");
            doc.text(noteLines, margin + 8, ctx.y + 5);
            ctx.y += noteH + 3;
          }
        }
      }

      // ── Footer on each page ──
      const totalPages = doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        // Bottom gold line
        doc.setFillColor(...C.gold);
        doc.rect(0, pageH - 2, pageW, 2, "F");
        // Page number
        doc.setTextColor(...C.gray);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Manual Hallow  ·  Pagina ${i - 1} de ${totalPages - 1}`,
          pageW / 2, pageH - 5, { align: "center" }
        );
      }

      doc.save("Manual-Hallow.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
      setRenderForPDF(false);
    }
  }, [selected, includeNotes, user]);

  if (!open) return null;

  const selectedIds = Array.from(selected);

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
              Exportar {selected.size} capitulo{selected.size !== 1 ? "s" : ""}
            </>
          )}
        </button>
      </div>

      {renderForPDF && (
        <HiddenChapterRenderer ref={hiddenRef} chapterIds={selectedIds} />
      )}
    </div>
  );
};

export default ExportPDFModal;
