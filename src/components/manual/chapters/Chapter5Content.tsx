import FavoritableCard from "../FavoritableCard";

const Chapter5Content = () => (
  <>
    <h3 className="display mb-24" style={{fontSize:28, color:'var(--white)'}}>O que dizer antes do preço — Pré-Frame</h3>
    <div className="col-2 reveal">
      <div className="callout-small callout"><p>"Pra comparar justo, não compara só tamanho. Compara instalação, acabamento e pós-venda."</p></div>
      <div className="callout-small callout"><p>"Piscina é uma instalação que você não quer refazer. A ideia é fazer uma vez e ficar perfeita."</p></div>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Como Falar Preço · Estrutura em 5 Passos</h3>
    <div className="steps reveal">
      <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"var(--border)","--step-color-text":"var(--gold)"} as React.CSSProperties}>
        <div className="step-num">1</div><div className="step-body"><h4>Recap do critério</h4><p>Relembre o que ele te disse que é mais importante.</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}>
        <div className="step-num">2</div><div className="step-body"><h4>Recomendação</h4><p>"O caminho ideal pra você é esse modelo."</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"var(--border)","--step-color-text":"var(--ch5)"} as React.CSSProperties}>
        <div className="step-num">3</div><div className="step-body"><h4>Investimento</h4><p>"O investimento fica em R$ ___."</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}>
        <div className="step-num">4</div><div className="step-body"><h4>Comparação justa</h4><p>"Quer que eu detalhe o que está incluso pra você comparar justo?"</p></div>
      </div>
      <div className="step" style={{"--step-color":"var(--purple-dim)","--step-border":"rgba(160,123,224,0.2)","--step-color-text":"var(--purple)"} as React.CSSProperties}>
        <div className="step-num">5</div><div className="step-body"><h4>Próximo passo</h4><p>Data/hora concretos para visita ou assinatura.</p></div>
      </div>
    </div>

    <FavoritableCard id="ch5-script-preco" label="Script: Apresentação de Preço" chapter="Capítulo 05">
      <div className="card-script reveal mt-24">
        <div className="card-script-header">
          <div className="card-script-dots"><i></i><i></i><i></i></div>
          <span>Script · Apresentação de Preço · WhatsApp</span>
        </div>
        <div className="card-script-body">
          <div className="script-line">
            <span className="script-who">Vendedor</span>
            <div className="script-text">Pelo teu cenário e pelo teu critério (instalação tranquila + padrão), o caminho ideal é esse. O investimento fica em R$ __. Quer que eu detalhe o que está incluso pra você comparar justo?</div>
          </div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>4 Pré-Objeções para Antecipar</h3>
    <p className="prose reveal">Pré-objeção é você antecipar a dúvida antes que vire resistência. Aumenta confiança e reduz "tá caro".</p>
    <div className="col-2 reveal">
      <FavoritableCard id="ch5-obj-preco" label="Pré-Objeção: Comparação por tamanho" chapter="Capítulo 05">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Preço</span></div><h4>Comparação por tamanho</h4><div className="obj-q">"Antes do valor, só pra comparar certo: piscina não é só tamanho. A diferença aparece em instalação, acabamento e pós-venda."</div></div>
      </FavoritableCard>
      <FavoritableCard id="ch5-obj-instalacao" label="Pré-Objeção: Medo de bagunça" chapter="Capítulo 05">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Instalação</span></div><h4>Medo de bagunça e atraso</h4><div className="obj-q">"A gente organiza em etapas claras pra não virar novela."</div></div>
      </FavoritableCard>
      <FavoritableCard id="ch5-obj-inclusos" label="Pré-Objeção: O que está no pacote" chapter="Capítulo 05">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Inclusos</span></div><h4>O que está no pacote</h4><div className="obj-q">"Eu te digo exatamente o que está incluso pra evitar surpresa."</div></div>
      </FavoritableCard>
      <FavoritableCard id="ch5-obj-manutencao" label="Pré-Objeção: Manutenção dia a dia" chapter="Capítulo 05">
        <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Manutenção</span></div><h4>Trabalho e custo no dia a dia</h4><div className="obj-q">"Te explico de forma bem simples como fica no dia a dia."</div></div>
      </FavoritableCard>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Protocolo de Desconto · Sem Agressividade</h3>
    <FavoritableCard id="ch5-obj-desconto" label="Objeção: Protocolo de Desconto" chapter="Capítulo 05">
      <div className="card-obj reveal">
        <div className="card-obj-header"><span className="card-obj-tag">Regra</span><h4>Nunca discuta desconto sem entender o motivo</h4></div>
        <div className="obj-q">Pergunta-mestre: "Esse desconto é por orçamento ou por comparação?"</div>
        <div className="obj-branches">
          <div className="obj-branch"><span className="obj-branch-if">Orçamento</span><div className="obj-branch-text">"Prefere ajustar condição ou ajustar escopo mantendo o essencial?"</div></div>
          <div className="obj-branch"><span className="obj-branch-if">Comparação</span><div className="obj-branch-text">"Me manda o print do outro orçamento e o que está incluso."</div></div>
          <div className="obj-branch"><span className="obj-branch-if">Inclusos</span><div className="obj-branch-text">"Pesa mais instalação tranquila, acabamento ou garantia?"</div></div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Travas Comuns · O que Realmente Significam</h3>
    <FavoritableCard id="ch5-travas" label="Tabela: Travas Comuns e Ações" chapter="Capítulo 05">
      <div className="compare-table reveal">
        <div className="compare-head">
          <div className="compare-head-cell" style={{color:'var(--gray)'}}>O Cliente Diz</div>
          <div className="compare-head-cell" style={{color:'var(--gold)'}}>O Que Realmente Significa</div>
          <div className="compare-head-cell" style={{color:'var(--green)'}}>Sua Ação</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{fontStyle:'italic', color:'var(--gray)'}}>"Vou pensar"</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>Falta de segurança ou está comparando</div>
          <div className="compare-cell good">Perguntar o que exatamente precisa ter claro</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{fontStyle:'italic', color:'var(--gray)'}}>"Preciso falar com meu cônjuge"</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>Falta de justificativa / medo de errar</div>
          <div className="compare-cell good">Mandar resumo de 5 linhas + proposta para decidir juntos</div>
        </div>
        <div className="compare-row">
          <div className="compare-cell" style={{fontStyle:'italic', color:'var(--gray)'}}>Silêncio após proposta</div>
          <div className="compare-cell" style={{color:'var(--gold)'}}>Sobrecarga / medo / outra prioridade</div>
          <div className="compare-cell good">Follow-up com valor no D+1 (não "e aí?")</div>
        </div>
      </div>
    </FavoritableCard>
  </>
);

export default Chapter5Content;
