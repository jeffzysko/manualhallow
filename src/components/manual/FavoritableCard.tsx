import FavoriteButton from "./FavoriteButton";
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

  return (
    <div className={`favoritable-card ${className}`}>
      {isLoggedIn && (
        <div className="favoritable-card-header">
          <span className="favoritable-card-label">{label}</span>
          <FavoriteButton
            active={isFavorite(id)}
            onClick={() => toggleFavorite(id, label, chapter)}
            className="element-fav-btn"
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default FavoritableCard;
