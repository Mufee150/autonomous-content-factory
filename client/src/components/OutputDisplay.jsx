import { useState } from "react";

export default function OutputDisplay({ result, error }) {
  const [activeTab, setActiveTab] = useState("meta");
  const [copiedLabel, setCopiedLabel] = useState("");

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      setTimeout(() => {
        setCopiedLabel("");
      }, 1200);
    } catch (clipboardError) {
      setCopiedLabel("Copy failed");
    }
  }

  if (error) {
    return (
      <section className="card">
        <h3>Generated Output</h3>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="card">
        <h3>Generated Output</h3>
        <p>No output yet.</p>
      </section>
    );
  }

  const { meta_document: metaDocument, content } = result;

  const threadItems = content.twitter_thread || content.social_thread || [];

  const threadText = threadItems
    .map((post, index) => `${index + 1}. ${post}`)
    .join("\n");

  return (
    <section className="card">
      <h3>Generated Output</h3>
      <p className="copy-hint">{copiedLabel ? `${copiedLabel} copied` : ""}</p>

      <div className="tab-row">
        <button
          type="button"
          className={activeTab === "meta" ? "tab active" : "tab"}
          onClick={() => setActiveTab("meta")}
        >
          Meta
        </button>
        <button
          type="button"
          className={activeTab === "blog" ? "tab active" : "tab"}
          onClick={() => setActiveTab("blog")}
        >
          Blog
        </button>
        <button
          type="button"
          className={activeTab === "linkedin" ? "tab active" : "tab"}
          onClick={() => setActiveTab("linkedin")}
        >
          LinkedIn
        </button>
        <button
          type="button"
          className={activeTab === "thread" ? "tab active" : "tab"}
          onClick={() => setActiveTab("thread")}
        >
          Twitter
        </button>
        <button
          type="button"
          className={activeTab === "email" ? "tab active" : "tab"}
          onClick={() => setActiveTab("email")}
        >
          Email
        </button>
        <button
          type="button"
          className={activeTab === "validation" ? "tab active" : "tab"}
          onClick={() => setActiveTab("validation")}
        >
          Validation
        </button>
      </div>

      {activeTab === "meta" && (
        <div>
          <h4>Meta Document</h4>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => copyText(JSON.stringify(metaDocument, null, 2), "Meta")}
          >
            Copy
          </button>
          <pre>{JSON.stringify(metaDocument, null, 2)}</pre>
        </div>
      )}

      {activeTab === "blog" && (
        <div>
          <h4>Blog Post</h4>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => copyText(content.blog_post, "Blog")}
          >
            Copy
          </button>
          <p>{content.blog_post}</p>
        </div>
      )}

      {activeTab === "thread" && (
        <div>
          <h4>Twitter Thread</h4>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => copyText(threadText, "Thread")}
          >
            Copy
          </button>
          <ol>
            {threadItems.map((post, index) => (
              <li key={`thread-${index}`}>{post}</li>
            ))}
          </ol>
        </div>
      )}

      {activeTab === "linkedin" && (
        <div>
          <h4>LinkedIn Post</h4>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => copyText(content.linkedin_post || "", "LinkedIn")}
          >
            Copy
          </button>
          <p>{content.linkedin_post || "No LinkedIn output available."}</p>
        </div>
      )}

      {activeTab === "email" && (
        <div>
          <h4>Email Teaser</h4>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => copyText(content.email_teaser, "Email")}
          >
            Copy
          </button>
          <p>{content.email_teaser}</p>
        </div>
      )}

      {activeTab === "validation" && (
        <div>
          <h4>Validation Report</h4>
          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              copyText(JSON.stringify(content.validation_report, null, 2), "Validation")
            }
          >
            Copy
          </button>
          <pre>{JSON.stringify(content.validation_report, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}

