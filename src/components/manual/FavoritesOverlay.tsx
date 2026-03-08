import { useState } from "react";
import type { FavoriteItem } from "@/hooks/useFavorites";

interface FavoritesOverlayProps {
  open: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onNavigate: (id: string) => void;
  onRemove: (itemId: string) => void;
}

const FavoritesOverlay = ({ open, onClose, favorites, onNavigate, onRemove }: FavoritesOverlayProps) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleRemove = (itemId: string) => {
    onRemove(itemId);
    setConfirmId(null);
  };

  const handleClose = () => {
    setConfirmId(null);
    onClose();
  };

  return (
    <div className={`search-overlay${open ? " open" : ""}`} onClick={handleClose}>
      <div className="search-box fav-overlay-box" onClick={e => e.stopPropagation()}>
        <div className="fav-overlay-header">
          <h3 className="display fav-overlay-title">★ Favoritos</h3>
          <button className="fav-overlay-close" onClick={handleClose} aria-label="Fechar">✕</button>
        </div>

        <div className="fav-overlay-list">
          {favorites.length === 0 ? (
            <div className="fav-overlay-empty">
              <p>Nenhum favorito salvo ainda.</p>
              <span>Toque na ★ nos cards e scripts para salvar.</span>
            </div>
          ) : (
            favorites.map(fav => (
              <div key={fav.id} className="fav-overlay-item">
                <div
                  className="fav-overlay-item-info"
                  onClick={() => { onNavigate(fav.item_id); handleClose(); }}
                >
                  <div className="fav-overlay-item-title">{fav.item_title}</div>
                  <div className="fav-overlay-item-chapter">{fav.item_chapter}</div>
                </div>

                {confirmId === fav.item_id ? (
                  <div className="fav-confirm-group">
                    <button
                      className="fav-confirm-yes"
                      onClick={e => { e.stopPropagation(); handleRemove(fav.item_id); }}
                    >
                      Sim
                    </button>
                    <button
                      className="fav-confirm-no"
                      onClick={e => { e.stopPropagation(); setConfirmId(null); }}
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    className="fav-overlay-item-remove"
                    onClick={e => { e.stopPropagation(); setConfirmId(fav.item_id); }}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesOverlay;
