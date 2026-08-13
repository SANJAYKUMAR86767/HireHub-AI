import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  DollarSign,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  FileText,
  Copy,
  Check,
  Building,
  HelpCircle,
  Clock,
  PieChart,
  Percent,
} from "lucide-react";

export default function OfferAnalyzer() {
  const [form, setForm] = useState({
    roleTitle: "Senior Full Stack Engineer",
    companyName: "Unicorn Tech Solutions",
    baseSalary: 2800000,
    joiningBonus: 400000,
    annualBonus: 300000,
    equityTotalGrant: 2000000,
    vestingYears: 4,
    currency: "INR",
    location: "India (Tier 1 / Remote)",
    hasClawback: true,
    hasNonCompete: false,
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post("/advanced/offer-analyzer", form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyLetter = () => {
    if (result?.counterOfferLetter) {
      navigator.clipboard.writeText(result.counterOfferLetter);
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    }
  };

  const currencySymbol = form.currency === "INR" ? "₹" : "$";
  const denom = form.currency === "INR" ? 100000 : 1000;
  const denomSuffix = form.currency === "INR" ? "LPA" : "k";

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
              AI Offer Letter & Total Comp Analyzer
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Negotiation Radar</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>Job Offer Parameters</span>
            </h3>
            {/* Currency Switcher */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, currency: "INR" }))}
                className={`px-2.5 py-1 rounded-lg transition ${
                  form.currency === "INR" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, currency: "USD" }))}
                className={`px-2.5 py-1 rounded-lg transition ${
                  form.currency === "USD" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                $ USD
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Target Role Title
            </label>
            <input
              type="text"
              value={form.roleTitle}
              onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Company / Employer Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Annual Base Salary ({currencySymbol})
              </label>
              <input
                type="number"
                value={form.baseSalary}
                onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Signing Bonus ({currencySymbol})
              </label>
              <input
                type="number"
                value={form.joiningBonus}
                onChange={(e) => setForm({ ...form, joiningBonus: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Annual Bonus / Perf ({currencySymbol})
              </label>
              <input
                type="number"
                value={form.annualBonus}
                onChange={(e) => setForm({ ...form, annualBonus: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Equity / ESOPs ({currencySymbol})
              </label>
              <input
                type="number"
                value={form.equityTotalGrant}
                onChange={(e) => setForm({ ...form, equityTotalGrant: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Risk Factors Checklist */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider block">
              Offer Clauses & Risk Check
            </span>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasClawback}
                onChange={(e) => setForm({ ...form, hasClawback: e.target.checked })}
                className="accent-indigo-600 rounded"
              />
              <span>Signing bonus has a 12-month clawback condition</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasNonCompete}
                onChange={(e) => setForm({ ...form, hasNonCompete: e.target.checked })}
                className="accent-indigo-600 rounded"
              />
              <span>Includes restrictive Non-Compete / IP assignment clause</span>
            </label>
          </div>

          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs py-3 rounded-2xl transition shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{analyzing ? "Auditing Package..." : "Analyze Compensation & Generate Strategy"}</span>
          </button>
        </div>

        {/* Results & AI Strategy Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Top Comp Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white shadow-xl text-center">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                    Year 1 Total Comp
                  </span>
                  <span className="text-2xl font-black text-amber-400">
                    {currencySymbol}{(result.year1Total / denom).toFixed(2)} {denomSuffix}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Base + Signing + Bonus + Eq</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white shadow-xl text-center">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                    Est. Monthly Take-Home
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {currencySymbol}{(result.monthlyNetInHand / (form.currency === "INR" ? 1000 : 1000)).toFixed(1)}k
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Post-tax net in bank</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white shadow-xl text-center">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                    Market Percentile
                  </span>
                  <span className="text-2xl font-black text-purple-400">
                    {result.marketPercentile}th %ile
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Top tier tier-1 benchmark</span>
                </div>
              </div>

              {/* Risks & Mitigation Radar */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl">
                <h3 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Offer Risk Audit & Hidden Conditions</span>
                </h3>
                {result.risks.length === 0 ? (
                  <p className="text-xs text-emerald-300">Clean offer terms. No restrictive non-competes or unusual cliffs detected.</p>
                ) : (
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.risks.map((risk, idx) => (
                      <li key={idx} className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* AI Counter-Offer Script */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Personalized AI Counter-Offer Negotiation Letter</span>
                  </h3>
                  <button
                    onClick={copyLetter}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? "Copied!" : "Copy Email"}</span>
                  </button>
                </div>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                  {result.counterOfferLetter}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-xl flex flex-col items-center justify-center min-h-[380px]">
              <TrendingUp className="w-12 h-12 text-indigo-400 mb-3" />
              <h3 className="text-base font-black">Ready to Audit Your Job Offer</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter your base salary, bonuses, and equity details on the left to calculate 4-year annualized comp, tax estimate, and generate a counter-offer script.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
