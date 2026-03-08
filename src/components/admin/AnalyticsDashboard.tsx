import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CHAPTER_NAMES } from "@/data/chapters";

interface AnalyticsSummary {
  total_events: number;
  unique_users: number;
  chapter_views: { chapter_id: string; views: number; unique_users: number }[] | null;
  daily_activity: { day: string; events: number; users: number }[] | null;
  event_breakdown: { event_type: string; total: number }[] | null;
  avg_reading_seconds: number;
  ai_chat_count: number;
}

const EVENT_LABELS: Record<string, string> = {
  chapter_view: "Visualização",
  reading_time: "Leitura",
  ai_chat: "Chat IA",
  favorite: "Favorito",
  note: "Anotação",
  search: "Busca",
  login: "Login",
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.rpc("get_analytics_summary", { days_back: days }).then(({ data: d }) => {
      setData(d as unknown as AnalyticsSummary);
      setLoading(false);
    });
  }, [days]);

  if (loading) return <p className="admin-loading-text">Carregando analytics...</p>;
  if (!data) return <p className="admin-empty">Nenhum dado disponível.</p>;

  const maxViews = data.chapter_views ? Math.max(...data.chapter_views.map(c => c.views)) : 1;
  const maxDaily = data.daily_activity ? Math.max(...data.daily_activity.map(d => d.events)) : 1;

  return (
    <div className="analytics-dashboard">
      {/* Period selector */}
      <div className="analytics-period">
        {[7, 14, 30, 90].map(d => (
          <button
            key={d}
            className={`analytics-period-btn${days === d ? " analytics-period-btn--active" : ""}`}
            onClick={() => setDays(d)}
          >
            {d}d
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-num">{data.total_events}</span>
          <span className="admin-stat-label">Eventos</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{data.unique_users}</span>
          <span className="admin-stat-label">Usuários Ativos</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{data.ai_chat_count}</span>
          <span className="admin-stat-label">Msgs IA</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{data.avg_reading_seconds > 0 ? `${Math.round(data.avg_reading_seconds / 60)}min` : "—"}</span>
          <span className="admin-stat-label">Leitura Média</span>
        </div>
      </div>

      {/* Event breakdown */}
      {data.event_breakdown && data.event_breakdown.length > 0 && (
        <div className="admin-section">
          <h3 className="admin-section-title">Tipos de Evento</h3>
          <div className="analytics-bars">
            {data.event_breakdown.map(e => (
              <div key={e.event_type} className="analytics-bar-row">
                <span className="analytics-bar-label">{EVENT_LABELS[e.event_type] || e.event_type}</span>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill analytics-bar-fill--gold"
                    style={{ width: `${(e.total / data.event_breakdown![0].total) * 100}%` }}
                  />
                </div>
                <span className="analytics-bar-value">{e.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapter views */}
      {data.chapter_views && data.chapter_views.length > 0 && (
        <div className="admin-section">
          <h3 className="admin-section-title">Capítulos mais acessados</h3>
          <div className="analytics-bars">
            {data.chapter_views.map(ch => (
              <div key={ch.chapter_id} className="analytics-bar-row">
                <span className="analytics-bar-label">{CHAPTER_NAMES[ch.chapter_id] || ch.chapter_id}</span>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill analytics-bar-fill--blue"
                    style={{ width: `${(ch.views / maxViews) * 100}%` }}
                  />
                </div>
                <span className="analytics-bar-value">{ch.views} <small>({ch.unique_users}u)</small></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily activity mini chart */}
      {data.daily_activity && data.daily_activity.length > 0 && (
        <div className="admin-section">
          <h3 className="admin-section-title">Atividade Diária</h3>
          <div className="analytics-daily-chart">
            {data.daily_activity.slice(-30).map(d => (
              <div key={d.day} className="analytics-daily-bar-wrap" title={`${new Date(d.day).toLocaleDateString("pt-BR")}: ${d.events} eventos, ${d.users} usuários`}>
                <div
                  className="analytics-daily-bar"
                  style={{ height: `${Math.max(4, (d.events / maxDaily) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="analytics-daily-legend">
            <span>{new Date(data.daily_activity[0].day).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
            <span>{new Date(data.daily_activity[data.daily_activity.length - 1].day).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
