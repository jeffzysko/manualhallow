interface BottomTabBarProps {
  onScrollTop: () => void;
  onOpenDrawer: () => void;
  onOpenNotes: () => void;
  onToggleScripts: () => void;
  onOpenAI?: () => void;
  scriptsMode: boolean;
}

const BottomTabBar = ({ onScrollTop, onOpenDrawer, onOpenNotes, onToggleScripts, onOpenAI, scriptsMode }: BottomTabBarProps) => (
  <nav className="bottom-tab-bar" id="bottom-tab-bar">
    <button className="tab-item" onClick={onScrollTop} aria-label="Início">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Início</span>
    </button>
    <button className="tab-item" onClick={onOpenDrawer} aria-label="Sumário">
      <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
      <span>Sumário</span>
    </button>
    {onOpenAI && (
      <button className="tab-item tab-item--ai" onClick={onOpenAI} aria-label="Assistente IA">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <span>IA</span>
      </button>
    )}
    <button className="tab-item" onClick={onOpenNotes} aria-label="Notas">
      <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      <span>Notas</span>
    </button>
    <button className={`tab-item${scriptsMode ? " active" : ""}`} onClick={onToggleScripts} aria-label="Scripts">
      <svg viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
      <span>Scripts</span>
    </button>
  </nav>
);

export default BottomTabBar;
