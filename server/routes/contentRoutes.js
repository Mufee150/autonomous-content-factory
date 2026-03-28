const express = require("express");
const {
	analyzeSource,
	generateFromMeta,
	createContent
} = require("../controllers/contentController");

const router = express.Router();

router.post("/analyze", analyzeSource);
router.post("/generate", generateFromMeta);
router.post("/create-content", createContent);

module.exports = router;

