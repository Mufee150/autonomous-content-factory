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
    const apiError = new Error("OpenAI request failed in Copywriter Agent.");
    apiError.statusCode = 502;
    apiError.source = "copywriter-agent";
    throw apiError;
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

