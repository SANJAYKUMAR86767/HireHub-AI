require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");

async function seed() {
  await connectDB();

  let recruiter = await User.findOne({ email: "recruiter@techcorp.com" });
  if (!recruiter) {
    const hashed = await bcrypt.hash("password123", 10);
    recruiter = await User.create({
      name: "TechCorp Hiring Manager",
      email: "recruiter@techcorp.com",
      password: hashed,
      role: "recruiter",
      companyName: "TechCorp Global",
    });
  }

  const sampleJobs = [
    {
      title: "Senior Frontend Engineer (React / Next.js)",
      company: "TechCorp Global",
      description: "Building next-generation micro-frontend architectures with React, Redux Toolkit, and Tailwind CSS.",
      skills: ["React", "JavaScript", "Frontend", "Tailwind CSS", "TypeScript"],
      location: "Bangalore (Remote Available)",
      jobType: "Full-time",
      workMode: "Remote",
      salaryMin: 1800000,
      salaryMax: 2800000,
      recruiterId: recruiter._id,
    },
    {
      title: "Backend Node.js API Architect",
      company: "CloudScale Systems",
      description: "Designing high-concurrency microservices APIs with Node.js, Express, MongoDB, and Redis caching.",
      skills: ["Node.js", "Express", "Backend", "MongoDB", "Redis"],
      location: "Hyderabad",
      jobType: "Full-time",
      workMode: "Hybrid",
      salaryMin: 1600000,
      salaryMax: 2500000,
      recruiterId: recruiter._id,
    },
    {
      title: "Full Stack MERN Developer",
      company: "Innovate AI Labs",
      description: "End-to-end web application engineering combining React frontend and Express MongoDB backend engines.",
      skills: ["React", "Node.js", "Full Stack", "MongoDB", "Express"],
      location: "Pune",
      jobType: "Full-time",
      workMode: "Remote",
      salaryMin: 1400000,
      salaryMax: 2200000,
      recruiterId: recruiter._id,
    },
    {
      title: "Cloud & DevOps Infrastructure Specialist",
      company: "CloudScale Systems",
      description: "Automating CI/CD pipelines, Docker container orchestration, Kubernetes clusters, and AWS infrastructure.",
      skills: ["AWS", "Docker", "Kubernetes", "DevOps", "Cloud & DevOps"],
      location: "Gurgaon",
      jobType: "Full-time",
      workMode: "Onsite",
      salaryMin: 2000000,
      salaryMax: 3200000,
      recruiterId: recruiter._id,
    },
  ];

  for (const jobData of sampleJobs) {
    await Job.findOneAndUpdate({ title: jobData.title }, jobData, { upsert: true, new: true });
  }

  console.log("Sample diverse tech jobs seeded successfully!");
  process.exit(0);
}

seed();
