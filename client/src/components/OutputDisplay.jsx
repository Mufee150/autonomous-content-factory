import { useState } from "react";
import {
  Copy,
  FileText,
  Share2,
  MessageCircle,
  Mail,
  Shield,
  CheckCircle2
} from "lucide-react";
import AIAuditCard from "./AIAuditCard";

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
      <section className="rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Generation Failed</h3>
        </div>
        <p className="rounded-lg border border-red-200 bg-white/60 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!result) {
    return null;
  }

  const { meta_document: metaDocument, content } = result;
  const review = content.editor_review || content.validation_report || {};
  const threadItems = content.twitter_thread || content.social_thread || [];
  const threadText = threadItems
    .map((post, index) => `${index + 1}. ${post}`)
    .join("\n");

  const tabs = [
    { id: "meta", label: "Meta", icon: FileText },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "linkedin", label: "LinkedIn", icon: Share2 },
    { id: "thread", label: "Twitter", icon: MessageCircle },
    { id: "email", label: "Email", icon: Mail },
    { id: "validation", label: "Review", icon: Shield }
  ];

  return (
    <section className="space-y-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Generated Output</h3>
          <p className="mt-1 text-sm text-slate-600">
            Review and manage your generated content
          </p>
        </div>
        {copiedLabel && (
          <div className="animate-fade-in rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            {copiedLabel} copied
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto rounded-xl bg-slate-50/60 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6">
        {activeTab === "meta" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Meta Document</h4>
              <button
                type="button"
                onClick={() => copyText(JSON.stringify(metaDocument, null, 2), "Meta")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <pre className="max-h-96 overflow-auto rounded-lg border border-slate-300 bg-white p-4 text-xs text-slate-700">
              {JSON.stringify(metaDocument, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === "blog" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Blog Post</h4>
              <button
                type="button"
                onClick={() => copyText(content.blog_post, "Blog")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-slate-300 bg-white p-6 text-sm leading-relaxed text-slate-800">
              {content.blog_post ? (
                <p className="whitespace-pre-wrap">{content.blog_post}</p>
              ) : (
                <p className="text-slate-500">No blog post generated.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "linkedin" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">LinkedIn Post</h4>
              <button
                type="button"
                onClick={() => copyText(content.linkedin_post || "", "LinkedIn")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-slate-300 bg-white p-6 text-sm leading-relaxed text-slate-800">
              {content.linkedin_post ? (
                <p className="whitespace-pre-wrap">{content.linkedin_post}</p>
              ) : (
                <p className="text-slate-500">No LinkedIn post generated.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "thread" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Twitter Thread</h4>
              <button
                type="button"
                onClick={() => copyText(threadText, "Thread")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <div className="max-h-96 space-y-3 overflow-auto">
              {threadItems.length > 0 ? (
                threadItems.map((post, index) => (
                  <div
                    key={`thread-${index}`}
                    className="rounded-lg border border-slate-300 bg-white p-4"
                  >
                    <span className="mr-2 inline-block font-bold text-blue-600">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-slate-800">
                      {post}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No Twitter thread generated.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "email" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Email Teaser</h4>
              <button
                type="button"
                onClick={() => copyText(content.email_teaser, "Email")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-slate-300 bg-white p-6 text-sm leading-relaxed text-slate-800">
              {content.email_teaser ? (
                <p className="whitespace-pre-wrap">{content.email_teaser}</p>
              ) : (
                <p className="text-slate-500">No email teaser generated.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "validation" && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Editorial Review</h4>
            <AIAuditCard
              status={review.status}
              issues={[
                ...(review.hallucinations_found || []),
                ...(review.tone_issues || []),
                ...(review.missing_alignment || [])
              ]}
              fixes={review.suggested_fixes || []}
              regenerated={Boolean(content.regeneration_applied)}
            />
          </div>
        )}
      </div>
    </section>
  );
}

