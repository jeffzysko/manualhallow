interface ManualTOCProps {
  onNavigate: (target: string) => void;
}

const tocItems = [
  { num: "01", title: "O Jogo do Premium", desc: "Como vender 2× mais caro sem discutir preço. A fórmula das 3 certezas.", target: "ch1", color: "var(--ch1)" },
  { num: "02", title: "Diagnóstico", desc: "Descubra o que o cliente realmente quer sem parecer interrogatório.", target: "ch2", color: "var(--ch2)" },
  { num: "03", title: "Espelhamento", desc: "Como gerar confiança em minutos sem soar artificial.", target: "ch3", color: "var(--ch3)" },
  { num: "04", title: "Escada do SIM", desc: "Microcompromissos que aceleram a decisão sem pressão.", target: "ch4", color: "var(--ch4)" },
  { num: "05", title: "Valor & Preço Premium", desc: "Como sustentar preço premium com clareza e segurança.", target: "ch5", color: "var(--ch5)" },
  { num: "06", title: "Persuasão Ética", desc: "Influência ética: comportamento, contexto e gatilhos.", target: "ch6", color: "var(--ch6)" },
  { num: "07", title: "Fechamento", desc: "Conduza para a decisão por telefone e WhatsApp.", target: "ch7", color: "var(--ch7)" },
  { num: "08", title: "Experiência & Fidelização", desc: "Atendimento que vira indicação. Os 7 pontos de ouro.", target: "ch8", color: "var(--ch8)" },
  { num: "ACC", title: "Acessórios & Upsell", desc: "Cascata, LED, clorador, aquecimento, borda. Como oferecer sem parecer empurrador.", target: "chacc", color: "var(--ch6)" },
  { num: "09", title: "Metas 2026", desc: "Planejamento, rotina, números e execução prática.", target: "ch9", color: "var(--ch1)" },
  { num: "E1", title: "Banco de Provas Sociais", desc: "4 perfis de cliente com relatos prontos, template universal e quando usar cada caso.", target: "chps", color: "var(--green)" },
  { num: "E2", title: "Objeções de Acessórios", desc: "LED, clorador, aquecimento, cascata e borda — resposta certa para cada resistência.", target: "choa", color: "var(--ch6)" },
  { num: "E3", title: "Reativação de Lead Frio", desc: "5 scripts por situação + cadência de 4 tentativas sem soar desesperado.", target: "chlf", color: "var(--ch5)" },
  { num: "E4", title: "Guia de Fotos para Diagnóstico", desc: "As 5 fotos essenciais, como pedir, o que analisar e sinais de alerta.", target: "chgf", color: "var(--blue)" },
  { num: "E5", title: "Template de Proposta Padrão", desc: "Estrutura em 6 blocos com modelo preenchível pronto para usar.", target: "chtp", color: "var(--gold)" },
];

const ManualTOC = ({ onNavigate }: ManualTOCProps) => (
  <section id="toc">
    <div className="page-wrap">
      <div className="toc-header">
        <div className="ornament mb-16" style={{ marginBottom: 24 }}><span>ÍNDICE</span></div>
        <h2>O que você vai <em>dominar</em></h2>
      </div>

      <div className="toc-grid">
        {tocItems.map(item => (
          <a
            key={item.target}
            className="toc-item"
            style={{ "--item-color": item.color } as React.CSSProperties}
            onClick={(e) => { e.preventDefault(); onNavigate(item.target); }}
            href={`#${item.target}`}
          >
            <span className="toc-num">{item.num}</span>
            <div className="toc-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
            <span className="toc-arrow">→</span>
          </a>
        ))}
      </div>

      <div className="note-box">
        <div className="note-icon">⚠️</div>
        <p><strong>Escopo da Splash:</strong> A Splash vende e realiza a instalação da piscina. Itens fora do escopo — paisagismo, revestimentos, decks, iluminação, mobiliário — são responsabilidade do cliente. Etapas de obra civil (contrapiso, preparação do terreno, elétrica/hidráulica externa) também ficam por conta do cliente; <strong>nós orientamos o necessário para a instalação ocorrer com segurança.</strong></p>
      </div>
    </div>
  </section>
);

export default ManualTOC;
