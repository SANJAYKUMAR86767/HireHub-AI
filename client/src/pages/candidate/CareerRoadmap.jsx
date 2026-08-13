import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  TrendingUp,
  Layers,
  Globe2,
  Cpu,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

export default function CareerRoadmap() {
  const [roadmaps, setRoadmaps] = useState(null);
  const [activeTrackKey, setActiveTrackKey] = useState("fullstack");
  const [activeLevelIdx, setActiveLevelIdx] = useState(1); // Default to Mid-Level
  const [currency, setCurrency] = useState("INR"); // INR or USD
  const [checkedMilestones, setCheckedMilestones] = useState(new Set([0, 1]));

  useEffect(() => {
    api
      .get("/advanced/career-roadmaps")
      .then((res) => setRoadmaps(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleMilestone = (idx) => {
    setCheckedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (!roadmaps) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-indigo-500 animate-spin" />
        <p className="font-bold text-sm">Loading Career Leveling Radar...</p>
      </div>
    );
  }

  const currentTrack = roadmaps[activeTrackKey] || roadmaps.fullstack;
  const currentLevel = currentTrack.levels[activeLevelIdx] || currentTrack.levels[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/candidate/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Engineering Career & Compensation Roadmap
            </h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leveling Radar</span>
            </span>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex items-center text-xs font-bold text-slate-300">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-3 py-1.5 rounded-xl transition ${
              currency === "INR" ? "bg-indigo-600 text-white shadow-sm" : "hover:text-white"
            }`}
          >
            ₹ INR (LPA)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1.5 rounded-xl transition ${
              currency === "USD" ? "bg-indigo-600 text-white shadow-sm" : "hover:text-white"
            }`}
          >
            $ USD ($/yr)
          </button>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { key: "fullstack", title: "Full Stack Engineer", icon: Layers, desc: "React, Node.js, Cloud & Scale" },
          { key: "devops", title: "Cloud & DevOps SRE", icon: Globe2, desc: "Kubernetes, AWS, IaC & SRE" },
          { key: "ai", title: "AI / GenAI Systems", icon: Cpu, desc: "PyTorch, LLMs, RAG & Inference" },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTrackKey === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActiveTrackKey(t.key);
                setActiveLevelIdx(0);
              }}
              className={`p-4 rounded-3xl text-left border transition-all ${
                isActive
                  ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-indigo-500/60 text-white shadow-xl shadow-indigo-950/40"
                  : "bg-slate-900/50 hover:bg-slate-900 text-slate-400 border-slate-800"
              }`}
            >
              <div className="flex items-center space-x-3 mb-1.5">
                <div
                  className={`p-2.5 rounded-2xl ${
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">{t.title}</h3>
                  <p className="text-[11px] text-slate-400">{t.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Career Leveling Ladder Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 text-white shadow-xl">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 block mb-4">
          Select Career Level Tier
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentTrack.levels.map((lvl, idx) => {
            const isSelected = activeLevelIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveLevelIdx(idx)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 transform scale-102"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                    Level {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-xs text-white mt-1 leading-snug">
                    {lvl.tier.split(":")[1] || lvl.tier}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300">
                    {currency === "INR" ? lvl.salaryINR : lvl.salaryUSD}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Detail Showcase Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white shadow-2xl space-y-8 backdrop-blur-xl">
        {/* Tier Header & Salary Band */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{currentTrack.title}</span>
            </div>
            <h2 className="text-2xl font-black text-white">{currentLevel.tier}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span>Experience Target: <strong className="text-slate-200">{currentLevel.years}</strong></span>
              <span>·</span>
              <span>Scope: <strong className="text-slate-200">{currentLevel.focus}</strong></span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-600/40 p-5 rounded-2xl flex flex-col items-center md:items-end">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
              Benchmark Total Compensation
            </span>
            <span className="text-3xl font-black text-amber-400 mt-1">
              {currency === "INR" ? currentLevel.salaryINR : currentLevel.salaryUSD}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Base + Annual Bonus + Initial Stock Grant</span>
          </div>
        </div>

        {/* Core Tech Stack Matrix */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Prerequisite Tech Stack & Competencies</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentLevel.coreSkills.map((skill, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-semibold text-slate-300 hover:border-indigo-500/40 transition"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Checklist */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Promotion & Interview Checklist for This Tier</span>
          </h3>
          <div className="space-y-2">
            {[
              `Demonstrated end-to-end delivery of ${currentLevel.coreSkills[0]} and ${currentLevel.coreSkills[1] || "core subsystems"}`,
              `Led technical design documents (RFC) with clear latency, cost, and maintainability trade-offs`,
              `Successfully resolved cross-service architectural bottlenecks and optimized database/API throughput`,
              `Conducted peer code reviews and mentored junior/mid engineers on clean code standards`,
            ].map((milestone, mIdx) => {
              const checked = checkedMilestones.has(mIdx);
              return (
                <div
                  key={mIdx}
                  onClick={() => toggleMilestone(mIdx)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center space-x-3 text-xs ${
                    checked
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      checked
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="flex-1 font-medium">{milestone}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Ready to test your readiness for this level?
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/candidate/live-interview"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <span>Practice Mock Interview for {currentLevel.tier.split(":")[0]}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
