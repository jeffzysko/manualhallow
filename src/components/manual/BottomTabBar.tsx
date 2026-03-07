interface BottomTabBarProps {
  onScrollTop: () => void;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenFavorites: () => void;
  onOpenNotes: () => void;
  onToggleScripts: () => void;
  scriptsMode: boolean;
}

const BottomTabBar = ({ onScrollTop, onOpenDrawer, onOpenSearch, onOpenFavorites, onOpenNotes, onToggleScripts, scriptsMode }: BottomTabBarProps) => (
  <nav className="bottom-tab-bar" id="bottom-tab-bar">
    <button className="tab-item" onClick={onScrollTop} aria-label="Início">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Início</span>
    </button>
    <button className="tab-item" onClick={onOpenDrawer} aria-label="Sumário">
      <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
      <span>Sumário</span>
    </button>
    <button className="tab-item" onClick={onOpenSearch} aria-label="Buscar">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <span>Buscar</span>
    </button>
    <button className="tab-item" onClick={onOpenNotes} aria-label="Notas">
      <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      <span>Notas</span>
    </button>
    <button className="tab-item" onClick={onOpenFavorites} aria-label="Favoritos">
      <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"/></svg>
      <span>Favoritos</span>
    </button>
  </nav>
);

export default BottomTabBar;
