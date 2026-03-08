import { jsPDF } from "jspdf";

// ─── Colors ───
type RGB = [number, number, number];
const C = {
  bg:       [9, 9, 15] as RGB,
  gold:     [201, 169, 106] as RGB,
  white:    [244, 240, 232] as RGB,
  gray:     [158, 154, 146] as RGB,
  darkCard: [18, 18, 26] as RGB,
  cardBorder: [40, 40, 52] as RGB,
  blue:     [91, 155, 213] as RGB,
  green:    [92, 184, 138] as RGB,
  red:      [224, 92, 92] as RGB,
  purple:   [160, 123, 224] as RGB,
  scriptBg: [14, 14, 22] as RGB,
  calloutBg:[28, 25, 18] as RGB,
};

interface PDFCtx {
  doc: jsPDF;
  y: number;
  margin: number;
  contentW: number;
  pageW: number;
  pageH: number;
}

function paintBg(ctx: PDFCtx) {
  ctx.doc.setFillColor(...C.bg);
  ctx.doc.rect(0, 0, ctx.pageW, ctx.pageH, "F");
}

function addPage(ctx: PDFCtx) {
  ctx.doc.addPage();
  paintBg(ctx);
  ctx.y = ctx.margin;
}

function checkSpace(ctx: PDFCtx, needed: number) {
  if (ctx.y + needed > ctx.pageH - ctx.margin - 10) addPage(ctx);
}

/** Sanitize text: remove emojis and non-latin chars that Helvetica can't render */
export function sanitize(text: string): string {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u2600-\u27BF\u2B50\u2B55\u23CF\u23E9-\u23F3\u23F8-\u23FA\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2602-\u2605\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665-\u2666\u2668\u267B\u267E-\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26A7\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF]/g, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u200D]/g, "")
    .replace(/[❌✅✨🚫]/g, "")
    .trim();
}

// ─── Structured content extraction from DOM ───

interface ContentBlock {
  type: "h3" | "h4" | "p" | "callout" | "step" | "script-dialog" | "card-grid" | "compare-table" | "followup" | "list-item" | "numbered-point" | "phrase-columns" | "cert-grid" | "mind-grid" | "check-card";
  text?: string;
  items?: any[];
}

