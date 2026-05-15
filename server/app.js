const express = require("express");
const cors = require("cors");
const contentRoutes = require("./routes/contentRoutes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Allow both local dev and deployed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/", contentRoutes);
app.use(errorHandler);

module.exports = app;