import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import AgentStatus from "../components/AgentStatus";
import ActivityFeed from "../components/ActivityFeed";
import HistoryPanel from "../components/HistoryPanel";
import OutputDisplay from "../components/OutputDisplay";
import useAgentFlow from "../hooks/useAgentFlow";
import { Zap, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const {
    status,
    result,
    error,
    history,
    activityFeed,
    agentStates,
    runPipeline,
    selectHistoryItem
  } = useAgentFlow();
  const isLoading = status === "researching" || status === "generating";

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-content">
        {/* Page Header */}
        <div className="anim-slide-down" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, var(--brand-dim), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px var(--brand-glow)" }}>
                <Zap size={24} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 2 }}>
                  Content Pipeline
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Paste source material → AI agents research, write, validate, and deliver
                </p>
              </div>
            </div>
            <Link
              to="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: "var(--radius-sm)",
                background: "var(--bg-surface)", border: "1px solid var(--border-default)",
                color: "var(--text-muted)", fontSize: 13, fontWeight: 600,
                textDecoration: "none", transition: "all 0.2s var(--ease-out)",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-default)"; }}
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          {/* Input Row */}
          <div className="anim-slide-up delay-100">
            <UploadBox onSubmit={runPipeline} isLoading={isLoading} />
          </div>

          {/* Agent Status */}
          <div className="anim-slide-up delay-200">
            <AgentStatus status={status} agentStates={agentStates} />
          </div>

          {/* Two Column: Feed + Output */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Activity Feed */}
            <div className="anim-slide-up delay-300">
              <ActivityFeed items={activityFeed} />
            </div>

            {/* Output */}
            <div className="anim-slide-up delay-300">
              {result || error ? (
                <OutputDisplay result={result} error={error} />
              ) : (
                <div className="glass-card-lg" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
                  <div className="empty-state">
                    <span className="empty-state-icon">🚀</span>
                    <span className="empty-state-title">Ready to generate</span>
                    <span className="empty-state-desc">
                      Paste your source document above and click Generate to see your full campaign here.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="anim-slide-up delay-400">
              <div className="divider" />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>Recent Generations</h3>
                <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
                <span className="badge badge-brand">{history.length}</span>
              </div>
              <HistoryPanel history={history} onSelect={selectHistoryItem} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
