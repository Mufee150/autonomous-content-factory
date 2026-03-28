export default function HistoryPanel({ history, onSelect }) {
  return (
    <section className="card">
      <h3>History</h3>

      {history.length === 0 && <p>No previous runs yet.</p>}

      {history.length > 0 && (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className="history-item">
              <div className="history-meta">
                <p className="history-time">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="history-preview">{item.sourceText.slice(0, 120)}</p>
              </div>
              <button type="button" onClick={() => onSelect(item.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}