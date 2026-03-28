import { useState } from "react";

export default function UploadBox({ onSubmit, isLoading }) {
  const [sourceText, setSourceText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!sourceText.trim()) {
      return;
    }

    onSubmit(sourceText.trim());
  }

  return (
    <section className="card">
      <h3>Upload Input</h3>
      <p>Add source material to generate your full campaign.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={8}
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          placeholder="Paste your source document here..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Content"}
        </button>
      </form>
    </section>
  );
}