/** Extract structured blocks from a chapter DOM element */
export function extractBlocks(container: HTMLElement): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  
  // Walk direct and nested children in order
  const walker = (root: HTMLElement) => {
    for (const child of Array.from(root.children) as HTMLElement[]) {
      const cls = child.className || "";
      const tag = child.tagName.toLowerCase();
      
      // Key phrase / callout
      if (cls.includes("key-phrase") || cls.includes("callout")) {
        blocks.push({ type: "callout", text: sanitize(child.textContent || "") });
        continue;
      }
      
      // H3 headings
      if (tag === "h3") {
        blocks.push({ type: "h3", text: sanitize(child.textContent || "") });
        continue;
      }
      
      // Prose paragraphs
      if (tag === "p" && cls.includes("prose")) {
        blocks.push({ type: "p", text: sanitize(child.textContent || "") });
        continue;
      }
      
      // Steps
      if (cls.includes("steps")) {
        const steps: { num: string; title: string; desc: string }[] = [];
        child.querySelectorAll(".step").forEach(s => {
          steps.push({
            num: sanitize(s.querySelector(".step-num")?.textContent || ""),
            title: sanitize(s.querySelector("h4")?.textContent || ""),
            desc: sanitize(s.querySelector("p")?.textContent || ""),
          });
        });
        if (steps.length) blocks.push({ type: "step", items: steps });
        continue;
      }
      
      // Profiles grid (card grid)
      if (cls.includes("profiles-grid")) {
        const cards: { title: string; desc: string; tag?: string }[] = [];
        child.querySelectorAll(".profile-card").forEach(c => {
          cards.push({
            title: sanitize(c.querySelector("h4")?.textContent || ""),
            desc: sanitize(c.querySelector("p")?.textContent || ""),
            tag: sanitize(c.querySelector(".profile-tag")?.textContent || ""),
          });
        });
        if (cards.length) blocks.push({ type: "card-grid", items: cards });
        continue;
      }
      
      // Cert grid
      if (cls.includes("cert-grid")) {
        const cards: { title: string; desc: string }[] = [];
        child.querySelectorAll(".cert-card").forEach(c => {
          cards.push({
            title: sanitize(c.querySelector("h4")?.textContent || ""),
            desc: sanitize(c.querySelector("p")?.textContent || ""),
          });
        });
        if (cards.length) blocks.push({ type: "cert-grid", items: cards });
        continue;
      }
      
      // Mind grid
      if (cls.includes("mind-grid")) {
        const cards: { tag: string; title: string; desc: string }[] = [];
        child.querySelectorAll(".mind-card").forEach(c => {
          cards.push({
            tag: sanitize(c.querySelector(".mind-card-tag")?.textContent || ""),
            title: sanitize(c.querySelector("h4")?.textContent || ""),
            desc: sanitize(c.querySelector("p")?.textContent || ""),
          });
        });
        if (cards.length) blocks.push({ type: "mind-grid", items: cards });
        continue;
      }
      
      // Pontos list (numbered points)
      if (cls.includes("pontos-list")) {
        const items: { title: string; desc: string }[] = [];
        child.querySelectorAll(".ponto-item").forEach(p => {
          items.push({
            title: sanitize(p.querySelector("h4")?.textContent || ""),
            desc: sanitize(p.querySelector("p")?.textContent || ""),
          });
        });
        if (items.length) blocks.push({ type: "numbered-point", items });
        continue;
      }
      
      // Compare table
      if (cls.includes("compare-table") || child.querySelector(".compare-table")) {
        const table = cls.includes("compare-table") ? child : child.querySelector(".compare-table") as HTMLElement;
        if (table) {
          const heads: string[] = [];
          table.querySelectorAll(".compare-head-cell").forEach(h => heads.push(sanitize(h.textContent || "")));
          const rows: string[][] = [];
          table.querySelectorAll(".compare-row").forEach(r => {
            const cells: string[] = [];
            r.querySelectorAll(".compare-cell").forEach(c => cells.push(sanitize(c.textContent || "")));
            rows.push(cells);
          });
          blocks.push({ type: "compare-table", items: [{ heads, rows }] });
        }
        continue;
      }
      
      // Follow-up
      if (cls.includes("followup-wrap") || child.querySelector(".followup-wrap")) {
        const wrap = cls.includes("followup-wrap") ? child : child.querySelector(".followup-wrap") as HTMLElement;
        if (wrap) {
          const items: { day: string; msg: string }[] = [];
          wrap.querySelectorAll(".followup-row").forEach(r => {
            items.push({
              day: sanitize(r.querySelector(".fu-day")?.textContent || ""),
              msg: sanitize(r.querySelector(".fu-msg")?.textContent || ""),
            });
          });
          if (items.length) blocks.push({ type: "followup", items });
        }
        continue;
      }
      
      // Script dialog
      if (cls.includes("card-script") || child.querySelector(".card-script")) {
        const script = cls.includes("card-script") ? child : child.querySelector(".card-script") as HTMLElement;
        if (script) {
          const title = sanitize(script.querySelector(".card-script-header span")?.textContent || "Script");
          const lines: { who: string; text: string; isClient: boolean }[] = [];
          script.querySelectorAll(".script-line").forEach(l => {
            const whoEl = l.querySelector(".script-who");
            const textEl = l.querySelector(".script-text");
            lines.push({
              who: sanitize(whoEl?.textContent || ""),
              text: sanitize(textEl?.textContent || ""),
              isClient: whoEl?.className?.includes("cliente") || false,
            });
          });
          blocks.push({ type: "script-dialog", text: title, items: lines });
        }
        continue;
      }
      
      // Audio card (similar to script)
      if (cls.includes("card-audio") || child.querySelector(".card-audio")) {
        const audio = cls.includes("card-audio") ? child : child.querySelector(".card-audio") as HTMLElement;
        if (audio) {
          const titleEl = audio.querySelector("span[style]") || audio.querySelector("h4");
          const title = sanitize(titleEl?.textContent || "Script");
          const lines: { who: string; text: string; isClient: boolean }[] = [];
          audio.querySelectorAll(".script-line").forEach(l => {
            const whoEl = l.querySelector(".script-who");
            const textEl = l.querySelector(".script-text");
            lines.push({
              who: sanitize(whoEl?.textContent || ""),
              text: sanitize(textEl?.textContent || ""),
              isClient: whoEl?.className?.includes("cliente") || false,
            });
          });
          if (lines.length) blocks.push({ type: "script-dialog", text: title, items: lines });
        }
        continue;
      }
      
      // Phrases grid
      if (cls.includes("phrases-grid")) {
        const cols: { title: string; items: string[] }[] = [];
        child.querySelectorAll(".phrases-col").forEach(col => {
          const colTitle = sanitize(col.querySelector(".phrases-col-title")?.textContent || "");
          const phrases: string[] = [];
          col.querySelectorAll(".phrase-item").forEach(p => phrases.push(sanitize(p.textContent || "")));
          cols.push({ title: colTitle, items: phrases });
        });
        if (cols.length) blocks.push({ type: "phrase-columns", items: cols });
        continue;
      }
      
      // Check card
      if (cls.includes("card-check")) {
        const title = sanitize(child.querySelector("h4")?.textContent || "");
        const items: string[] = [];
        child.querySelectorAll(".check-text").forEach(t => items.push(sanitize(t.textContent || "")));
        if (items.length) blocks.push({ type: "check-card", text: title, items });
        continue;
      }
      
      // Obj card
      if (cls.includes("card-obj") || child.querySelector(".card-obj")) {
        const obj = cls.includes("card-obj") ? child : child.querySelector(".card-obj") as HTMLElement;
        if (obj) {
          const title = sanitize(obj.querySelector("h4")?.textContent || "");
          const q = sanitize(obj.querySelector(".obj-q")?.textContent || "");
          const branches: string[] = [];
          obj.querySelectorAll(".obj-branch-text").forEach(b => branches.push(sanitize(b.textContent || "")));
          blocks.push({ type: "callout", text: `${title}\n${q}\n${branches.join("\n")}` });
        }
        continue;
      }
      
      // col-2 wrapper - recurse into children
      if (cls.includes("col-2")) {
        walker(child);
        continue;
      }
      
      // FavoritableCard wrapper - recurse
      if (child.getAttribute("data-favoritable") || child.querySelector(".card-script, .compare-table, .followup-wrap, .mind-grid, .phrases-grid, .card-check, .card-obj, .card-audio")) {
        walker(child);
        continue;
      }
      
      // Generic card
      if (cls.includes("card") && !cls.includes("card-")) {
        const title = sanitize(child.querySelector("h4")?.textContent || "");
        const desc = sanitize(child.querySelector("p")?.textContent || "");
        if (title) blocks.push({ type: "card-grid", items: [{ title, desc }] });
        continue;
      }
      
      // Fallback: if it has interesting children, recurse
      if (child.children.length > 0 && !tag.match(/^(h[1-6]|p|li|span)$/)) {
        walker(child);
      }
    }
  };
  
  walker(container);
  return blocks;
}

