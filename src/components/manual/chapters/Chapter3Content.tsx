import FavoritableCard from "../FavoritableCard";

const Chapter3Content = () => (
  <>
    <div className="col-2 reveal">
      <FavoritableCard id="ch3-espelho-palavras" label="Espelhamento: Palavras" chapter="Capítulo 03">
        <div className="card" style={{borderColor:'rgba(91,155,213,0.3)'}}>
          <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
            <div style={{fontSize:28}}>🔤</div>
            <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:22, color:'var(--white)'}}>1 · Palavras</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <div style={{background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'14px 16px'}}>
              <div style={{fontSize:11, color:'var(--gray)', marginBottom:6, textTransform:'uppercase', letterSpacing:1}}>Cliente diz</div>
              <div style={{fontSize:14, color:'var(--gray)', fontStyle:'italic'}}>"não quero dor de cabeça"</div>
              <div style={{height:1, background:'var(--border2)', margin:'10px 0'}}></div>
              <div style={{fontSize:11, color:'var(--blue)', marginBottom:6, textTransform:'uppercase', letterSpacing:1}}>Você responde</div>
              <div style={{fontSize:14, color:'var(--white)'}}>"Perfeito — foco em <strong>zero dor de cabeça</strong> e previsibilidade."</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'14px 16px'}}>
              <div style={{fontSize:11, color:'var(--gray)', marginBottom:6, textTransform:'uppercase', letterSpacing:1}}>Cliente diz</div>
              <div style={{fontSize:14, color:'var(--gray)', fontStyle:'italic'}}>"quero no padrão da casa"</div>
              <div style={{height:1, background:'var(--border2)', margin:'10px 0'}}></div>
              <div style={{fontSize:11, color:'var(--blue)', marginBottom:6, textTransform:'uppercase', letterSpacing:1}}>Você responde</div>
              <div style={{fontSize:14, color:'var(--white)'}}>"Entendi — precisa ficar no <strong>mesmo nível estético do imóvel</strong>."</div>
            </div>
          </div>
        </div>
      </FavoritableCard>

      <FavoritableCard id="ch3-espelho-ritmo" label="Espelhamento: Ritmo" chapter="Capítulo 03">
        <div className="card" style={{borderColor:'rgba(201,169,106,0.3)'}}>
          <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:16}}>
            <div style={{fontSize:28}}>⏱️</div>
            <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:22, color:'var(--white)'}}>2 · Ritmo</h3>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <div className="check-item"><div className="check-box checked"></div><div className="check-text">Cliente escreve <strong>curto</strong> → responda curto</div></div>
            <div className="check-item"><div className="check-box checked"></div><div className="check-text">Cliente manda <strong>áudio</strong> → responda em áudio de 20–30s</div></div>
            <div className="check-item"><div className="check-box checked"></div><div className="check-text">Cliente <strong>demora</strong> → não cobre; faça follow-up leve</div></div>
            <div className="check-item"><div className="check-box checked"></div><div className="check-text">Cliente <strong>detalhista</strong> → você mais detalhista também</div></div>
          </div>
          <div className="note-box mt-16" style={{margin:'16px 0 0'}}>
            <div className="note-icon">🎵</div>
            <p><strong>Regra-mãe do WhatsApp premium:</strong> 1 mensagem = 1 intenção. 1 áudio = 1 pergunta.</p>
          </div>
        </div>
      </FavoritableCard>
    </div>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Técnica: Rotular + Validar + Perguntar</h3>
    <FavoritableCard id="ch3-rvp" label="Técnica: Rotular + Validar + Perguntar" chapter="Capítulo 03">
      <div className="card reveal" style={{borderColor:'rgba(201,169,106,0.2)'}}>
        <p className="prose" style={{marginBottom:24}}>Estrutura de 1 mensagem premium — use consistentemente para criar ritmo de conversa:</p>
        <div className="mobile-rvp-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16}}>
          <div style={{textAlign:'center', padding:20, background:'var(--gold-dim)', borderRadius:12}}>
            <div style={{fontSize:32, marginBottom:12}}>🏷️</div>
            <div style={{fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', fontWeight:700, marginBottom:8}}>Rótulo</div>
            <div style={{fontSize:13, color:'var(--white)'}}>"Pelo que você me disse, parece que o principal é X…"</div>
          </div>
          <div style={{textAlign:'center', padding:20, background:'var(--green-dim)', borderRadius:12}}>
            <div style={{fontSize:32, marginBottom:12}}>✅</div>
            <div style={{fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'var(--green)', fontWeight:700, marginBottom:8}}>Validação</div>
            <div style={{fontSize:13, color:'var(--white)'}}>"Entendo total / faz sentido."</div>
          </div>
          <div style={{textAlign:'center', padding:20, background:'var(--blue-dim)', borderRadius:12}}>
            <div style={{fontSize:32, marginBottom:12}}>❓</div>
            <div style={{fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'var(--blue)', fontWeight:700, marginBottom:8}}>Pergunta</div>
            <div style={{fontSize:13, color:'var(--white)'}}>"É mais por Y ou por Z?"</div>
          </div>
        </div>
      </div>
    </FavoritableCard>

    <h3 className="display mb-24 mt-40" style={{fontSize:28, color:'var(--white)'}}>Postura Consultiva · Tom que Fecha</h3>
    <p className="prose reveal">No premium, <strong>postura é metade da venda</strong>. Quem parece inseguro vira vendedor de preço. Quem parece organizado vira consultor.</p>
    <FavoritableCard id="ch3-checklist-tom" label="Checklist: Tom que Fecha" chapter="Capítulo 03">
      <div className="card-check reveal">
        <div className="card-check-header">
          <div className="card-check-icon">🎭</div>
          <h4>Checklist de Tom — O que o cliente deve sentir</h4>
        </div>
        <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>Calma e segurança</strong> — sem pressa, sem ansiedade</div></div>
        <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>Clareza e direção</strong> — próximo passo sempre simples e claro</div></div>
        <div className="check-item"><div className="check-box checked"></div><div className="check-text"><strong>Cuidado</strong> — diagnóstico sempre antes do preço</div></div>
      </div>
    </FavoritableCard>
  </>
);

export default Chapter3Content;
