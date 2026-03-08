import { useState, useRef, useCallback, ReactNode } from "react";
import FavoriteButton from "./FavoriteButton";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useInView } from "@/hooks/useInView";

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
  isRead?: boolean;
  onToggleRead?: () => void;
  scriptsMode?: boolean;
}

const CollapsibleChapter = ({
  id, num, numBg, numColor = "#000", tag, tagColor, title, lead, bgStyle = "var(--bg)", tldr, children, isRead, onToggleRead, scriptsMode = false
}: CollapsibleChapterProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const isCollapsed = scriptsMode ? false : collapsed;
  const { isFavorite, toggleFavorite, isLoggedIn } = useFavoritesContext();
  const { ref: animRef, isVisible } = useInView();
  const sectionRef = useRef<HTMLElement>(null);

  const handleExpand = useCallback(() => {
    const wasCollapsed = collapsed;
    setCollapsed(prev => !prev);
    // When expanding, scroll back to section after a tick so content renders
    if (wasCollapsed) {
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [collapsed]);

  const chapterLabel = `Cap. ${num.replace(/^0/, "")} — ${tag}`;

  return (
    <section id={id} ref={sectionRef} style={{ background: bgStyle, position: "relative" }}>
      <div
        ref={animRef}
        className={`page-wrap section-gap chapter-animate${isVisible ? " chapter-visible" : ""}`}
      >
        <div className="chapter-header" style={{ position: "relative" }}>
          <div className="ch-num">{num}</div>
          <div className="ch-label">
            <div className="ch-label-num" style={{ background: numBg, color: numColor }}>
              {num.replace(/^0/, "")}
            </div>
            <span className="ch-label-tag" style={{ color: tagColor }}>{tag}</span>
          </div>
          {title}
          <p className="lead">{lead}</p>

          {isLoggedIn && (
            <FavoriteButton
              active={isFavorite(id)}
              onClick={() => toggleFavorite(id, chapterLabel, `Capítulo ${num}`)}
              className="chapter-fav-btn"
            />
          )}
          {isLoggedIn && onToggleRead && (
            <button
              className={`chapter-read-check${isRead ? " chapter-read-check--done" : ""}`}
              onClick={onToggleRead}
              title={isRead ? "Marcar como não lido" : "Marcar como lido"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isRead ? "3" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{isRead ? "Lido" : "Marcar como lido"}</span>
            </button>
          )}
        </div>

        {!scriptsMode && (
          <button
            className="section-toggle"
            onClick={handleExpand}
            aria-expanded={!isCollapsed}
          >
            <span className="collapse-hint">
              {isCollapsed ? "Toque para ler" : "Recolher"}
            </span>
            <div className="toggle-icon">
              <svg viewBox="0 0 24 24" style={{ transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>
        )}

        {!scriptsMode && isCollapsed && (
          <div
            className="expand-cta"
            role="button"
            tabIndex={0}
            onClick={handleExpand}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleExpand(); } }}
            aria-label={`Expandir conteúdo do capítulo ${num}`}
          >
            <span className="expand-cta-text">Expandir conteúdo completo</span>
            <svg className="expand-cta-icon" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}

        {!isCollapsed && (
          <div className="section-collapsible">
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
        )}
      </div>
    </section>
  );
};

export default CollapsibleChapter;