// ─── PDF Drawing functions ───

function drawRoundedRect(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, fillColor: readonly [number, number, number], borderColor?: readonly [number, number, number]) {
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, w, h, r, r, "F");
  if (borderColor) {
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, r, r, "S");
  }
}

function drawGoldLine(ctx: PDFCtx) {
  ctx.doc.setDrawColor(...C.gold);
  ctx.doc.setLineWidth(0.3);
  ctx.doc.line(ctx.margin, ctx.y, ctx.margin + ctx.contentW, ctx.y);
  ctx.y += 6;
}

function renderH3(ctx: PDFCtx, text: string) {
  checkSpace(ctx, 16);
  ctx.y += 4;
  // Gold accent line
  ctx.doc.setFillColor(...C.gold);
  ctx.doc.rect(ctx.margin, ctx.y - 1, 3, 8, "F");
  ctx.doc.setTextColor(...C.white);
  ctx.doc.setFontSize(14);
  ctx.doc.setFont("helvetica", "bold");
  const lines = ctx.doc.splitTextToSize(text, ctx.contentW - 8);
  ctx.doc.text(lines, ctx.margin + 7, ctx.y + 5);
  ctx.y += lines.length * 7 + 6;
}

function renderH4(ctx: PDFCtx, text: string) {
  checkSpace(ctx, 12);
  ctx.y += 2;
  ctx.doc.setTextColor(...C.gold);
  ctx.doc.setFontSize(11);
  ctx.doc.setFont("helvetica", "bold");
  const lines = ctx.doc.splitTextToSize(text, ctx.contentW);
  ctx.doc.text(lines, ctx.margin, ctx.y);
  ctx.y += lines.length * 5.5 + 3;
}

