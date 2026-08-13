import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AiMatchCard from "../components/AiMatchCard";
import { MapPin, Briefcase, DollarSign, Building, Clock, CheckCircle2, Send, ExternalLink, Globe, Sparkles, Share2 } from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  const apply = async () => {
    try {
      setApplying(true);
      await api.post(`/applications/${id}/apply`);
      setApplied(true);
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not apply");
    } finally {
      setApplying(false);
    }
  };

  if (!job) return <div className="p-8 text-center text-slate-400">Loading job details...</div>;

  const encodedTitle = encodeURIComponent(`${job.title} ${job.companyName || job.company || ""}`);
  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}`;
  const naukriUrl = `https://www.naukri.com/${encodeURIComponent(job.title)}-jobs`;
  const googleJobsUrl = `https://www.google.com/search?q=${encodedTitle}+jobs`;
  const internshalaUrl = `https://internshala.com/jobs/${encodeURIComponent((job.skills || [])[0] || "developer")}-jobs/`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Job Card Header */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                {job.jobType || "Full-time"} · {job.workMode || "Onsite"}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Listing</span>
              </span>
            </div>

            <h1 className="text-3xl font-black text-white mt-3 leading-snug">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-400 mt-3">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Building className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold">{job.companyName || job.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-sm">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>{job.salary ? job.salary : `₹${job.salaryMin || 1500000} - ₹${job.salaryMax || 2500000}`}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {user?.role === "candidate" && (
              <button
                disabled={applied || applying}
                onClick={apply}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2"
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Application Submitted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{applying ? "Submitting..." : "Apply Now"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-500/30">
            {message}
          </div>
        )}

        {/* Global Multi-Platform Simulation Links */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Multi-Platform Simulation Portals:</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>LinkedIn Jobs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={naukriUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Naukri.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={googleJobsUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Google Jobs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={internshalaUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Internshala</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Required Skills */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Required Core Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((s) => (
              <span key={s} className="text-xs bg-slate-800 text-indigo-200 border border-slate-700/80 px-3 py-1 rounded-xl font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      {user?.role === "candidate" && <AiMatchCard jobId={id} jobTitle={job.title} jobSkills={job.skills} />}

      {/* Job Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-slate-200">
        <h3 className="text-lg font-black text-white mb-4">Job Description & Responsibilities</h3>
        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-300 font-sans">{job.description}</p>
      </div>
    </div>
  );
}
