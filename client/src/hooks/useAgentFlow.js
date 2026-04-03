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

  function addFeed(message, options = {}) {
    const { type = "normal", agent = "System" } = options;

    const item = {
      id: Date.now() + Math.random(),
      timestamp: getTimestamp(),
      agent,
      type,
      message
    };

    setActivityFeed((currentFeed) => [...currentFeed, item].slice(-40));
  }

  async function runPipeline(sourceText) {
    setStatus("researching");
    setResult(null);
    setError("");
    setAgentStates({ research: "thinking", copywriter: "idle", editor: "idle" });
    addFeed("Started analysis.", { agent: "Research", type: "normal" });

    try {
      const analyzeResponse = await api.post("/analyze", {
        source_text: sourceText
      });

      const metaDocument = analyzeResponse.data.data;
      addFeed("Extracted source facts.", { agent: "Research", type: "success" });
      setAgentStates({
        research: "completed",
        copywriter: "thinking",
        editor: "idle"
      });

      setStatus("generating");
      addFeed("Generating blog, LinkedIn, Twitter, and email outputs.", {
        agent: "Copywriter",
        type: "normal"
      });

      const generateResponse = await api.post("/generate", {
        meta_document: metaDocument
      });

      const content = generateResponse.data.data;
      const review = content.editor_review || {};

      if (content.regeneration_applied) {
        addFeed("Rejected output and requested regeneration.", {
          agent: "Editor",
          type: "error"
        });
        addFeed("Applying corrections from editor feedback.", {
          agent: "Regeneration",
          type: "warning"
        });
      }

      if (review.status === "REJECTED") {
        setAgentStates({
          research: "completed",
          copywriter: "completed",
          editor: "rejected"
        });
        addFeed("Final review status: REJECTED.", {
          agent: "Editor",
          type: "error"
        });
      } else {
        setAgentStates({
          research: "completed",
          copywriter: "completed",
          editor: "completed"
        });
        addFeed("Final review status: APPROVED.", {
          agent: "Editor",
          type: "success"
        });
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
      addFeed(`Pipeline failed: ${message}`, {
        agent: "System",
        type: "error"
      });
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
    addFeed("Loaded a previous run from history.", {
      agent: "System",
      type: "normal"
    });
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

