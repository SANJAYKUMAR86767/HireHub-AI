const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { generateAiInsights } = require("../controllers/aiController");

router.post("/insights", protect, generateAiInsights);

module.exports = router;
