const { callGemini } = require("../config/gemini");
const prompts = require("./promptTemplates");

function buildFallbackEditorResult(metaDocument, draftContent) {
  const riskyClaims = (metaDocument.risks_or_ambiguities || []).length
    ? [
        "Content was generated while fact sheet includes ambiguities. Review wording before publishing."
      ]
    : [];

  const status = riskyClaims.length ? "REJECTED" : "APPROVED";

  const review = {
    status,
    hallucinations_found: [],
    tone_issues: [],
    missing_alignment: [],
    suggested_fixes: [
      "Generated in local fallback mode because OpenAI service was unavailable.",
      ...riskyClaims
    ]
  };

  return {
    ...draftContent,
    editor_review: review,
    validation_report: review
  };
}

function normalizeReview(candidate) {
  const status =
    typeof candidate.status === "string"
      ? candidate.status.toUpperCase()
      : "APPROVED";

  const hallucinationsFound = Array.isArray(candidate.hallucinations_found)
    ? candidate.hallucinations_found.filter((item) => typeof item === "string")
    : [];

  const toneIssues = Array.isArray(candidate.tone_issues)
    ? candidate.tone_issues.filter((item) => typeof item === "string")
    : [];

  const missingAlignment = Array.isArray(candidate.missing_alignment)
    ? candidate.missing_alignment.filter((item) => typeof item === "string")
    : [];

  const suggestedFixes = Array.isArray(candidate.suggested_fixes)
    ? candidate.suggested_fixes.filter((item) => typeof item === "string")
    : [];

  const forcedStatus = hallucinationsFound.length ? "REJECTED" : status;

  return {
    status: forcedStatus === "REJECTED" ? "REJECTED" : "APPROVED",
    hallucinations_found: hallucinationsFound,
    tone_issues: toneIssues,
    missing_alignment: missingAlignment,
    suggested_fixes: suggestedFixes
  };
}

function normalizeEditorResult(draftContent, review) {
  return {
    blog_post: typeof draftContent.blog_post === "string" ? draftContent.blog_post : "",
    linkedin_post:
      typeof draftContent.linkedin_post === "string" ? draftContent.linkedin_post : "",
    twitter_thread: Array.isArray(draftContent.twitter_thread)
      ? draftContent.twitter_thread.filter((item) => typeof item === "string").slice(0, 5)
      : [],
    email_teaser:
      typeof draftContent.email_teaser === "string" ? draftContent.email_teaser : "",
    editor_review: review,
    validation_report: review
  };
}

async function editorAgent(metaDocument, draftContent) {
  let rawText;
  try {
    rawText = await callGemini(
      prompts.editorPrompt,
      JSON.stringify({ fact_sheet: metaDocument, generated_content: draftContent })
    );
    rawText = rawText.trim();
  } catch (error) {
    return buildFallbackEditorResult(metaDocument, draftContent);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    const parseError = new Error("Editor Agent returned invalid JSON.");
    parseError.statusCode = 502;
    parseError.source = "editor-agent";
    throw parseError;
  }

  const review = normalizeReview(parsed);

  return normalizeEditorResult(draftContent, review);
}

module.exports = editorAgent;

