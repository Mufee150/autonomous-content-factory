function formatOutput(content) {
  return {
    timestamp: new Date().toISOString(),
    content
  };
}

module.exports = { formatOutput };