function renderP(ctx: PDFCtx, text: string) {
  checkSpace(ctx, 10);
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.setFontSize(9.5);
  ctx.doc.setFont("helvetica", "normal");
  const lines = ctx.doc.splitTextToSize(text, ctx.contentW);
  ctx.doc.text(lines, ctx.margin, ctx.y);
  ctx.y += lines.length * 4.5 + 4;
}

function renderCallout(ctx: PDFCtx, text: string) {
  checkSpace(ctx, 18);
  const lines = ctx.doc.splitTextToSize(text, ctx.contentW - 20);
  ctx.doc.setFontSize(9.5);
  const boxH = Math.max(lines.length * 4.5 + 10, 14);
  drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, boxH, 3, C.calloutBg, C.gold);
  // Gold left bar
  ctx.doc.setFillColor(...C.gold);
  ctx.doc.rect(ctx.margin, ctx.y, 2.5, boxH, "F");
  ctx.doc.setTextColor(...C.white);
  ctx.doc.setFont("helvetica", "italic");
  ctx.doc.text(lines, ctx.margin + 8, ctx.y + 6);
  ctx.y += boxH + 5;
}

function renderSteps(ctx: PDFCtx, steps: { num: string; title: string; desc: string }[]) {
  for (const step of steps) {
    checkSpace(ctx, 22);
    // Step card background
    const descLines = ctx.doc.splitTextToSize(step.desc, ctx.contentW - 24);
    ctx.doc.setFontSize(9);
    const cardH = Math.max(descLines.length * 4.5 + 16, 20);
    drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, cardH, 3, C.darkCard, C.cardBorder);
    // Numbered badge
    ctx.doc.setFillColor(...C.gold);
    ctx.doc.roundedRect(ctx.margin + 5, ctx.y + 4, 10, 10, 2, 2, "F");
    ctx.doc.setTextColor(...C.bg);
    ctx.doc.setFontSize(9);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(step.num, ctx.margin + 10, ctx.y + 10.5, { align: "center" });
    // Title
    ctx.doc.setTextColor(...C.white);
    ctx.doc.setFontSize(10);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(sanitize(step.title), ctx.margin + 19, ctx.y + 10);
    // Description
    ctx.doc.setTextColor(...C.gray);
    ctx.doc.setFontSize(9);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.text(descLines, ctx.margin + 19, ctx.y + 16);
    ctx.y += cardH + 3;
  }
  ctx.y += 2;
}

function renderScriptDialog(ctx: PDFCtx, title: string, lines: { who: string; text: string; isClient: boolean }[]) {
  checkSpace(ctx, 20);
  // Calculate total height
  let tempH = 14; // header
  for (const line of lines) {
    const textLines = ctx.doc.splitTextToSize(line.text, ctx.contentW - 30);
    ctx.doc.setFontSize(9);
    tempH += textLines.length * 4.5 + 8;
  }
  
  // May need multiple pages for long scripts
  // Header
  checkSpace(ctx, Math.min(tempH, 50));
  drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, 12, 3, C.scriptBg, C.cardBorder);
  // Dots
  const dotY = ctx.y + 6;
  ctx.doc.setFillColor(224, 92, 92); ctx.doc.circle(ctx.margin + 6, dotY, 1.5, "F");
  ctx.doc.setFillColor(201, 169, 106); ctx.doc.circle(ctx.margin + 11, dotY, 1.5, "F");
  ctx.doc.setFillColor(92, 184, 138); ctx.doc.circle(ctx.margin + 16, dotY, 1.5, "F");
  // Title
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.setFontSize(8);
  ctx.doc.setFont("helvetica", "normal");
  ctx.doc.text(title, ctx.margin + 22, dotY + 1);
  ctx.y += 14;
  
  // Dialog lines
  for (const line of lines) {
    checkSpace(ctx, 14);
    const color = line.isClient ? C.gray : C.gold;
    // Who badge
    ctx.doc.setTextColor(...color);
    ctx.doc.setFontSize(7.5);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(line.who.toUpperCase(), ctx.margin + 4, ctx.y + 3);
    // Text
    ctx.doc.setTextColor(line.isClient ? C.gray : C.white);
    ctx.doc.setFontSize(9);
    ctx.doc.setFont("helvetica", "normal");
    const textLines = ctx.doc.splitTextToSize(line.text, ctx.contentW - 30);
    ctx.doc.text(textLines, ctx.margin + 4, ctx.y + 8);
    ctx.y += textLines.length * 4.5 + 8;
    // Subtle separator
    ctx.doc.setDrawColor(40, 40, 52);
    ctx.doc.setLineWidth(0.15);
    ctx.doc.line(ctx.margin + 4, ctx.y, ctx.margin + ctx.contentW - 4, ctx.y);
    ctx.y += 2;
  }
  ctx.y += 4;
}

