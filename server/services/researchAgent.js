const { callGemini } = require("../config/gemini");
const prompts = require("./promptTemplates");
const metaSchema = require("../../shared/metaSchema");

function getSectionValue(sourceText, sectionName) {
  const regex = new RegExp(`${sectionName}\\s*:\\s*([^\\n.]+)`, "i");
  const match = sourceText.match(regex);
  return match ? match[1].trim() : "";
}

function buildFallbackMetaDocument(sourceText) {
  const productName = getSectionValue(sourceText, "Product");
  const targetAudience = getSectionValue(sourceText, "Audience");
  const valueProposition = getSectionValue(sourceText, "Value");
  const toneDetected = getSectionValue(sourceText, "Tone");

  const featureLine = getSectionValue(sourceText, "Features");
  const keyFeatures = featureLine
    ? featureLine
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const supportingLine = getSectionValue(sourceText, "Supporting Points");
  const supportingPoints = supportingLine
    ? supportingLine
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const constraintsLine = getSectionValue(sourceText, "Constraints");
  const constraints = constraintsLine
    ? constraintsLine
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const risksOrAmbiguities = [];
  if (!productName) {
    risksOrAmbiguities.push("Product name is unclear in source content.");
  }
  if (!targetAudience) {
    risksOrAmbiguities.push("Target audience is unclear in source content.");
  }

  const missingInformation = [];
  if (!productName) {
    missingInformation.push("Product name");
  }
  if (!targetAudience) {
    missingInformation.push("Target audience");
  }
  if (!keyFeatures.length) {
    missingInformation.push("Key features");
  }
  if (!valueProposition) {
    missingInformation.push("Value proposition");
  }
  if (!toneDetected) {
    missingInformation.push("Tone");
  }

  return {
    ...metaSchema,
    product_name: productName,
    target_audience: targetAudience,
    key_features: keyFeatures,
    value_proposition: valueProposition,
    supporting_points: supportingPoints,
    tone_detected: toneDetected,
    constraints,
    risks_or_ambiguities: risksOrAmbiguities,
    missing_information: missingInformation
  };
}

function normalizeMetaDocument(candidate) {
  return {
    product_name:
      typeof candidate.product_name === "string" ? candidate.product_name : "",
    target_audience:
      typeof candidate.target_audience === "string"
        ? candidate.target_audience
        : "",
    key_features: Array.isArray(candidate.key_features)
      ? candidate.key_features.filter((item) => typeof item === "string")
      : [],
    value_proposition:
      typeof candidate.value_proposition === "string"
        ? candidate.value_proposition
        : "",
    supporting_points: Array.isArray(candidate.supporting_points)
      ? candidate.supporting_points.filter((item) => typeof item === "string")
      : [],
    tone_detected:
      typeof candidate.tone_detected === "string" ? candidate.tone_detected : "",
    constraints: Array.isArray(candidate.constraints)
      ? candidate.constraints.filter((item) => typeof item === "string")
      : [],
    risks_or_ambiguities: Array.isArray(candidate.risks_or_ambiguities)
      ? candidate.risks_or_ambiguities.filter((item) => typeof item === "string")
      : [],
    missing_information: Array.isArray(candidate.missing_information)
      ? candidate.missing_information.filter((item) => typeof item === "string")
      : []
  };
}

async function researchAgent(sourceText) {
  let rawText;
  try {
    rawText = await callGemini(prompts.researchPrompt, sourceText);
    rawText = rawText.trim();
  } catch (error) {
    return buildFallbackMetaDocument(sourceText);
  }

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

