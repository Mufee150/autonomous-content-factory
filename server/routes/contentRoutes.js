const express = require("express");
const { analyzeSource } = require("../controllers/contentController");

const router = express.Router();

router.post("/analyze", analyzeSource);

module.exports = router;

