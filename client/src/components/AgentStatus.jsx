function AgentCard({ title, icon, state }) {
  const stateLabel = {
    idle: "Idle",
    thinking: "Thinking",
    completed: "Completed",
    rejected: "Rejected"
  };

  return (
    <div className={`agent-card agent-${state}`}>
      <div className="agent-card-head">
        <p className="agent-title">
          {icon} {title}
        </p>
        <p className="agent-state">{stateLabel[state] || "Idle"}</p>
      </div>

      {state === "thinking" && <div className="thinking-dot" />}
      {state === "completed" && <p className="agent-mark">checkmark</p>}
      {state === "rejected" && <p className="agent-mark rejected-mark">attention required</p>}
    </div>
  );
}

export default function AgentStatus({ status = "idle", agentStates }) {
  const statusMap = {
    idle: "Idle",
    researching: "Research phase running",
    generating: "Generation phase running",
    completed: "Completed",
    failed: "Rejected"
  };

  return (
    <section className="card">
      <h3>Agent Status</h3>
      <p>Current state: {statusMap[status] || status}</p>

      <div className="agent-grid">
        <AgentCard title="Research Agent" icon="🧠" state={agentStates.research} />
        <AgentCard title="Copywriter Agent" icon="✍️" state={agentStates.copywriter} />
        <AgentCard title="Editor Agent" icon="✅" state={agentStates.editor} />
      </div>
    </section>
  );
}

