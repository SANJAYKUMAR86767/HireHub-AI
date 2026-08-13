const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// AI Smart Recommended Jobs for Candidate based on Skills & History
const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userSkills = (user.skills || []).map((s) => s.toLowerCase());

    // Fetch all open jobs
    const jobs = await Job.find({ status: "open" }).populate("recruiterId", "name companyName");

    // Rank jobs by skill overlap count
    const rankedJobs = jobs.map((job) => {
      const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
      const matchCount = jobSkills.filter((s) => userSkills.includes(s)).length;
      const matchPercentage = jobSkills.length > 0 ? Math.round((matchCount / jobSkills.length) * 100) : 0;
      return { job, matchCount, matchPercentage };
    });

    // Sort descending by match percentage
    rankedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(rankedJobs.slice(0, 6)); // Top 6 matches
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Auto Generated Interview Schedule Invite Link (.ics / Google Calendar format)
const scheduleInterviewSlot = async (req, res) => {
  try {
    const { applicationId, interviewDate, meetingLink, notes } = req.body;

    const application = await Application.findById(applicationId).populate("candidateId").populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "interview";
    application.interviewDate = interviewDate;
    await application.save();

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Interview: ${application.jobId.title} at ${application.jobId.company || "HireHub"}`
    )}&dates=${new Date(interviewDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(
      new Date(interviewDate).getTime() + 45 * 60000
    )
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
      `Join Video Call: ${meetingLink || "https://meet.jit.si/HireHubInterview"}\nNotes: ${notes || "Technical round"}`
    )}`;

    res.json({
      message: "Interview scheduled & invite generated!",
      application,
      gcalUrl,
      meetingLink: meetingLink || "https://meet.jit.si/HireHubInterview",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecommendedJobs, scheduleInterviewSlot };
