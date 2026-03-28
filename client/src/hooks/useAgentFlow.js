import { useState } from "react";
import api from "../services/api";

export default function useAgentFlow() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

