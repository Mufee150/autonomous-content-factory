import UploadBox from "../components/UploadBox";
import AgentStatus from "../components/AgentStatus";
import HistoryPanel from "../components/HistoryPanel";
import OutputDisplay from "../components/OutputDisplay";
import useAgentFlow from "../hooks/useAgentFlow";

export default function Dashboard() {
  const { status, result, error, history, runPipeline, selectHistoryItem } =
    useAgentFlow();
  const isLoading = status === "researching" || status === "generating";

  return (
    <main className="page-shell">
      <section className="dashboard-header card">
        <h1>Content Dashboard</h1>
        <p>
          Paste your source document, run the pipeline, and review generated outputs.
        </p>
      </section>
      <UploadBox onSubmit={runPipeline} isLoading={isLoading} />
      <AgentStatus status={status} />
      <HistoryPanel history={history} onSelect={selectHistoryItem} />
      <OutputDisplay result={result} error={error} />
    </main>
  );
}

