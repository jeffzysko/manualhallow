export interface ChapterInfo {
  id: string;
  label: string;
  color: string;
}

const CHAPTERS: ChapterInfo[] = [
  { id: "ch1", label: "01 · O Jogo do Premium", color: "var(--ch1)" },
  { id: "ch2", label: "02 · Diagnóstico", color: "var(--ch2)" },
  { id: "ch3", label: "03 · Espelhamento", color: "var(--ch3)" },
  { id: "ch4", label: "04 · Escada do SIM", color: "var(--ch4)" },
  { id: "ch5", label: "05 · Valor & Preço", color: "var(--ch5)" },
  { id: "ch6", label: "06 · Persuasão", color: "var(--ch6)" },
  { id: "ch7", label: "07 · Fechamento", color: "var(--ch7)" },
  { id: "ch8", label: "08 · Experiência", color: "var(--ch8)" },
  { id: "ch9", label: "09 · Planejamento", color: "var(--ch1)" },
];

export const CHAPTER_NAMES: Record<string, string> = Object.fromEntries(
  CHAPTERS.map(ch => [ch.id, ch.label])
);

export interface TOCItem {
  num: string;
  title: string;
  desc: string;
  target: string;
  color: string;
}

export const TOC_ITEMS: TOCItem[] = [
  { num: "01", title: "O Jogo do Premium", desc: "Como vender 2× mais caro sem discutir preço. A fórmula das 3 certezas.", target: "ch1", color: "var(--ch1)" },
  { num: "02", title: "Diagnóstico", desc: "Descubra o que o cliente realmente quer sem parecer interrogatório.", target: "ch2", color: "var(--ch2)" },
  { num: "03", title: "Espelhamento", desc: "Como gerar confiança em minutos sem soar artificial.", target: "ch3", color: "var(--ch3)" },
  { num: "04", title: "Escada do SIM", desc: "Microcompromissos que aceleram a decisão sem pressão.", target: "ch4", color: "var(--ch4)" },
  { num: "05", title: "Valor & Preço Premium", desc: "Como sustentar preço premium com clareza e segurança.", target: "ch5", color: "var(--ch5)" },
  { num: "06", title: "Persuasão Ética", desc: "Influência ética: comportamento, contexto e gatilhos.", target: "ch6", color: "var(--ch6)" },
  { num: "07", title: "Fechamento", desc: "Conduza para a decisão por telefone e WhatsApp.", target: "ch7", color: "var(--ch7)" },
  { num: "08", title: "Experiência & Fidelização", desc: "Atendimento que vira indicação. Os 7 pontos de ouro.", target: "ch8", color: "var(--ch8)" },
  { num: "ACC", title: "Acessórios & Upsell", desc: "Cascata, LED, clorador, aquecimento, borda. Como oferecer sem parecer empurrador.", target: "choa", color: "var(--ch6)" },
  { num: "09", title: "Metas 2026", desc: "Planejamento, rotina, números e execução prática.", target: "ch9", color: "var(--ch1)" },
  { num: "E1", title: "Banco de Provas Sociais", desc: "4 perfis de cliente com relatos prontos, template universal e quando usar cada caso.", target: "chps", color: "var(--green)" },
  { num: "E2", title: "Objeções de Acessórios", desc: "LED, clorador, aquecimento, cascata e borda — resposta certa para cada resistência.", target: "choa-obj", color: "var(--ch6)" },
  { num: "E3", title: "Reativação de Lead Frio", desc: "5 scripts por situação + cadência de 4 tentativas sem soar desesperado.", target: "chlf", color: "var(--ch5)" },
  { num: "E4", title: "Guia de Fotos para Diagnóstico", desc: "As 5 fotos essenciais, como pedir, o que analisar e sinais de alerta.", target: "chgf", color: "var(--blue)" },
  { num: "E5", title: "Template de Proposta Padrão", desc: "Estrutura em 6 blocos com modelo preenchível pronto para usar.", target: "chtp", color: "var(--gold)" },
];

export default CHAPTERS;
