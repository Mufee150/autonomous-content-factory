const openai = require("../config/openai");
const prompts = require("./promptTemplates");

function buildFallbackDraft(metaDocument) {
  const productName = metaDocument.product_name || "This offering";
  const audience = metaDocument.target_audience || "the target audience";
  const value =
    metaDocument.value_proposition ||
    "provide clear, practical value based on the fact sheet";
  const features = (metaDocument.key_features || []).join(", ");
  const supportingPoints = (metaDocument.supporting_points || []).join("; ");
  const constraints = (metaDocument.constraints || []).join(", ");
  const risks = (metaDocument.risks_or_ambiguities || []).join("; ");
  const missingInfo = (metaDocument.missing_information || []).join(", ");

  const neutralLine = risks
    ? `Some details remain unclear (${risks}), so this messaging uses neutral wording.`
    : "All available claims are limited to the provided fact sheet.";

  const missingLine = missingInfo
    ? `Some marketing details are missing (${missingInfo}), so assumptions are intentionally avoided.`
    : "No missing critical marketing fields were flagged in the fact sheet.";

  const featureLine = features
    ? `Key features mentioned are ${features}.`
    : "The fact sheet does not list explicit key features.";

  const supportLine = supportingPoints
    ? `Supporting points include ${supportingPoints}.`
    : "No explicit supporting points were provided in the fact sheet.";

  const constraintLine = constraints
    ? `Noted constraints: ${constraints}.`
    : "No explicit constraints were provided.";

  return {
    blog_post: `Introduction:
${productName} is positioned for ${audience}, with a central value proposition: ${value}. This article is based strictly on the provided fact sheet and avoids assumptions beyond those documented facts.

Body:
${featureLine} ${supportLine} ${constraintLine}

To keep content reliable across channels, the messaging focuses on one clear throughline: ${value}. This creates consistency between long-form and short-form formats while preventing drift in claims.

${neutralLine} ${missingLine}

From a strategy perspective, the fact sheet provides a usable foundation for professional campaign messaging. The most dependable angle is to reinforce audience relevance (${audience}) and repeat the same value proposition without introducing unverified detail. Where specifics are absent, communication should stay precise and transparent rather than speculative.

This approach supports trust, reduces factual risk, and creates a repeatable structure for multi-platform publishing. The result is content that remains consistent, controlled, and aligned with source data.

Conclusion:
For this campaign, the strongest message remains ${value}. Repeating this proposition across blog, LinkedIn, Twitter, and email ensures alignment and clarity while keeping every statement grounded in the fact sheet.`,
    linkedin_post: `${productName} is built for ${audience} with a clear promise: ${value}.

${featureLine}
${supportLine}

${neutralLine}
${missingLine}

The focus here is disciplined messaging based only on verified source information.`,
    twitter_thread: [
      `${productName}: built for ${audience}. Core value -> ${value}.`,
      features
        ? `Key features from the fact sheet: ${features}.`
        : "No explicit key features were listed in the fact sheet.",
      supportingPoints
        ? `Supporting points: ${supportingPoints}.`
        : "No explicit supporting points were provided.",
      constraints
        ? `Constraints to respect: ${constraints}.`
        : "No explicit constraints were listed.",
      `${neutralLine} ${missingLine}`
    ],
    email_teaser: `${productName} for ${audience}: ${value}. This message is based strictly on verified source details, with neutral wording where information is unclear.`
  };
}

function normalizeDraft(candidate) {
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
      typeof candidate.email_teaser === "string" ? candidate.email_teaser : ""
  };
}

async function copywriterAgent(metaDocument) {
  let completion;
  try {
    completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: prompts.copywriterPrompt
        },
        {
          role: "user",
          content: `Fact Sheet:\n${JSON.stringify(metaDocument, null, 2)}`
        }
      ]
    });
  } catch (error) {
    return buildFallbackDraft(metaDocument);
  }

  const rawText = (completion.output_text || "").trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    const parseError = new Error("Copywriter Agent returned invalid JSON.");
    parseError.statusCode = 502;
    parseError.source = "copywriter-agent";
    throw parseError;
  }

  return normalizeDraft(parsed);
}

module.exports = copywriterAgent;

