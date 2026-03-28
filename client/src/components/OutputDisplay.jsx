export default function OutputDisplay({ result, error }) {
  if (error) {
    return (
      <section className="card">
        <h3>Generated Output</h3>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="card">
        <h3>Generated Output</h3>
        <p>No output yet.</p>
      </section>
    );
  }

  const { meta_document: metaDocument, content } = result;

  return (
    <section className="card">
      <h3>Generated Output</h3>

      <h4>Meta Document</h4>
      <pre>{JSON.stringify(metaDocument, null, 2)}</pre>

      <h4>Blog Post</h4>
      <p>{content.blog_post}</p>

      <h4>Social Media Thread</h4>
      <ol>
        {content.social_thread.map((post, index) => (
          <li key={`thread-${index}`}>{post}</li>
        ))}
      </ol>

      <h4>Email Teaser</h4>
      <p>{content.email_teaser}</p>

      <h4>Validation Report</h4>
      <pre>{JSON.stringify(content.validation_report, null, 2)}</pre>
    </section>
  );
}

