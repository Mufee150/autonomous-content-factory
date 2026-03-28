const express = require("express");
const cors = require("cors");
const contentRoutes = require("./routes/contentRoutes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/", contentRoutes);
app.use(errorHandler);

module.exports = app;