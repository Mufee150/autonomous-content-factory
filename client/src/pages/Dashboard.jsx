import UploadBox from "../components/UploadBox";
import AgentStatus from "../components/AgentStatus";
import ActivityFeed from "../components/ActivityFeed";
import HistoryPanel from "../components/HistoryPanel";
import OutputDisplay from "../components/OutputDisplay";
import useAgentFlow from "../hooks/useAgentFlow";

export default function Dashboard() {
  const {
    status,
    result,
    error,
    history,
    activityFeed,
    agentStates,
    runPipeline,
    selectHistoryItem
  } = useAgentFlow();
  const isLoading = status === "researching" || status === "generating";

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-slate-900">Content Generation</h1>
        <p className="mt-2 text-slate-600">
          Upload your source material and watch the AI pipeline transform it into
          multi-channel content with automated quality reviews.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Input & Workflow */}
        <div className="space-y-8 lg:col-span-2">
          <UploadBox onSubmit={runPipeline} isLoading={isLoading} />
          <AgentStatus status={status} agentStates={agentStates} />
        </div>

        {/* Right Column: History */}
        <div>
          <HistoryPanel history={history} onSelect={selectHistoryItem} />
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed items={activityFeed} />

      {/* Output Display */}
      {(result || error) && <OutputDisplay result={result} error={error} />}

      {/* Empty State */}
      {!result && !error && status === "idle" && (
        <div className="rounded-2xl border border-dashed border-slate-300 px-8 py-16 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 p-6">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Ready to create content?
          </h3>
          <p className="mt-2 text-slate-600">
            Paste your source document in the input box above to begin the pipeline.
          </p>
        </div>
      )}
    </div>
  );
}

