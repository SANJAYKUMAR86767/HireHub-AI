import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import {
  Briefcase,
  User,
  LogOut,
  Sparkles,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Terminal,
  BookOpen,
  ShieldCheck,
  Video,
  TrendingUp,
  Search,
  PlusCircle,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white text-lg tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
              HireHub
            </span>
            <span className="text-[9px] font-extrabold text-indigo-400 tracking-widest uppercase">
              Autonomous AI
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 text-xs font-semibold text-slate-300">
          <Link
            to="/"
            className="hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            Explore Jobs
          </Link>

          {/* AI Live Mock Video Interview Studio */}
          <Link
            to="/candidate/live-interview"
            className="flex items-center space-x-1.5 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition text-amber-300"
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Video Mock</span>
          </Link>

          {/* Career Roadmap */}
          <Link
            to="/candidate/career-roadmap"
            className="flex items-center space-x-1.5 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Career Roadmap</span>
          </Link>

          {/* Recruiter Talent Radar (Visible to recruiters/admins) */}
          {(user?.role === "recruiter" || user?.role === "admin") && (
            <Link
              to="/recruiter/talent-pool"
              className="flex items-center space-x-1.5 text-indigo-300 hover:text-white px-3 py-2 rounded-xl hover:bg-indigo-950/40 transition border border-indigo-500/30"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Talent Radar</span>
            </Link>
          )}

          {/* Offer Analyzer */}
          <Link
            to="/candidate/offer-analyzer"
            className="hidden xl:flex items-center space-x-1 hover:text-emerald-400 px-2.5 py-2 rounded-xl hover:bg-slate-900 transition text-emerald-300"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offer Analyzer</span>
          </Link>

          {/* System Design */}
          <Link
            to="/candidate/system-design-studio"
            className="hidden xl:flex items-center space-x-1 hover:text-purple-400 px-2.5 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>System Design</span>
          </Link>

          {/* Resume Auditor */}
          <Link
            to="/candidate/resume-auditor"
            className="hidden 2xl:flex items-center space-x-1 hover:text-indigo-400 px-2.5 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>ATS Auditor</span>
          </Link>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center space-x-2 text-xs font-semibold">
          {user && <NotificationDropdown />}

          {!user && (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-md shadow-indigo-500/20 transition"
              >
                Get Started
              </Link>
            </>
          )}

          {user?.role === "candidate" && (
            <>
              <Link
                to="/candidate/applications"
                className="hidden sm:flex text-slate-300 hover:text-white px-2.5 py-2 rounded-xl hover:bg-slate-900 transition items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Applications</span>
              </Link>
              <Link
                to="/candidate/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden sm:inline">Candidate Command</span>
                <span className="sm:hidden">Command</span>
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <>
              <Link
                to="/recruiter/post-job"
                className="hidden sm:flex items-center space-x-1 text-slate-300 hover:text-white px-2.5 py-2 rounded-xl hover:bg-slate-900 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Post Job</span>
              </Link>
              <Link
                to="/recruiter/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Recruiter Studio</span>
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              Admin Suite
            </Link>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
