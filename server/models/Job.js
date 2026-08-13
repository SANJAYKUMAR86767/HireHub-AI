const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String, required: true }],
    location: { type: String },
    jobType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" },
    workMode: { type: String, enum: ["Remote", "Onsite", "Hybrid"], default: "Onsite" },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    experienceRequired: { type: Number, default: 0 },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },

    riskScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
    riskFlags: [{ type: String }],
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", skills: "text", company: "text" });

module.exports = mongoose.model("Job", jobSchema);
