const openai = require("../config/openai");
const prompts = require("./promptTemplates");
const metaSchema = require("../../shared/metaSchema");

function getSectionValue(sourceText, sectionName) {
  const regex = new RegExp(`${sectionName}\\s*:\\s*([^\\n.]+)`, "i");
  const match = sourceText.match(regex);
  return match ? match[1].trim() : "";
}

function toTitleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^(ai|ml|aiml)$/i.test(word)) {
        return word.toUpperCase();
      }

      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function inferTopic(sourceText) {
  if (/\baiml\b/i.test(sourceText)) {
    return "AI and Machine Learning";
  }

  const patterns = [
    /workshop\s+on\s+([a-z0-9\s-]+)/i,
    /about\s+([a-z0-9\s-]+)/i,
    /for\s+([a-z0-9\s-]+)/i
  ];

  for (const pattern of patterns) {
    const match = sourceText.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/[.,!?;:].*$/, "").trim();
    }
  }

  return "";
}

function inferProductName(sourceText) {
  const explicitProduct = getSectionValue(sourceText, "Product");
  if (explicitProduct) {
    return explicitProduct;
  }

  const topic = inferTopic(sourceText);
  if (topic) {
    if (/workshop/i.test(sourceText)) {
      return `${toTitleCase(topic)} Workshop`;
    }

    return toTitleCase(topic);
  }

  return "Content Campaign";
}

function inferFeatures(sourceText, topic) {
  const explicitFeatures = getSectionValue(sourceText, "Features");
  if (explicitFeatures) {
    return explicitFeatures
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (/workshop/i.test(sourceText)) {
    return [
      "Structured learning agenda",
      "Hands-on practical exercises",
      "Guided instruction and Q&A"
    ];
  }

  if (topic) {
    return [
      `Focused coverage of ${topic}`,
      "Clear learning flow",
      "Actionable next steps"
    ];
  }

  return [];
}

function buildFallbackMetaDocument(sourceText) {
  const topic = inferTopic(sourceText);
  const productName = inferProductName(sourceText);
  const features = inferFeatures(sourceText, topic);
  const explicitAudience = getSectionValue(sourceText, "Audience");
  const explicitValue = getSectionValue(sourceText, "Value");
  const targetAudience =
    explicitAudience || (topic ? `Learners interested in ${topic}` : "");
  const valueProposition =
    explicitValue ||
    (topic
      ? `Help learners build practical understanding of ${topic} quickly`
      : "");
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

