import FavoritableCard from "../FavoritableCard";

const Chapter1Content = () => (
  <>
    <div className="key-phrase reveal">
      Piscina premium não se vende na lógica <em>"produto × preço"</em>.<br/>
      Ela se vende na lógica <em>"risco × previsibilidade"</em>.
    </div>

    <h3 className="display mb-24" style={{fontSize:32, color:'var(--white)'}} id="caro-significa">Quando o cliente diz "caro", ele está dizendo...</h3>

    <div className="profiles-grid reveal">
      <div className="profile-card" style={{"--pc-color":"#E07B5B"} as React.CSSProperties}>
        <div className="profile-icon">🤔</div>
        <h4>"Não sei o que está incluso"</h4>
        <p>Ele está comparando apenas tamanho e preço, sem entender o pacote completo da instalação.</p>
        <span className="profile-tag" style={{"--pc-color":"#E07B5B"} as React.CSSProperties}>Clareza de Escopo</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--red)"} as React.CSSProperties}>
        <div className="profile-icon">😰</div>
        <h4>"Não confio na instalação"</h4>
        <p>Medo de bagunça, atraso, custo surpresa e falta de assistência pós-venda.</p>
        <span className="profile-tag" style={{"--pc-color":"var(--red)"} as React.CSSProperties}>Segurança de Processo</span>
      </div>
      <div className="profile-card" style={{"--pc-color":"var(--purple)"} as React.CSSProperties}>
        <div className="profile-icon">💬</div>
        <h4>"Não consigo justificar"</h4>
        <p>Falta uma justificativa racional para ele mesmo ou para o cônjuge.</p>
        <span className="profile-tag" style={{"--pc-color":"var(--purple)"} as React.CSSProperties}>Justificativa Elegante</span>
      </div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:32, color:'var(--white)'}}>Protocolo "Preço com Contexto"</h3>
    <p className="prose reveal">Preço alto só vira problema quando o cliente não entende o pacote e compara errado. Siga estes 4 passos antes de falar qualquer número:</p>

    <div className="steps reveal">
      <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"var(--border)","--step-color-text":"var(--gold)"} as React.CSSProperties}>
        <div className="step-num">1</div>
        <div className="step-body">
          <h4>Relembrar o critério do cliente</h4>
          <p>Antes de qualquer número, echo o "porquê" que ele te deu. Ele se sente entendido e a régua já muda.</p>
        </div>
      </div>
      <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}>
        <div className="step-num">2</div>
        <div className="step-body">
          <h4>Definir a régua de comparação</h4>
          <p>Deixar claro que a comparação justa é por pacote completo — não só "casca + tamanho".</p>
        </div>
      </div>
      <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}>
        <div className="step-num">3</div>
        <div className="step-body">
          <h4>Apresentar como investimento total</h4>
          <p>Piscina + instalação + reforços + hidráulica + checklist + pós. Assim você compara justo.</p>
        </div>
      </div>
      <div className="step" style={{"--step-color":"var(--purple-dim)","--step-border":"rgba(160,123,224,0.2)","--step-color-text":"var(--purple)"} as React.CSSProperties}>
        <div className="step-num">4</div>
        <div className="step-body">
          <h4>Ancorar risco evitado + pós-venda</h4>
          <p>Mostre o que o barato costuma virar: manutenção, retrabalho, falta de assistência, dor de cabeça.</p>
        </div>
      </div>
    </div>

    <FavoritableCard id="ch1-script-preco" label="Script: Protocolo Preço com Contexto" chapter="Capítulo 01">
      <div className="card-script reveal mt-40">
        <div className="card-script-header">
          <div className="card-script-dots"><i></i><i></i><i></i></div>
          <span>Script · WhatsApp · Protocolo Preço com Contexto</span>
        </div>
        <div className="card-script-body">
          <div className="script-line">
            <span className="script-who">Vendedor</span>
            <div className="script-text">[Nome], pelo que você me disse, você quer uma instalação tranquila e sem susto depois, certo?</div>
          </div>
          <div className="script-line">
            <span className="script-who cliente">Cliente</span>
            <div className="script-text cliente">Sim.</div>
          </div>
          <div className="script-line">
            <span className="script-who">Vendedor</span>
            <div className="script-text">Então vou te passar o valor do <strong>pacote completo</strong> — piscina + instalação + reforços + hidráulica + checklist + pós. Assim você compara justo.</div>
          </div>
          <div className="script-line">
            <span className="script-who">Vendedor</span>
            <div className="script-text">Nesse cenário, fica <strong>R$ X</strong> à vista / ou em condições. Se você quiser, eu também te mostro o que geralmente <em>NÃO</em> vem incluso nas mais baratas — pra você evitar manutenção depois.</div>
          </div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:32, color:'var(--white)'}}>A Fórmula do Fechamento Premium</h3>
    <p className="prose reveal">Para fechar com convicção, o cliente precisa ter <strong>3 certezas</strong>. Se uma delas faltar, ele "vai pensar".</p>

    <div className="cert-grid reveal">
      <div className="cert-card">
        <div className="cert-num">1</div>
        <span className="cert-icon">✅</span>
        <h4>Certeza de Encaixe</h4>
        <p>O modelo e tamanho são os certos para o uso, estética e espaço dele.</p>
      </div>
      <div className="cert-card">
        <div className="cert-num">2</div>
        <span className="cert-icon">🗺️</span>
        <h4>Certeza de Entrega</h4>
        <p>Processo claro, etapas definidas, responsabilidades e pós-venda estabelecidos.</p>
      </div>
      <div className="cert-card">
        <div className="cert-num">3</div>
        <span className="cert-icon">🧠</span>
        <h4>Certeza de Justificativa</h4>
        <p>Comparação justa e benefícios que ele valoriza: paz, padrão, valorização do imóvel, tempo.</p>
      </div>
    </div>

    <div className="callout reveal">
      <p>"Você está vendendo <strong>mais tempo de qualidade em casa</strong>, um espaço que dá orgulho, paz de instalação sem novela e segurança com garantia real. A piscina é só o veículo."</p>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:32, color:'var(--white)'}}>Comparação Justa · 5 Critérios</h3>
    <p className="prose reveal">Use esta régua quando o cliente mandar proposta de concorrente. A conversa muda de preço para critério.</p>

    <FavoritableCard id="ch1-comparacao" label="Tabela: Comparação Justa 5 Critérios" chapter="Capítulo 01">
      <div className="compare-table reveal">
        <div className="compare-head">
          <div className="compare-head-cell">Critério</div>
          <div className="compare-head-cell" style={{color:'var(--red)'}}>❌ Proposta Barata</div>
          <div className="compare-head-cell" style={{color:'var(--green)'}}>✅ Splash Premium</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell label">Instalação</div>
          <div className="compare-cell bad">Genérica, sem checklist de base/nivelamento</div>
          <div className="compare-cell good">Base, nivelamento, drenagem — padrão documentado</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell label">Reforços & Estrutura</div>
          <div className="compare-cell bad">Material que apodrece ou trabalha no solo</div>
          <div className="compare-cell good">Estrutura adequada ao terreno e uso</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell label">Hidráulica</div>
          <div className="compare-cell bad">Material barato, risco de trincar/vazar</div>
          <div className="compare-cell good">Material de qualidade, conexões seguras</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell label">Garantia</div>
          <div className="compare-cell bad">Verbal ou sem cobertura clara</div>
          <div className="compare-cell good">Documentada, com acionamento definido</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell label">Pós-venda</div>
          <div className="compare-cell bad">Suporte inexistente pós-entrega</div>
          <div className="compare-cell good">Checklist final + orientação + assistência</div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Quando Oferecer Condição (sem desvalorizar)</h3>
    <div className="col-2 reveal">
      <div className="card-check">
        <div className="card-check-header">
          <div className="card-check-icon">🔄</div>
          <h4>Trocas Saudáveis</h4>
        </div>
        <div className="check-item"><div className="check-box checked"></div><div className="check-text">Preço <strong>por escopo</strong> — retirar item, não dar desconto</div></div>
        <div className="check-item"><div className="check-box checked"></div><div className="check-text">Preço <strong>por forma de pagamento</strong> — à vista vs parcelado</div></div>
        <div className="check-item"><div className="check-box checked"></div><div className="check-text">Preço <strong>por agenda</strong> — encaixe de instalação</div></div>
      </div>
      <FavoritableCard id="ch1-obj-desconto" label="Objeção: Desconto sem contrapartida" chapter="Capítulo 01">
        <div className="card-obj">
          <div className="card-obj-header">
            <span className="card-obj-tag">Evitar</span>
          </div>
          <h4>Desconto puro sem contrapartida</h4>
          <div className="obj-q">Dar desconto sem entender o motivo sinaliza insegurança e desvaloriza o produto.</div>
          <div className="obj-branches">
            <div className="obj-branch">
              <span className="obj-branch-if">Regra</span>
              <div className="obj-branch-text">Nunca discuta desconto antes de entender o motivo. Pergunta-mestre primeiro: <em>"Esse desconto é por orçamento ou por comparação?"</em></div>
            </div>
          </div>
        </div>
      </FavoritableCard>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Frases Proibidas × Frases Premium</h3>
    <FavoritableCard id="ch1-frases" label="Frases Proibidas × Frases Premium" chapter="Capítulo 01">
      <div className="phrases-grid reveal">
        <div className="phrases-col bad">
          <div className="phrases-col-header">
            <span className="phrases-col-icon">🚫</span>
            <span className="phrases-col-title">Diminui Valor</span>
          </div>
          <div className="phrase-item">"Promoção imperdível, última chance!"</div>
          <div className="phrase-item">"É caro mesmo, mas…"</div>
          <div className="phrase-item">"Vou te fazer 6 perguntas…"</div>
          <div className="phrase-item">"Tô passando um precinho especial pra você"</div>
        </div>
        <div className="phrases-col good">
          <div className="phrases-col-header">
            <span className="phrases-col-icon">✨</span>
            <span className="phrases-col-title">Aumenta Segurança</span>
          </div>
          <div className="phrase-item">"Prefiro te orientar certo do que te passar um número solto."</div>
          <div className="phrase-item">"Pelo teu cenário, existem dois caminhos bem seguros."</div>
          <div className="phrase-item">"Vamos comparar justo: instalação, acabamento e pós-venda."</div>
          <div className="phrase-item">"A ideia é fazer uma vez e ficar perfeita."</div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Cadência de Follow-up · Focada em Valor</h3>
    <FavoritableCard id="ch1-followup" label="Follow-up: Cadência D+1 a D+7" chapter="Capítulo 01">
      <div className="followup-wrap reveal">
        <div className="followup-row">
          <div className="fu-day">D+1</div>
          <div className="fu-msg"><span className="fu-tag">checklist</span>"Quer que eu te mande o checklist da instalação pra você ver o padrão?"</div>
        </div>
        <div className="followup-row">
          <div className="fu-day">D+3</div>
          <div className="fu-msg"><span className="fu-tag">prova social</span>"Posso te mandar 2 depoimentos curtos de clientes que estavam comparando preço?"</div>
        </div>
        <div className="followup-row">
          <div className="fu-day">D+7</div>
          <div className="fu-msg"><span className="fu-tag">comparação</span>"Se você me mandar o print da proposta, eu comparo item a item sem achismo."</div>
        </div>
      </div>
    </FavoritableCard>
  </>
);

export default Chapter1Content;
