import { createContext, useContext, useState } from "react";
import api from "../services/api";

export const AppContext = createContext(null);

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AppProvider({ children }) {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [agentStates, setAgentStates] = useState({
    research: "idle",
    copywriter: "idle",
    editor: "idle"
  });

  function addFeed(message, options = {}) {
    const { type = "normal", agent = "System" } = options;
    setActivityFeed((prev) => [...prev, {
      id: Date.now() + Math.random(),
      timestamp: getTimestamp(),
      agent,
      type,
      message
    }].slice(-40));
  }

  async function runPipeline(sourceText) {
    setStatus("researching");
    setResult(null);
    setError("");
    setAgentStates({ research: "thinking", copywriter: "idle", editor: "idle" });
    addFeed("Pipeline started. Sending to Research Agent...", { agent: "System", type: "normal" });

    try {
      // Step 1 — Research
      const analyzeRes = await api.post("/analyze", { source_text: sourceText });
      const metaDocument = analyzeRes.data;
      addFeed(`Research complete. Product: "${metaDocument.product_name || "Unknown"}"`, { agent: "Research", type: "success" });
      setAgentStates({ research: "completed", copywriter: "thinking", editor: "idle" });

      if (metaDocument.missing_information?.length > 0) {
        addFeed(`Missing info detected: ${metaDocument.missing_information.join(", ")}`, { agent: "Research", type: "warning" });
      }

      // Step 2 — Copywriter + Editor (+ optional Regeneration)
      setStatus("generating");
      addFeed("Sending fact sheet to Copywriter Agent...", { agent: "Copywriter", type: "normal" });

      const generateRes = await api.post("/generate", { meta_document: metaDocument });
      const content = generateRes.data;
      const review = content.editor_review || {};

      addFeed("Blog, LinkedIn, Twitter & Email content generated.", { agent: "Copywriter", type: "success" });

      if (content.regeneration_applied) {
        addFeed("Editor rejected first draft — Regeneration Agent applied fixes.", { agent: "Regeneration", type: "warning" });
      }

      if (review.status === "REJECTED") {
        setAgentStates({ research: "completed", copywriter: "completed", editor: "rejected" });
        addFeed(`Editor final verdict: REJECTED. Issues: ${(review.suggested_fixes || []).join("; ") || "See audit tab."}`, { agent: "Editor", type: "error" });
      } else {
        setAgentStates({ research: "completed", copywriter: "completed", editor: "completed" });
        addFeed("Editor final verdict: APPROVED ✓ Content is ready to publish.", { agent: "Editor", type: "success" });
      }

      const fullResult = { meta_document: metaDocument, content };
      setResult(fullResult);

      const historyItem = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        sourceText,
        result: fullResult
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 20));
      setStatus(review.status === "REJECTED" ? "failed" : "completed");
    } catch (reqError) {
      const message = reqError.response?.data?.message || "Pipeline failed. Please try again.";
      setError(message);
      setStatus("failed");
      setAgentStates((cur) => ({
        research: cur.research === "completed" ? "completed" : "rejected",
        copywriter: cur.copywriter === "thinking" ? "rejected" : cur.copywriter,
        editor: "rejected"
      }));
      addFeed(`Error: ${message}`, { agent: "System", type: "error" });
    }
  }

  function selectHistoryItem(itemId) {
    const item = history.find((h) => h.id === itemId);
    if (!item) return;
    setResult(item.result);
    setError("");
    setStatus("completed");
    setAgentStates({ research: "completed", copywriter: "completed", editor: "completed" });
    addFeed("Loaded previous run from history.", { agent: "System", type: "normal" });
    // Navigate to dashboard
    window.location.hash = "/dashboard";
  }

  const value = {
    status, result, error, history, activityFeed, agentStates,
    runPipeline, selectHistoryItem
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
