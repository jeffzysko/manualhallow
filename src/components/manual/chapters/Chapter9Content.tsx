const Chapter9Content = () => (
  <>
    <h3 className="display mb-24" style={{fontSize:28, color:'var(--white)'}}>KPIs Essenciais · O que Importa</h3>
    <div className="kpi-grid reveal">
      <div className="kpi-card" style={{"--kpi-bg":"var(--blue-dim)"} as React.CSSProperties}><div className="kpi-icon" style={{background:'var(--blue-dim)', fontSize:20}}>⏱️</div><h4>Tempo de 1ª Resposta</h4><p>Regra dos 5 minutos. Responder rápido muda a taxa de agendamento.</p></div>
      <div className="kpi-card" style={{"--kpi-bg":"var(--green-dim)"} as React.CSSProperties}><div className="kpi-icon" style={{background:'var(--green-dim)', fontSize:20}}>🎯</div><h4>% Diagnóstico Completo</h4><p>Conversas com cenário + critério + próximo passo definido.</p></div>
      <div className="kpi-card" style={{"--kpi-bg":"var(--gold-dim)"} as React.CSSProperties}><div className="kpi-icon" style={{background:'var(--gold-dim)', fontSize:20}}>📋</div><h4>% Propostas em 24h</h4><p>Velocidade de proposta impacta direto na taxa de fechamento.</p></div>
      <div className="kpi-card" style={{"--kpi-bg":"var(--purple-dim)"} as React.CSSProperties}><div className="kpi-icon" style={{background:'var(--purple-dim)', fontSize:20}}>📅</div><h4>% Agendamentos</h4><p>Visitas técnicas e vídeo-chamadas agendadas por semana.</p></div>
      <div className="kpi-card" style={{"--kpi-bg":"var(--red-dim)"} as React.CSSProperties}><div className="kpi-icon" style={{background:'var(--red-dim)', fontSize:20}}>🏆</div><h4>Taxa de Fechamento</h4><p>Propostas enviadas ÷ vendas fechadas. Acompanhe semanalmente.</p></div>
      <div className="kpi-card" style={{"--kpi-bg":"var(--blue-dim)"} as React.CSSProperties}><div className="kpi-icon" style={{background:'var(--blue-dim)', fontSize:20}}>⏳</div><h4>Ciclo Médio de Venda</h4><p>Dias do lead ao fechamento. Quanto menor, mais eficiente o processo.</p></div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Calendário 2026 · Sazonalidade + Estratégia</h3>
    <div className="note-box reveal" style={{marginBottom:24}}>
      <div className="note-icon">📊</div>
      <p><strong>Realidade do mercado Splash:</strong> O pico real de decisão e fechamento é <strong style={{color:'var(--gold)'}}>outubro a dezembro</strong>. Jan–Mar tende a ser baixa procura. Use os meses "frios" para nutrir e plantar semente — para colher no pico.</p>
    </div>
    <div className="season-grid reveal">
      <div className="season-card" style={{"--season-color":"#6A7080"} as React.CSSProperties}><span className="season-icon">🌧️</span><div className="season-period">Jan — Mar</div><h4>Baixa Demanda · Pós-verão</h4><div className="season-strategy"><strong style={{color:'var(--white)'}}>Foco:</strong> Reativar leads. Nutrir com conteúdo. Argumento: <em>"melhor instalar agora sem concorrer com todo mundo"</em>.</div></div>
      <div className="season-card" style={{"--season-color":"#5B9BD5"} as React.CSSProperties}><span className="season-icon">🌱</span><div className="season-period">Abr — Jun</div><h4>Retomada Gradual · Outono</h4><div className="season-strategy"><strong style={{color:'var(--white)'}}>Foco:</strong> Plantar a semente de antecipação. Scripts de urgência real: <em>"quem instala em junho garante agenda"</em>.</div></div>
      <div className="season-card" style={{"--season-color":"#A07BE0"} as React.CSSProperties}><span className="season-icon">❄️</span><div className="season-period">Jul — Set</div><h4>Pré-Temporada · Inverno</h4><div className="season-strategy"><strong style={{color:'var(--white)'}}>Foco:</strong> Antecipação + urgência de agenda. <em>"Instala agora e chega no verão com tudo pronto"</em>.</div></div>
      <div className="season-card" style={{"--season-color":"var(--gold)"} as React.CSSProperties}><span className="season-icon">🏆</span><div className="season-period">Out — Dez</div><h4>Alta Demanda · Pico de Decisão</h4><div className="season-strategy"><strong style={{color:'var(--white)'}}>Foco:</strong> Velocidade de resposta (&lt;5 min), fechamento rápido, prova social intensa.</div></div>
    </div>

    <h3 className="display mb-16 mt-40" style={{fontSize:22, color:'var(--white)'}}>Use a Sazonalidade como Argumento de Venda</h3>
    <div className="followup-wrap reveal">
      <div className="followup-row"><div className="fu-day" style={{fontSize:10}}>Abr–Jun</div><div className="fu-msg"><span className="fu-tag">antecipação</span>"Quem decide agora garante agenda de instalação sem concorrer com o pico de outubro."</div></div>
      <div className="followup-row"><div className="fu-day" style={{fontSize:10}}>Jul–Set</div><div className="fu-msg"><span className="fu-tag">urgência</span>"A agenda de instalação para o verão começa a fechar agora. Quer garantir sua janela?"</div></div>
      <div className="followup-row"><div className="fu-day" style={{fontSize:10}}>Out–Dez</div><div className="fu-msg"><span className="fu-tag">escassez real</span>"Estou com [X] instalações na fila. Preciso confirmar até [data] para garantir entrega antes do verão."</div></div>
      <div className="followup-row"><div className="fu-day" style={{fontSize:10}}>Jan–Mar</div><div className="fu-msg"><span className="fu-tag">reativação</span>"Boa notícia: temos janela de instalação sem fila agora."</div></div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Ritual Diário · Alta Alavancagem</h3>
    <div className="card-check reveal">
      <div className="card-check-header"><div className="card-check-icon">☀️</div><h4>30–45 minutos por dia que mudam o resultado</h4></div>
      <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>Varredura do funil</strong> — quem está em orçamento / comparando / travado</div></div>
      <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>5 follow-ups obrigatórios</strong> — com valor, não "e aí?"</div></div>
      <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>1 convite para visita</strong> para cada lead qualificado ativo</div></div>
      <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>1 prova social enviada</strong> — antes de falar preço quando fizer sentido</div></div>
      <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>Atualizar CRM/planilha</strong> — etapa + próxima ação + data</div></div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>4 Regras de Gestão · Padrão Splash</h3>
    <div className="steps reveal">
      <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"var(--border)","--step-color-text":"var(--gold)"} as React.CSSProperties}><div className="step-num">⏱</div><div className="step-body"><h4>Regra dos 5 Minutos</h4><p>Responder rápido muda a taxa de agendamento. Velocidade é diferencial competitivo.</p></div></div>
      <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}><div className="step-num">→</div><div className="step-body"><h4>Regra da Próxima Ação</h4><p>Toda conversa termina com um próximo passo (data/hora). Sem isso, o lead esfria.</p></div></div>
      <div className="step" style={{"--step-color":"var(--red-dim)","--step-border":"rgba(224,92,92,0.2)","--step-color-text":"var(--red)"} as React.CSSProperties}><div className="step-num">📸</div><div className="step-body"><h4>Regra do Print</h4><p>Se cliente diz "mais barato", peça print e compare com justiça item a item.</p></div></div>
      <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}><div className="step-num">📦</div><div className="step-body"><h4>Regra do Pacote</h4><p>Preço sempre contextualizado: instalação + reforços + pós + segurança. Nunca preço solto.</p></div></div>
    </div>
  </>
);

export default Chapter9Content;
