export default function AgentStatus({ status = "idle" }) {
  return (
    <section>
      <h3>Agent Status</h3>
      <p>Current state: {status}</p>
    </section>
  );
}

