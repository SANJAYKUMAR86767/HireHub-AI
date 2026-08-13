const express = require("express");
const { getQuestions, getFeedback, predictSalary } = require("../controllers/interviewController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();
router.post("/questions", protect, authorize("candidate"), getQuestions);
router.post("/feedback", protect, authorize("candidate"), getFeedback);
router.post("/salary-predict", protect, predictSalary);

module.exports = router;
