const express = require("express");
const { uploadResume, getResumeBuilder, saveResumeBuilder } = require("../controllers/resumeController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();
router.post("/upload", protect, authorize("candidate"), upload.single("resume"), uploadResume);
router.get("/builder", protect, authorize("candidate"), getResumeBuilder);
router.post("/builder", protect, authorize("candidate"), saveResumeBuilder);

module.exports = router;
