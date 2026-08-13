const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["candidate", "recruiter", "admin"], default: "candidate" },

    skills: [{ type: String }],
    experience: [
      { title: String, company: String, years: Number },
    ],
    education: [
      { degree: String, institute: String, year: Number },
    ],
    resumeUrl: { type: String },
    resumeText: { type: String },

    companyName: { type: String },
    companyVerified: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },

    resumeBuilder: {
      template: { type: String, enum: ["modern", "classic", "minimal"], default: "modern" },
      personalInfo: {
        fullName: String,
        title: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        website: String,
      },
      summary: { type: String },
      experience: [
        { role: String, company: String, duration: String, description: String },
      ],
      education: [
        { degree: String, institute: String, year: String },
      ],
      skills: [{ type: String }],
      projects: [
        { name: String, description: String, link: String },
      ],
      certifications: [{ type: String }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
