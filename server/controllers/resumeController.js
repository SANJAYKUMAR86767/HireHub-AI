const fs = require("fs");
const pdfParse = require("pdf-parse");
const User = require("../models/User");
const { cloudinaryConfigured } = require("../config/cloudinary");

/**
 * Extracts plain text skills-relevant content from an uploaded resume.
 * Works with Cloudinary (remote URL) or local disk fallback.
 */
const extractTextFromPdf = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch {
    return "";
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = cloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;

    let resumeText = "";
    if (req.file.mimetype === "application/pdf") {
      const buffer = cloudinaryConfigured ? null : fs.readFileSync(req.file.path);
      // When using Cloudinary, buffer isn't available locally; text extraction
      // in that case can be done by fetching the file — left as an extension point.
      if (buffer) resumeText = await extractTextFromPdf(buffer);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: fileUrl, resumeText },
      { new: true }
    ).select("-password");

    res.json({ message: "Resume uploaded", resumeUrl: user.resumeUrl, resumeText: user.resumeText });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getResumeBuilder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("resumeBuilder");
    res.json(user.resumeBuilder || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveResumeBuilder = async (req, res) => {
  try {
    const { template, personalInfo, summary, experience, education, skills, projects, certifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeBuilder: {
          template: template || "modern",
          personalInfo: personalInfo || {},
          summary: summary || "",
          experience: experience || [],
          education: education || [],
          skills: skills || [],
          projects: projects || [],
          certifications: certifications || [],
        },
      },
      { new: true }
    ).select("resumeBuilder");
    res.json(user.resumeBuilder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadResume, getResumeBuilder, saveResumeBuilder };
