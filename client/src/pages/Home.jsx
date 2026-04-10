import { Link } from "react-router-dom";
import { ArrowRight, Zap, Sparkles, Brain, PenTool, ShieldCheck, Send, FileText, MessageCircle, Mail, BarChart3 } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
  const agents = [
    { icon: Brain, label: "Research Agent", desc: "Extracts facts, identifies key claims & product info from your source", color: "#818cf8" },
    { icon: PenTool, label: "Copywriter Agent", desc: "Generates blog, social, and email content in your brand voice", color: "#a78bfa" },
    { icon: ShieldCheck, label: "Editor & Validator", desc: "Checks for hallucinations, tone issues, and factual accuracy", color: "#34d399" },
    { icon: Send, label: "Multi-Platform Output", desc: "Delivers ready-to-publish content for every channel", color: "#22d3ee" },
  ];

  const outputs = [
    { icon: FileText, label: "Blog Post", color: "#818cf8" },
    { icon: MessageCircle, label: "Social Thread", color: "#22d3ee" },
    { icon: Mail, label: "Email Teaser", color: "#f472b6" },
    { icon: BarChart3, label: "AI Audit Report", color: "#34d399" },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: "relative", overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem 2rem" }}>
        {/* Background orbs */}
        <div className="hero-bg-orb" style={{ width: 500, height: 500, background: "#6366f1", top: "-10%", left: "-10%" }} />
        <div className="hero-bg-orb" style={{ width: 400, height: 400, background: "#a855f7", bottom: "-5%", right: "-5%" }} />
        <div className="hero-bg-orb" style={{ width: 300, height: 300, background: "#22d3ee", top: "40%", left: "60%", opacity: 0.08 }} />

        <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div className="anim-slide-down" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "var(--brand-glow)", border: "1px solid rgba(129,140,248,0.2)", marginBottom: 32 }}>
            <Sparkles size={14} style={{ color: "var(--brand)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              AI Multi-Agent System
            </span>
          </div>

          {/* Headline */}
          <h1 className="anim-slide-up" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, color: "var(--text-primary)" }}>
            Turn one source into a{" "}
            <span style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              full campaign
            </span>
            {" "}in minutes
          </h1>

          {/* Subheadline */}
          <p className="anim-slide-up delay-100" style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Autonomously generate a blog post, social thread, and email teaser — all validated for tone, consistency, and accuracy by our AI editorial pipeline.
          </p>

          {/* CTA Buttons */}
          <div className="anim-slide-up delay-200" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 32px", borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(99, 102, 241, 0.35)",
                transition: "all 0.3s var(--ease-out)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99, 102, 241, 0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(99, 102, 241, 0.35)"; }}
            >
              <Zap size={18} />
              Open Pipeline
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/analytics"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: "var(--radius-md)",
                background: "var(--bg-surface)", border: "1px solid var(--border-default)",
                color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.9375rem",
                textDecoration: "none",
                transition: "all 0.3s var(--ease-out)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-default)"; }}
            >
              View Analytics
            </Link>
          </div>

          {/* Agent Cards */}
          <div className="anim-slide-up delay-300" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 48 }}>
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.label}
                  className="glass-card"
                  style={{ textAlign: "left", padding: "1.5rem", cursor: "default", animationDelay: `${300 + i * 100}ms` }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: `${agent.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={22} style={{ color: agent.color }} />
                  </div>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>{agent.label}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{agent.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Output Format Chips */}
          <div className="anim-slide-up delay-500" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "center", marginRight: 4 }}>Outputs:</span>
            {outputs.map((output) => {
              const Icon = output.icon;
              return (
                <div
                  key={output.label}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 16px", borderRadius: 999,
                    background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)", fontSize: 13, fontWeight: 600,
                    transition: "all 0.2s var(--ease-out)",
                  }}
                >
                  <Icon size={14} style={{ color: output.color }} />
                  {output.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
          © {new Date().getFullYear()} Autonomous Content Factory — AI Multi-Agent Content System
        </p>
      </footer>
    </div>
  );
}
