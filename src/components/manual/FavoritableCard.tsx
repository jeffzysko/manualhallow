import { useRef, useState, useCallback } from "react";
import { useFavoritesContext } from "@/contexts/FavoritesContext";

interface FavoritableCardProps {
  id: string;
  label: string;
  chapter: string;
  children: React.ReactNode;
  className?: string;
}

const FavoritableCard = ({ id, label, chapter, children, className = "" }: FavoritableCardProps) => {
  const { isFavorite, toggleFavorite, isLoggedIn } = useFavoritesContext();
  const [longPressToast, setLongPressToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movedRef = useRef(false);

  const active = isFavorite(id);

  const handleToggle = useCallback(() => {
    toggleFavorite(id, label, chapter);
  }, [id, label, chapter, toggleFavorite]);

  const showToast = useCallback(() => {
    setLongPressToast(true);
    setTimeout(() => setLongPressToast(false), 1200);
  }, []);

  const onTouchStart = useCallback(() => {
    if (!isLoggedIn) return;
    movedRef.current = false;
    timerRef.current = setTimeout(() => {
      handleToggle();
      showToast();
    }, 600);
  }, [isLoggedIn, handleToggle, showToast]);

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onTouchMove = useCallback(() => {
    movedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className={`favoritable-card ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      {children}

      {isLoggedIn && (
        <div className="fav-footer-bar">
          <span className="fav-footer-label">{label}</span>
          <button
            className={`fav-footer-btn ${active ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <svg viewBox="0 0 24 24" width="14" height="14">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={active ? "var(--gold)" : "none"}
                stroke={active ? "var(--gold)" : "var(--gray2)"}
                strokeWidth="1.5"
              />
            </svg>
            <span>{active ? "Salvo" : "Salvar"}</span>
          </button>
        </div>
      )}

      {longPressToast && (
        <div className="fav-longpress-toast">
          {active ? "★ Removido" : "★ Salvo nos favoritos"}
        </div>
      )}
    </div>
  );
};

export default FavoritableCard;
