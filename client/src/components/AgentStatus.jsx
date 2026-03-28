export default function AgentStatus({ status = "idle" }) {
  const statusMap = {
    idle: "Idle",
    researching: "Research Agent is building the Meta Document...",
    generating: "Copywriter and Editor Agents are generating content...",
    completed: "Completed",
    failed: "Failed"
  };

  const stepMap = {
    researching: 1,
    generating: 2,
    completed: 3
  };

  const activeStep = stepMap[status] || 0;

  return (
    <section className="card">
      <h3>Agent Status</h3>
      <p>Current state: {statusMap[status] || status}</p>

      <ul className="status-steps">
        <li className={activeStep >= 1 ? "done" : ""}>Research Meta Document</li>
        <li className={activeStep >= 2 ? "done" : ""}>Generate Campaign Content</li>
        <li className={activeStep >= 3 ? "done" : ""}>Finalize Output</li>
      </ul>
    </section>
  );
}

