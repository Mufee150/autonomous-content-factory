const openai = require("../config/openai");
const prompts = require("./promptTemplates");

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
  const completion = await openai.responses.create({
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

  const rawText = (completion.output_text || "").trim();

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error("Copywriter agent returned invalid JSON.");
  }

  return normalizeDraft(parsed);
}

module.exports = copywriterAgent;

