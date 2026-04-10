import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";

export default function UploadBox({ onSubmit, isLoading }) {
  const [sourceText, setSourceText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!sourceText.trim()) return;
    onSubmit(sourceText.trim());
  }

  return (
    <div className="glass-card-lg">
      <div className="section-title">
        <div className="icon-wrap" style={{ background: "rgba(129, 140, 248, 0.1)" }}>
          <FileText size={18} style={{ color: "var(--brand)" }} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Source Document</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Paste your source material to generate a full content campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <textarea
            rows={8}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Paste your article, brief, product description, or any source material here..."
            disabled={isLoading}
            style={{ width: "100%", resize: "vertical" }}
          />
          <div style={{ position: "absolute", bottom: 12, right: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--text-dim)" }} />
            {sourceText.length.toLocaleString()} chars
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !sourceText.trim()}
          className="btn-primary"
          style={{
            width: "100%", justifyContent: "center", padding: "14px 0",
            fontSize: "0.9375rem", borderRadius: "var(--radius-md)",
          }}
        >
          <Sparkles size={18} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Processing Pipeline..." : "Generate Content"}
        </button>
      </form>
    </div>
  );
}
