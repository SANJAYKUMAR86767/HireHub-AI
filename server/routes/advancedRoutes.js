const express = require("express");
const {
  getRecommendedJobs,
  scheduleInterviewSlot,
  getTalentPool,
  askAiCopilot,
  analyzeLiveInterview,
  getCareerRoadmaps,
  getNotifications,
  analyzeJobOffer,
  auditResumeContent,
  evaluateSystemArchitecture,
  generateJobDescription,
  analyzeCompanyCulture,
  generateOutreachSequence,
  getTechTrendsMatrix,
} = require("../controllers/advancedController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Candidate Recommendations & General Routes
router.get("/recommendations", protect, getRecommendedJobs);
router.post("/schedule-interview", protect, authorize("recruiter", "admin"), scheduleInterviewSlot);

// Recruiter Talent Radar & Discovery
router.get("/talent-pool", protect, authorize("recruiter", "admin"), getTalentPool);

// Global AI Career Copilot
router.post("/copilot", protect, askAiCopilot);

// Live Mock Video Interview Telemetry
router.post("/interview-analysis", protect, analyzeLiveInterview);

// Career Roadmaps & Compensation Explorer (Public / Candidate)
router.get("/career-roadmaps", getCareerRoadmaps);

// Real-Time Notification Center Feed
router.get("/notifications", protect, getNotifications);

// Phase 2 Advanced Endpoints
router.post("/offer-analyzer", protect, analyzeJobOffer);
router.post("/resume-auditor", protect, auditResumeContent);
router.post("/system-design-eval", protect, evaluateSystemArchitecture);
router.post("/generate-job-desc", protect, authorize("recruiter", "admin"), generateJobDescription);

// Phase 3 Hyper-Advanced Endpoints
router.post("/culture-analyzer", protect, analyzeCompanyCulture);
router.post("/outreach-sequence", protect, authorize("recruiter", "admin"), generateOutreachSequence);
router.get("/tech-trends", getTechTrendsMatrix);

module.exports = router;