function renderCardGrid(ctx: PDFCtx, cards: { title: string; desc: string; tag?: string }[]) {
  const colW = cards.length <= 2 ? (ctx.contentW - 4) / 2 : (ctx.contentW - 8) / 3;
  
  // Calculate max card height
  let maxH = 0;
  const cardsData = cards.map(card => {
    const titleLines = ctx.doc.splitTextToSize(card.title, colW - 12);
    ctx.doc.setFontSize(10);
    const descLines = ctx.doc.splitTextToSize(card.desc, colW - 12);
    ctx.doc.setFontSize(9);
    const h = titleLines.length * 5 + descLines.length * 4.5 + (card.tag ? 20 : 12);
    maxH = Math.max(maxH, h);
    return { ...card, titleLines, descLines };
  });
  maxH = Math.min(maxH, 60); // cap
  
  checkSpace(ctx, maxH + 4);
  
  cardsData.forEach((card, i) => {
    const x = ctx.margin + i * (colW + 4);
    drawRoundedRect(ctx.doc, x, ctx.y, colW, maxH, 3, C.darkCard, C.cardBorder);
    let cy = ctx.y + 6;
    // Title
    ctx.doc.setTextColor(...C.white);
    ctx.doc.setFontSize(10);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(card.titleLines, x + 6, cy);
    cy += card.titleLines.length * 5 + 2;
    // Desc
    ctx.doc.setTextColor(...C.gray);
    ctx.doc.setFontSize(8.5);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.text(card.descLines, x + 6, cy);
    cy += card.descLines.length * 4.5 + 2;
    // Tag
    if (card.tag) {
      ctx.doc.setTextColor(...C.gold);
      ctx.doc.setFontSize(7);
      ctx.doc.setFont("helvetica", "bold");
      ctx.doc.text(card.tag.toUpperCase(), x + 6, cy + 2);
    }
  });
  ctx.y += maxH + 5;
}

function renderCompareTable(ctx: PDFCtx, heads: string[], rows: string[][]) {
  const numCols = heads.length || (rows[0]?.length || 3);
  const colW = ctx.contentW / numCols;
  
  // Header row
  checkSpace(ctx, 12);
  drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, 9, 2, [25, 25, 35] as any, C.cardBorder);
  heads.forEach((h, i) => {
    ctx.doc.setTextColor(...C.gold);
    ctx.doc.setFontSize(8);
    ctx.doc.setFont("helvetica", "bold");
    const truncated = h.length > 25 ? h.slice(0, 22) + "..." : h;
    ctx.doc.text(truncated, ctx.margin + i * colW + 4, ctx.y + 6);
  });
  ctx.y += 11;
  
  // Data rows
  for (const row of rows) {
    // Calculate row height
    let maxLines = 1;
    const cellLines = row.map(cell => {
      const lines = ctx.doc.splitTextToSize(cell, colW - 8);
      ctx.doc.setFontSize(8);
      maxLines = Math.max(maxLines, lines.length);
      return lines;
    });
    const rowH = maxLines * 4 + 6;
    checkSpace(ctx, rowH + 2);
    
    // Alternate row bg
    drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, rowH, 1, C.darkCard);
    
    cellLines.forEach((lines, i) => {
      const isFirst = i === 0;
      ctx.doc.setTextColor(isFirst ? [...C.white] as any : [...C.gray] as any);
      ctx.doc.setFontSize(8);
      ctx.doc.setFont("helvetica", isFirst ? "bold" : "normal");
      ctx.doc.text(lines, ctx.margin + i * colW + 4, ctx.y + 4.5);
    });
    ctx.y += rowH + 1;
  }
  ctx.y += 4;
}

