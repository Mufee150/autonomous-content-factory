import { CheckCircle2, Brain, Zap, CircleX, Clock } from "lucide-react";

function AgentCard({ title, icon: Icon, state, index, totalAgents }) {
  const stateConfig = {
    idle: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      icon: "text-slate-400",
      badge: "bg-slate-100 text-slate-600"
    },
    thinking: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700 animate-pulse"
    },
    completed: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700"
    },
    rejected: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      badge: "bg-red-100 text-red-700"
    }
  };

  const config = stateConfig[state] || stateConfig.idle;
  const isLast = index === totalAgents - 1;

  const badgeMap = {
    idle: "Idle",
    thinking: "Processing",
    completed: "Done",
    rejected: "Failed"
  };

  return (
    <div className="flex flex-1 items-start gap-4">
      <div
        className={`relative flex flex-col items-center rounded-2xl border-2 p-5 transition-all duration-300 ${config.bg} ${config.border} flex-1 hover:-translate-y-1 hover:shadow-lg`}
      >
        {/* Icon */}
        <div className={`mb-3 rounded-lg p-3 ${config.badge}`}>
          <Icon className={`h-6 w-6 ${config.icon}`} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h4 className="font-semibold text-slate-900">{title}</h4>

        {/* Badge */}
        <span
          className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${config.badge}`}
        >
          {badgeMap[state]}
        </span>

        {/* Loading indicator */}
        {state === "thinking" && (
          <div className="mt-3 flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce delay-100" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
          </div>
        )}
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div className="flex items-center justify-center pt-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentStatus({ status = "idle", agentStates }) {
  const statusMap = {
    idle: "Ready to start",
    researching: "🔍 Research phase active",
    generating: "✍️ Generation phase active",
    completed: "✅ Pipeline completed successfully",
    failed: "❌ Pipeline encountered an issue"
  };

  const agents = [
    { title: "Research Agent", icon: Brain },
    { title: "Copywriter Agent", icon: Zap },
    { title: "Editor Agent", icon: CheckCircle2 }
  ];

  return (
    <section className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Pipeline Workflow
          </h3>
          <p className="mt-1 text-sm text-slate-600">{statusMap[status]}</p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 p-3">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* Agent Cards Flow */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.title}
            title={agent.title}
            icon={agent.icon}
            state={agentStates[agent.title.split(" ")[0].toLowerCase()]}
            index={index}
            totalAgents={agents.length}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Overall Progress</span>
          <span className="text-xs font-semibold text-slate-600">
            {Object.values(agentStates).filter((s) => s === "completed").length} /{" "}
            {Object.keys(agentStates).length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{
              width: `${(Object.values(agentStates).filter((s) => s === "completed").length / Object.keys(agentStates).length) * 100}%`
            }}
          />
        </div>
      </div>
    </section>
  );
}

