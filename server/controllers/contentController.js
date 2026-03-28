const researchAgent = require("../services/researchAgent");
const copywriterAgent = require("../services/copywriterAgent");
const editorAgent = require("../services/editorAgent");

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

async function generateFromMeta(req, res, next) {
  try {
    const { meta_document: metaDocument } = req.body || {};

    if (!metaDocument || typeof metaDocument !== "object") {
      return res.status(400).json({
        success: false,
        message: "meta_document is required and must be an object."
      });
    }

    const draftContent = await copywriterAgent(metaDocument);
    const finalContent = await editorAgent(metaDocument, draftContent);

    res.json({ success: true, data: finalContent });
  } catch (error) {
    next(error);
  }
}

module.exports = { analyzeSource, generateFromMeta };

