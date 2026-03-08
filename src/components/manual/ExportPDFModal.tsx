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

// Static chapter summaries for PDF (DOM may not be expanded)
const CHAPTER_SUMMARIES: Record<string, string[]> = {
  ch1: [
    "O cliente não compra produto — compra risco evitado e previsibilidade.",
    "Preço premium se sustenta quando o valor percebido supera a âncora de custo.",
    "Nunca entre na guerra de preço; entre na lógica risco × transformação.",
    "As 3 Certezas: certeza no produto, certeza no vendedor, certeza no momento.",
    "Quem vende premium não desconta — demonstra que o custo de NÃO comprar é maior.",
  ],
  ch2: [
    "Diagnóstico bom = entender cenário + critério de decisão + próximo passo.",
    "Use SPIN: Situação → Problema → Implicação → Ganho.",
    "Follow-up sempre com avanço de valor, nunca com 'e aí?'.",
    "Perguntas abertas extraem mais informação que perguntas fechadas.",
    "Documente tudo: cada detalhe vira argumento na proposta.",
  ],
  ch3: [
    "Espelhamento acontece em 3 níveis: palavras, ritmo e emoção.",
    "Reflita o vocabulário e tom do cliente para gerar confiança em minutos.",
    "Espelhar é entender, não manipular — faça com ética.",
    "Adapte o canal: WhatsApp pede objetividade, telefone permite mais rapport.",
    "Valide antes de avançar: 'Entendi certo que...' cria conexão.",
  ],
  ch4: [
    "Microcompromissos reduzem resistência e tornam o 'sim' final natural.",
    "Cada confirmação pequena gera consistência psicológica.",
    "Use a técnica Rotular + Validar + Perguntar em cada interação.",
    "Nunca pule etapas — a escada funciona degrau por degrau.",
    "O 'sim' final é consequência de vários 'sims' menores.",
  ],
  ch5: [
    "Preço só entra quando já existe: cenário + critério + encaixe.",
    "Ancoragem positiva antes do valor: mostre o que está incluso primeiro.",
    "Use a fórmula: custo da inação > investimento na solução.",
    "Nunca apresente preço isolado — sempre dentro de um contexto de valor.",
    "Parcelamento e condições são ferramentas, não concessões.",
  ],
  ch6: [
    "Reciprocidade, prova social e escassez são os 3 gatilhos mais eficazes.",
    "Urgência real (agenda limitada) funciona melhor que pressão artificial.",
    "Autoridade se constrói com dados e cases, não com autopromoção.",
    "Gatilho mental não é frase mágica — é estrutura de comunicação.",
    "Persuasão ética = ajudar o cliente a decidir com segurança.",
  ],
  ch7: [
    "Fechamento premium = próximo passo claro, não pedido de compra.",
    "Os 3 melhores: por próximo passo, por escolha, por resumo.",
    "Nunca deixe o cliente sem saber o que fazer depois.",
    "Objeção não é rejeição — é pedido de mais informação.",
    "Silencie após apresentar: quem fala primeiro perde poder de negociação.",
  ],
  ch8: [
    "Pós-venda gera recompra e indicações — é o início do próximo ciclo.",
    "Follow-up de entrega cria confiança e previne cancelamentos.",
    "Cada cliente satisfeito vale 3 indicações em média.",
    "Os 7 pontos de ouro: boas-vindas, acompanhamento, entrega, check-in, feedback, indicação, recompra.",
    "Experiência premium é consistência em cada ponto de contato.",
  ],
  ch9: [
    "Metas claras geram foco — sem meta, sem direção.",
    "Acompanhe semanalmente, não apenas no final do mês.",
    "Celebre conquistas intermediárias para manter motivação.",
    "Foque em taxa de avanço por etapa do funil.",
    "Planeje por trimestre, execute por semana, revise diariamente.",
  ],
};

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

    try {
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
      doc.text(`Exportado por: ${userName}`, pageW / 2, pageH / 2 + 15, { align: "center" });
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
        doc.text(ch.title, margin + 12, y);
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

        // Try DOM content first, fallback to static summaries
        const el = document.getElementById(chapter.target);
        let hasContent = false;

        if (el) {
          const textEls = el.querySelectorAll("p, li, h3, h4, blockquote");
          if (textEls.length > 5) {
            hasContent = true;
            for (const textEl of textEls) {
              const text = textEl.textContent?.trim();
              if (!text || text.length < 3) continue;

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
                const lines = doc.splitTextToSize(`  - ${text}`, contentW - 6);
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
        }

        // Fallback: static summary content
        if (!hasContent) {
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
            const lines = doc.splitTextToSize(note.content, contentW - 4);
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
    }
  }, [selected, includeNotes, user]);

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
