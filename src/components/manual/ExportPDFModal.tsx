import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TOC_ITEMS } from "@/data/chapters";
import { jsPDF } from "jspdf";
import HiddenChapterRenderer from "./pdf/HiddenChapterRenderer";

interface ExportPDFModalProps {
  open: boolean;
  onClose: () => void;
}

interface NotesByChapter {
  [chapterId: string]: { section_id: string; content: string }[];
}

const CHAPTER_ITEMS = TOC_ITEMS.filter(item => item.num.match(/^0[1-9]$/));

const CHAPTER_SUMMARIES: Record<string, string[]> = {
  ch1: [
    "O cliente nao compra produto — compra risco evitado e previsibilidade.",
    "Preco premium se sustenta quando o valor percebido supera a ancora de custo.",
    "Nunca entre na guerra de preco; entre na logica risco x transformacao.",
    "As 3 Certezas: certeza no produto, certeza no vendedor, certeza no momento.",
    "Quem vende premium nao desconta — demonstra que o custo de NAO comprar e maior.",
  ],
  ch2: [
    "Diagnostico bom = entender cenario + criterio de decisao + proximo passo.",
    "Use SPIN: Situacao -> Problema -> Implicacao -> Ganho.",
    "Follow-up sempre com avanco de valor, nunca com 'e ai?'.",
    "Perguntas abertas extraem mais informacao que perguntas fechadas.",
    "Documente tudo: cada detalhe vira argumento na proposta.",
  ],
  ch3: [
    "Espelhamento acontece em 3 niveis: palavras, ritmo e emocao.",
    "Reflita o vocabulario e tom do cliente para gerar confianca em minutos.",
    "Espelhar e entender, nao manipular — faca com etica.",
    "Adapte o canal: WhatsApp pede objetividade, telefone permite mais rapport.",
    "Valide antes de avancar: 'Entendi certo que...' cria conexao.",
  ],
  ch4: [
    "Microcompromissos reduzem resistencia e tornam o 'sim' final natural.",
    "Cada confirmacao pequena gera consistencia psicologica.",
    "Use a tecnica Rotular + Validar + Perguntar em cada interacao.",
    "Nunca pule etapas — a escada funciona degrau por degrau.",
    "O 'sim' final e consequencia de varios 'sims' menores.",
  ],
  ch5: [
    "Preco so entra quando ja existe: cenario + criterio + encaixe.",
    "Ancoragem positiva antes do valor: mostre o que esta incluso primeiro.",
    "Use a formula: custo da inacao > investimento na solucao.",
    "Nunca apresente preco isolado — sempre dentro de um contexto de valor.",
    "Parcelamento e condicoes sao ferramentas, nao concessoes.",
  ],
  ch6: [
    "Reciprocidade, prova social e escassez sao os 3 gatilhos mais eficazes.",
    "Urgencia real (agenda limitada) funciona melhor que pressao artificial.",
    "Autoridade se constroi com dados e cases, nao com autopromocao.",
    "Gatilho mental nao e frase magica — e estrutura de comunicacao.",
    "Persuasao etica = ajudar o cliente a decidir com seguranca.",
  ],
  ch7: [
    "Fechamento premium = proximo passo claro, nao pedido de compra.",
    "Os 3 melhores: por proximo passo, por escolha, por resumo.",
    "Nunca deixe o cliente sem saber o que fazer depois.",
    "Objecao nao e rejeicao — e pedido de mais informacao.",
    "Silencie apos apresentar: quem fala primeiro perde poder de negociacao.",
  ],
  ch8: [
    "Pos-venda gera recompra e indicacoes — e o inicio do proximo ciclo.",
    "Follow-up de entrega cria confianca e previne cancelamentos.",
    "Cada cliente satisfeito vale 3 indicacoes em media.",
    "Os 7 pontos de ouro: boas-vindas, acompanhamento, entrega, check-in, feedback, indicacao, recompra.",
    "Experiencia premium e consistencia em cada ponto de contato.",
  ],
  ch9: [
    "Metas claras geram foco — sem meta, sem direcao.",
    "Acompanhe semanalmente, nao apenas no final do mes.",
    "Celebre conquistas intermediarias para manter motivacao.",
    "Foque em taxa de avanco por etapa do funil.",
    "Planeje por trimestre, execute por semana, revise diariamente.",
  ],
};

/** Sanitize text: remove emojis and non-latin chars that Helvetica can't render */
function sanitize(text: string): string {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u2600-\u27BF\u2B50\u2B55\u23CF\u23E9-\u23F3\u23F8-\u23FA\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2602-\u2605\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665-\u2666\u2668\u267B\u267E-\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26A7\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF]/g, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u200D]/g, "")
    .replace(/[❌✅✨🚫]/g, "")
    .trim();
}

