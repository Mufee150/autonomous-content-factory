const openai = require("../config/openai");
const prompts = require("./promptTemplates");
const metaSchema = require("../../shared/metaSchema");

function getSectionValue(sourceText, sectionName) {
  const regex = new RegExp(`${sectionName}\\s*:\\s*([^\\n.]+)`, "i");
  const match = sourceText.match(regex);
  return match ? match[1].trim() : "";
}

function buildFallbackMetaDocument(sourceText) {
  const productName = getSectionValue(sourceText, "Product") || "Unknown Product";
  const featuresRaw = getSectionValue(sourceText, "Features");
  const features = featuresRaw
    ? featuresRaw.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  const targetAudience = getSectionValue(sourceText, "Audience");
  const valueProposition = getSectionValue(sourceText, "Value");
  const tone = getSectionValue(sourceText, "Tone") || "professional";

  const ambiguousPoints = [];
  if (!targetAudience) {
    ambiguousPoints.push("Target audience is not clearly specified.");
  }
  if (!valueProposition) {
    ambiguousPoints.push("Value proposition is not clearly specified.");
  }

  return {
    ...metaSchema,
    product_name: productName,
    features,
    target_audience: targetAudience,
    value_proposition: valueProposition,
    tone,
    ambiguous_points: ambiguousPoints
  };
}

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
  let completion;
  try {
    completion = await openai.responses.create({
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
  } catch (error) {
    return buildFallbackMetaDocument(sourceText);
  }

  const rawText = (completion.output_text || "").trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    const parseError = new Error("Research Agent returned invalid JSON.");
    parseError.statusCode = 502;
    parseError.source = "research-agent";
    throw parseError;
  }

  const safeMetaDocument = normalizeMetaDocument(parsed);

  return {
    ...metaSchema,
    ...safeMetaDocument
  };
}

module.exports = researchAgent;

