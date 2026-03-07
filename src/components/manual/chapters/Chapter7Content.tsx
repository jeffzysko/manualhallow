import FavoritableCard from "../FavoritableCard";

const Chapter7Content = () => (
  <>
    <h3 className="display mb-24" style={{fontSize:28, color:'var(--white)'}}>Os 3 Fechamentos Mais Consistentes</h3>
    <div className="steps reveal">
      <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"var(--border)","--step-color-text":"var(--gold)"} as React.CSSProperties}>
        <div className="step-num">→</div><div className="step-body"><h4>Por próximo passo</h4><p>"Quer agendar uma avaliação/visita rápida pra fechar sem erro?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}>
        <div className="step-num">→</div><div className="step-body"><h4>Por escolha</h4><p>"Você prefere A (mais rápido) ou B (mais premium no acabamento)?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}>
        <div className="step-num">→</div><div className="step-body"><h4>Por resumo</h4><p>"Você quer X, evitar Y e o critério é Z. Posso formalizar a proposta?"</p></div>
      </div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Roteiro de Fechamento · WhatsApp (3 Mensagens)</h3>
    <FavoritableCard id="ch7-script-fechamento" label="Script: Fechamento WhatsApp 3 Msgs" chapter="Capítulo 07">
      <div className="card-script reveal">
        <div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span>Script · Fechamento por WhatsApp · 3 mensagens com pausa</span></div>
        <div className="card-script-body">
          <div className="script-line"><span className="script-who" style={{minWidth:110, fontSize:10}}>Msg 1</span><div className="script-text">Perfeito, [Nome]. Pelo seu espaço, as duas melhores são A e B. Quer que eu te mande as fotos + prazo de instalação?</div></div>
          <div className="script-line"><span className="script-who cliente" style={{minWidth:110, fontSize:10}}>[aguarda resposta]</span><div className="script-text cliente">[cliente responde]</div></div>
          <div className="script-line"><span className="script-who" style={{minWidth:110, fontSize:10}}>Msg 2</span><div className="script-text">Boa. Entre A e B, o que pesa mais pra você: área útil ou praia/SPA?</div></div>
          <div className="script-line"><span className="script-who cliente" style={{minWidth:110, fontSize:10}}>[aguarda resposta]</span><div className="script-text cliente">[cliente responde]</div></div>
          <div className="script-line"><span className="script-who" style={{minWidth:110, fontSize:10}}>Msg 3</span><div className="script-text">Fechado. Então a melhor é [X]. Posso formalizar a proposta completa e te sugerir 2 horários de visita pra ver acabamento?</div></div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Mini-Roteiro de Ligação · 8 Minutos</h3>
    <FavoritableCard id="ch7-funnel-ligacao" label="Roteiro: Ligação 8 Minutos" chapter="Capítulo 07">
      <div className="funnel reveal">
        <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--gold-dim)","--funnel-text":"var(--gold)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--gold-dim)', color:'var(--gold)'}}>1m</div><span className="funnel-step-name">Contexto e permissão</span><span className="funnel-step-desc">"Pra eu te orientar certo…"</span></div></div>
        <div className="funnel-connector"></div>
        <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--blue-dim)","--funnel-text":"var(--blue)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--blue-dim)', color:'var(--blue)'}}>2m</div><span className="funnel-step-name">Uso + estética (desejo)</span><span className="funnel-step-desc">Como vai usar, como quer que fique</span></div></div>
        <div className="funnel-connector"></div>
        <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--red-dim)","--funnel-text":"var(--red)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--red-dim)', color:'var(--red)'}}>2m</div><span className="funnel-step-name">Medos + restrições (risco)</span><span className="funnel-step-desc">O que quer evitar, qual é o critério</span></div></div>
        <div className="funnel-connector"></div>
        <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--green-dim)","--funnel-text":"var(--green)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--green-dim)', color:'var(--green)'}}>1m</div><span className="funnel-step-name">Critério e recap</span><span className="funnel-step-desc">"Então o essencial é…" — confirmar alinhamento</span></div></div>
        <div className="funnel-connector"></div>
        <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--gold-dim)","--funnel-text":"var(--gold)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--gold-dim)', color:'var(--gold)'}}>1m</div><span className="funnel-step-name">Opções (2 caminhos)</span><span className="funnel-step-desc">Máximo 2–3, sempre com "pra quem é"</span></div></div>
        <div className="funnel-connector"></div>
        <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--purple-dim)","--funnel-text":"var(--purple)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--purple-dim)', color:'var(--purple)'}}>1m</div><span className="funnel-step-name">Próximo passo (visita/proposta)</span><span className="funnel-step-desc">Data + hora + confirmação</span></div></div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Objeções no Fechamento · Atalhos</h3>
    <div className="col-2 reveal">
      <FavoritableCard id="ch7-obj-pensar" label="Objeção: Vou pensar" chapter="Capítulo 07">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>"Vou pensar"</h4><div className="obj-q">"Perfeito. O que exatamente você precisa ter claro pra decidir com segurança?"</div></div>
      </FavoritableCard>
      <FavoritableCard id="ch7-obj-caro" label="Objeção: Tá caro" chapter="Capítulo 07">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>"Tá caro"</h4><div className="obj-q">"Comparando com qual proposta? Me manda o print do que está incluso que eu te ajudo a comparar justo."</div></div>
      </FavoritableCard>
      <FavoritableCard id="ch7-obj-conjuge" label="Objeção: Meu cônjuge decide" chapter="Capítulo 07">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>"Meu marido/esposa decide"</h4><div className="obj-q">"Quer que eu mande um resumo de 5 linhas + proposta pra vocês decidirem juntos?"</div></div>
      </FavoritableCard>
      <FavoritableCard id="ch7-obj-opcoes" label="Objeção: Quero ver outras opções" chapter="Capítulo 07">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>"Quero ver outras opções"</h4><div className="obj-q">"Quer que eu te mande uma régua simples pra comparar certinho?"</div></div>
      </FavoritableCard>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Áudios Premium por Cenário</h3>

    <FavoritableCard id="ch7-audio-quente" label="Áudio: Cliente Quente" chapter="Capítulo 07">
      <div className="card-audio reveal">
        <div className="card-audio-header"><div className="audio-icon">🔥</div><span className="audio-tag">Cenário A</span><div style={{marginLeft:8, fontSize:13, color:'var(--white)'}}>Cliente Quente</div><span className="audio-timer">20–30s</span></div>
        <div className="audio-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div className="audio-text">"[Nome], show. Pra eu te indicar o modelo certinho e já te passar prazo real de instalação: é pra casa ou sítio? E o que pesa mais pra você: área útil pra reunir gente ou ter uma praia/SPA pra relaxar? Com isso eu fecho 2 opções perfeitas pro teu espaço. Quer que a gente marque uma visita rápida ou uma vídeo-chamada? Pode ser hoje no fim da tarde ou amanhã de manhã?"</div>
      </div>
    </FavoritableCard>

    <FavoritableCard id="ch7-audio-comparando" label="Áudio: Comparando Preço" chapter="Capítulo 07">
      <div className="card-audio reveal">
        <div className="card-audio-header"><div className="audio-icon">⚖️</div><span className="audio-tag">Cenário B</span><div style={{marginLeft:8, fontSize:13, color:'var(--white)'}}>Comparando Preço</div><span className="audio-timer">25–35s</span></div>
        <div className="audio-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div className="audio-text">"[Nome], total — sempre aparece mais barato mesmo. Só que piscina é igual instalação: o barato costuma ficar barato só no início. Pra eu te orientar com justiça, me manda um print do que está incluso nessa proposta? Tipo instalação, base, reforços, hidráulica, garantia e pós. Daí eu comparo item a item e te digo exatamente onde muda o valor e onde pode virar manutenção depois."</div>
      </div>
    </FavoritableCard>

    <FavoritableCard id="ch7-audio-travado" label="Áudio: Cliente Travado" chapter="Capítulo 07">
      <div className="card-audio reveal">
        <div className="card-audio-header"><div className="audio-icon">🧊</div><span className="audio-tag">Cenário C</span><div style={{marginLeft:8, fontSize:13, color:'var(--white)'}}>Cliente Travado</div><span className="audio-timer">20–35s</span></div>
        <div className="audio-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div className="audio-text">"[Nome], perfeito pensar — é uma decisão importante. Só pra eu te ajudar sem pressão: o que mais te trava hoje? É instalação/bagunça, prazo, ou ficar inseguro com garantia e pós? Me diz isso que eu te explico exatamente como a Splash resolve esse ponto. E se fizer sentido, a gente faz o próximo passo mais seguro: uma visita técnica rápida pra mapear o local e te passar o cronograma real."</div>
      </div>
    </FavoritableCard>

    <FavoritableCard id="ch7-audio-desconto" label="Áudio: Cliente Pediu Desconto" chapter="Capítulo 07">
      <div className="card-audio reveal">
        <div className="card-audio-header"><div className="audio-icon">💰</div><span className="audio-tag">Cenário D</span><div style={{marginLeft:8, fontSize:13, color:'var(--white)'}}>Cliente Pediu Desconto</div><span className="audio-timer">20–35s</span></div>
        <div className="audio-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div className="audio-text">"[Nome], eu entendo. O ponto é que o nosso valor já está no pacote completo pra você não ter surpresa de instalação e manutenção depois. O que eu consigo fazer é te ajudar por condição: ou à vista, ou ajustando forma de pagamento, ou encaixando na agenda de instalação — sem tirar qualidade. Me diz: você prefere melhorar condição de pagamento ou garantir um encaixe de agenda mais rápido?"</div>
      </div>
    </FavoritableCard>
  </>
);

export default Chapter7Content;
