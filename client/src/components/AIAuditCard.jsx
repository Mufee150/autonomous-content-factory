import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  CircleX,
  ShieldCheck,
  Sparkles,
  Wrench
} from "lucide-react";

export default function AIAuditCard({ review = {} }) {
  const status = String(review.status || "APPROVED").toUpperCase();
  const isApproved = status === "APPROVED";
  const issues = [
    ...(review.hallucinations_found || []),
    ...(review.tone_issues || []),
    ...(review.missing_alignment || [])
  ];
  const fixes = review.suggested_fixes || [];

  const hasHallucinations = issues.some(i => /hallucination/i.test(i));
  const hasToneIssues = issues.some(i => /tone/i.test(i));
  const hasAlignmentIssues = issues.some(i => /alignment|value/i.test(i));

  const checks = [
    { label: "Fact Verification", failed: hasHallucinations, failLabel: "Issues", passLabel: "Passed" },
    { label: "Tone Consistency", failed: hasToneIssues, failLabel: "Review", passLabel: "Aligned" },
    { label: "Value Alignment", failed: hasAlignmentIssues, failLabel: "Review", passLabel: "Matched" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "rgba(129, 140, 248, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={20} style={{ color: "var(--brand)" }} />
          </div>
          <div>
            <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>AI Audit Report</h4>
            <p style={{ fontSize: 11, color: "var(--text-dim)", margin: 0 }}>Automated editorial validation</p>
          </div>
        </div>

        <span
          className={`badge ${isApproved ? "badge-success" : "badge-danger"}`}
          style={{ padding: "6px 14px", fontSize: 12 }}
        >
          {isApproved ? <BadgeCheck size={14} /> : <CircleX size={14} />}
          {status}
        </span>
      </div>

      {/* Two Column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Analysis */}
        <div style={{ padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
          <h5 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 14 }}>
            <AlertTriangle size={13} />
            Analysis Results
          </h5>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checks.map(({ label, failed, failLabel, passLabel }) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", borderRadius: "var(--radius-sm)",
                  background: failed ? "rgba(251, 113, 133, 0.05)" : "rgba(52, 211, 153, 0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: failed ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                  {failed ? <CircleX size={14} /> : <CheckCircle2 size={14} />}
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
                  color: failed ? "var(--accent-rose)" : "var(--accent-emerald)"
                }}>
                  {failed ? failLabel : passLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fixes */}
        <div style={{ padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
          <h5 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 14 }}>
            <Wrench size={13} />
            Suggested Improvements
          </h5>

          {fixes.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {fixes.map((fix, idx) => (
                <li key={idx} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", marginTop: 6, flexShrink: 0 }} />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 0", textAlign: "center" }}>
              <Sparkles size={24} style={{ color: "var(--text-dim)", marginBottom: 8 }} />
              <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>No fixes required</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
