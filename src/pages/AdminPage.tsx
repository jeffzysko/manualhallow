import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import TopHeader from "@/components/manual/TopHeader";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { CHAPTER_NAMES } from "@/data/chapters";
import "@/styles/manual.css";

interface AdminStats {
  total_users: number;
  active_users: number;
  total_favorites: number;
  total_notes: number;
  chapters_completed: number;
  popular_chapters: { chapter: string; total: number }[] | null;
  recent_users: { id: string; full_name: string | null; created_at: string; is_active: boolean; email: string }[] | null;
}

interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  is_active: boolean;
  total_favorites: number;
  chapters_read: number;
}

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "analytics">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    const [statsRes, usersRes] = await Promise.all([
      supabase.rpc("get_admin_stats"),
      supabase.rpc("admin_list_users"),
    ]);

    if (statsRes.error) {
      setError("Acesso negado. Você não tem permissão de administrador.");
      setLoading(false);
      return;
    }

    setStats(statsRes.data as unknown as AdminStats);
    setUsers((usersRes.data as unknown as UserRow[]) || []);
    setLoading(false);
  };

  const toggleUserActive = async (targetId: string, active: boolean) => {
    setTogglingId(targetId);
    await supabase.rpc("admin_toggle_user", { target_user_id: targetId, active });
    setUsers(prev => prev.map(u => u.id === targetId ? { ...u, is_active: active } : u));
    setTogglingId(null);
  };

  if (loading) {
    return (
      <div className="manual-page admin-center">
        <p className="admin-loading-text">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manual-page admin-center admin-error-page">
        <TopHeader />
        <p className="admin-error-text">{error}</p>
        <button className="admin-back-btn" onClick={() => navigate("/")}>
          Voltar ao Manual
        </button>
      </div>
    );
  }

  return (
    <div className="manual-page">
      <TopHeader />
      <div className="page-wrap admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="display admin-title">Painel Admin</h1>
            <p className="admin-desc">Gestão do Manual de Vendas Hallow</p>
          </div>
          <button className="admin-back-btn" onClick={() => navigate("/")}>
            ← Manual
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "overview" ? " admin-tab--active" : ""}`} onClick={() => setTab("overview")}>Visão Geral</button>
          <button className={`admin-tab${tab === "users" ? " admin-tab--active" : ""}`} onClick={() => setTab("users")}>Usuários ({users.length})</button>
          <button className={`admin-tab${tab === "analytics" ? " admin-tab--active" : ""}`} onClick={() => setTab("analytics")}>Analytics</button>
        </div>

        {tab === "overview" && (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="admin-stat-num">{stats?.total_users || 0}</span>
                <span className="admin-stat-label">Usuários</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num">{stats?.active_users || 0}</span>
                <span className="admin-stat-label">Ativos</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num">{stats?.total_favorites || 0}</span>
                <span className="admin-stat-label">Favoritos</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num">{stats?.total_notes || 0}</span>
                <span className="admin-stat-label">Anotações</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-num">{stats?.chapters_completed || 0}</span>
                <span className="admin-stat-label">Cap. Lidos</span>
              </div>
            </div>

            <div className="admin-section">
              <h3 className="admin-section-title">Capítulos mais favoritados</h3>
              {stats?.popular_chapters && stats.popular_chapters.length > 0 ? (
                <div className="admin-table">
                  {stats.popular_chapters.map((ch, i) => (
                    <div key={i} className="admin-table-row">
                      <span className="admin-table-name">{CHAPTER_NAMES[ch.chapter] || ch.chapter}</span>
                      <span className="admin-badge">{ch.total} favoritos</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">Nenhum dado disponível ainda.</p>
              )}
            </div>

            <div className="admin-section">
              <h3 className="admin-section-title">Últimos cadastros</h3>
              {stats?.recent_users && stats.recent_users.length > 0 ? (
                <div className="admin-table">
                  {stats.recent_users.map((u) => (
                    <div key={u.id} className="admin-table-row">
                      <div>
                        <span className="admin-user-name">{u.full_name || "Sem nome"}</span>
                        <span className="admin-user-email">{u.email}</span>
                      </div>
                      <div className="admin-user-meta">
                        <span className={u.is_active ? "admin-status--active" : "admin-status--inactive"}>
                          {u.is_active ? "Ativo" : "Inativo"}
                        </span>
                        <span className="admin-date">{new Date(u.created_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">Nenhum usuário cadastrado.</p>
              )}
            </div>
          </>
        )}

        {tab === "users" && (
          <div className="admin-section">
            <div className="admin-table">
              {users.map((u) => (
                <div key={u.id} className="admin-table-row admin-table-row--wrap">
                  <div className="admin-user-info">
                    <span className="admin-user-name admin-user-name--bold">{u.full_name || "Sem nome"}</span>
                    <span className="admin-user-email">{u.email}</span>
                  </div>
                  <div className="admin-user-badges">
                    <span className="admin-badge admin-badge--blue">{u.chapters_read} cap.</span>
                    <span className="admin-badge">{u.total_favorites} fav.</span>
                  </div>
                  <div className="admin-user-actions">
                    <span className="admin-date">{new Date(u.created_at).toLocaleDateString("pt-BR")}</span>
                    <button
                      className={`admin-toggle-btn ${u.is_active ? "admin-toggle-btn--danger" : "admin-toggle-btn--success"}`}
                      onClick={() => toggleUserActive(u.id, !u.is_active)}
                      disabled={togglingId === u.id}
                    >
                      {togglingId === u.id ? "…" : u.is_active ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
