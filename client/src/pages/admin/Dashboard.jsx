import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Server,
  Zap,
  Lock,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 shadow-2xl mb-8 border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Platform Governance & System Intelligence</span>
          </div>
          <h1 className="text-3xl font-black">HireHub Admin Command Suite</h1>
          <p className="text-xs text-purple-200 mt-1">
            Global user access moderation, AI scam job shield, and platform telemetry oversight.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/users"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition shadow-lg shadow-purple-600/30 flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Moderate Users</span>
          </Link>
          <Link
            to="/admin/jobs"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition border border-slate-700 flex items-center space-x-1.5"
          >
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>Moderate Jobs</span>
          </Link>
        </div>
      </div>

      {/* Analytics Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-28 bg-white border border-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Users} label="Total Platform Users" value={stats.totalUsers || 0} color="text-indigo-600 bg-indigo-50" />
            <StatCard icon={Users} label="Registered Candidates" value={stats.totalCandidates || 0} color="text-emerald-600 bg-emerald-50" />
            <StatCard icon={Briefcase} label="Verified Recruiters" value={stats.totalRecruiters || 0} color="text-purple-600 bg-purple-50" />
            <StatCard icon={Activity} label="Total Job Postings" value={stats.totalJobs || 0} color="text-blue-600 bg-blue-50" />
            <StatCard icon={CheckCircle2} label="Active Open Jobs" value={stats.openJobs || 0} color="text-teal-600 bg-teal-50" />
            <StatCard icon={TrendingUp} label="Total Applications Submitted" value={stats.totalApplications || 0} color="text-amber-600 bg-amber-50" />
          </div>
        )
      )}

      {/* System Health & Shield Radar Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">System Telemetry & Health</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              100% Operational
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-600">WebSocket / Socket.io Real-Time Layer</span>
              <span className="font-extrabold text-emerald-600">Connected & Listening</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-600">AI Scoring & ATS Match Engine</span>
              <span className="font-extrabold text-indigo-600">Active (Hybrid LLM + Fallback)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-600">Spam / Scam Job Detection Shield</span>
              <span className="font-extrabold text-purple-600">Auto-Flagging Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Quick Moderation Hub</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Review flagged jobs with high scam risk scores, block abusive accounts, or verify corporate recruiter identities.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/jobs"
              className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition flex items-center justify-between shadow-sm"
            >
              <span>Scan Flagged Jobs</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/users"
              className="p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-2xl text-xs font-bold transition flex items-center justify-between border border-purple-200"
            >
              <span>Manage User Roles</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center space-x-4">
      <div className={`p-3.5 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
