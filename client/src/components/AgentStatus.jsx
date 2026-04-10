import { CheckCircle2, Brain, Zap, CircleX } from "lucide-react";

const stateStyles = {
  idle: {
    bg: "var(--bg-surface)",
    border: "var(--border-subtle)",
    iconBg: "rgba(100, 116, 139, 0.1)",
    iconColor: "var(--text-dim)",
    badgeBg: "rgba(100, 116, 139, 0.1)",
    badgeColor: "var(--text-dim)",
  },
  thinking: {
    bg: "rgba(129, 140, 248, 0.04)",
    border: "rgba(129, 140, 248, 0.2)",
    iconBg: "rgba(129, 140, 248, 0.12)",
    iconColor: "var(--brand)",
    badgeBg: "rgba(129, 140, 248, 0.12)",
    badgeColor: "var(--brand)",
  },
  completed: {
    bg: "rgba(52, 211, 153, 0.04)",
    border: "rgba(52, 211, 153, 0.2)",
    iconBg: "rgba(52, 211, 153, 0.12)",
    iconColor: "var(--accent-emerald)",
    badgeBg: "rgba(52, 211, 153, 0.12)",
    badgeColor: "var(--accent-emerald)",
  },
  rejected: {
    bg: "rgba(251, 113, 133, 0.04)",
    border: "rgba(251, 113, 133, 0.2)",
    iconBg: "rgba(251, 113, 133, 0.12)",
    iconColor: "var(--accent-rose)",
    badgeBg: "rgba(251, 113, 133, 0.12)",
    badgeColor: "var(--accent-rose)",
  }
};

const badgeLabels = {
  idle: "Waiting",
  thinking: "Processing",
  completed: "Done",
  rejected: "Failed"
};

function AgentCard({ title, icon: Icon, state }) {
  const s = stateStyles[state] || stateStyles.idle;

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "1.5rem 1rem",
        background: s.bg, border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-xl)",
        transition: "all 0.3s var(--ease-out)",
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: "var(--radius-md)",
        background: s.iconBg, display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: 14,
      }}>
        <Icon size={22} style={{ color: s.iconColor }} strokeWidth={2.5} />
      </div>

      <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 10, textAlign: "center" }}>
        {title}
      </h4>

      <span style={{
        padding: "4px 12px", borderRadius: 999,
        fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
        background: s.badgeBg, color: s.badgeColor,
      }}>
        {badgeLabels[state]}
      </span>

      {state === "thinking" && (
        <div style={{ display: "flex", gap: 5, marginTop: 14 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--brand)",
              animation: `pulseDot 1s ease-in-out ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AgentStatus({ status = "idle", agentStates }) {
  const agents = [
    { title: "Research Agent", icon: Brain, key: "research" },
    { title: "Copywriter Agent", icon: Zap, key: "copywriter" },
    { title: "Editor Agent", icon: CheckCircle2, key: "editor" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {agents.map((agent) => (
        <AgentCard
          key={agent.key}
          title={agent.title}
          icon={agent.icon}
          state={agentStates[agent.key] || "idle"}
        />
      ))}
    </div>
  );
}
