import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";

export default function UploadBox({ onSubmit, isLoading }) {
  const [sourceText, setSourceText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!sourceText.trim()) {
      return;
    }

    onSubmit(sourceText.trim());
  }

  return (
    <section className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 p-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Input Document</h3>
            <p className="text-sm text-slate-600">
              Paste your source material to begin
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            rows={8}
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder="Paste your source document, article, or reference material here. The AI pipeline will analyze and generate content..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {sourceText.length} characters
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !sourceText.trim()}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center justify-center gap-2">
            <Sparkles className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            <span>
              {isLoading ? "Generating Content..." : "Generate Content"}
            </span>
          </div>
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500">
        💡 Tip: Add source documents like press releases, blog posts, whitepapers,
        or product specifications for best results.
      </p>
    </section>
  );
}

