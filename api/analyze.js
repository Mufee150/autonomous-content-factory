const researchAgent = require('../server/services/researchAgent');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { source_text: sourceText = '' } = req.body || {};

    if (!sourceText || typeof sourceText !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'source_text is required and must be a string.'
      });
    }

    const metaDocument = await researchAgent(sourceText);
    res.json(metaDocument);
  } catch (error) {
    console.error('[analyze]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
