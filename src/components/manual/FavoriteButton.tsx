interface FavoriteButtonProps {
  active: boolean;
  onClick: () => void;
  className?: string;
}

const FavoriteButton = ({ active, onClick, className = "" }: FavoriteButtonProps) => (
  <button
    className={`favorite-btn ${active ? "active" : ""} ${className}`}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
  >
    <svg viewBox="0 0 24 24" width="18" height="18">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={active ? "var(--gold)" : "none"}
        stroke={active ? "var(--gold)" : "var(--gray2)"}
        strokeWidth="1.5"
      />
    </svg>
  </button>
);

export default FavoriteButton;
