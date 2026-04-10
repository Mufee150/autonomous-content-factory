import { useEffect, useMemo, useRef, useState } from "react";

const typeColors = {
  normal: { border: "var(--border-subtle)", bg: "var(--bg-surface)", text: "var(--text-secondary)" },
  warning: { border: "rgba(251, 191, 36, 0.2)", bg: "rgba(251, 191, 36, 0.05)", text: "var(--accent-amber)" },
  success: { border: "rgba(52, 211, 153, 0.2)", bg: "rgba(52, 211, 153, 0.05)", text: "var(--accent-emerald)" },
  error: { border: "rgba(251, 113, 133, 0.2)", bg: "rgba(251, 113, 133, 0.05)", text: "var(--accent-rose)" },
};

export default function ActivityFeed({ items = [] }) {
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(true);
  const prevCountRef = useRef(items.length);

  const filteredItems = useMemo(() => {
    if (filter === "errors") return items.filter(i => i.type === "error");
    return items;
  }, [items, filter]);

  useEffect(() => {
    if (items.length > prevCountRef.current && autoScrollRef.current) {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
    prevCountRef.current = items.length;
  }, [items.length]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    autoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 30;
  }

  return (
    <div className="glass-card-lg" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <div className="icon-wrap" style={{ background: "rgba(129, 140, 248, 0.1)", width: 32, height: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", animation: "pulseDot 1.5s ease-in-out infinite" }} />
          </div>
          <h3 style={{ fontSize: "1rem" }}>Live Activity</h3>
        </div>

        <div className="tab-group" style={{ padding: 3 }}>
          {["all", "errors"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tab-btn${filter === f ? " active" : ""}`}
              style={{ padding: "4px 12px", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide"
        style={{
          flex: 1, minHeight: 250, maxHeight: 400,
          overflowY: "auto",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "var(--radius-md)",
          padding: 12,
          display: "flex", flexDirection: "column", gap: 8,
        }}
      >
        {filteredItems.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontSize: 13 }}>
            {items.length === 0 ? "Waiting for pipeline to start..." : "No error events detected."}
          </div>
        ) : (
          filteredItems.map((item, i) => {
            const c = typeColors[item.type] || typeColors.normal;
            return (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${c.border}`,
                  background: c.bg,
                  fontSize: 12,
                  animation: "slideUp 0.3s var(--ease-out) both",
                  display: "flex", flexDirection: "column", gap: 4,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.6, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <span style={{ color: c.text }}>{item.agent || "SYSTEM"}</span>
                  <span style={{ color: "var(--text-dim)" }}>{item.timestamp}</span>
                </div>
                <p style={{ margin: 0, color: c.text, lineHeight: 1.5, fontWeight: 500 }}>{item.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
