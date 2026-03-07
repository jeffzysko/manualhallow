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

export default CHAPTERS;
