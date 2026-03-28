export default function AgentStatus({ status = "idle" }) {
  const statusMap = {
    idle: "Idle",
    researching: "Running AI pipeline...",
    completed: "Completed",
    failed: "Failed"
  };

  return (
    <section className="card">
      <h3>Agent Status</h3>
      <p>Current state: {statusMap[status] || status}</p>
    </section>
  );
}

