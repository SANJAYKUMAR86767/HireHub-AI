const { analyzeMatch, resumeSuggestions } = require("../utils/aiMatch");
const Job = require("../models/Job");
const User = require("../models/User");

// Generate Cover Letter & Skill Gap Recommendations
const generateAiInsights = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const matchResult = await analyzeMatch(user.skills || [], job.skills || [], user.resumeText || "");
    const suggestions = resumeSuggestions(matchResult.missingSkills);

    // AI Cover Letter Draft Generator
    const coverLetter = `Dear Hiring Manager at ${job.companyName || "the Hiring Team"},

I am writing to express my strong interest in the ${job.title} position. With my background in ${(user.skills || []).slice(0, 4).join(", ") || "relevant technical skills"} and hands-on experience, I am confident in my ability to contribute effectively to your team.

Key highlights of my background matching your requirements:
- Proficiency in core required technologies: ${(matchResult.matchedSkills || []).slice(0, 3).join(", ") || "software engineering principles"}.
- Dedicated approach to continuous learning and solving complex problems.

I look forward to discussing how my experience aligns with your goals for ${job.title}.

Sincerely,
${user.name}
${user.email}`;

    // AI Interview Practice Questions Generator
    const interviewQuestions = [
      `How do you use ${(job.skills || [])[0] || "core skills"} in production environments to maintain clean, scalable code?`,
      `Describe a challenging project where you had to work with ${(job.skills || [])[1] || "team frameworks"} and how you delivered it.`,
      `How would you handle missing competencies like ${matchResult.missingSkills[0] || "new frameworks"} when starting on a project?`,
      `Walk us through a time you debugged a high-priority issue under tight deadlines.`
    ];

    res.json({
      matchResult,
      suggestions,
      coverLetter,
      interviewQuestions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateAiInsights };
