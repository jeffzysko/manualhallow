import FavoritableCard from "../FavoritableCard";

const Chapter8Content = () => (
  <>
    <h3 className="display mb-24" style={{fontSize:28, color:'var(--white)'}}>Os 7 Pontos de Ouro da Experiência</h3>
    <div className="pontos-list reveal">
      <div className="ponto-item"><div className="ponto-num">1</div><div className="ponto-content"><h4>Resposta rápida e humana</h4><p>Primeiros 10 minutos quando possível. Velocidade de resposta muda a taxa de agendamento.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">2</div><div className="ponto-content"><h4>Clareza do processo</h4><p>O que acontece depois de cada etapa. Sem surpresas, sem "não sabia que era assim".</p></div></div>
      <div className="ponto-item"><div className="ponto-num">3</div><div className="ponto-content"><h4>Segurança técnica</h4><p>Checklists, fotos de instalação, padrões documentados — tudo que mostra profissionalismo.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">4</div><div className="ponto-content"><h4>Previsibilidade</h4><p>Prazos claros, marcos definidos, "o que pode dar errado" — antecipe, não oculte.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">5</div><div className="ponto-content"><h4>Comunicação proativa</h4><p>Avisar antes do cliente perguntar. Esse é o maior diferencial do premium.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">6</div><div className="ponto-content"><h4>Encantamento no final</h4><p>Pico e final: entrega + orientação. O cliente lembra do último momento.</p></div></div>
      <div className="ponto-item"><div className="ponto-num">7</div><div className="ponto-content"><h4>Pós-venda que gera indicação</h4><p>Mensagem nos dias 7, 30 e 90. Transforme o cliente em promotor ativo.</p></div></div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Mensagens de Pós-venda · Prontas</h3>
    <FavoritableCard id="ch8-followup-posvenda" label="Follow-up: Pós-venda D+7 a D+90" chapter="Capítulo 08">
      <div className="followup-wrap reveal">
        <div className="followup-row"><div className="fu-day">D+7</div><div className="fu-msg"><span className="fu-tag">uso</span>"Como foi a primeira semana? Alguma dúvida de uso ou manutenção?"</div></div>
        <div className="followup-row"><div className="fu-day">D+30</div><div className="fu-msg"><span className="fu-tag">avaliação</span>"O que você mais curtiu até agora? Posso te pedir uma avaliação?"</div></div>
        <div className="followup-row"><div className="fu-day">D+90</div><div className="fu-msg"><span className="fu-tag">indicação</span>"Se você indicar alguém, eu cuido pessoalmente do atendimento pra manter o padrão."</div></div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Jornada do Cliente · Identificar em 30 Segundos</h3>
    <FavoritableCard id="ch8-jornada" label="Tabela: Jornada do Cliente" chapter="Capítulo 08">
      <div className="compare-table reveal">
        <div className="compare-head">
          <div className="compare-head-cell" style={{color:'var(--gray)'}}>Sinais que ele dá</div>
          <div className="compare-head-cell" style={{color:'var(--gold)'}}>Fase onde está</div>
          <div className="compare-head-cell" style={{color:'var(--blue)'}}>O que ele precisa</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{color:'var(--gray)'}}>Faz perguntas gerais sobre opções</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>🔍 Explorando</div>
          <div className="compare-cell" style={{color:'var(--blue)'}}>Visão e exemplos inspiradores</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{color:'var(--gray)'}}>Fala "tá caro" / menciona concorrente</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>⚖️ Comparando</div>
          <div className="compare-cell" style={{color:'var(--blue)'}}>Régua de comparação justa</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{color:'var(--gray)'}}>Pergunta prazo, instalação, garantia</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>🎯 Decidindo</div>
          <div className="compare-cell" style={{color:'var(--blue)'}}>Segurança e plano de execução</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{color:'var(--gray)'}}>Pede contrato ou forma de pagamento</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>💳 Comprando</div>
          <div className="compare-cell" style={{color:'var(--blue)'}}>Clareza e agendamento rápido</div>
        </div>
      </div>
    </FavoritableCard>
  </>
);

export default Chapter8Content;
