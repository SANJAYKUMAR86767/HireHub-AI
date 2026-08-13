import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Plus, Users, Briefcase, CheckCircle, Clock, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    api.get("/jobs/mine").then((res) => {
      setJobs(res.data);
      // Compute total applicants count across posted jobs
      const total = res.data.reduce((acc, job) => acc + (job.applicantCount || 0), 0);
      setTotalApplicants(total);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl mb-8 border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Recruiter Hiring Workspace</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-indigo-200 mt-1">Manage active listings, track candidate pipelines, and trigger AI match ranking.</p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold px-5 py-3 rounded-xl transition flex items-center space-x-2 shadow-md hover:shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job Role</span>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase} label="Active Job Postings" value={jobs.length} color="text-indigo-600 bg-indigo-50" />
        <StatCard icon={Users} label="Total Applicants" value={totalApplicants} color="text-purple-600 bg-purple-50" />
        <StatCard icon={CheckCircle} label="Open Positions" value={jobs.filter((j) => (j.status || "open") === "open").length} color="text-emerald-600 bg-emerald-50" />
        <StatCard icon={TrendingUp} label="Hiring Velocity" value="84% Match" color="text-amber-600 bg-amber-50" />
      </div>

      {/* Posted Jobs Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-lg">Your Active Job Postings</h3>
        <span className="text-xs font-semibold text-slate-500">{jobs.length} Total</span>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600 text-sm">No jobs posted yet.</p>
          <p className="text-xs text-slate-400 mt-1">Create your first posting to start receiving AI-matched applicants.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div key={j._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{j.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{j.location || "Remote"} · {j.jobType || "Full-time"}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {j.status || "Open"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(j.skills || []).slice(0, 4).map((s) => (
                    <span key={s} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {j.applicantCount || 0} Candidates Applied
                </span>
                <Link
                  to={`/recruiter/jobs/${j._id}/applicants`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
