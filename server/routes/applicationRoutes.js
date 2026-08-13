const express = require("express");
const {
  applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();
router.post("/:jobId/apply", protect, authorize("candidate"), applyToJob);
router.get("/mine", protect, authorize("candidate"), getMyApplications);
router.get("/job/:jobId", protect, authorize("recruiter"), getApplicantsForJob);
router.put("/:id/status", protect, authorize("recruiter"), updateApplicationStatus);

module.exports = router;