function renderFollowup(ctx: PDFCtx, items: { day: string; msg: string }[]) {
  for (const item of items) {
    checkSpace(ctx, 14);
    const msgLines = ctx.doc.splitTextToSize(item.msg, ctx.contentW - 28);
    ctx.doc.setFontSize(9);
    const rowH = Math.max(msgLines.length * 4.5 + 8, 14);
    
    drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, rowH, 3, C.darkCard, C.cardBorder);
    // Day badge
    ctx.doc.setFillColor(...C.gold);
    ctx.doc.roundedRect(ctx.margin + 4, ctx.y + 3, 16, 8, 2, 2, "F");
    ctx.doc.setTextColor(...C.bg);
    ctx.doc.setFontSize(7.5);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(item.day, ctx.margin + 12, ctx.y + 8.5, { align: "center" });
    // Message
    ctx.doc.setTextColor(...C.white);
    ctx.doc.setFontSize(9);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.text(msgLines, ctx.margin + 24, ctx.y + 7);
    ctx.y += rowH + 2;
  }
  ctx.y += 3;
}

function renderNumberedPoints(ctx: PDFCtx, items: { title: string; desc: string }[]) {
  items.forEach((item, i) => {
    checkSpace(ctx, 18);
    const descLines = ctx.doc.splitTextToSize(item.desc, ctx.contentW - 22);
    ctx.doc.setFontSize(9);
    const cardH = Math.max(descLines.length * 4.5 + 14, 16);
    drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, cardH, 3, C.darkCard, C.cardBorder);
    // Number
    ctx.doc.setFillColor(...C.gold);
    ctx.doc.circle(ctx.margin + 8, ctx.y + cardH / 2, 4, "F");
    ctx.doc.setTextColor(...C.bg);
    ctx.doc.setFontSize(8);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(String(i + 1), ctx.margin + 8, ctx.y + cardH / 2 + 1, { align: "center" });
    // Title
    ctx.doc.setTextColor(...C.white);
    ctx.doc.setFontSize(9.5);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(sanitize(item.title), ctx.margin + 16, ctx.y + 7);
    // Desc
    ctx.doc.setTextColor(...C.gray);
    ctx.doc.setFontSize(8.5);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.text(descLines, ctx.margin + 16, ctx.y + 12);
    ctx.y += cardH + 2;
  });
  ctx.y += 3;
}

function renderPhraseColumns(ctx: PDFCtx, cols: { title: string; items: string[] }[]) {
  const colW = (ctx.contentW - 4) / 2;
  // Calculate max height
  let maxH = 12;
  const colsData = cols.map(col => {
    let h = 12;
    col.items.forEach(p => {
      const lines = ctx.doc.splitTextToSize(p, colW - 12);
      ctx.doc.setFontSize(8.5);
      h += lines.length * 4 + 4;
    });
    maxH = Math.max(maxH, h);
    return col;
  });
  
  checkSpace(ctx, Math.min(maxH + 4, 80));
  
  colsData.forEach((col, i) => {
    const x = ctx.margin + i * (colW + 4);
    const isGood = i === 1;
    const borderCol = isGood ? C.green : C.red;
    drawRoundedRect(ctx.doc, x, ctx.y, colW, maxH, 3, C.darkCard, borderCol);
    let cy = ctx.y + 6;
    // Title
    ctx.doc.setTextColor(...borderCol);
    ctx.doc.setFontSize(9);
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text(col.title.toUpperCase(), x + 6, cy);
    cy += 7;
    // Items
    col.items.forEach(p => {
      ctx.doc.setTextColor(...C.white);
      ctx.doc.setFontSize(8.5);
      ctx.doc.setFont("helvetica", "normal");
      const lines = ctx.doc.splitTextToSize(p, colW - 12);
      // Check if we need to split across pages
      ctx.doc.text(lines, x + 6, cy);
      cy += lines.length * 4 + 4;
    });
  });
  ctx.y += maxH + 5;
}

