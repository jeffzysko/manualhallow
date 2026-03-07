import { useState, ReactNode } from "react";
import FavoriteButton from "./FavoriteButton";
import SectionNote from "./SectionNote";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

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
  const { isFavorite, toggleFavorite, isLoggedIn } = useFavoritesContext();

  // Extract plain text from title for favorite label
  const chapterLabel = `Cap. ${num.replace(/^0/, "")} — ${tag}`;

  return (
    <section id={id} style={{ background: bgStyle, position: "relative" }}>
      <div className="page-wrap section-gap">
        <div className="chapter-header" style={{ position: "relative" }}>
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

          {isLoggedIn && (
            <FavoriteButton
              active={isFavorite(id)}
              onClick={() => toggleFavorite(id, chapterLabel, `Capítulo ${num}`)}
              className="chapter-fav-btn"
            />
          )}
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
          {isLoggedIn && (
            <SectionNote sectionId={id} chapterId={`Capítulo ${num}`} />
          )}
        </div>
      </div>
    </section>
  );
};

export default CollapsibleChapter;
