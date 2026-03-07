import FavoritableCard from "../FavoritableCard";

const Chapter4Content = () => (
  <>
    <div className="callout reveal">
      <p>A escada não é "perguntar 6 coisas de uma vez". É <em>micro-SIM ao longo da conversa</em>, sempre respeitando o ritmo do cliente. O 'sim' mais valioso é o de critério.</p>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Micro-SIMs por Etapa da Conversa</h3>
    <div className="steps reveal">
      <div className="step" style={{"--step-color":"var(--purple-dim)","--step-border":"rgba(160,123,224,0.2)","--step-color-text":"var(--purple)"} as React.CSSProperties}>
        <div className="step-num">1</div>
        <div className="step-body"><h4>Permissão</h4><p>"Posso te fazer uma pergunta rapidinha pra te indicar certo?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}>
        <div className="step-num">2</div>
        <div className="step-body"><h4>Critério</h4><p>"Faz sentido priorizar uma instalação sem dor de cabeça?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"var(--border)","--step-color-text":"var(--gold)"} as React.CSSProperties}>
        <div className="step-num">3</div>
        <div className="step-body"><h4>Escolha Guiada</h4><p>"Você prefere mais área útil ou uma praia/SPA?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}>
        <div className="step-num">4</div>
        <div className="step-body"><h4>Próximo Passo</h4><p>"Quer que eu formalize a proposta com tudo incluso?"</p></div>
      </div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>3 Cenários Prontos com Escada do SIM</h3>
    <div className="col-2 reveal">
      <FavoritableCard id="ch4-script-quente" label="Script: Escada do SIM — Cliente Quente" chapter="Capítulo 04">
        <div className="card-script">
          <div className="card-script-header">
            <div className="card-script-dots"><i></i><i></i><i></i></div>
            <span style={{color:'var(--green)'}}>🔥 Cliente Quente</span>
          </div>
          <div className="card-script-body">
            <div className="script-line"><span className="script-who">Vendedor</span><div className="script-text">Posso te mostrar 2 modelos que funcionam pro seu espaço? <em>[SIM]</em></div></div>
            <div className="script-line"><span className="script-who">Vendedor</span><div className="script-text">Perfeito. Quer agendar uma visita rápida pra ver acabamento? <em>[SIM]</em></div></div>
          </div>
        </div>
      </FavoritableCard>
      <FavoritableCard id="ch4-script-preco" label="Script: Escada do SIM — Comparando Preço" chapter="Capítulo 04">
        <div className="card-script">
          <div className="card-script-header">
            <div className="card-script-dots"><i></i><i></i><i></i></div>
            <span style={{color:'var(--red)'}}>⚖️ Comparando Preço</span>
          </div>
          <div className="card-script-body">
            <div className="script-line"><span className="script-who">Vendedor</span><div className="script-text">Posso comparar com justiça se você me mandar o print do que está incluso? <em>[SIM]</em></div></div>
            <div className="script-line"><span className="script-who">Vendedor</span><div className="script-text">Faz sentido comparar por garantia e instalação também? <em>[SIM]</em></div></div>
          </div>
        </div>
      </FavoritableCard>
    </div>
    <FavoritableCard id="ch4-script-travado" label="Script: Escada do SIM — Cliente Travado" chapter="Capítulo 04">
      <div className="card-script reveal">
        <div className="card-script-header">
          <div className="card-script-dots"><i></i><i></i><i></i></div>
          <span style={{color:'var(--purple)'}}>🧊 Cliente Travado</span>
        </div>
        <div className="card-script-body">
          <div className="script-line"><span className="script-who">Vendedor</span><div className="script-text">Posso entender qual é o ponto que te trava pra eu te orientar sem pressão? <em>[SIM]</em></div></div>
          <div className="script-line"><span className="script-who">Vendedor</span><div className="script-text">Quer fazer só a visita técnica e depois decide? <em>[SIM]</em></div></div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Técnica das 2–3 Opções</h3>
    <p className="prose reveal">Pressão quebra confiança. Condução premium dá autonomia com direção. Mostre caminhos, nunca imponha.</p>
    <div className="profiles-grid reveal">
      <div className="profile-card" style={{"--pc-color":"var(--green)"} as React.CSSProperties}>
        <div className="profile-icon">⚡</div>
        <h4>Opção A</h4>
        <p>Pra quem quer instalação mais rápida e simples.</p>
        <span className="profile-tag">Velocidade</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--gold)"} as React.CSSProperties}>
        <div className="profile-icon">✨</div>
        <h4>Opção B</h4>
        <p>Pra quem quer acabamento mais premium e integração com a casa.</p>
        <span className="profile-tag">Premium</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--blue)"} as React.CSSProperties}>
        <div className="profile-icon">🎉</div>
        <h4>Opção C</h4>
        <p>Pra quem quer maximizar área de lazer e receber.</p>
        <span className="profile-tag">Entretenimento</span>
      </div>
    </div>
  </>
);

export default Chapter4Content;
