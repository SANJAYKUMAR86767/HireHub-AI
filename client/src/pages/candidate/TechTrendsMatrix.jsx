import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  TrendingUp,
  Sparkles,
  ArrowLeft,
  Zap,
  ArrowRight,
  DollarSign,
  Cpu,
  Layers,
  Activity,
  Flame,
} from "lucide-react";

export default function TechTrendsMatrix() {
  const [trends, setTrends] = useState([]);
  const [migrations, setMigrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api
      .get("/advanced/tech-trends")
      .then((res) => {
        setTrends(res.data.techTrends || []);
        setMigrations(res.data.skillMigrations || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", "Frontend", "Backend", "AI & ML", "DevOps", "Data / Streaming"];
  const filteredTrends = activeCategory === "All" ? trends : trends.filter((t) => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
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
              2026 Tech Stack Market Demand & Skill Swap Radar
            </h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Real-Time Market Radar</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Trends Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl mb-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
            Top Demanded Tech Stacks & Compensation Growth
          </span>
          <span className="text-xs text-slate-500">Live Hiring Telemetry</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-slate-950 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrends.map((trend, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 transition group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {trend.category}
                      </span>
                      <h4 className="font-black text-sm text-white mt-0.5">{trend.name}</h4>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                      {trend.yoySalaryGrowth} YoY
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Demand Index</span>
                      <span className="font-extrabold text-amber-400">{trend.demandScore}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full"
                        style={{ width: `${trend.demandScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{trend.avgSalaryINR}</span>
                  <span className="text-indigo-300 font-bold">{trend.avgSalaryUSD}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Migration & Transition Fast-Track */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <h3 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>High-ROI Skill Swap & Career Transition Fast-Tracks</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {migrations.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">{m.from}</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                <span className="text-amber-300">{m.to}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-900">
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Compatibility</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">{m.compatibility}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Time to Master</span>
                  <span className="font-bold text-indigo-300 mt-0.5 block">{m.timeToMaster}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Avg Salary Lift</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">{m.salaryBump}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
