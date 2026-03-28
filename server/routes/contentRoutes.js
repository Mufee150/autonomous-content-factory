const express = require("express");
const {
	analyzeSource,
	generateFromMeta
} = require("../controllers/contentController");

const router = express.Router();

router.post("/analyze", analyzeSource);
router.post("/generate", generateFromMeta);

module.exports = router;

