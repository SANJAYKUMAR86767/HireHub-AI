const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const getStats = async (req, res) => {
  const [totalUsers, totalCandidates, totalRecruiters, totalJobs, openJobs, totalApplications] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Application.countDocuments(),
    ]);
  res.json({ totalUsers, totalCandidates, totalRecruiters, totalJobs, openJobs, totalApplications });
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

const setUserBlocked = async (req, res) => {
  const { blocked } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { blocked: Boolean(blocked) }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("recruiterId", "name email companyName").sort({ createdAt: -1 });
  res.json(jobs);
};

const removeJob = async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ message: "Job removed" });
};

const verifyCompany = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: "recruiter" },
    { companyVerified: true },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "Recruiter not found" });
  res.json(user);
};

module.exports = { getStats, getAllUsers, setUserBlocked, getAllJobs, removeJob, verifyCompany };
