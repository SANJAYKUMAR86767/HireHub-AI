const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { analyzeMatch } = require("../utils/aiMatch");
const { sendMail } = require("../utils/mailer");
const { invalidateJobsCache } = require("../utils/cache");

const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate("recruiterId", "email name");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidate = await User.findById(req.user.id);
    const { score, matchedSkills, missingSkills } = await analyzeMatch(
      candidate.skills, job.skills, candidate.resumeText
    );

    const application = await Application.create({
      candidateId: req.user.id,
      jobId: job._id,
      aiScore: score,
      matchedSkills,
      missingSkills,
    });

    sendMail({
      to: job.recruiterId.email,
      subject: `New applicant for ${job.title}`,
      text: `${candidate.name} applied to your job "${job.title}" — AI match score: ${score}%.`,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already applied to this job" });
    }
    res.status(500).json({ message: err.message });
  }
};

const getMyApplications = async (req, res) => {
  const apps = await Application.find({ candidateId: req.user.id })
    .populate("jobId")
    .sort({ createdAt: -1 });
  res.json(apps);
};

const getApplicantsForJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, recruiterId: req.user.id });
  if (!job) return res.status(404).json({ message: "Job not found" });

  const apps = await Application.find({ jobId: job._id })
    .populate("candidateId", "name email skills experience resumeUrl")
    .sort({ aiScore: -1 });
  res.json(apps);
};

const updateApplicationStatus = async (req, res) => {
  const { status, recruiterFeedback, interviewDate } = req.body;
  const app = await Application.findById(req.params.id).populate("jobId").populate("candidateId", "email name");
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (String(app.jobId.recruiterId) !== req.user.id) {
    return res.status(403).json({ message: "Not your job posting" });
  }
  if (status) app.status = status;
  if (recruiterFeedback !== undefined) app.recruiterFeedback = recruiterFeedback;
  if (interviewDate) app.interviewDate = interviewDate;
  await app.save();

  if (status) {
    sendMail({
      to: app.candidateId.email,
      subject: `Update on your application: ${app.jobId.title}`,
      text: `Hi ${app.candidateId.name}, your application status is now "${status}".`,
    });
  }

  res.json(app);
};

module.exports = { applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
