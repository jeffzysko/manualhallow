interface DrawerItem {
  label: string;
  target: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
  activeSection: string;
}

const items: DrawerItem[] = [
  { label: "Capa", target: "cover" },
  { label: "Sumário", target: "toc" },
  { label: "Premium", target: "ch1" },
  { label: "Diagnóstico", target: "ch2" },
  { label: "Espelhamento", target: "ch3" },
  { label: "Escada do SIM", target: "ch4" },
  { label: "Valor", target: "ch5" },
  { label: "Persuasão", target: "ch6" },
  { label: "Fechamento", target: "ch7" },
  { label: "Fidelização", target: "ch8" },
  { label: "Acessórios", target: "choa" },
  { label: "Metas 2026", target: "ch9" },
  { label: "Provas Sociais", target: "chps" },
  { label: "Objeções Acessórios", target: "choa" },
  { label: "Lead Frio", target: "chlf" },
  { label: "Guia de Fotos", target: "chgf" },
  { label: "Template Proposta", target: "chtp" },
  { label: "Apêndices", target: "appendix" },
];

const MobileDrawer = ({ open, onClose, onNavigate, activeSection }: MobileDrawerProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`mobile-drawer-overlay${open ? " open" : ""}`} onClick={handleOverlayClick}>
      <div className="mobile-drawer">
        <div className="drawer-header">
          <span className="drawer-logo">Hallow</span>
          <button className="drawer-close" onClick={onClose} aria-label="Fechar menu">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="drawer-nav">
          {items.map(item => (
            <button
              key={item.target}
              className={`drawer-nav-item${activeSection === item.target ? " active" : ""}`}
              onClick={() => { onNavigate(item.target); onClose(); }}
            >
              <span className="drawer-nav-dot" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
