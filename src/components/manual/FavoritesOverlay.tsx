import type { FavoriteItem } from "@/hooks/useFavorites";

interface FavoritesOverlayProps {
  open: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onNavigate: (id: string) => void;
  onRemove: (itemId: string) => void;
}

const FavoritesOverlay = ({ open, onClose, favorites, onNavigate, onRemove }: FavoritesOverlayProps) => {
  return (
    <div className={`search-overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="search-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: "1px solid var(--border2)" }}>
          <h3 className="display" style={{ fontSize: 22, color: "var(--gold)", margin: 0 }}>★ Favoritos</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--gray)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: "8px 0", maxHeight: "60vh", overflowY: "auto" }}>
          {favorites.length === 0 ? (
            <p style={{ color: "var(--gray)", fontSize: 14, textAlign: "center", padding: "32px 20px" }}>
              Nenhum favorito salvo ainda.<br />
              <span style={{ fontSize: 12 }}>Toque na ★ nos cards e scripts para salvar.</span>
            </p>
          ) : (
            favorites.map(fav => (
              <div
                key={fav.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px", borderBottom: "1px solid var(--border2)", cursor: "pointer",
                }}
                onClick={() => { onNavigate(fav.item_id); onClose(); }}
              >
                <div>
                  <div style={{ color: "var(--white)", fontSize: 14, fontWeight: 500 }}>{fav.item_title}</div>
                  <div style={{ color: "var(--gray2)", fontSize: 11, marginTop: 2 }}>{fav.item_chapter}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onRemove(fav.item_id); }}
                  style={{ background: "none", border: "none", color: "var(--red)", fontSize: 12, cursor: "pointer", padding: "4px 8px" }}
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesOverlay;
