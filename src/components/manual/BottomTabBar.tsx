interface BottomTabBarProps {
  onScrollTop: () => void;
  onOpenDrawer: () => void;
  onOpenNotes: () => void;
  onOpenAI?: () => void;
}

const BottomTabBar = ({ onScrollTop, onOpenDrawer, onOpenNotes, onOpenAI }: BottomTabBarProps) => (
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
  </nav>
);

export default BottomTabBar;
