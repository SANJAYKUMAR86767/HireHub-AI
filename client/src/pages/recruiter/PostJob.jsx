import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Sparkles, Wand2, Plus, Building, MapPin, DollarSign, Briefcase, ShieldCheck } from "lucide-react";

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    skills: "",
    location: "",
    jobType: "Full-time",
    workMode: "Onsite",
    salaryMin: "",
    salaryMax: "",
    experienceRequired: 0,
  });
  const [error, setError] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // AI Instant Auto-Generator for Job Description & Skills
  const generateWithAi = () => {
    if (!form.title.trim()) {
      setError("Please enter a Job Title first (e.g. Senior Frontend Developer)");
      return;
    }
    setError("");
    setAiGenerating(true);

    setTimeout(() => {
      const titleLower = form.title.toLowerCase();
      let generatedSkills = "React, JavaScript, TypeScript, Tailwind CSS, Redux, REST API";
      let generatedDesc = `We are seeking a talented ${form.title} to join our high-growth engineering team at ${
        form.company || "TechCorp"
      }.

Key Responsibilities:
- Architect, build, and maintain high-performance web applications using modern best practices.
- Collaborate with product managers, UX designers, and backend engineers to define product features.
- Write clean, maintainable, and well-tested code while optimizing application speed and responsiveness.
- Participate in code reviews and mentor junior developers.

Requirements & Qualifications:
- Strong proficiency in modern software engineering principles and tech stacks.
- Hands-on experience building scalable applications in production environments.
- Excellent problem-solving skills and communication.`;

      if (titleLower.includes("backend") || titleLower.includes("node") || titleLower.includes("python")) {
        generatedSkills = "Node.js, Express, MongoDB, Python, PostgreSQL, Redis, REST API, Microservices";
      } else if (titleLower.includes("cloud") || titleLower.includes("devops") || titleLower.includes("aws")) {
        generatedSkills = "AWS, Docker, Kubernetes, Terraform, CI/CD, Linux, Cloud Security";
      } else if (titleLower.includes("full") || titleLower.includes("mern")) {
        generatedSkills = "React, Node.js, Express, MongoDB, TypeScript, GraphQL, AWS";
      }

      setForm((prev) => ({
        ...prev,
        skills: generatedSkills,
        description: generatedDesc,
        location: prev.location || "Bangalore (Remote Available)",
        company: prev.company || "Innovate Global Tech",
        salaryMin: prev.salaryMin || "1800000",
        salaryMax: prev.salaryMax || "2800000",
      }));
      setAiGenerating(false);
    }, 1000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/jobs", {
        ...form,
        companyName: form.company,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : 1800000,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : 2800000,
        salary: `₹${(Number(form.salaryMin || 1800000) / 100000).toFixed(0)} - ₹${(
          Number(form.salaryMax || 2800000) / 100000
        ).toFixed(0)} LPA`,
        experienceRequired: Number(form.experienceRequired) || 0,
      });
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>AI-Assisted Job Creation Studio</span>
            </div>
            <h1 className="text-2xl font-bold">Post New Job Listing</h1>
            <p className="text-xs text-slate-400 mt-0.5">Use AI Auto-Generate to draft description & skills instantly</p>
          </div>
          <button
            type="button"
            onClick={generateWithAi}
            disabled={aiGenerating}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>{aiGenerating ? "Generating with AI..." : "AI Auto-Fill Description"}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Title</label>
              <input
                required
                placeholder="e.g. Senior Frontend Architect"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
              <input
                required
                placeholder="e.g. TechCorp Global"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">Job Description</label>
              <button
                type="button"
                onClick={generateWithAi}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
              >
                Auto-generate description with AI
              </button>
            </div>
            <textarea
              required
              placeholder="Detailed responsibilities, team requirements..."
              rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Required Skills (comma separated)</label>
            <input
              required
              placeholder="e.g. React, Node.js, TypeScript, AWS"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
              <input
                placeholder="e.g. Bangalore, IN"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Type</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Work Mode</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                value={form.workMode}
                onChange={(e) => setForm({ ...form, workMode: e.target.value })}
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Min Salary Package (in INR)</label>
              <input
                type="number"
                placeholder="1800000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Max Salary Package (in INR)</label>
              <input
                type="number"
                placeholder="2800000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={submitting}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-xl transition shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{submitting ? "Publishing Job Listing..." : "Publish Job to Global Marketplace"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
