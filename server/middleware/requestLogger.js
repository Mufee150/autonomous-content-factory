function requestLogger(req, res, next) {
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
    );
  });

  next();
}

module.exports = requestLogger;