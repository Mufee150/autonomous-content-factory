const openai = require("../config/openai");
const prompts = require("./promptTemplates");
const metaSchema = require("../../shared/metaSchema");

function normalizeMetaDocument(candidate) {
  return {
    product_name:
      typeof candidate.product_name === "string" ? candidate.product_name : "",
    features: Array.isArray(candidate.features)
      ? candidate.features.filter((item) => typeof item === "string")
      : [],
    target_audience:
      typeof candidate.target_audience === "string"
        ? candidate.target_audience
        : "",
    value_proposition:
      typeof candidate.value_proposition === "string"
        ? candidate.value_proposition
        : "",
    tone: typeof candidate.tone === "string" ? candidate.tone : "",
    ambiguous_points: Array.isArray(candidate.ambiguous_points)
      ? candidate.ambiguous_points.filter((item) => typeof item === "string")
      : []
  };
}

async function researchAgent(sourceText) {
  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: prompts.researchPrompt
      },
      {
        role: "user",
        content: sourceText
      }
    ]
  });

  const rawText = (completion.output_text || "").trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error("Research agent returned invalid JSON.");
  }

  const safeMetaDocument = normalizeMetaDocument(parsed);

  return {
    ...metaSchema,
    ...safeMetaDocument
  };
}

module.exports = researchAgent;

