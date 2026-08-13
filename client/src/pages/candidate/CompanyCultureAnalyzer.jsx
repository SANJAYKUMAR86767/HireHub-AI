import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Building2,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Activity,
  Compass,
  Zap,
  Award,
} from "lucide-react";

export default function CompanyCultureAnalyzer() {
  const [companyName, setCompanyName] = useState("FastScale Cloud Technologies");
  const [companyStage, setCompanyStage] = useState("Growth Series B");
  const [analyzing, setAnalyzing] = useState(false);
  const [cultureData, setCultureData] = useState(null);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post("/advanced/culture-analyzer", {
        companyName,
        companyStage,
      });
      setCultureData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

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
              AI Company Culture DNA & Reverse Interview Engine
            </h1>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Culture Radar</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Company Input (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4" />
            <span>Target Company Profile</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe, Uber, OpenAI, Series A Startup..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Company Maturity & Stage
            </label>
            <select
              value={companyStage}
              onChange={(e) => setCompanyStage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Early-Stage Startup (Seed / Series A)">Early-Stage Startup (Seed / Series A)</option>
              <option value="Growth Series B">Growth Stage (Series B / Series C)</option>
              <option value="Unicorn / Pre-IPO">Late-Stage Unicorn / Pre-IPO</option>
              <option value="Big Tech / FAANG">Big Tech / Global Public Enterprise</option>
            </select>
          </div>

          <button
            onClick={runAnalysis}
            disabled={analyzing || !companyName.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs py-3.5 rounded-2xl transition shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{analyzing ? "Decoding Culture DNA..." : "Generate Culture DNA & Questions"}</span>
          </button>
        </div>

        {/* Culture DNA & Reverse Interview Questions Output (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {cultureData ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Culture DNA Radar Grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
                  Engineering Culture DNA Radar
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <CultureGauge label="Engineering Autonomy" value={`${cultureData.cultureRadar.engineeringAutonomy}%`} />
                  <CultureGauge label="Release Velocity" value={`${cultureData.cultureRadar.deploymentVelocity}%`} />
                  <CultureGauge label="Work-Life Balance" value={`${cultureData.cultureRadar.wlbScore}%`} />
                  <CultureGauge label="Code Review Rigor" value={`${cultureData.cultureRadar.codeReviewRigor}%`} />
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">On-Call Burden</span>
                    <p className="font-extrabold text-indigo-300 mt-0.5">{cultureData.cultureRadar.onCallBurden}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Tech Debt Tolerance</span>
                    <p className="font-extrabold text-amber-400 mt-0.5">{cultureData.cultureRadar.techDebtTolerance}</p>
                  </div>
                </div>
              </div>

              {/* Reverse Interview Questions Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>High-Signal Reverse Interview Questions to Ask</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Ask in your final round</span>
                </div>

                <div className="space-y-3">
                  {cultureData.reverseInterviewQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                          {q.category}
                        </span>
                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                          Ask: {q.targetAudience}
                        </span>
                      </div>
                      <p className="font-bold text-white leading-relaxed text-xs">
                        "{q.question}"
                      </p>
                      <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                        💡 <strong className="text-indigo-300">What to look for in response:</strong> {q.signalToListenFor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags to Watch */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="font-extrabold text-xs text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Subtle Red Flags to Watch During Interviews</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {cultureData.redFlagsToWatch.map((flag, i) => (
                    <li key={i} className="bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-xl">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-xl flex flex-col items-center justify-center min-h-[400px]">
              <Compass className="w-12 h-12 text-indigo-400 mb-3" />
              <h3 className="text-base font-black">Audit Engineering Team Culture</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter your target company name and stage on the left to decode engineering autonomy, release cadence, and extract tailored reverse-interview questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CultureGauge({ label, value }) {
  return (
    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
      <span className="text-slate-400 text-[10px] font-bold block">{label}</span>
      <span className="text-xl font-black text-amber-400 mt-1 block">{value}</span>
    </div>
  );
}
