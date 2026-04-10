import { useContext } from "react";
import { Clock, FileText, CheckCircle, XCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Unknown date";
  }
}

function HistoryItemCard({ item, onSelect }) {
  const review = item.result?.content?.editor_review || {};
  const approved = review.status === "APPROVED";

  return (
    <div
      className="glass-card"
      style={{ cursor: "pointer", transition: "all 0.25s var(--ease-out)" }}
      onClick={() => onSelect(item.id)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = ""; }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onSelect(item.id)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className={`badge ${approved ? "badge-success" : "badge-danger"}`}>
              {approved ? "✓ Approved" : "✕ Rejected"}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} />
              {formatDate(item.createdAt)}
            </span>
          </div>
          <p style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            lineHeight: 1.5,
          }}>
            {item.sourceText?.slice(0, 140) || "No preview available"}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            {item.result?.content?.blog_post && (
              <span style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                <FileText size={11} /> Blog
              </span>
            )}
            {item.result?.content?.linkedin_post && (
              <span style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                <FileText size={11} /> LinkedIn
              </span>
            )}
            {item.result?.content?.email_teaser && (
              <span style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                <FileText size={11} /> Email
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={18} style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: 4 }} />
      </div>
    </div>
  );
}

export default function History() {
  const { history, selectHistoryItem } = useContext(AppContext);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        {/* Header */}
        <div className="anim-slide-down" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(129, 140, 248, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={24} style={{ color: "var(--brand)" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 2 }}>
                  Pipeline History
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Your recent content generation runs. Click any item to reload it.
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

        {/* Content */}
        <div className="anim-slide-up delay-100">
          {history.length === 0 ? (
            <div className="glass-card-lg">
              <div className="empty-state">
                <span className="empty-state-icon">🕓</span>
                <span className="empty-state-title">No history yet</span>
                <span className="empty-state-desc">
                  Run the pipeline from the Dashboard to see your generation history here.
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-secondary)" }}>
                  {history.length} run{history.length !== 1 ? "s" : ""} this session
                </h2>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--accent-emerald)", fontWeight: 700 }}>
                    <CheckCircle size={13} />
                    {history.filter(h => h.result?.content?.editor_review?.status === "APPROVED").length} approved
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--accent-rose)", fontWeight: 700 }}>
                    <XCircle size={13} />
                    {history.filter(h => h.result?.content?.editor_review?.status !== "APPROVED").length} rejected
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {history.map((item) => (
                  <HistoryItemCard key={item.id} item={item} onSelect={selectHistoryItem} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