/** Extract structured text from a DOM container for PDF rendering */
function extractContentFromDOM(container: HTMLElement): Array<{ tag: string; text: string }> {
  const results: Array<{ tag: string; text: string }> = [];
  const selectors = "h3, h4, p, li, blockquote, .script-text, .script-who, .fu-day, .fu-msg, .fu-tag, .compare-cell, .compare-head-cell, .phrase-item, .check-text, .obj-q, .obj-branch-text, .obj-branch-if, .ponto-content h4, .ponto-content p, .audio-text, .season-strategy, .season-period, .kpi-card h4, .kpi-card p";
  
  const elements = container.querySelectorAll(selectors);
  
  for (const el of elements) {
    const text = sanitize(el.textContent?.trim() || "");
    if (!text || text.length < 2) continue;
    
    const tag = el.tagName.toLowerCase();
    const classList = el.className || "";
    
    // Classify the element
    if (tag === "h3") {
      results.push({ tag: "h3", text });
    } else if (tag === "h4") {
      results.push({ tag: "h4", text });
    } else if (tag === "blockquote" || classList.includes("callout")) {
      results.push({ tag: "quote", text });
    } else if (classList.includes("script-who")) {
      results.push({ tag: "script-who", text });
    } else if (classList.includes("script-text")) {
      results.push({ tag: "script-text", text });
    } else if (classList.includes("fu-day")) {
      results.push({ tag: "fu-day", text });
    } else if (classList.includes("fu-msg")) {
      results.push({ tag: "fu-msg", text });
    } else if (classList.includes("audio-text")) {
      results.push({ tag: "quote", text });
    } else if (classList.includes("obj-q")) {
      results.push({ tag: "quote", text });
    } else if (classList.includes("obj-branch-if")) {
      results.push({ tag: "label", text });
    } else if (classList.includes("obj-branch-text")) {
      results.push({ tag: "body", text });
    } else if (classList.includes("phrase-item")) {
      results.push({ tag: "li", text });
    } else if (classList.includes("check-text")) {
      results.push({ tag: "li", text });
    } else if (classList.includes("compare-head-cell")) {
      results.push({ tag: "th", text });
    } else if (classList.includes("compare-cell")) {
      results.push({ tag: "td", text });
    } else if (tag === "li") {
      results.push({ tag: "li", text });
    } else if (tag === "p") {
      results.push({ tag: "p", text });
    }
  }
  
  return results;
}

