const { callGemini } = require("../config/gemini");
const prompts = require("./promptTemplates");

function normalizeContent(candidate, originalContent) {
  return {
    blog_post:
      typeof candidate.blog_post === "string"
        ? candidate.blog_post
        : originalContent.blog_post || "",
    linkedin_post:
      typeof candidate.linkedin_post === "string"
        ? candidate.linkedin_post
        : originalContent.linkedin_post || "",
    twitter_thread: Array.isArray(candidate.twitter_thread)
      ? candidate.twitter_thread
          .filter((item) => typeof item === "string")
          .slice(0, 5)
      : Array.isArray(originalContent.twitter_thread)
      ? originalContent.twitter_thread
      : [],
    email_teaser:
      typeof candidate.email_teaser === "string"
        ? candidate.email_teaser
        : originalContent.email_teaser || ""
  };
}

async function regenerationAgent(editorOutput, originalContent) {
  let rawText;
  try {
    rawText = await callGemini(
      prompts.regenerationPrompt,
      JSON.stringify({ EDITOR_OUTPUT: editorOutput, CONTENT: originalContent })
    );
    rawText = rawText.trim();
  } catch (error) {
    return originalContent;
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    return originalContent;
  }

  return normalizeContent(parsed, originalContent);
}

module.exports = regenerationAgent;
