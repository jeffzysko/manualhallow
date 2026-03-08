import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TopHeaderProps {
  onOpenSearch?: () => void;
  onOpenFavorites?: () => void;
  onToggleScripts?: () => void;
  scriptsMode?: boolean;
}

const TopHeader = ({ onOpenSearch, onOpenFavorites, onToggleScripts, onExportPDF, scriptsMode }: TopHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [menuOpen]);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "?";

  return (
    <header className={`top-header${scrolled ? " top-header--scrolled" : ""}`}>
      <div className="top-header__inner">
        {/* Logo */}
        <button className="top-header__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Voltar ao topo">
          <span className="top-header__logo-text">HALLOW</span>
          <span className="top-header__logo-sub">Manual de Vendas</span>
        </button>

        {/* Actions */}
        <div className="top-header__actions">
          {onToggleScripts && (
            <button
              className={`top-header__icon-btn${scriptsMode ? " top-header__icon-btn--active" : ""}`}
              onClick={onToggleScripts}
              aria-label="Modo Scripts"
              data-tooltip="Scripts"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </button>
          )}
          {onOpenSearch && (
            <button className="top-header__icon-btn" onClick={onOpenSearch} aria-label="Buscar" data-tooltip="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}
          {onOpenFavorites && (
            <button className="top-header__icon-btn" onClick={onOpenFavorites} aria-label="Favoritos" data-tooltip="Favoritos">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}
          {onExportPDF && (
            <button className="top-header__icon-btn" onClick={onExportPDF} aria-label="Exportar PDF" data-tooltip="Exportar PDF">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          )}

          {/* User Area */}
          {user ? (
            <div className="top-header__user">
              <button
                ref={avatarRef}
                className="top-header__avatar"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu do usuário"
              >
                {initials}
              </button>

              {menuOpen && (
                <div ref={dropdownRef} className="top-header__dropdown">
                  <div className="top-header__dropdown-header">
                    <div className="top-header__dropdown-avatar">{initials}</div>
                    <div>
                      {user.user_metadata?.full_name && (
                        <p className="top-header__dropdown-name">{user.user_metadata.full_name}</p>
                      )}
                      <p className="top-header__dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="top-header__dropdown-divider" />
                  {isAdmin && (
                    <button className="top-header__dropdown-btn" onClick={() => { setMenuOpen(false); navigate("/admin"); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                      Painel Admin
                    </button>
                  )}
                  <button className="top-header__dropdown-btn" onClick={handleSignOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="top-header__login-btn" onClick={() => navigate("/auth")}>
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
