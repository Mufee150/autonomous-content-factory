import { useContext } from "react";
import { BarChart3, CheckCircle, XCircle, FileText, Zap, RefreshCw, ArrowLeft } from "lucide-react";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function StatCard({ label, value, sub, color = "var(--brand)", icon: Icon }) {
  return (
    <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem 1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "var(--radius-md)",
          background: `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const { history } = useContext(AppContext);

  const total = history.length;
  const approved = history.filter(h => h.result?.content?.editor_review?.status === "APPROVED").length;
  const rejected = total - approved;
  const regenerated = history.filter(h => h.result?.content?.regeneration_applied).length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const totalWords = history.reduce((sum, h) => {
    const blog = h.result?.content?.blog_post || "";
    const linkedin = h.result?.content?.linkedin_post || "";
    const email = h.result?.content?.email_teaser || "";
    const words = (blog + " " + linkedin + " " + email).trim().split(/\s+/).filter(Boolean).length;
    return sum + words;
  }, 0);

  const outputTypes = [
    { label: "Blog Posts", count: history.filter(h => h.result?.content?.blog_post).length, color: "#818cf8" },
    { label: "LinkedIn Posts", count: history.filter(h => h.result?.content?.linkedin_post).length, color: "#0a66c2" },
    { label: "Twitter Threads", count: history.filter(h => (h.result?.content?.twitter_thread || []).length > 0).length, color: "#22d3ee" },
    { label: "Email Teasers", count: history.filter(h => h.result?.content?.email_teaser).length, color: "#f472b6" },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        {/* Header */}
        <div className="anim-slide-down" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(34, 211, 238, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={24} style={{ color: "var(--accent-cyan)" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 2 }}>
                  Analytics
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Metrics from your current session's content generation runs
                </p>
              </div>
            </div>
            <Link
              to="/dashboard"
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
              Back to Pipeline
            </Link>
          </div>
        </div>

        {total === 0 ? (
          <div className="glass-card-lg anim-slide-up delay-100">
            <div className="empty-state">
              <span className="empty-state-icon">📊</span>
              <span className="empty-state-title">No data yet</span>
              <span className="empty-state-desc">
                Run the pipeline from the Dashboard to start seeing analytics here.
              </span>
              <Link
                to="/dashboard"
                className="btn-primary"
                style={{ marginTop: 12, textDecoration: "none", padding: "10px 24px", borderRadius: "var(--radius-sm)" }}
              >
                Open Pipeline
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="anim-slide-up delay-100" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              <StatCard label="Total Runs" value={total} sub="This session" icon={Zap} color="var(--brand)" />
              <StatCard label="Approved" value={approved} sub={`${approvalRate}% approval rate`} icon={CheckCircle} color="var(--accent-emerald)" />
              <StatCard label="Rejected" value={rejected} sub="Flagged by editor" icon={XCircle} color="var(--accent-rose)" />
              <StatCard label="Regenerated" value={regenerated} sub="Fixed by AI" icon={RefreshCw} color="var(--accent-amber)" />
              <StatCard label="Total Words" value={totalWords.toLocaleString()} sub="Across all outputs" icon={FileText} color="var(--accent-cyan)" />
            </div>

            {/* Approval Rate Bar */}
            <div className="glass-card-lg anim-slide-up delay-200" style={{ marginBottom: 24 }}>
              <div className="section-title">
                <div className="icon-wrap" style={{ background: "rgba(129, 140, 248, 0.1)" }}>
                  <BarChart3 size={18} style={{ color: "var(--brand)" }} />
                </div>
                <h3>Approval Rate</h3>
              </div>
              <div style={{ height: 10, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
                <div style={{
                  height: "100%",
                  width: `${approvalRate}%`,
                  background: "linear-gradient(90deg, var(--brand-dim), var(--accent-cyan))",
                  borderRadius: 999,
                  transition: "width 1s cubic-bezier(0.16,1,0.3,1)"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>{approved} approved</span>
                <span style={{ fontWeight: 800, color: "var(--brand)" }}>{approvalRate}%</span>
                <span style={{ color: "var(--accent-rose)", fontWeight: 700 }}>{rejected} rejected</span>
              </div>
            </div>

            {/* Output Breakdown */}
            <div className="glass-card-lg anim-slide-up delay-300">
              <div className="section-title">
                <div className="icon-wrap" style={{ background: "rgba(34, 211, 238, 0.1)" }}>
                  <FileText size={18} style={{ color: "var(--accent-cyan)" }} />
                </div>
                <h3>Output Breakdown</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {outputTypes.map(({ label, count, color }) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{label}</span>
                      <span style={{ color, fontWeight: 800 }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: total > 0 ? `${(count / total) * 100}%` : "0%",
                        background: color,
                        borderRadius: 999,
                        transition: "width 1s cubic-bezier(0.16,1,0.3,1)"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
