const { makeAPICall, logger } = require("./apiHandler");
const { cacheResearchCall } = require("./cacheService");
const prompts = require("./promptTemplates");
const metaSchema = require("../../shared/metaSchema");

// ─── Smart fallback (extracts info from natural text) ─────────────────────────
function extractProductName(text) {
  // Try "Product: xxx" format first
  const explicit = text.match(/(?:product|app|tool|platform|software|service)\s*(?:name)?[:\-–]\s*([^\n,.]+)/i);
  if (explicit) return explicit[1].trim();

  // Try to find a capitalized product name (e.g. "TechFlow Pro")
  const capitalizedName = text.match(/\b([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)+)\b/);
  if (capitalizedName) {
    const name = capitalizedName[1].trim();
    // Filter out common sentence starters
    const skipWords = ["The", "This", "Our", "We", "It", "In", "At", "For", "With", "From", "By"];
    if (!skipWords.includes(name.split(" ")[0])) return name;
  }

  // Try quoted names
  const quoted = text.match(/["']([^"']{2,40})["']/);
  if (quoted) return quoted[1].trim();

  // Use first sentence subject
  const firstSentence = text.split(/[.!?\n]/)[0]?.trim() || "";
  if (firstSentence.length < 60) return firstSentence;

  return "Product";
}

function extractAudience(text) {
  const patterns = [
    /(?:target|intended|designed|built)\s+(?:for|audience)[:\s]+([^\n.]+)/i,
    /(?:for|helps|serves|empowers)\s+([\w\s,]+(?:teams|users|professionals|developers|businesses|companies|organizations|marketers|creators|managers|engineers|startups))/i,
    /(?:audience|users?|customers?)[:\-–]\s*([^\n.]+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim().substring(0, 200);
  }
  return "General audience";
}

function extractFeatures(text) {
  const features = [];

  // Look for bullet points or numbered lists
  const bulletMatches = text.match(/(?:^|\n)\s*[-•*]\s+([^\n]+)/g);
  if (bulletMatches) {
    bulletMatches.forEach(m => {
      const clean = m.replace(/^[\s\-•*]+/, "").trim();
      if (clean.length > 5 && clean.length < 200) features.push(clean);
    });
  }

  // Look for "features include" or similar phrases
  const featureBlock = text.match(/(?:features?|capabilities|includes?|offers?)[:\s]+([^\n]+(?:\n\s*[-•*][^\n]+)*)/i);
  if (featureBlock) {
    featureBlock[1].split(/[,;\n]/).forEach(f => {
      const clean = f.replace(/^[\s\-•*]+/, "").trim();
      if (clean.length > 5 && clean.length < 200 && !features.includes(clean)) {
        features.push(clean);
      }
    });
  }

  // Extract key phrases with action verbs
  const actionPhrases = text.match(/(?:uses?|leverages?|provides?|enables?|supports?|integrates?)\s+[^.]+/gi);
  if (actionPhrases && features.length < 3) {
    actionPhrases.slice(0, 3).forEach(p => {
      const clean = p.trim().substring(0, 150);
      if (clean.length > 10) features.push(clean);
    });
  }

  return features.slice(0, 10);
}

function extractValue(text) {
  const patterns = [
    /(?:value\s+proposition|core\s+value|main\s+benefit|key\s+benefit)[:\s]+([^\n.]+)/i,
    /(?:helps?\s+(?:you|teams?|users?))\s+([^\n.]+)/i,
    /(?:designed\s+to|built\s+to|aims?\s+to)\s+([^\n.]+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim().substring(0, 400);
  }

  // Use second sentence as value prop
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length >= 2) return sentences[1].trim().substring(0, 400);

  return "Provides a comprehensive solution for its target users";
}

function extractTone(text) {
  const toneMatch = text.match(/(?:tone|voice|style)[:\s]+([^\n.]+)/i);
  if (toneMatch) return toneMatch[1].trim();

  // Auto-detect tone from content
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(text);
  const hasExclamation = (text.match(/!/g) || []).length > 2;
  const hasTechnical = /(?:API|SDK|integration|algorithm|infrastructure|database|deployment)/i.test(text);
  const hasBusiness = /(?:ROI|revenue|enterprise|B2B|strategy|market)/i.test(text);

  if (hasTechnical && hasBusiness) return "Professional, trustworthy, technical yet accessible";
  if (hasTechnical) return "Technical, informative, developer-friendly";
  if (hasBusiness) return "Professional, business-oriented, results-driven";
  if (hasEmoji || hasExclamation) return "Enthusiastic, engaging, conversational";
  return "Professional, clear, informative";
}

function buildFallbackMetaDocument(sourceText) {
  const productName = extractProductName(sourceText);
  const targetAudience = extractAudience(sourceText);
  const keyFeatures = extractFeatures(sourceText);
  const valueProposition = extractValue(sourceText);
  const toneDetected = extractTone(sourceText);

  const risksOrAmbiguities = [];
  const missingInformation = [];

  if (productName === "Product") {
    risksOrAmbiguities.push("Product name could not be clearly identified from source.");
    missingInformation.push("Explicit product name");
  }
  if (targetAudience === "General audience") {
    missingInformation.push("Specific target audience");
  }
  if (keyFeatures.length === 0) {
    missingInformation.push("Key features list");
  }

  // Extract supporting points from the text
  const sentences = sourceText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const supportingPoints = sentences.slice(1, 4).map(s => s.trim()).filter(Boolean);

  // Extract constraints
  const constraintMatch = sourceText.match(/(?:constraints?|limitations?|restrictions?|note)[:\s]+([^\n]+)/i);
  const constraints = constraintMatch
    ? constraintMatch[1].split(",").map(c => c.trim()).filter(Boolean)
    : [];

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
    missing_information: missingInformation,
  };
}

