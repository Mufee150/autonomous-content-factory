const openai = require("../config/openai");
const prompts = require("./promptTemplates");

function buildFallbackDraft(metaDocument) {
  const productName = metaDocument.product_name || "the product";
  const features = (metaDocument.features || []).join(", ") || "its core capabilities";
  const audience = metaDocument.target_audience || "your target audience";
  const value =
    metaDocument.value_proposition || "delivering clear and practical value";

  return {
    blog_post: `${productName} is designed for ${audience}. Its main goal is to ${value}. In practical terms, this means participants or readers get a clear path from first exposure to confident execution.

The experience is built around ${features}. These elements work together to keep learning focused, reduce confusion, and provide momentum from one section to the next. Instead of scattered information, the structure gives people a reliable sequence they can follow.

One of the biggest strengths of ${productName} is clarity. Each section is planned to connect directly to outcomes that matter. People do not just consume information, they understand how to apply it.

For teams and organizers, this also improves consistency. Messaging remains aligned, expectations are transparent, and delivery quality becomes easier to maintain. Over time, this creates better engagement and stronger trust in the program.

If your objective is to help ${audience} gain confidence quickly, ${productName} provides a practical and repeatable format that supports that outcome.`,
    social_thread: [
      `${productName} helps teams move from one source document to multi-channel content faster.`,
      `It is built for ${audience} who need consistent messaging without repetitive rewriting.`,
      `Core features: ${features}.`,
      `Main value: ${value}.`,
      `Outcome: faster launches, better consistency, and reduced manual effort.`
    ],
    email_teaser: `${productName} gives ${audience} a faster way to turn one source document into clear, consistent campaign content with ${value}.`
  };
}

function normalizeDraft(candidate) {
  return {
    blog_post: typeof candidate.blog_post === "string" ? candidate.blog_post : "",
    social_thread: Array.isArray(candidate.social_thread)
      ? candidate.social_thread
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
          content: JSON.stringify(metaDocument)
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

