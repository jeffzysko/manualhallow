interface BottomTabBarProps {
  onScrollTop: () => void;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenFavorites: () => void;
  onToggleScripts: () => void;
  scriptsMode: boolean;
}

const BottomTabBar = ({ onScrollTop, onOpenDrawer, onOpenSearch, onOpenFavorites, onToggleScripts, scriptsMode }: BottomTabBarProps) => (
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
    <button className="tab-item" onClick={onOpenFavorites} aria-label="Favoritos">
      <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"/></svg>
      <span>Favoritos</span>
    </button>
    <button className={`tab-item${scriptsMode ? " active" : ""}`} onClick={onToggleScripts} aria-label="Scripts">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <span>{scriptsMode ? "Sair" : "Scripts"}</span>
    </button>
  </nav>
);

export default BottomTabBar;
