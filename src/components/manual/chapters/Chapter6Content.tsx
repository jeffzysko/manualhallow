import FavoritableCard from "../FavoritableCard";

const Chapter6Content = () => (
  <>
    <h3 className="display mb-24" style={{fontSize:28, color:'var(--white)'}}>Gatilhos Mentais Mais Úteis</h3>
    <FavoritableCard id="ch6-gatilhos" label="Gatilhos Mentais Mais Úteis" chapter="Capítulo 06">
      <div className="mind-grid reveal">
        <div className="mind-card" style={{"--mind-color":"var(--ch6)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--ch6)'}}>Autoridade</span>
          <h4>Explicar processo com segurança</h4>
          <p>Sem ostentar. Sua expertise aparece na clareza das etapas e no diagnóstico preciso.</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--blue)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--blue)'}}>Prova Social</span>
          <h4>Casos reais e depoimentos</h4>
          <p>Fotos de projetos, histórias de instalações parecidas. Use com moderação — nunca exagere.</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--green)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--green)'}}>Especificidade</span>
          <h4>Inclusos, etapas e cronograma</h4>
          <p>Quanto mais específico o processo, maior a confiança. Promessas vagas são de vendedor de preço.</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--red)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--red)'}}>Escassez Real</span>
          <h4>Agenda de instalação</h4>
          <p>Só use quando for verdadeiro. "Estou fechando a agenda deste mês" — se for real, funciona.</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--gold)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--gold)'}}>Reciprocidade</span>
          <h4>Checklist de comparação justa</h4>
          <p>Orientação clara e gratuita antes de vender cria comprometimento e confiança genuína.</p>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Perfis de Cliente · Como Conduzir</h3>
    <div className="profiles-grid reveal">
      <div className="profile-card" style={{"--pc-color":"var(--blue)"} as React.CSSProperties}>
        <div className="profile-icon">📊</div><h4>Analítico</h4><p>Quer checklist e comparação detalhada.</p>
        <span className="profile-tag" style={{"--pc-color":"var(--blue)"} as React.CSSProperties}>Envie a régua</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--purple)"} as React.CSSProperties}>
        <div className="profile-icon">🎨</div><h4>Esteta</h4><p>Quer padrão e integração com a casa.</p>
        <span className="profile-tag" style={{"--pc-color":"var(--purple)"} as React.CSSProperties}>Fale de acabamento</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--red)"} as React.CSSProperties}>
        <div className="profile-icon">😤</div><h4>Traumatizado</h4><p>Já teve problema com instalação.</p>
        <span className="profile-tag" style={{"--pc-color":"var(--red)"} as React.CSSProperties}>Fale de etapas claras</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--ch5)"} as React.CSSProperties}>
        <div className="profile-icon">🤝</div><h4>Negociador</h4><p>Testa desconto e condições.</p>
        <span className="profile-tag" style={{"--pc-color":"var(--ch5)"} as React.CSSProperties}>Protocolo com calma</span>
      </div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Venda Informativa × Venda Consultiva</h3>
    <FavoritableCard id="ch6-frases-venda" label="Frases: Venda Informativa × Consultiva" chapter="Capítulo 06">
      <div className="phrases-grid reveal">
        <div className="phrases-col bad">
          <div className="phrases-col-header"><span className="phrases-col-icon">📋</span><span className="phrases-col-title">Informativa — Não Basta</span></div>
          <div className="phrase-item">Falar de modelo</div>
          <div className="phrase-item">Falar de tamanho</div>
          <div className="phrase-item">Falar de preço</div>
          <div className="phrase-item">Falar de características técnicas</div>
        </div>
        <div className="phrases-col good">
          <div className="phrases-col-header"><span className="phrases-col-icon">🎯</span><span className="phrases-col-title">Consultiva — O que Fecha</span></div>
          <div className="phrase-item">Entender cenário e uso real</div>
          <div className="phrase-item">Alinhar critério de decisão</div>
          <div className="phrase-item">Reduzir risco percebido</div>
          <div className="phrase-item">Conduzir próximo passo claro</div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Dor & Desejo · Os 5 Porquês</h3>
    <p className="prose reveal">No premium, preço só vira problema quando a transformação não está clara. Use com cuidado — não é interrogatório, é conversa.</p>
    <FavoritableCard id="ch6-5porques" label="Técnica: Os 5 Porquês" chapter="Capítulo 06">
      <div className="followup-wrap reveal">
        <div className="followup-row"><div className="fu-day" style={{fontSize:11, letterSpacing:1}}>Porquê 1</div><div className="fu-msg">"Por que você quer uma piscina agora?"</div></div>
        <div className="followup-row"><div className="fu-day" style={{fontSize:11, letterSpacing:1}}>Porquê 2</div><div className="fu-msg">"E por que isso é importante pra você / pra família?"</div></div>
        <div className="followup-row"><div className="fu-day" style={{fontSize:11, letterSpacing:1}}>Porquê 3</div><div className="fu-msg">"O que acontece se vocês não fizerem isso este ano?"</div></div>
        <div className="followup-row"><div className="fu-day" style={{fontSize:11, letterSpacing:1}}>Porquê 4</div><div className="fu-msg">"Qual é o risco/medo maior nessa compra?"</div></div>
        <div className="followup-row"><div className="fu-day" style={{fontSize:11, letterSpacing:1}}>Porquê 5</div><div className="fu-msg">"Se der tudo certo, como você quer se sentir quando estiver pronta?"</div></div>
      </div>
    </FavoritableCard>

    <div className="callout reveal mt-24">
      <p>"Não é só piscina: é <em>rotina melhor</em>, família junto e área de lazer valorizada. O caro é pagar duas vezes: manutenção, retrabalho, dor de cabeça."</p>
    </div>
  </>
);

export default Chapter6Content;
