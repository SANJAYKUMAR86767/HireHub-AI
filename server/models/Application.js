const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
      default: "applied",
    },
    aiScore: { type: Number, default: 0 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recruiterFeedback: { type: String },
    interviewDate: { type: Date },
  },
  { timestamps: true }
);

applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
