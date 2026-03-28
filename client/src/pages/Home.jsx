import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="hero-kicker">AI Multi-Agent Content System</p>
        <h1>Turn one source document into a full campaign in minutes.</h1>
        <p>
          Generate a structured Meta Document, a blog post, a social thread, and an
          email teaser with validation for tone and consistency.
        </p>
        <Link to="/dashboard" className="hero-cta">
          Open Dashboard
        </Link>
      </section>
    </main>
  );
}

