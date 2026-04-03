import { useEffect, useMemo, useRef, useState } from "react";

const TYPE_STYLES = {
  normal: "border-slate-200 bg-slate-50 text-slate-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700"
};

function getTypeStyle(type) {
  return TYPE_STYLES[type] || TYPE_STYLES.normal;
}

export default function ActivityFeed({ items = [] }) {
  const [filter, setFilter] = useState("all");
  const scrollContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const previousCountRef = useRef(items.length);

  const filteredItems = useMemo(() => {
    if (filter === "errors") {
      return items.filter((item) => item.type === "error");
    }

    return items;
  }, [items, filter]);

  useEffect(() => {
    const hasNewItems = items.length > previousCountRef.current;
    previousCountRef.current = items.length;

    if (!hasNewItems || !shouldAutoScrollRef.current) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth"
    });
  }, [items.length]);

  function handleScroll() {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const threshold = 28;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;

    shouldAutoScrollRef.current = isNearBottom;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Live Activity Feed</h3>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "bg-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("errors")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === "errors"
                ? "bg-white text-red-700 shadow-sm"
                : "bg-transparent text-slate-600 hover:text-red-700"
            }`}
          >
            Errors Only
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-2"
      >
        {filteredItems.length === 0 ? (
          <p className="px-2 py-4 text-sm text-slate-500">
            {items.length === 0
              ? "No activity yet. Run the pipeline to start logging events."
              : "No error events in the current feed."}
          </p>
        ) : (
          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={`rounded-lg border px-3 py-2 transition-all hover:-translate-y-0.5 hover:shadow-sm ${getTypeStyle(item.type)}`}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wide">
                  <span className="text-slate-500">{item.timestamp}</span>
                  <span>{item.agent || "System"}</span>
                </div>
                <p className="m-0 text-sm leading-relaxed">{item.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
