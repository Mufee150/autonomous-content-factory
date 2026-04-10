import { Clock, ExternalLink } from "lucide-react";

export default function HistoryPanel({ history, onSelect }) {
  if (history.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {history.map((item) => (
        <div
          key={item.id}
          className="glass-card"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            cursor: "pointer", padding: "1rem 1.25rem",
            transition: "all 0.25s var(--ease-out)",
          }}
          onClick={() => onSelect(item.id)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateX(4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.transform = ""; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              📄
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4, marginBottom: 4, fontWeight: 600 }}>
                <Clock size={11} />
                {new Date(item.createdAt).toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 500 }}>
                {item.sourceText.slice(0, 120)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
            className="btn-ghost"
            style={{ padding: "6px 12px", fontSize: 12, flexShrink: 0 }}
          >
            <ExternalLink size={13} />
            Open
          </button>
        </div>
      ))}
    </div>
  );
}