const ExportPDFModal = ({ open, onClose }: ExportPDFModalProps) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set(CHAPTER_ITEMS.map(c => c.target)));
  const [includeNotes, setIncludeNotes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [renderForPDF, setRenderForPDF] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const generateResolveRef = useRef<(() => void) | null>(null);

  // When hidden chapters finish rendering, resolve the promise
  useEffect(() => {
    if (!renderForPDF || !hiddenRef.current) return;
    // Wait for Suspense/lazy to load
    const timer = setTimeout(() => {
      generateResolveRef.current?.();
    }, 1500);
    return () => clearTimeout(timer);
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

  const generatePDF = useCallback(async () => {
    if (selected.size === 0 || !user) return;
    setGenerating(true);

    try {
      // Step 1: Render chapters in hidden container
      setRenderForPDF(true);
      await new Promise<void>((resolve) => {
        generateResolveRef.current = resolve;
      });

      // Step 2: Fetch notes if requested
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
      const margin = 20;
      const contentW = pageW - margin * 2;
      let y = margin;

      const paintBg = () => {
        doc.setFillColor(9, 9, 15);
        doc.rect(0, 0, pageW, pageH, "F");
      };

      const addPage = () => {
        doc.addPage();
        paintBg();
        y = margin;
      };

      const checkSpace = (needed: number) => {
        if (y + needed > pageH - margin - 10) addPage();
      };

      // ── Cover page ──
      paintBg();
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
      doc.text(`Exportado por: ${sanitize(userName)}`, pageW / 2, pageH / 2 + 15, { align: "center" });
      doc.text(
        new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
        pageW / 2,
        pageH / 2 + 22,
        { align: "center" }
      );

      // ── Table of Contents ──
      addPage();
      doc.setTextColor(201, 169, 106);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Sumario", margin, y);
      y += 12;

      const selectedChapters = CHAPTER_ITEMS.filter(c => selected.has(c.target));
      for (const ch of selectedChapters) {
        doc.setTextColor(201, 169, 106);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(ch.num, margin, y);
        doc.setTextColor(244, 240, 232);
        doc.setFont("helvetica", "normal");
        doc.text(sanitize(ch.title), margin + 12, y);
        y += 7;
      }
      y += 5;

      // ── Chapters ──
      for (const chapter of selectedChapters) {
        addPage();

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
        doc.text(sanitize(chapter.title), margin + 18, y + 10);
        y += 22;

        // Chapter description
        doc.setTextColor(158, 154, 146);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(sanitize(chapter.desc), contentW);
        doc.text(descLines, margin, y);
        y += descLines.length * 5 + 8;

        // Separator
        doc.setDrawColor(201, 169, 106);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + contentW, y);
        y += 10;

        // Try scraping from hidden renderer first
        const hiddenEl = hiddenRef.current?.querySelector(`[data-chapter-id="${chapter.target}"]`) as HTMLElement | null;
        let contentItems: Array<{ tag: string; text: string }> = [];

        if (hiddenEl) {
          contentItems = extractContentFromDOM(hiddenEl);
        }

        if (contentItems.length > 3) {
          // Render full content
          for (const item of contentItems) {
            const text = item.text;
            if (!text) continue;

            switch (item.tag) {
              case "h3": {
                checkSpace(14);
                y += 4;
                doc.setTextColor(201, 169, 106);
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                const lines = doc.splitTextToSize(text, contentW);
                doc.text(lines, margin, y);
                y += lines.length * 6 + 4;
                break;
              }
              case "h4": {
                checkSpace(12);
                y += 2;
                doc.setTextColor(220, 216, 208);
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                const lines = doc.splitTextToSize(text, contentW);
                doc.text(lines, margin, y);
                y += lines.length * 5.5 + 3;
                break;
              }
              case "quote": {
                checkSpace(12);
                doc.setTextColor(201, 169, 106);
                doc.setFontSize(9);
                doc.setFont("helvetica", "italic");
                const lines = doc.splitTextToSize(`"${text}"`, contentW - 10);
                doc.text(lines, margin + 5, y);
                y += lines.length * 4.5 + 4;
                break;
              }
              case "li": {
                checkSpace(8);
                doc.setTextColor(220, 216, 208);
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                const lines = doc.splitTextToSize(`  - ${text}`, contentW - 6);
                doc.text(lines, margin + 3, y);
                y += lines.length * 4.5 + 2;
                break;
              }
              case "script-who": {
                checkSpace(10);
                y += 2;
                doc.setTextColor(201, 169, 106);
                doc.setFontSize(8);
                doc.setFont("helvetica", "bold");
                doc.text(text.toUpperCase(), margin + 3, y);
                y += 4;
                break;
              }
              case "script-text": {
                doc.setTextColor(220, 216, 208);
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                const lines = doc.splitTextToSize(text, contentW - 10);
                doc.text(lines, margin + 6, y);
                y += lines.length * 4.5 + 3;
                break;
              }
              case "fu-day": {
                checkSpace(10);
                y += 2;
                doc.setTextColor(201, 169, 106);
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.text(text, margin + 3, y);
                y += 5;
                break;
              }
              case "fu-msg": {
                doc.setTextColor(220, 216, 208);
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                const lines = doc.splitTextToSize(text, contentW - 10);
                doc.text(lines, margin + 6, y);
                y += lines.length * 4.5 + 3;
                break;
              }
              case "label": {
                checkSpace(8);
                doc.setTextColor(91, 155, 213);
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.text(text, margin + 3, y);
                y += 5;
                break;
              }
              case "th": {
                checkSpace(8);
                doc.setTextColor(201, 169, 106);
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.text(text, margin + 3, y);
                y += 5;
                break;
              }
              case "td": {
                doc.setTextColor(200, 196, 188);
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                const lines = doc.splitTextToSize(text, contentW - 10);
                doc.text(lines, margin + 6, y);
                y += lines.length * 4.5 + 2;
                break;
              }
              default: {
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
        } else {
          // Fallback: static summary
          const summary = CHAPTER_SUMMARIES[chapter.target];
          if (summary) {
            doc.setTextColor(201, 169, 106);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Pontos-chave", margin, y);
            y += 8;

            for (const point of summary) {
              checkSpace(10);
              doc.setTextColor(220, 216, 208);
              doc.setFontSize(9);
              doc.setFont("helvetica", "normal");
              const lines = doc.splitTextToSize(`  - ${point}`, contentW - 6);
              doc.text(lines, margin + 3, y);
              y += lines.length * 4.5 + 3;
            }
          }
        }

        // ── Notes for this chapter ──
        const chapterNotes = notesByChapter[chapter.target];
        if (includeNotes && chapterNotes && chapterNotes.length > 0) {
          checkSpace(20);
          y += 6;
          doc.setDrawColor(91, 155, 213);
          doc.setLineWidth(0.3);
          doc.line(margin, y, margin + contentW, y);
          y += 8;

          doc.setTextColor(91, 155, 213);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text("Suas Anotacoes", margin, y);
          y += 8;

          for (const note of chapterNotes) {
            checkSpace(12);
            doc.setTextColor(200, 196, 188);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(sanitize(note.content), contentW - 4);
            doc.text(lines, margin + 2, y);
            y += lines.length * 4.5 + 4;
          }
        }
      }

      // ── Footer on each page (skip cover) ──
      const totalPages = doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setTextColor(100, 96, 88);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Manual Hallow  |  Pagina ${i - 1} de ${totalPages - 1}`,
          pageW / 2,
          pageH - 8,
          { align: "center" }
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

      {/* Hidden renderer: loads chapter components off-screen for PDF scraping */}
      {renderForPDF && (
        <HiddenChapterRenderer ref={hiddenRef} chapterIds={selectedIds} />
      )}
    </div>
  );
};

export default ExportPDFModal;
