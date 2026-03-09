const AppendixContent = () => (
  <>
    {/* Extras: Provas Sociais */}
    <section id="chps" style={{background:'var(--bg)'}}>
      <div className="page-wrap section-gap">
        <div className="chapter-header reveal">
          <div className="ch-num" style={{fontSize:120}}>PS</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{background:'var(--green)', color:'#000'}}>+1</div>
            <span className="ch-label-tag" style={{color:'var(--green)'}}>Provas Sociais</span>
          </div>
          <h2>Banco de<br/><em style={{color:'var(--green)'}}>Provas Sociais</em></h2>
          <p className="lead">Depoimentos, cases e dados reais para usar em conversas, propostas e follow-ups.</p>
        </div>

        <h3 className="display mb-16" style={{fontSize:28, color:'var(--white)'}}>Depoimentos de Clientes Reais</h3>
        <div className="card reveal"><h4>⭐ "A melhor decisão que tomei"</h4><p className="prose">"Pesquisei em 4 empresas antes de fechar com a Splash. No começo achei mais caro, mas <div className="card reveal"><h4>⭐ "A melhor decisão que tomei"</h4><p className="prose">"Pesquisei em 4 empresas antes de fechar com a Splash. No começo achei mais caro, mas quando vi o que estava incluso (instalação completa, reforço de terreno, acabamento premium), entendi que era o único orçamento honesto. Hoje minha piscina tem 2 anos e está impecável." — <strong>Roberto M., São Paulo</strong></p></div> que era o único orçamento honesto. Hoje minha piscina tem 2 anos e está impecável." — <strong>Roberto M., São Paulo</strong></p></div>
        <div className="card reveal"><h4>⭐ "Zero dor de cabeça"</h4><p className="prose">"O que me vendeu foi a transparência. Me mostraram exatamente o que ia acontecer, quanto tempo ia levar e o que estava incluso. Cumpriram tudo no prazo. Indiquei pra 3 vizinhos." — <strong>Carla S., Campinas</strong></p></div>
        <div className="card reveal"><h4>⭐ "Valeu cada centavo"</h4><p className="prose">"Minha esposa queria a mais barata. Eu insisti na Splash depois que vi a comparação lado a lado. Hoje ela agradece todo fim de semana quando a família toda está na piscina." — <strong>André L., Ribeirão Preto</strong></p></div>

        <h3 className="display mb-16" style={{fontSize:28, color:'var(--white)'}}>Dados & Números</h3>
        <div className="stats-row reveal">
          <div className="stat-box"><span className="stat-num" style={{"--stat-color":"var(--gold)"} as React.CSSProperties}>97%</span><div className="stat-label">Satisfação pós-instalação</div></div>
          <div className="stat-box"><span className="stat-num" style={{"--stat-color":"var(--green)"} as React.CSSProperties}>85%</span><div className="stat-label">Indicam para amigos</div></div>
          <div className="stat-box"><span className="stat-num" style={{"--stat-color":"var(--blue)"} as React.CSSProperties}>4.9★</span><div className="stat-label">Avaliação no Google</div></div>
        </div>
      </div>
    </section>

    {/* Extras: Objeções de Acessórios */}
    <section id="choa" style={{background:'var(--bg2)'}}>
      <div className="page-wrap section-gap">
        <div className="chapter-header reveal">
          <div className="ch-num" style={{fontSize:120}}>OA</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{background:'var(--purple)', color:'#000'}}>+2</div>
            <span className="ch-label-tag" style={{color:'var(--purple)'}}>Objeções Acessórios</span>
          </div>
          <h2>Objeções de<br/><em style={{color:'var(--purple)'}}>Acessórios & Upgrades</em></h2>
          <p className="lead">Como contornar resistências na venda de aquecimento, iluminação, cascata e outros complementos.</p>
        </div>

        <div className="card-obj reveal"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Aquecimento é caro, não preciso"</h4><div className="obj-q">"Você pretende usar a piscina só no verão ou o ano todo?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Ano todo</span><div className="obj-branch-text">"Sem aquecimento, você vai usar 4 meses por ano. Com, são 12."</div></div><div className="obj-branch"><span className="obj-branch-if">Só verão</span><div className="obj-branch-text">"Instalar depois custa 40% mais por causa da obra extra."</div></div></div></div>
        <div className="card-obj reveal"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Iluminação é supérfluo"</h4><div className="obj-q">"Você vai usar a piscina só de dia?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">À noite tb</span><div className="obj-branch-text">"Sem iluminação, depois das 18h a piscina vira uma poça escura."</div></div><div className="obj-branch"><span className="obj-branch-if">Só de dia</span><div className="obj-branch-text">"A tubulação é feita junto. Se quiser depois, é quebra-quebra."</div></div></div></div>
        <div className="card-obj reveal"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Cascata é só estética"</h4><div className="obj-q">"O que mais te atrai na piscina: relaxar, se exercitar ou o visual?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Relaxar</span><div className="obj-branch-text">"A cascata cria uma massagem natural na cervical."</div></div><div className="obj-branch"><span className="obj-branch-if">Visual</span><div className="obj-branch-text">"A cascata é o item que mais valoriza o visual."</div></div></div></div>
        <div className="card-obj reveal"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Vou colocar esses itens depois"</h4><div className="obj-q">"Você sabe quanto custa instalar separado depois?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Não sabe</span><div className="obj-branch-text">"Em média 40-60% mais caro por obra extra."</div></div><div className="obj-branch"><span className="obj-branch-if">Sabe</span><div className="obj-branch-text">"A maioria prefere já deixar a infraestrutura pronta."</div></div></div></div>
      </div>
    </section>

    {/* Extras: Lead Frio */}
    <section id="chlf" style={{background:'var(--bg)'}}>
      <div className="page-wrap section-gap">
        <div className="chapter-header reveal">
          <div className="ch-num" style={{fontSize:120}}>LF</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{background:'var(--blue)', color:'#000'}}>+3</div>
            <span className="ch-label-tag" style={{color:'var(--blue)'}}>Lead Frio</span>
          </div>
          <h2>Reativação de<br/><em style={{color:'var(--blue)'}}>Lead Frio</em></h2>
          <p className="lead">Scripts e estratégias para reengajar leads que pararam de responder.</p>
        </div>

        <h3 className="display mb-16" style={{fontSize:28, color:'var(--white)'}}>Sequência de Reativação · 3 Toques</h3>
        <div className="card-script reveal"><div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span style={{color:'var(--blue)'}}>Toque 1 · D+3 · Valor sem pressão</span></div><div className="card-script-body"><div className="script-line"><span className="script-who">Splash</span><div className="script-text">"Oi [NOME], tudo bem? Lembrei de você porque fizemos uma instalação essa semana num espaço parecido com o seu. Ficou incrível! Posso te mandar as fotos?"</div></div></div></div>
        <div className="card-script reveal"><div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span style={{color:'var(--blue)'}}>Toque 2 · D+7 · Escassez real</span></div><div className="card-script-body"><div className="script-line"><span className="script-who">Splash</span><div className="script-text">"[NOME], só passando pra avisar: nossa agenda de instalação pra [MÊS] está quase fechada. Se ainda tiver interesse, consigo reservar uma vaga pra você."</div></div></div></div>
        <div className="card-script reveal"><div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span style={{color:'var(--blue)'}}>Toque 3 · D+14 · Porta aberta</span></div><div className="card-script-body"><div className="script-line"><span className="script-who">Splash</span><div className="script-text">"Oi [NOME]! Sei que o timing pode não ser agora e tá tudo bem. Quando fizer sentido, é só me chamar. 😊"</div></div></div></div>
        <div className="callout reveal"><p>"Lead frio não é lead morto. É lead que ainda não encontrou o motivo certo para agir."</p></div>
      </div>
    </section>

    {/* Extras: Guia de Fotos */}
    <section id="chgf" style={{background:'var(--bg2)'}}>
      <div className="page-wrap section-gap">
        <div className="chapter-header reveal">
          <div className="ch-num" style={{fontSize:120}}>GF</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{background:'var(--ch5)', color:'#000'}}>+4</div>
            <span className="ch-label-tag" style={{color:'var(--ch5)'}}>Guia de Fotos</span>
          </div>
          <h2>Guia de Fotos<br/><em style={{color:'var(--ch5)'}}>para Diagnóstico</em></h2>
          <p className="lead">Oriente o cliente a enviar fotos certas para um orçamento preciso e rápido.</p>
        </div>
        <h3 className="display mb-16" style={{fontSize:28, color:'var(--white)'}}>O que Pedir ao Cliente</h3>
        <div className="card-check reveal">
          <div className="card-check-header"><div className="card-check-icon">📸</div><h4>Checklist de Fotos Obrigatórias</h4></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Vista geral do espaço</strong>: foto aberta mostrando todo o terreno</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Acesso / portão</strong>: por onde a piscina vai entrar</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Nível do terreno</strong>: se há desnível, muro de arrimo ou inclinação</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Área da casa próxima</strong>: janelas, portas, varanda</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Tubulação/esgoto visível</strong>: se há canos, ralos ou fossas no caminho</div></div>
        </div>
        <div className="card-script reveal"><div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span style={{color:'var(--ch5)'}}>Script para pedir fotos</span></div><div className="card-script-body"><div className="script-line"><span className="script-who">Splash</span><div className="script-text">"Pra eu montar uma proposta certinha e sem surpresa, me manda 3 fotos: uma do espaço todo, uma do acesso (portão/passagem) e uma mostrando se o terreno é plano ou tem desnível."</div></div></div></div>
      </div>
    </section>

    {/* Extras: Template de Proposta */}
    <section id="chtp" style={{background:'var(--bg)'}}>
      <div className="page-wrap section-gap">
        <div className="chapter-header reveal">
          <div className="ch-num" style={{fontSize:120}}>TP</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{background:'var(--ch8)', color:'#000'}}>+5</div>
            <span className="ch-label-tag" style={{color:'var(--ch8)'}}>Template Proposta</span>
          </div>
          <h2>Template de<br/><em style={{color:'var(--ch8)'}}>Proposta Comercial</em></h2>
          <p className="lead">Estrutura pronta para enviar propostas profissionais que vendem valor, não preço.</p>
        </div>
        <h3 className="display mb-16" style={{fontSize:28, color:'var(--white)'}}>Estrutura da Proposta Premium</h3>
        <div className="steps reveal">
          <div className="step" style={{"--step-color":"var(--gold-dim)","--step-border":"rgba(201,169,106,0.2)","--step-color-text":"var(--gold)"} as React.CSSProperties}><div className="step-num">1</div><div className="step-body"><h4>Cabeçalho Personalizado</h4><p>Nome do cliente + referência ao que ele disse na conversa.</p></div></div>
          <div className="step" style={{"--step-color":"var(--blue-dim)","--step-border":"rgba(91,155,213,0.2)","--step-color-text":"var(--blue)"} as React.CSSProperties}><div className="step-num">2</div><div className="step-body"><h4>Recap do Diagnóstico</h4><p>"Com base na nossa conversa, entendi que você precisa de: [uso] + [estética] + [prioridade]."</p></div></div>
          <div className="step" style={{"--step-color":"var(--green-dim)","--step-border":"rgba(92,184,138,0.2)","--step-color-text":"var(--green)"} as React.CSSProperties}><div className="step-num">3</div><div className="step-body"><h4>Pacote Completo — Tudo Incluso</h4><p>Liste TUDO que está incluso. Nunca preço solto.</p></div></div>
          <div className="step" style={{"--step-color":"var(--purple-dim)","--step-border":"rgba(160,123,224,0.2)","--step-color-text":"var(--purple)"} as React.CSSProperties}><div className="step-num">4</div><div className="step-body"><h4>Investimento com Contexto</h4><p>"Investimento total: R$ [VALOR] — inclui [lista]."</p></div></div>
          <div className="step" style={{"--step-color":"var(--ch5)","--step-border":"rgba(224,123,91,0.2)","--step-color-text":"var(--ch5)"} as React.CSSProperties}><div className="step-num">5</div><div className="step-body"><h4>Próximo Passo Claro</h4><p>"Para garantir a instalação em [MÊS], preciso da confirmação até [DATA]."</p></div></div>
        </div>
        <div className="callout reveal"><p>"Uma proposta bem feita não precisa de desconto. Ela faz o cliente sentir que está comprando segurança."</p></div>
      </div>
    </section>

    {/* Appendix: Scripts & Checklist */}
    <section id="appendix" style={{background:'var(--bg2)'}}>
      <div className="page-wrap section-gap">
        <div className="chapter-header reveal">
          <div className="ch-num">AP</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{background:'var(--gray)', color:'#000'}}>A</div>
            <span className="ch-label-tag" style={{color:'var(--gray)'}}>Apêndices</span>
          </div>
          <h2>Scripts, Checklists<br/><em style={{color:'var(--gray)'}}>& Kit de Execução</em></h2>
          <p className="lead">Copie, cole e adapte. Templates prontos para uso imediato no dia a dia comercial.</p>
        </div>

        <h3 className="display mb-16" style={{fontSize:28, color:'var(--white)'}}>Scripts de Abertura Premium · 3 Versões</h3>
        <div className="card-script reveal">
          <div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span>Script Master · Abertura · 3 opções</span></div>
          <div className="card-script-body">
            <div className="script-line"><span className="script-who" style={{minWidth:80, fontSize:10, color:'var(--gold)'}}>Versão 1</span><div className="script-text">Oi, tudo bem? Aqui é o [NOME] da Splash. Pra eu te orientar certinho: é pra casa ou sítio/chácara?</div></div>
            <div className="script-line"><span className="script-who" style={{minWidth:80, fontSize:10, color:'var(--gold)'}}>Versão 2</span><div className="script-text">Oi! Aqui é o [NOME] da Splash. Você já tem tamanho em mente ou ainda está escolhendo?</div></div>
            <div className="script-line"><span className="script-who" style={{minWidth:80, fontSize:10, color:'var(--gold)'}}>Versão 3</span><div className="script-text">Oi! Piscina é aquela realização, né? O que te fez pensar em colocar uma agora?</div></div>
          </div>
        </div>

        <h3 className="display mb-16 mt-40" style={{fontSize:28, color:'var(--white)'}}>Conversa Completa · 3 Cenários</h3>
        <div className="card-script reveal">
          <div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span style={{color:'var(--green)'}}>🏠 Cenário Casa · Família + Estética + Instalação Tranquila</span></div>
          <div className="card-script-body">
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">Oi, quanto custa uma piscina de 6 metros?</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Oi! Tudo bem? Aqui é o [NOME] da Splash. Te passo sim. Só pra eu te passar um valor bem alinhado: é pra casa ou sítio/chácara?</div></div>
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">Casa.</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Perfeito. E vai ser mais pra curtir com a família no dia a dia ou pra receber amigos nos fins de semana?</div></div>
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">Família.</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Show. E você curte mais um estilo moderno/minimalista ou uma vibe mais resort?</div></div>
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">Moderno.</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Entendi. E o que você quer evitar a qualquer custo nessa instalação: bagunça, atraso ou custo surpresa?</div></div>
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">Atraso.</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Perfeito. Se puder, me manda uma foto do espaço. Aí eu te mostro 2 caminhos bem seguros e te passo o investimento com tudo que está incluso pra comparar justo.</div></div>
          </div>
        </div>

        <div className="card-script reveal">
          <div className="card-script-header"><div className="card-script-dots"><i></i><i></i><i></i></div><span style={{color:'var(--red)'}}>⚖️ Cenário Comparação · Concorrente 2× mais barato</span></div>
          <div className="card-script-body">
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">A outra empresa me passou bem menos. Por que vocês são mais caros?</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Entendo total — faz sentido comparar. Só pra comparar justo: qual o modelo/tamanho e o que está incluso no outro orçamento?</div></div>
            <div className="script-line"><span className="script-who cliente">Cliente</span><div className="script-text cliente">6m. Disseram que entregam e instalam.</div></div>
            <div className="script-line"><span className="script-who">Splash</span><div className="script-text">Perfeito. 'Entrega e instala' pode significar várias coisas. Me manda um print do orçamento e uma foto do teu espaço que eu te devolvo uma comparação clara e justa.</div></div>
          </div>
        </div>

        <h3 className="display mb-16 mt-40" style={{fontSize:28, color:'var(--white)'}}>Checklist Interno · Antes de Enviar Proposta</h3>
        <div className="card-check reveal">
          <div className="card-check-header"><div className="card-check-icon">📋</div><h4>10 pontos obrigatórios antes de qualquer proposta</h4></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Casa/sítio/chácara + cidade/bairro</strong> confirmados</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Perfil de uso</strong> identificado</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Estética desejada</strong> alinhada</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Acesso</strong> verificado</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Prioridade</strong> definida</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Medos mapeados</strong></div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Critério de decisão</strong> anotado</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Timing</strong> confirmado</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Referência de comparação</strong> verificada</div></div>
          <div className="check-item"><div className="check-box"></div><div className="check-text"><strong>Decisor</strong> identificado</div></div>
        </div>

        <h3 className="display mb-16 mt-40" style={{fontSize:28, color:'var(--white)'}}>Árvore de Objeções · Respostas Prontas</h3>
        <div className="col-2 reveal">
          <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Tá caro"</h4><div className="obj-q">Pergunta-mestre: "Esse caro é por comparação, orçamento ou inclusos?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Comparação</span><div className="obj-branch-text">"Qual marca/modelo e o que está incluso?"</div></div><div className="obj-branch"><span className="obj-branch-if">Orçamento</span><div className="obj-branch-text">"Prefere ajustar condição ou escopo?"</div></div><div className="obj-branch"><span className="obj-branch-if">Inclusos</span><div className="obj-branch-text">"Pesa mais instalação, acabamento ou garantia?"</div></div></div></div>
          <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Me dá desconto"</h4><div className="obj-q">Pergunta-mestre: "Desconto por orçamento ou por comparação?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Orçamento</span><div className="obj-branch-text">"Condição ou escopo? Sem tirar o essencial."</div></div><div className="obj-branch"><span className="obj-branch-if">Comparação</span><div className="obj-branch-text">"Me manda o print do outro orçamento."</div></div></div></div>
        </div>
        <div className="col-2 reveal">
          <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Manda só o preço"</h4><div className="obj-q">"Te passo sim. É pra casa ou sítio/chácara?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Insiste</span><div className="obj-branch-text">"Eu te passo uma faixa real. Me diz só casa/sítio + tamanho."</div></div></div></div>
          <div className="card-obj"><div className="card-obj-header"><span className="card-obj-tag">Objeção</span></div><h4>💬 "Preciso falar com cônjuge"</h4><div className="obj-q">"Claro. A preocupação principal dela/dele é instalação, custo, manutenção ou segurança?"</div><div className="obj-branches"><div className="obj-branch"><span className="obj-branch-if">Ação</span><div className="obj-branch-text">Mande resumo de 5 linhas + proposta para decidirem juntos.</div></div></div></div>
        </div>

        <h3 className="display mb-16 mt-40" style={{fontSize:28, color:'var(--white)'}}>Funil de Vendas Splash · Operacional</h3>
        <div className="funnel reveal">
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--gold-dim)","--funnel-text":"var(--gold)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--gold-dim)', color:'var(--gold)'}}>1</div><span className="funnel-step-name">Entrada (Lead)</span><span className="funnel-step-desc">Primeira mensagem + permissão</span></div></div>
          <div className="funnel-connector"></div>
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--blue-dim)","--funnel-text":"var(--blue)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--blue-dim)', color:'var(--blue)'}}>2</div><span className="funnel-step-name">Diagnóstico</span><span className="funnel-step-desc">Contexto → uso → critério → riscos</span></div></div>
          <div className="funnel-connector"></div>
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--blue-dim)","--funnel-text":"var(--ch6)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'rgba(91,200,200,0.15)', color:'var(--ch6)'}}>3</div><span className="funnel-step-name">Enquadramento Premium</span><span className="funnel-step-desc">Comparação justa + transformação</span></div></div>
          <div className="funnel-connector"></div>
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--purple-dim)","--funnel-text":"var(--purple)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--purple-dim)', color:'var(--purple)'}}>4</div><span className="funnel-step-name">Proposta</span><span className="funnel-step-desc">Preço + escopo claro</span></div></div>
          <div className="funnel-connector"></div>
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--red-dim)","--funnel-text":"var(--red)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--red-dim)', color:'var(--red)'}}>5</div><span className="funnel-step-name">Objeções</span><span className="funnel-step-desc">Protocolo do desconto</span></div></div>
          <div className="funnel-connector"></div>
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--gold-dim)","--funnel-text":"var(--ch7)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'rgba(224,181,91,0.15)', color:'var(--ch7)'}}>6</div><span className="funnel-step-name">Fechamento</span><span className="funnel-step-desc">Próximo passo claro + data</span></div></div>
          <div className="funnel-connector"></div>
          <div className="funnel-step"><div className="funnel-bar" style={{"--funnel-color":"var(--green-dim)","--funnel-text":"var(--green)"} as React.CSSProperties}><div className="funnel-step-num" style={{background:'var(--green-dim)', color:'var(--green)'}}>7</div><span className="funnel-step-name">Pós-venda & Fidelização</span><span className="funnel-step-desc">7/30/90 dias → indicação</span></div></div>
        </div>

        <div className="key-phrase reveal" style={{textAlign:'center'}}>
          "O atendimento premium não é sobre <em>fechar</em>.<br/>É sobre conduzir o cliente a <em>decidir com segurança</em>."
        </div>
      </div>
    </section>
  </>
);

export default AppendixContent;
