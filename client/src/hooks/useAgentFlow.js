import { useState } from "react";
import api from "../services/api";

export default function useAgentFlow() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  async function runPipeline(sourceText) {
    setStatus("researching");
    setResult(null);
    setError("");

    try {
      const analyzeResponse = await api.post("/analyze", {
        source_text: sourceText
      });

      const metaDocument = analyzeResponse.data.data;

      setStatus("generating");

      const generateResponse = await api.post("/generate", {
        meta_document: metaDocument
      });

      setResult({
        meta_document: metaDocument,
        content: generateResponse.data.data
      });

      const historyItem = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        sourceText,
        result: {
          meta_document: metaDocument,
          content: generateResponse.data.data
        }
      };

      setHistory((currentHistory) => [historyItem, ...currentHistory].slice(0, 10));
      setStatus("completed");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Failed to generate content. Please try again.";

      setError(message);
      setStatus("failed");
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
  }

  return {
    status,
    result,
    error,
    history,
    runPipeline,
    selectHistoryItem
  };
}

