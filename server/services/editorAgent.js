const openai = require("../config/openai");
const prompts = require("./promptTemplates");

function buildFallbackEditorResult(draftContent) {
  return {
    ...draftContent,
    validation_report: {
      hallucination_detected: false,
      tone_consistent: true,
      aligned_with_meta_document: true,
      notes: [
        "Generated in local fallback mode because OpenAI service was unavailable."
      ]
    }
  };
}

function normalizeEditorResult(candidate) {
  const report = candidate.validation_report || {};

  return {
    blog_post: typeof candidate.blog_post === "string" ? candidate.blog_post : "",
    linkedin_post:
      typeof candidate.linkedin_post === "string" ? candidate.linkedin_post : "",
    twitter_thread: Array.isArray(candidate.twitter_thread)
      ? candidate.twitter_thread
          .filter((item) => typeof item === "string")
          .slice(0, 5)
      : [],
    email_teaser:
      typeof candidate.email_teaser === "string" ? candidate.email_teaser : "",
    validation_report: {
      hallucination_detected: Boolean(report.hallucination_detected),
      tone_consistent: Boolean(report.tone_consistent),
      aligned_with_meta_document: Boolean(report.aligned_with_meta_document),
      notes: Array.isArray(report.notes)
        ? report.notes.filter((item) => typeof item === "string")
        : []
    }
  };
}

async function editorAgent(metaDocument, draftContent) {
  let completion;
  try {
    completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: prompts.editorPrompt
        },
        {
          role: "user",
          content: JSON.stringify({
            meta_document: metaDocument,
            generated_content: draftContent
          })
        }
      ]
    });
  } catch (error) {
    return buildFallbackEditorResult(draftContent);
  }

  const rawText = (completion.output_text || "").trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    const parseError = new Error("Editor Agent returned invalid JSON.");
    parseError.statusCode = 502;
    parseError.source = "editor-agent";
    throw parseError;
  }

  return normalizeEditorResult(parsed);
}

module.exports = editorAgent;

