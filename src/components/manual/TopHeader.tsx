import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const TopHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        <div className="top-header__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="top-header__logo-text">HALLOW</span>
          <span className="top-header__logo-sub">Manual de Vendas</span>
        </div>

        {/* User Area */}
        {user ? (
          <div className="top-header__user">
            <button
              className="top-header__avatar"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu do usuário"
            >
              {initials}
            </button>

            {menuOpen && (
              <>
                <div className="top-header__overlay" onClick={() => setMenuOpen(false)} />
                <div className="top-header__dropdown">
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
                  <button className="top-header__dropdown-btn" onClick={handleSignOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sair da conta
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button className="top-header__login-btn" onClick={() => navigate("/auth")}>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default TopHeader;
