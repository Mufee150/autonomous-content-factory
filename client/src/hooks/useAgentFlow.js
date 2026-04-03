import { useState } from "react";
import api from "../services/api";

function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function useAgentFlow() {
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

  function addFeed(message) {
    const item = {
      id: Date.now() + Math.random(),
      timestamp: getTimestamp(),
      message
    };

    setActivityFeed((currentFeed) => [item, ...currentFeed].slice(0, 20));
  }

  async function runPipeline(sourceText) {
    setStatus("researching");
    setResult(null);
    setError("");
    setAgentStates({ research: "thinking", copywriter: "idle", editor: "idle" });
    addFeed("Research Agent started analysis...");

    try {
      const analyzeResponse = await api.post("/analyze", {
        source_text: sourceText
      });

      const metaDocument = analyzeResponse.data.data;
      addFeed("Research Agent extracted facts.");
      setAgentStates({
        research: "completed",
        copywriter: "thinking",
        editor: "idle"
      });

      setStatus("generating");
      addFeed("Copywriter Agent generating blog, LinkedIn, Twitter, and email...");

      const generateResponse = await api.post("/generate", {
        meta_document: metaDocument
      });

      const content = generateResponse.data.data;
      const review = content.editor_review || {};

      if (content.regeneration_applied) {
        addFeed("Editor rejected output ❌");
        addFeed("Regenerating...");
      }

      if (review.status === "REJECTED") {
        setAgentStates({
          research: "completed",
          copywriter: "completed",
          editor: "rejected"
        });
        addFeed("Editor status: REJECTED.");
      } else {
        setAgentStates({
          research: "completed",
          copywriter: "completed",
          editor: "completed"
        });
        addFeed("Editor approved output ✅");
      }

      setResult({
        meta_document: metaDocument,
        content
      });

      const historyItem = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        sourceText,
        result: {
          meta_document: metaDocument,
          content
        }
      };

      setHistory((currentHistory) => [historyItem, ...currentHistory].slice(0, 10));
      setStatus(review.status === "REJECTED" ? "failed" : "completed");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Failed to generate content. Please try again.";

      setError(message);
      setStatus("failed");
      setAgentStates((current) => ({
        research: current.research === "completed" ? "completed" : current.research,
        copywriter:
          current.copywriter === "thinking" ? "rejected" : current.copywriter,
        editor: "rejected"
      }));
      addFeed(`Pipeline failed: ${message}`);
    }
  }

  function selectHistoryItem(itemId) {
    const selectedItem = history.find((item) => item.id === itemId);
    if (!selectedItem) {
      return;
    }

    setResult(selectedItem.result);
    setError("");
    setStatus("completed");
    setAgentStates({ research: "completed", copywriter: "completed", editor: "completed" });
    addFeed("Loaded a previous run from history.");
  }

  return {
    status,
    result,
    error,
    history,
    activityFeed,
    agentStates,
    runPipeline,
    selectHistoryItem
  };
}

