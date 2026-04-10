/**
 * API Handler Service
 * Centralized Gemini API management with retry logic and error handling
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// ─── Configuration ────────────────────────────────────────────────────────────
const API_CONFIG = {
  GEMINI: {
    name: "Gemini",
    enabled: !!process.env.GEMINI_API_KEY,
    apiKey: process.env.GEMINI_API_KEY || "",
    maxRetries: 3,
    initialDelay: 1000, // ms
  },
};

// ─── Logger ──────────────────────────────────────────────────────────────────
const logger = {
  info: (tag, message) => console.log(`[${tag}] ℹ️ ${message}`),
  warn: (tag, message) => console.warn(`[${tag}] ⚠️ ${message}`),
  error: (tag, message) => console.error(`[${tag}] ❌ ${message}`),
  debug: (tag, message) => {
    if (process.env.DEBUG === "true") console.log(`[${tag}] 🔍 ${message}`);
  },
  success: (tag, message) => console.log(`[${tag}] ✅ ${message}`),
};

module.exports.logger = logger;

// ─── Exponential Backoff Calculator ──────────────────────────────────────────
function calculateBackoffDelay(retryCount, initialDelay) {
  return initialDelay * Math.pow(2, retryCount - 1) + Math.random() * 1000;
}

// ─── Error Detector ──────────────────────────────────────────────────────────
function isRetryableError(error) {
  const message = error?.message || "";
  const status = error?.status || 0;

  // Rate limit (429) → Always retry
  if (status === 429) return true;

  // Server errors (5xx) → Retry
  if (status >= 500) return true;

  // Timeout errors → Retry
  if (message.includes("timeout") || message.includes("TIMEOUT")) return true;
  if (message.includes("ECONNREFUSED") || message.includes("ECONNRESET")) return true;

  // Authentication errors (401, 403) → Don't retry
  if (status === 401 || status === 403) return false;

  // Model not found (404) → Don't retry
  if (status === 404) return false;

  return false;
}

// ─── Request Wrapper (Retry + Backoff) ───────────────────────────────────────
async function requestWithRetry(apiName, requestFn, maxRetries = 3, initialDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(apiName, `Attempt ${attempt}/${maxRetries}`);
      const result = await requestFn();

      if (attempt > 1) {
        logger.success(apiName, `Succeeded on attempt ${attempt}`);
      }
      return { success: true, data: result, apiUsed: apiName };
    } catch (error) {
      lastError = error;
      const errorMsg = error?.message || JSON.stringify(error);
      logger.warn(apiName, `Attempt ${attempt} failed: ${errorMsg}`);

      // Check if error is retryable
      if (!isRetryableError(error) || attempt === maxRetries) {
        break;
      }

      // Calculate exponential backoff delay
      const delay = calculateBackoffDelay(attempt, initialDelay);
      logger.debug(apiName, `Waiting ${Math.round(delay)}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { success: false, error: lastError, apiUsed: apiName };
}

// ─── Gemini API Handler ───────────────────────────────────────────────────────
async function callGeminiAPI(prompt, responseMimeType = "application/json") {
  const config = API_CONFIG.GEMINI;

  if (!config.enabled) {
    throw new Error("Gemini API is not configured (missing GEMINI_API_KEY)");
  }

  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType,
    },
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType },
  });

  return result.response.text().trim();
}

// ─── Main API Call Interface ──────────────────────────────────────────────────
async function makeAPICall(prompt, options = {}) {
  const {
    responseMimeType = "application/json",
    tag = "APIHandler",
    timeout = 30000,
  } = options;

  try {
    const config = API_CONFIG.GEMINI;

    if (!config.enabled) {
      logger.error(tag, "No API key configured. Set GEMINI_API_KEY in .env");
      return {
        success: false,
        data: null,
        apiUsed: null,
        error: { message: "No API key configured", type: "ConfigError" },
      };
    }

    // Set timeout wrapper
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API call timeout")), timeout)
    );

    const apiCallPromise = requestWithRetry(
      config.name,
      () => callGeminiAPI(prompt, responseMimeType),
      config.maxRetries,
      config.initialDelay
    );

    const result = await Promise.race([apiCallPromise, timeoutPromise]);

    if (result.success) {
      logger.success(tag, `API call succeeded (${result.apiUsed})`);
      return {
        success: true,
        data: result.data,
        apiUsed: result.apiUsed,
        error: null,
      };
    }

    // API failed after retries
    logger.warn(tag, `API failed after retries: ${result.error?.message}`);
    return {
      success: false,
      data: null,
      apiUsed: result.apiUsed,
      error: {
        message: result.error?.message || "API call failed",
        type: result.error?.constructor?.name || "Error",
      },
    };
  } catch (error) {
    logger.error(tag, `API call failed: ${error?.message}`);
    return {
      success: false,
      data: null,
      apiUsed: null,
      error: {
        message: error?.message || "Unknown error",
        type: error?.constructor?.name || "Error",
      },
    };
  }
}

module.exports = {
  makeAPICall,
  callGeminiAPI,
  requestWithRetry,
  isRetryableError,
  calculateBackoffDelay,
  API_CONFIG,
  logger,
};
