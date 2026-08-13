import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Plus,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Search,
  Calendar,
  Award,
  Video,
  ExternalLink,
} from "lucide-react";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    api.get("/jobs/mine").then((res) => {
      setJobs(res.data);
      const total = res.data.reduce((acc, job) => acc + (job.applicantCount || 0), 0);
      setTotalApplicants(total);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-2xl mb-8 border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Recruiter Hiring Studio</span>
          </div>
          <h1 className="text-3xl font-black">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Manage active job listings, scout verified engineers via Talent Radar, and schedule video interviews.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recruiter/talent-pool"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition flex items-center space-x-2 border border-slate-700"
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Open Talent Radar</span>
          </Link>
          <Link
            to="/recruiter/post-job"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job Role</span>
          </Link>
        </div>
      </div>

      {/* Talent Radar Quick Banner */}
      <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-700/40 rounded-3xl p-6 mb-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 text-indigo-300">
            <Search className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Autonomous Candidate Sourcing Radar</h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Directly search through pre-vetted, AI-certified candidates by skill matrix, salary, and availability.
            </p>
          </div>
        </div>
        <Link
          to="/recruiter/talent-pool"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 shrink-0"
        >
          <span>Explore Talent Pool</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase} label="Active Job Postings" value={jobs.length} color="text-indigo-600 bg-indigo-50" />
        <StatCard icon={Users} label="Total Applicants" value={totalApplicants} color="text-purple-600 bg-purple-50" />
        <StatCard icon={CheckCircle} label="Open Positions" value={jobs.filter((j) => (j.status || "open") === "open").length} color="text-emerald-600 bg-emerald-50" />
        <StatCard icon={TrendingUp} label="AI Match Precision" value="94.2% Avg" color="text-amber-600 bg-amber-50" />
      </div>

      {/* Posted Jobs Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Your Active Job Postings</h3>
        <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-xl">
          {jobs.length} Total Listings
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700 text-sm">No jobs posted yet.</p>
          <p className="text-xs text-slate-400 mt-1">Create your first posting to start receiving AI-matched applicants.</p>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center space-x-1.5 mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
          >
            <span>+ Post a Job</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div
              key={j._id}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{j.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{j.location || "Remote"} · {j.jobType || "Full-time"}</p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {j.status || "Open"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(j.skills || []).slice(0, 4).map((s) => (
                    <span key={s} className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-bold">
                  {j.applicantCount || 0} Candidates in Pipeline
                </span>
                <Link
                  to={`/recruiter/jobs/${j._id}/applicants`}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 bg-indigo-50 px-3 py-1.5 rounded-xl transition"
                >
                  <span>Kanban Pipeline</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
      <div className={`p-3.5 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
