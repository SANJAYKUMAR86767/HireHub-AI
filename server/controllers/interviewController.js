const { generateQuestions, generateFeedback } = require("../utils/interviewPrep");
const User = require("../models/User");

// AI Salary Predictor & Market Insights
const predictSalary = async (req, res) => {
  try {
    const { skills = [], location = "India", experienceYears = 1 } = req.body;

    const baseSalary = 350000; // Base INR
    const skillBonusMultiplier = skills.length * 75000;
    const expMultiplier = Number(experienceYears) * 120000;

    // High demand tech stacks bonus
    const highDemandTech = ["react", "node.js", "python", "aws", "docker", "typescript", "mongodb"];
    const matchedHighDemand = skills.filter((s) => highDemandTech.includes(String(s).toLowerCase())).length;

    const estimatedMin = Math.round(baseSalary + expMultiplier + skillBonusMultiplier * 0.8);
    const estimatedMax = Math.round(baseSalary + expMultiplier + skillBonusMultiplier * 1.4 + matchedHighDemand * 100000);
    const medianSalary = Math.round((estimatedMin + estimatedMax) / 2);

    const marketDemand = matchedHighDemand >= 3 ? "Extremely High 🔥" : matchedHighDemand >= 1 ? "Moderate High ⚡" : "Standard Demand";

    res.json({
      estimatedMin: `₹${(estimatedMin / 100000).toFixed(1)} Lakhs`,
      estimatedMax: `₹${(estimatedMax / 100000).toFixed(1)} Lakhs`,
      medianSalary: `₹${(medianSalary / 100000).toFixed(1)} LPA`,
      marketDemand,
      topRecommendedSkills: ["TypeScript", "AWS Cloud", "System Design", "Docker & Kubernetes"],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.user.id).select("skills");
    const questions = await generateQuestions(role, user?.skills || []);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "question and answer are required" });
    }
    const feedback = await generateFeedback(question, answer);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getQuestions, getFeedback, predictSalary };
