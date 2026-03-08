const ManualCover = () => (
  <section id="cover">
    <div className="cover-bg" />
    <div className="cover-grid" />
    <div className="cover-line" />

    <div className="cover-inner">
      <div className="cover-left fade-up">
        <div className="cover-badge">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>Padrão Hallow · Edição 2026</span>
        </div>

        <h1 className="cover-title">
          Manual de<br/>
          Atendimento<br/>
          <em>& Vendas</em>
        </h1>
        <div className="cover-subtitle">Hallow Comunicação · Splash Piscinas</div>

        <div className="cover-desc">
          Guia prático para rotina comercial e atendimento premium. Do primeiro contato ao pós-venda: scripts, técnicas, checklists e o método para vender valor — não preço.
        </div>

        <div className="cover-stats">
          <div className="cover-stat">
            <span className="cover-stat-num">12</span>
            <div className="cover-stat-label">Capítulos</div>
          </div>
          <div className="cover-stat">
            <span className="cover-stat-num">50+</span>
            <div className="cover-stat-label">Scripts Prontos</div>
          </div>
          <div className="cover-stat">
            <span className="cover-stat-num">100%</span>
            <div className="cover-stat-label">Premium</div>
          </div>
        </div>
      </div>

      <div className="cover-right fade-in" style={{ animationDelay: ".3s" }}>
        <div className="cover-card">
          <div className="cover-card-icon">🎯</div>
          <h3>Diagnóstico Premium</h3>
          <p>Descubra o que o cliente realmente quer sem parecer interrogatório. Perguntas estratégicas, ritmo certo.</p>
        </div>
        <div className="cover-card">
          <div className="cover-card-icon">💎</div>
          <h3>Valor Antes de Preço</h3>
          <p>Venda 2× mais caro justificando valor, não descontando. A fórmula das 3 certezas para fechar premium.</p>
        </div>
        <div className="cover-card">
          <div className="cover-card-icon">🤝</div>
          <h3>Fechamento sem Pressão</h3>
          <p>Escada do SIM, micro-compromissos e condução consultiva que transforma leads em promotores.</p>
        </div>
      </div>
    </div>

    <div className="cover-footer fade-up" style={{ animationDelay: ".5s" }}>
      <div className="cover-brand">
        <span className="cover-brand-name">Hallow</span>
        <div className="cover-brand-sep" />
        <span className="cover-brand-sub">Comunicação</span>
      </div>
      <span className="cover-edition">Guia Interno · Confidencial · 2026</span>
    </div>
  </section>
));

ManualCover.displayName = "ManualCover";

export default ManualCover;