function renderMindGrid(ctx: PDFCtx, cards: { tag: string; title: string; desc: string }[]) {
  // 2 columns
  const colW = (ctx.contentW - 4) / 2;
  for (let i = 0; i < cards.length; i += 2) {
    const pair = cards.slice(i, i + 2);
    let maxH = 0;
    const pairData = pair.map(card => {
      const descLines = ctx.doc.splitTextToSize(card.desc, colW - 12);
      ctx.doc.setFontSize(8.5);
      const h = descLines.length * 4 + 22;
      maxH = Math.max(maxH, h);
      return { ...card, descLines };
    });
    
    checkSpace(ctx, maxH + 4);
    pairData.forEach((card, j) => {
      const x = ctx.margin + j * (colW + 4);
      drawRoundedRect(ctx.doc, x, ctx.y, colW, maxH, 3, C.darkCard, C.cardBorder);
      let cy = ctx.y + 6;
      // Tag
      ctx.doc.setTextColor(...C.gold);
      ctx.doc.setFontSize(7);
      ctx.doc.setFont("helvetica", "bold");
      ctx.doc.text(card.tag.toUpperCase(), x + 6, cy);
      cy += 5;
      // Title
      ctx.doc.setTextColor(...C.white);
      ctx.doc.setFontSize(10);
      ctx.doc.setFont("helvetica", "bold");
      ctx.doc.text(sanitize(card.title), x + 6, cy);
      cy += 6;
      // Desc
      ctx.doc.setTextColor(...C.gray);
      ctx.doc.setFontSize(8.5);
      ctx.doc.setFont("helvetica", "normal");
      ctx.doc.text(card.descLines, x + 6, cy);
    });
    ctx.y += maxH + 3;
  }
  ctx.y += 3;
}

function renderCheckCard(ctx: PDFCtx, title: string, items: string[]) {
  checkSpace(ctx, 14 + items.length * 8);
  let totalH = 12;
  items.forEach(it => {
    const lines = ctx.doc.splitTextToSize(it, ctx.contentW - 20);
    ctx.doc.setFontSize(9);
    totalH += lines.length * 4.5 + 4;
  });
  
  drawRoundedRect(ctx.doc, ctx.margin, ctx.y, ctx.contentW, totalH, 3, C.darkCard, C.cardBorder);
  let cy = ctx.y + 7;
  ctx.doc.setTextColor(...C.white);
  ctx.doc.setFontSize(10);
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.text(title, ctx.margin + 6, cy);
  cy += 7;
  
  items.forEach(it => {
    // Checkbox
    ctx.doc.setFillColor(...C.gold);
    ctx.doc.roundedRect(ctx.margin + 6, cy - 2.5, 4, 4, 1, 1, "F");
    ctx.doc.setTextColor(...C.white);
    ctx.doc.setFontSize(9);
    ctx.doc.setFont("helvetica", "normal");
    const lines = ctx.doc.splitTextToSize(it, ctx.contentW - 20);
    ctx.doc.text(lines, ctx.margin + 14, cy);
    cy += lines.length * 4.5 + 4;
  });
  ctx.y += totalH + 4;
}

// ─── Main render function ───

export function renderBlocksToPDF(
  ctx: PDFCtx,
  blocks: ContentBlock[],
) {
  for (const block of blocks) {
    switch (block.type) {
      case "h3":
        renderH3(ctx, block.text!);
        break;
      case "h4":
        renderH4(ctx, block.text!);
        break;
      case "p":
        renderP(ctx, block.text!);
        break;
      case "callout":
        renderCallout(ctx, block.text!);
        break;
      case "step":
        renderSteps(ctx, block.items!);
        break;
      case "script-dialog":
        renderScriptDialog(ctx, block.text!, block.items!);
        break;
      case "card-grid":
      case "cert-grid":
        renderCardGrid(ctx, block.items!);
        break;
      case "compare-table":
        if (block.items?.[0]) renderCompareTable(ctx, block.items[0].heads, block.items[0].rows);
        break;
      case "followup":
        renderFollowup(ctx, block.items!);
        break;
      case "numbered-point":
        renderNumberedPoints(ctx, block.items!);
        break;
      case "phrase-columns":
        renderPhraseColumns(ctx, block.items!);
        break;
      case "mind-grid":
        renderMindGrid(ctx, block.items!);
        break;
      case "check-card":
        renderCheckCard(ctx, block.text!, block.items!);
        break;
      case "list-item":
        checkSpace(ctx, 8);
        ctx.doc.setTextColor(...C.white);
        ctx.doc.setFontSize(9);
        ctx.doc.setFont("helvetica", "normal");
        const liLines = ctx.doc.splitTextToSize(`  •  ${block.text}`, ctx.contentW - 6);
        ctx.doc.text(liLines, ctx.margin + 3, ctx.y);
        ctx.y += liLines.length * 4.5 + 2;
        break;
    }
  }
}

export { C, paintBg, addPage, checkSpace, drawGoldLine, type PDFCtx, type ContentBlock };
