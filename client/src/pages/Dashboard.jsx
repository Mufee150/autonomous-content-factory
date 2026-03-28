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
    <main>
      <h1>Dashboard</h1>
      <UploadBox onSubmit={runPipeline} isLoading={isLoading} />
      <AgentStatus status={status} />
      <HistoryPanel history={history} onSelect={selectHistoryItem} />
      <OutputDisplay result={result} error={error} />
    </main>
  );
}

