const express = require("express");
const { getRecommendedJobs, scheduleInterviewSlot } = require("../controllers/advancedController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/recommendations", protect, getRecommendedJobs);
router.post("/schedule-interview", protect, authorize("recruiter"), scheduleInterviewSlot);

module.exports = router;
