export default function OutputDisplay({ output = "" }) {
  return (
    <section>
      <h3>Generated Output</h3>
      <pre>{output || "No output yet."}</pre>
    </section>
  );
}

