import { useState } from "react";
import api from "../services/api";

export default function useAgentFlow() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function runPipeline(sourceText) {
    setStatus("researching");
    setError("");

    try {
      const response = await api.post("/create-content", {
        source_text: sourceText
      });

      setResult(response.data.data);
      setStatus("completed");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Failed to generate content. Please try again.";

      setError(message);
      setStatus("failed");
    }
  }

  return {
    status,
    result,
    error,
    runPipeline
  };
}

