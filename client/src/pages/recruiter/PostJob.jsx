import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Sparkles,
  Wand2,
  Plus,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    skills: "",
    location: "Bengaluru, IN (Remote)",
    jobType: "Full-time",
    workMode: "Remote",
    salaryMin: "2400000",
    salaryMax: "3600000",
    experienceRequired: 4,
  });
  const [error, setError] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [biasResult, setBiasResult] = useState(null);

  // AI Instant Auto-Generator for Job Description & Bias Shield
  const generateWithAi = async () => {
    if (!form.title.trim()) {
      setError("Please enter a Job Title first (e.g. Senior Full Stack Engineer)");
      return;
    }
    setError("");
    setAiGenerating(true);

    try {
      const res = await api.post("/advanced/generate-job-desc", {
        title: form.title,
        companyName: form.company || "HireHub Tech Partner",
        techStack: form.skills ? form.skills.split(",").map((s) => s.trim()) : ["React", "Node.js", "TypeScript", "AWS"],
        workMode: form.workMode,
      });

      setForm((prev) => ({
        ...prev,
        description: res.data.jobDescription,
        skills: prev.skills || "React, Node.js, TypeScript, PostgreSQL, Docker, AWS",
        company: prev.company || "HireHub Tech Partner",
      }));
      setBiasResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>AI-Powered Job Creation & Bias Shield Studio</span>
            </div>
            <h1 className="text-2xl font-black">Post New Job Listing</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft comprehensive, inclusive job postings optimized for candidate response rates.
            </p>
          </div>
          <button
            type="button"
            onClick={generateWithAi}
            disabled={aiGenerating}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition flex items-center space-x-1.5"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>{aiGenerating ? "Synthesizing with AI..." : "1-Click AI Auto-Draft & Bias Audit"}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Title</label>
              <input
                required
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company / Team Name</label>
              <input
                required
                placeholder="e.g. Acme Cloud Infrastructure"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">Job Description (Markdown formatted)</label>
              <button
                type="button"
                onClick={generateWithAi}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
              >
                Auto-generate with AI & check bias
              </button>
            </div>
            <textarea
              required
              placeholder="Detailed responsibilities, tech stack, qualifications..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Inclusivity & Bias Shield Audit Display */}
          {biasResult && (
            <div className="p-4 bg-slate-950 border border-indigo-500/40 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Inclusivity & Neutrality Score: {biasResult.biasScore}/100</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  Suggested Salary: {biasResult.suggestedSalaryRange}
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                {biasResult.biasAudit.map((b, i) => (
                  <p key={i} className="text-[11px] text-slate-400">
                    {b}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              required
              placeholder="e.g. React, Node.js, TypeScript, AWS, PostgreSQL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
              <input
                placeholder="e.g. Bengaluru, IN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Type</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Max Salary Package (in INR)</label>
              <input
                type="number"
                placeholder="2800000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={submitting}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black py-3.5 rounded-2xl text-xs shadow-xl transition shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{submitting ? "Publishing Job Listing..." : "Publish Job to Global Marketplace"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
