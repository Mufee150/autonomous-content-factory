export default function ActivityFeed({ items }) {
  return (
    <section className="card">
      <h3>Live Activity Feed</h3>

      {items.length === 0 && <p>No activity yet.</p>}

      {items.length > 0 && (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.id} className="activity-item">
              <span className="activity-time">[{item.timestamp}]</span>
              <span>{item.message}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
