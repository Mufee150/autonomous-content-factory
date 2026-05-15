const copywriterAgent = require('../server/services/copywriterAgent');
const editorAgent = require('../server/services/editorAgent');
const regenerationAgent = require('../server/services/regenerationAgent');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { meta_document: metaDocument } = req.body || {};

    if (!metaDocument || typeof metaDocument !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'meta_document is required and must be an object.'
      });
    }

    const draftContent = await copywriterAgent(metaDocument);
    const firstReview = await editorAgent(metaDocument, draftContent);

    let finalContent = firstReview;

    if (firstReview.editor_review?.status === 'REJECTED') {
      const regeneratedDraft = await regenerationAgent(
        firstReview.editor_review,
        draftContent
      );
      const secondReview = await editorAgent(metaDocument, regeneratedDraft);
      finalContent = { ...secondReview, regeneration_applied: true };
    }

    res.json(finalContent);
  } catch (error) {
    console.error('[generate]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
