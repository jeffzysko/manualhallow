import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import TopHeader from "@/components/manual/TopHeader";
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

import { CHAPTER_NAMES } from "@/data/chapters";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [tab, setTab] = useState<"overview" | "users">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    await supabase.rpc("admin_toggle_user", { target_user_id: targetId, active });
    setUsers(prev => prev.map(u => u.id === targetId ? { ...u, is_active: active } : u));
  };

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
        <TopHeader />
        <p style={{ color: "var(--red)", fontSize: 15 }}>{error}</p>
        <button onClick={() => navigate("/")} style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Voltar ao Manual
        </button>
      </div>
    );
  }

  return (
    <div className="manual-page">
      <TopHeader />
      <div className="page-wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="display" style={{ fontSize: 32, color: "var(--gold)", marginBottom: 4 }}>Painel Admin</h1>
            <p style={{ color: "var(--gray)", fontSize: 13 }}>Gestão do Manual de Vendas Hallow</p>
          </div>
          <button onClick={() => navigate("/")} style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
            ← Manual
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "overview" ? " admin-tab--active" : ""}`} onClick={() => setTab("overview")}>Visão Geral</button>
          <button className={`admin-tab${tab === "users" ? " admin-tab--active" : ""}`} onClick={() => setTab("users")}>Usuários ({users.length})</button>
        </div>

        {tab === "overview" && (
          <>
            {/* Stats Cards */}
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
                      <div>
                        <span style={{ color: "var(--white)", fontSize: 14, display: "block" }}>{u.full_name || "Sem nome"}</span>
                        <span style={{ color: "var(--gray)", fontSize: 11 }}>{u.email}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: u.is_active ? "var(--green)" : "var(--red)", fontSize: 11, fontWeight: 600 }}>
                          {u.is_active ? "Ativo" : "Inativo"}
                        </span>
                        <span style={{ color: "var(--gray)", fontSize: 12 }}>
                          {new Date(u.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--gray)", fontSize: 13 }}>Nenhum usuário cadastrado.</p>
              )}
            </div>
          </>
        )}

        {tab === "users" && (
          <div className="admin-section">
            <div className="admin-table">
              {users.map((u) => (
                <div key={u.id} className="admin-table-row" style={{ flexWrap: "wrap", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <span style={{ color: "var(--white)", fontSize: 14, display: "block", fontWeight: 600 }}>{u.full_name || "Sem nome"}</span>
                    <span style={{ color: "var(--gray)", fontSize: 12 }}>{u.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="admin-badge" style={{ background: "var(--blue-dim)", color: "var(--blue)" }}>{u.chapters_read} cap.</span>
                    <span className="admin-badge">{u.total_favorites} fav.</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--gray)", fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString("pt-BR")}</span>
                    <button
                      onClick={() => toggleUserActive(u.id, !u.is_active)}
                      style={{
                        padding: "5px 14px",
                        fontSize: 11,
                        fontWeight: 600,
                        borderRadius: 8,
                        border: "1px solid",
                        cursor: "pointer",
                        background: u.is_active ? "var(--red-dim)" : "var(--green-dim)",
                        color: u.is_active ? "var(--red)" : "var(--green)",
                        borderColor: u.is_active ? "rgba(224,92,92,0.3)" : "rgba(92,184,138,0.3)",
                      }}
                    >
                      {u.is_active ? "Desativar" : "Ativar"}
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
