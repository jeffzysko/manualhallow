import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "@/styles/manual.css";

interface AdminStats {
  total_users: number;
  total_favorites: number;
  chapters_completed: number;
  popular_chapters: { chapter: string; total: number }[] | null;
  recent_users: { id: string; full_name: string | null; created_at: string }[] | null;
}

const CHAPTER_NAMES: Record<string, string> = {
  ch1: "01 · O Jogo do Premium",
  ch2: "02 · Diagnóstico",
  ch3: "03 · Espelhamento",
  ch4: "04 · Escada do SIM",
  ch5: "05 · Valor & Preço",
  ch6: "06 · Persuasão",
  ch7: "07 · Fechamento",
  ch8: "08 · Experiência",
  ch9: "09 · Planejamento",
};

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }

    const fetchStats = async () => {
      const { data, error } = await supabase.rpc("get_admin_stats");
      if (error) {
        setError("Acesso negado. Você não tem permissão de administrador.");
        setLoading(false);
        return;
      }
      setStats(data as unknown as AdminStats);
      setLoading(false);
    };
    fetchStats();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="manual-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--gray)" }}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manual-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingTop: 0 }}>
        <p style={{ color: "var(--red)", fontSize: 15 }}>{error}</p>
        <button onClick={() => navigate("/")} style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Voltar ao Manual
        </button>
      </div>
    );
  }

  return (
    <div className="manual-page">
      <div className="page-wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <h1 className="display" style={{ fontSize: 32, color: "var(--gold)", marginBottom: 4 }}>Painel Admin</h1>
            <p style={{ color: "var(--gray)", fontSize: 13 }}>Visão geral do Manual de Vendas</p>
          </div>
          <button onClick={() => navigate("/")} style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
            ← Manual
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-num">{stats?.total_users || 0}</span>
            <span className="admin-stat-label">Usuários</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-num">{stats?.total_favorites || 0}</span>
            <span className="admin-stat-label">Favoritos</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-num">{stats?.chapters_completed || 0}</span>
            <span className="admin-stat-label">Capítulos Lidos</span>
          </div>
        </div>

        {/* Popular Chapters */}
        <div className="admin-section">
          <h3 style={{ color: "var(--white)", fontSize: 18, marginBottom: 16 }}>Capítulos mais favoritados</h3>
          {stats?.popular_chapters && stats.popular_chapters.length > 0 ? (
            <div className="admin-table">
              {stats.popular_chapters.map((ch, i) => (
                <div key={i} className="admin-table-row">
                  <span style={{ color: "var(--white)", fontSize: 14 }}>{CHAPTER_NAMES[ch.chapter] || ch.chapter}</span>
                  <span className="admin-badge">{ch.total} favoritos</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--gray)", fontSize: 13 }}>Nenhum dado disponível ainda.</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="admin-section">
          <h3 style={{ color: "var(--white)", fontSize: 18, marginBottom: 16 }}>Últimos cadastros</h3>
          {stats?.recent_users && stats.recent_users.length > 0 ? (
            <div className="admin-table">
              {stats.recent_users.map((u) => (
                <div key={u.id} className="admin-table-row">
                  <span style={{ color: "var(--white)", fontSize: 14 }}>{u.full_name || "Sem nome"}</span>
                  <span style={{ color: "var(--gray)", fontSize: 12 }}>
                    {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--gray)", fontSize: 13 }}>Nenhum usuário cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
