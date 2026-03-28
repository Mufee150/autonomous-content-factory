module.exports = async function editorAgent(draftData) {
  return {
    ...draftData,
    final: "Edited content placeholder"
  };
};

