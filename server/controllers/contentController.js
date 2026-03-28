const researchAgent = require("../services/researchAgent");

async function analyzeSource(req, res, next) {
  try {
    const { source_text: sourceText = "" } = req.body || {};

    if (!sourceText || typeof sourceText !== "string") {
      return res.status(400).json({
        success: false,
        message: "source_text is required and must be a string."
      });
    }

    const metaDocument = await researchAgent(sourceText);

    res.json({ success: true, data: metaDocument });
  } catch (error) {
    next(error);
  }
}

module.exports = { analyzeSource };

