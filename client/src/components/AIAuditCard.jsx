import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  CircleX,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Wrench
} from "lucide-react";

function hasKeyword(issues, pattern) {
  return issues.some((item) => pattern.test(item));
}

export default function AIAuditCard({
  status = "APPROVED",
  issues = [],
  fixes = [],
  regenerated = false
}) {
  const normalizedStatus = String(status || "APPROVED").toUpperCase();
  const isApproved = normalizedStatus === "APPROVED";

  const hasHallucinations = hasKeyword(issues, /hallucination/i);
  const hasToneIssues = hasKeyword(issues, /tone/i);
  const hasAlignmentIssues = hasKeyword(issues, /alignment|value/i);

  return (
    <section className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <ShieldCheck className="h-5 w-5 text-slate-500" />
          AI Audit Status
        </h4>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
            isApproved
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-red-50 text-red-700 ring-1 ring-red-200"
          }`}
        >
          {isApproved ? (
            <BadgeCheck className="h-5 w-5" />
          ) : (
            <CircleX className="h-5 w-5" />
          )}
          <span className="tracking-wide">{normalizedStatus}</span>
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
            <AlertTriangle className="h-4 w-4" />
            Issues Detected
          </h5>

          <ul className="space-y-2 text-sm">
            <li
              className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                hasHallucinations
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {hasHallucinations ? (
                <CircleX className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {hasHallucinations ? "Hallucinations found" : "No hallucinations found"}
            </li>

            <li
              className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                hasToneIssues
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {hasToneIssues ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {hasToneIssues ? "Tone issues" : "Tone aligned"}
            </li>

            <li
              className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                hasAlignmentIssues
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {hasAlignmentIssues ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {hasAlignmentIssues ? "Value alignment issues" : "Value alignment"}
            </li>
          </ul>

          {issues.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {issues.map((issue, index) => (
                <li key={`issue-${index}`}>{issue}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
            <Wrench className="h-4 w-4" />
            Suggested Fixes
          </h5>

          {fixes.length === 0 ? (
            <p className="text-sm text-slate-600">No fixes required.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {fixes.map((fix, index) => (
                <li key={`fix-${index}`}>{fix}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Sparkles className="h-4 w-4" />
              Regeneration
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                regenerated
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${regenerated ? "animate-pulse" : ""}`} />
              {regenerated
                ? "Regenerated after correction"
                : "No regeneration needed"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
