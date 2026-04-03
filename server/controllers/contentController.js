const researchAgent = require("../services/researchAgent");
const copywriterAgent = require("../services/copywriterAgent");
const editorAgent = require("../services/editorAgent");
const regenerationAgent = require("../services/regenerationAgent");

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
    const firstReview = await editorAgent(metaDocument, draftContent);

    let finalContent = firstReview;

    if (firstReview.editor_review?.status === "REJECTED") {
      const regeneratedDraft = await regenerationAgent(
        firstReview.editor_review,
        draftContent
      );
      const secondReview = await editorAgent(metaDocument, regeneratedDraft);
      finalContent = {
        ...secondReview,
        regeneration_applied: true
      };
    }

    res.json({ success: true, data: finalContent });
  } catch (error) {
    next(error);
  }
}

async function createContent(req, res, next) {
  try {
    const { source_text: sourceText = "" } = req.body || {};

    if (!sourceText || typeof sourceText !== "string") {
      return res.status(400).json({
        success: false,
        message: "source_text is required and must be a string."
      });
    }

    const metaDocument = await researchAgent(sourceText);
    const draftContent = await copywriterAgent(metaDocument);
    const firstReview = await editorAgent(metaDocument, draftContent);

    let finalContent = firstReview;

    if (firstReview.editor_review?.status === "REJECTED") {
      const regeneratedDraft = await regenerationAgent(
        firstReview.editor_review,
        draftContent
      );
      const secondReview = await editorAgent(metaDocument, regeneratedDraft);
      finalContent = {
        ...secondReview,
        regeneration_applied: true
      };
    }

    res.json({
      success: true,
      data: {
        meta_document: metaDocument,
        content: finalContent
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { analyzeSource, generateFromMeta, createContent };