function normalizeMetaDocument(candidate) {
  return {
    product_name: String(candidate.product_name || "").substring(0, 200),
    target_audience: String(candidate.target_audience || "").substring(0, 200),
    key_features: Array.isArray(candidate.key_features)
      ? candidate.key_features.filter((item) => typeof item === "string").slice(0, 10)
      : [],
    value_proposition: String(candidate.value_proposition || "").substring(0, 400),
    supporting_points: Array.isArray(candidate.supporting_points)
      ? candidate.supporting_points.filter((item) => typeof item === "string").slice(0, 5)
      : [],
    tone_detected: String(candidate.tone_detected || "").substring(0, 100),
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

// ─── Main Agent ───────────────────────────────────────────────────────────────
async function researchAgent(sourceText) {
  logger.info("ResearchAgent", "Processing source text...");

  const { data: cachedData, fromCache } = await cacheResearchCall(sourceText, async () => {
    // Try API first
    const prompt = `${prompts.researchPrompt}\n\nSource Content:\n${sourceText}`;
    const apiResult = await makeAPICall(prompt, {
      responseMimeType: "application/json",
      tag: "ResearchAgent",
    });

    if (apiResult.success) {
      logger.success("ResearchAgent", `API call succeeded using ${apiResult.apiUsed}`);
      try {
        const parsed = JSON.parse(apiResult.data);
        const normalized = normalizeMetaDocument(parsed);
        return { ...metaSchema, ...normalized };
      } catch (parseErr) {
        logger.warn("ResearchAgent", `JSON parse failed: ${parseErr.message}, using fallback`);
      }
    } else {
      logger.warn("ResearchAgent", `API failed: ${apiResult.error?.message}, using smart fallback`);
    }

    // Smart fallback: extract info from natural text
    return buildFallbackMetaDocument(sourceText);
  });

  if (fromCache) {
    logger.success("ResearchAgent", "Result retrieved from cache");
  }

  return cachedData;
}

module.exports = researchAgent;
