import FavoritableCard from "../FavoritableCard";

const Chapter2Content = () => (
  <>
    <h3 className="display mb-24" style={{fontSize:28, color:'var(--white)'}}>3 Níveis de Cliente · Abordagem por Perfil</h3>

    <div className="col-2 reveal">
      <div className="card" style={{borderColor:'rgba(92,184,138,0.3)'}}>
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
          <div style={{background:'var(--green-dim)', color:'var(--green)', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>🔥</div>
          <div>
            <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--green)', fontWeight:700}}>Nível 1</div>
            <h4 style={{fontFamily:'Cormorant Garamond, serif', fontSize:18, color:'var(--white)'}}>Cliente Quente</h4>
          </div>
        </div>
        <p style={{fontSize:13, color:'var(--gray)', marginBottom:12}}><strong style={{color:'var(--white)'}}>Meta:</strong> Agendar visita/vídeo-chamada e fechar o modelo certo rapidamente.</p>
        <div style={{background:'rgba(92,184,138,0.06)', borderRadius:8, padding:'12px 16px', fontSize:12, color:'var(--gray)'}}>
          <strong style={{color:'var(--green)'}}>Perguntas-chave (1–2 por vez):</strong><br/>
          Espaço, prazo, quem vai usar, terreno, prioridade (praia/SPA/profundidade).
        </div>
      </div>

      <div className="card" style={{borderColor:'rgba(224,92,92,0.3)'}}>
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
          <div style={{background:'var(--red-dim)', color:'var(--red)', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>⚖️</div>
          <div>
            <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--red)', fontWeight:700}}>Nível 2</div>
            <h4 style={{fontFamily:'Cormorant Garamond, serif', fontSize:18, color:'var(--white)'}}>Comparando Preço</h4>
          </div>
        </div>
        <p style={{fontSize:13, color:'var(--gray)', marginBottom:12}}><strong style={{color:'var(--white)'}}>Meta:</strong> Tirar da comparação rasa e mudar a régua.</p>
        <div style={{background:'var(--red-dim)', borderRadius:8, padding:'12px 16px', fontSize:12, color:'var(--white)', fontStyle:'italic'}}>
          "Você está buscando o menor valor ou a instalação mais tranquila e garantida?"
        </div>
      </div>
    </div>

    <FavoritableCard id="ch2-audio-travado" label="Script: Cliente Travado (Nível 3)" chapter="Capítulo 02">
      <div className="card-audio reveal mt-16">
        <div className="card-audio-header">
          <div style={{background:'var(--purple-dim)', color:'var(--purple)', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>🧊</div>
          <div>
            <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--purple)', fontWeight:700}}>Nível 3</div>
            <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:18, color:'var(--white)', fontWeight:600}}>Cliente Travado</span>
          </div>
          <div style={{marginLeft:'auto', fontSize:12, color:'var(--gray)'}}>medo/instalação/tempo</div>
        </div>
        <p className="prose" style={{marginBottom:16}}><strong>Meta:</strong> Destravar o medo escondido. Ferramenta: perguntas de implicação (SPIN) + prova social específica.</p>
        <div className="card-script-body" style={{padding:0}}>
          <div className="script-line">
            <span className="script-who cliente">Cliente</span>
            <div className="script-text cliente">Vou pensar.</div>
          </div>
          <div className="script-line">
            <span className="script-who">Vendedor</span>
            <div className="script-text">Claro. Só pra eu entender e te ajudar sem pressão: o que mais te preocupa hoje: instalação/bagunça, prazo, ou garantia pós-instalação?</div>
          </div>
          <div className="script-line">
            <span className="script-who cliente">Cliente</span>
            <div className="script-text cliente">[responde]</div>
          </div>
          <div className="script-line">
            <span className="script-who">Vendedor</span>
            <div className="script-text">Perfeito. Então faz sentido a gente fazer o próximo passo mais seguro: uma visita rápida pra mapear o local e te passar o cronograma real. Pode ser [dia] ou [dia]?</div>
          </div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Tipos de Perguntas Abertas</h3>
    <p className="prose reveal">Pergunta aberta não é curiosidade — é ferramenta de direção. Ela faz o cliente te contar desejo, medo, critério e trava.</p>

    <FavoritableCard id="ch2-perguntas" label="Tipos de Perguntas Abertas" chapter="Capítulo 02">
      <div className="mind-grid reveal">
        <div className="mind-card" style={{"--mind-color":"var(--ch2)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--ch2)'}}>Perguntas de História</span>
          <h4>Conexão + Intenção</h4>
          <p>"O que te fez pensar em colocar piscina agora?"<br/>"O que você quer que mude na rotina?"</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--blue)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--blue)'}}>Perguntas de Futuro</span>
          <h4>Desejo</h4>
          <p>"Imagina tudo pronto: como seria um sábado perfeito aí?"<br/>"Qual sensação você quer que esse espaço passe?"</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--red)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--red)'}}>Perguntas de Risco</span>
          <h4>Medos</h4>
          <p>"O que você quer evitar a qualquer custo?"<br/>"Seu medo maior é bagunça, prazo ou custo surpresa?"</p>
        </div>
        <div className="mind-card" style={{"--mind-color":"var(--gold)"} as React.CSSProperties}>
          <span className="mind-card-tag" style={{color:'var(--gold)'}}>Perguntas de Critério</span>
          <h4>Régua de Decisão</h4>
          <p>"O que define uma compra inteligente pra você aqui?"<br/>"Se você escolher certo, o que é indispensável?"</p>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>SPIN Selling Aplicado</h3>
    <div className="steps reveal">
      <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}>
        <div className="step-num">S</div>
        <div className="step-body"><h4>Situação</h4><p>"Casa ou sítio?" · "Já tem tamanho em mente ou ainda está escolhendo?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--red-dim)","--step-border":"rgba(224,92,92,0.2)","--step-color-text":"var(--red)"} as React.CSSProperties}>
        <div className="step-num">P</div>
        <div className="step-body"><h4>Problema</h4><p>"O que mais te preocupa nessa decisão?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--purple-dim)","--step-border":"rgba(160,123,224,0.2)","--step-color-text":"var(--purple)"} as React.CSSProperties}>
        <div className="step-num">I</div>
        <div className="step-body"><h4>Implicação</h4><p>"Se atrasar, isso impacta o quê pra você?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}>
        <div className="step-num">N</div>
        <div className="step-body"><h4>Need-Payoff (Ganho)</h4><p>"Se a instalação for previsível e sem surpresa, o que isso te traz?"</p></div>
      </div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Cadência de Follow-up D+1 → D+14</h3>
    <p className="prose reveal" style={{marginBottom:20}}>Regra de ouro: follow-up sempre com <strong>avanço de valor</strong>, nunca com "e aí?".</p>
    <FavoritableCard id="ch2-followup" label="Follow-up: Cadência D+1 a D+14" chapter="Capítulo 02">
      <div className="followup-wrap reveal">
        <div className="followup-row"><div className="fu-day">D+1</div><div className="fu-msg"><span className="fu-tag">confirmação</span>"Conseguiu ver as 2 opções? Quer que eu feche a melhor pro seu espaço?"</div></div>
        <div className="followup-row"><div className="fu-day">D+3</div><div className="fu-msg"><span className="fu-tag">prova social</span>"Achei um vídeo de uma instalação parecida com a sua. Quer que eu te envie?"</div></div>
        <div className="followup-row"><div className="fu-day">D+7</div><div className="fu-msg"><span className="fu-tag">comparação</span>"Se você estiver comparando, me manda o print do que está incluso. Eu te ajudo sem pegadinha."</div></div>
        <div className="followup-row"><div className="fu-day">D+14</div><div className="fu-msg"><span className="fu-tag">agenda</span>"Estou fechando a agenda de instalação do mês. Quer garantir um encaixe ou prefere a próxima janela?"</div></div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Os 7 Mecanismos Mentais do Cliente Premium</h3>
    <p className="prose reveal">O cliente A/B+ toma decisão com emoção e justifica com razão. Ele quer sentir segurança sem ser pressionado.</p>
    <div className="pontos-list reveal">
      <div className="ponto-item"><div className="ponto-num">1</div><div className="ponto-content"><h4>Aversão a risco e perda</h4><p>O medo de instalação ruim pesa mais que o desejo de ter piscina. Venda previsibilidade.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">2</div><div className="ponto-content"><h4>Heurística de comparação</h4><p>Ele compara só por tamanho/preço. Você muda a régua para instalação/acabamento/garantia.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">3</div><div className="ponto-content"><h4>Confiança por consistência</h4><p>O cérebro confia mais quando o cliente vai concordando com verdades pequenas e óbvias.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">4</div><div className="ponto-content"><h4>Prova social e status discreto</h4><p>A/B+ busca validação: "gente do meu padrão escolhe isso". Use casos reais, sem exagero.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">5</div><div className="ponto-content"><h4>Sobrecarga de escolha</h4><p>Muitas opções travam. Mostre 2–3 caminhos no máximo, sempre com "pra quem é".</p></div></div>
      <div className="ponto-item"><div className="ponto-num">6</div><div className="ponto-content"><h4>Dor de decisão em casal</h4><p>A decisão é conjunta. Prepare uma justificativa elegante para a outra pessoa também.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">7</div><div className="ponto-content"><h4>Efeito pico e final</h4><p>Como você conduz o fechamento e o pós-venda vira reputação. O cliente lembra do final.</p></div></div>
    </div>
  </>
);

export default Chapter2Content;
