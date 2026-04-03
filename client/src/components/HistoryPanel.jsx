import { Clock, ChevronRight } from "lucide-react";

export default function HistoryPanel({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <section className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 p-3">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Recent Runs</h3>
        </div>
        <p className="text-sm text-slate-500">
          No previous runs yet. Create your first content generation to see it here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-6 shadow-xl backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 p-3">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Recent Runs</h3>
      </div>

      <ul className="space-y-2">
        {history.map((item) => (
          <li
            key={item.id}
            className="group rounded-lg border border-slate-200 bg-slate-50/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <time className="text-xs font-semibold text-slate-500">
                {new Date(item.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </time>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Done
              </span>
            </div>
            <p className="mb-3 line-clamp-2 text-sm text-slate-700">
              {item.sourceText.slice(0, 120)}
            </p>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <span>Load</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}