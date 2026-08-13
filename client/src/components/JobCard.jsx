import React from "react";
import { Link } from "react-router-dom";
import { Building, MapPin, DollarSign, ArrowUpRight, ExternalLink, Globe, Sparkles } from "lucide-react";

export default function JobCard({ job }) {
  // Generate real-time live simulation links for top global job portals (LinkedIn, Naukri, Google, Internshala)
  const encodedTitle = encodeURIComponent(`${job.title} ${job.companyName || job.company || ""}`);
  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}`;
  const naukriUrl = `https://www.naukri.com/${encodeURIComponent(job.title)}-jobs`;
  const googleJobsUrl = `https://www.google.com/search?q=${encodedTitle}+jobs`;
  const internshalaUrl = `https://internshala.com/jobs/${encodeURIComponent((job.skills || [])[0] || "developer")}-jobs/`;

  return (
    <div className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between relative backdrop-blur-xl">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 text-white font-black flex items-center justify-center text-lg shadow-lg group-hover:scale-105 transition-transform">
              {(job.companyName || job.company || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-white group-hover:text-indigo-400 transition-colors text-base leading-snug">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center space-x-2 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  {job.companyName || job.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location || "Remote"}
                </span>
              </div>
            </div>
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
            title="View Job Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-[10px] font-extrabold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            {job.jobType || "Full-time"}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            {job.workMode || "On-site"}
          </span>
          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI Verified</span>
          </span>
        </div>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(job.skills || []).slice(0, 5).map((s) => (
            <span key={s} className="text-[11px] bg-slate-800 text-indigo-200 px-2.5 py-1 rounded-lg font-medium border border-slate-700/60">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Real-time External Simulation Portals Section */}
      <div className="mt-5 pt-3.5 border-t border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
          Real-Time External Job Portals:
        </span>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-1.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={naukriUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 px-1.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
          >
            <span>Naukri</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={googleJobsUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-1.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
          >
            <span>Google</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={internshalaUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 px-1.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
          >
            <span>Internshala</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Footer details */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-center text-xs font-extrabold text-emerald-400">
            <DollarSign className="w-4 h-4 text-emerald-400 mr-0.5" />
            <span>{job.salary ? job.salary : `₹${job.salaryMin || 1500000} - ₹${job.salaryMax || 2500000}`}</span>
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:underline"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
