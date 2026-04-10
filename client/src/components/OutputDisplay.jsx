import { useState } from "react";
import {
  Copy,
  FileText,
  Share2,
  MessageCircle,
  Mail,
  Shield,
  Check
} from "lucide-react";
import AIAuditCard from "./AIAuditCard";

export default function OutputDisplay({ result, error }) {
  const [activeTab, setActiveTab] = useState("meta");
  const [copiedLabel, setCopiedLabel] = useState("");

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(""), 1500);
    } catch {
      setCopiedLabel("Copy failed");
    }
  }

  if (error) {
    return (
      <div className="glass-card-lg" style={{ borderColor: "rgba(251, 113, 133, 0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(251, 113, 133, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={22} style={{ color: "var(--accent-rose)" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--accent-rose)" }}>Generation Failed</h3>
        </div>
        <p style={{ padding: "12px 16px", borderRadius: "var(--radius-sm)", background: "rgba(251, 113, 133, 0.05)", border: "1px solid rgba(251, 113, 133, 0.15)", fontSize: 14, color: "var(--accent-rose)", lineHeight: 1.6 }}>
          {error}
        </p>
      </div>
    );
  }

  if (!result) return null;

  const { meta_document: metaDocument, content } = result;
  const review = content.editor_review || content.validation_report || {};
  const threadItems = content.twitter_thread || content.social_thread || [];
  const threadText = threadItems.map((post, i) => `${i + 1}. ${post}`).join("\n");

  const tabs = [
    { id: "meta", label: "Meta", icon: FileText },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "linkedin", label: "LinkedIn", icon: Share2 },
    { id: "thread", label: "Twitter", icon: MessageCircle },
    { id: "email", label: "Email", icon: Mail },
    { id: "validation", label: "Audit", icon: Shield },
  ];

  const contentMap = {
    meta: JSON.stringify(metaDocument, null, 2),
    blog: content.blog_post,
    linkedin: content.linkedin_post,
    thread: threadText,
    email: content.email_teaser,
    validation: JSON.stringify(review, null, 2),
  };

  return (
    <div className="glass-card-lg" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>Generated Output</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Review your generated campaign content</p>
        </div>
        {copiedLabel && (
          <span className="badge badge-success" style={{ animation: "scaleIn 0.2s var(--ease-spring) both" }}>
            <Check size={12} />
            {copiedLabel} copied
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-group" style={{ marginBottom: 16 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn${active ? " active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: "relative", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.1)", padding: "1.25rem", minHeight: 300 }}>
        {/* Copy Btn */}
        <button
          onClick={() => copyText(contentMap[activeTab], activeTab)}
          className="btn-ghost"
          style={{ position: "absolute", top: 12, right: 12, padding: "6px 10px", zIndex: 2 }}
          title="Copy to clipboard"
        >
          <Copy size={14} />
        </button>

        {activeTab === "meta" && (
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
            {JSON.stringify(metaDocument, null, 2)}
          </pre>
        )}

        {activeTab === "blog" && (
          <div>
            <h4 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Blog Post</h4>
            <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 14 }}>
              {content.blog_post}
            </div>
          </div>
        )}

        {activeTab === "linkedin" && (
          <div>
            <h4 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>LinkedIn Post</h4>
            <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 14 }}>
              {content.linkedin_post}
            </div>
          </div>
        )}

        {activeTab === "thread" && (
          <div>
            <h4 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Twitter Thread</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {threadItems.map((post, i) => (
                <div key={i} style={{ padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                    Tweet {i + 1}
                  </div>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 13 }}>{post}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "email" && (
          <div>
            <h4 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Email Teaser</h4>
            <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 14 }}>
              {content.email_teaser}
            </div>
          </div>
        )}

        {activeTab === "validation" && <AIAuditCard review={review} />}
      </div>
    </div>
  );
}
