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
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 p-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white">⚡ GEMINI 1.5 FLASH — AI MULTI-AGENT PIPELINE</h1>
        <h2 className="mt-4 text-3xl font-bold text-white">Content Dashboard</h2>
        <p className="mt-4 text-gray-300">
          Paste any source document below. The AI pipeline will research the facts, write platform-specific content, validate it editorially, and deliver a campaign ready to publish.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Input & Workflow */}
        <div className="space-y-8">
          <UploadBox onSubmit={runPipeline} isLoading={isLoading} />
          <AgentStatus status={status} agentStates={agentStates} />
          <ActivityFeed items={activityFeed} />
        </div>

        {/* Right Column: Output */}
        <div>
          <OutputDisplay result={result} error={error} />
        </div>
      </div>

      {/* History Panel */}
      <HistoryPanel history={history} onSelect={selectHistoryItem} />
    </div>
  );
}

