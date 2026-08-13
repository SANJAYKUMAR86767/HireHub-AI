import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, User, LogOut, Sparkles, MessageSquare, LayoutDashboard, FileText, Terminal, BookOpen, ShieldCheck } from "lucide-react";

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
            <span className="text-[9px] font-extrabold text-indigo-400 tracking-widest uppercase">Autonomous AI</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs font-semibold">
          <Link
            to="/"
            className="text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            Explore Jobs
          </Link>

          {/* Quick Access AI Master Tools Navbar Dropdown / Buttons */}
          <Link
            to="/candidate/english-coach"
            className="hidden lg:flex items-center space-x-1 text-slate-300 hover:text-indigo-400 px-2.5 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>English Coach</span>
          </Link>

          <Link
            to="/candidate/coding-sandbox"
            className="hidden lg:flex items-center space-x-1 text-slate-300 hover:text-emerald-400 px-2.5 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Coding Sandbox</span>
          </Link>

          <Link
            to="/candidate/certification"
            className="hidden lg:flex items-center space-x-1 text-slate-300 hover:text-amber-400 px-2.5 py-2 rounded-xl hover:bg-slate-900 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Badge</span>
          </Link>

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
                className="text-slate-300 hover:text-white px-2.5 py-2 rounded-xl hover:bg-slate-900 transition flex items-center space-x-1 text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Applications</span>
              </Link>
              <Link
                to="/candidate/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-200" />
                <span>Candidate Command</span>
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <Link
              to="/recruiter/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Recruiter Studio</span>
            </Link>
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
