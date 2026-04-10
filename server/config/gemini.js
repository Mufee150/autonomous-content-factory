const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Strip markdown code fences that Gemini sometimes wraps around JSON.
 * e.g. ```json\n{...}\n``` -> {...}
 */
function stripCodeFences(text) {
  // Remove leading ```json or ``` with optional whitespace/newlines
  return text
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

/**
 * Helper to call Gemini with a system prompt and user message.
 * Returns the response text string (with code fences removed).
 */
async function callGemini(systemPrompt, userMessage) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userMessage);
  const response = result.response;
  return stripCodeFences(response.text());
}

module.exports = { callGemini };
