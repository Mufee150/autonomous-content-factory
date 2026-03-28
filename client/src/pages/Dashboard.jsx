import UploadBox from "../components/UploadBox";
import AgentStatus from "../components/AgentStatus";
import OutputDisplay from "../components/OutputDisplay";
import useAgentFlow from "../hooks/useAgentFlow";

export default function Dashboard() {
  const { status, output } = useAgentFlow();

  return (
    <main>
      <h1>Dashboard</h1>
      <UploadBox />
      <AgentStatus status={status} />
      <OutputDisplay output={output} />
    </main>
  );
}

