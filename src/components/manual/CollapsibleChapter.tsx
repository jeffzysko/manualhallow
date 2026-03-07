import { useState, ReactNode } from "react";

interface CollapsibleChapterProps {
  id: string;
  num: string;
  numBg: string;
  numColor?: string;
  tag: string;
  tagColor: string;
  title: ReactNode;
  lead: string;
  bgStyle?: string;
  tldr?: string[];
  children: ReactNode;
}

const CollapsibleChapter = ({
  id, num, numBg, numColor = "#000", tag, tagColor, title, lead, bgStyle = "var(--bg)", tldr, children
}: CollapsibleChapterProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <section id={id} style={{ background: bgStyle }}>
      <div className="page-wrap section-gap">
        <div className="chapter-header">
          <div className="ch-num">{num}</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{ background: numBg, color: numColor }}>
              {num.replace(/^0/, "")}
            </div>
            <span className="ch-label-tag" style={{ color: tagColor }}>{tag}</span>
          </div>
          <h2 dangerouslySetInnerHTML={{ __html: typeof title === "string" ? title : "" }} />
          {typeof title !== "string" && title}
          <p className="lead">{lead}</p>
        </div>

        <button
          className="section-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          <span className="collapse-hint">
            {collapsed ? "Toque para ler" : "Recolher"}
          </span>
          <div className="toggle-icon">
            <svg viewBox="0 0 24 24" style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {collapsed && (
          <div className="expand-cta" onClick={() => setCollapsed(false)}>
            <span className="expand-cta-text">Expandir conteúdo completo</span>
            <svg className="expand-cta-icon" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}

        <div className={`section-collapsible${collapsed ? " collapsed" : ""}`}>
          {tldr && (
            <div className="chapter-tldr">
              <div className="chapter-tldr-header">
                <span className="chapter-tldr-badge">TL;DR</span>
                <span className="chapter-tldr-title">Pontos-chave</span>
              </div>
              <ul className="chapter-tldr-list">
                {tldr.map((point, i) => <li key={i}>{point}</li>)}
              </ul>
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default CollapsibleChapter;
