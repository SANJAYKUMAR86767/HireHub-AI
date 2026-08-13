import React, { useState } from "react";
import { DollarSign, TrendingUp, Sparkles, Award, MapPin, Briefcase } from "lucide-react";
import api from "../services/api";

export default function SalaryPredictorModal({ isOpen, onClose }) {
  const [skills, setSkills] = useState("React, Node.js, MongoDB");
  const [experienceYears, setExperienceYears] = useState("2");
  const [location, setLocation] = useState("Bangalore, India");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await api.post("/interview/salary-predict", {
        skills: skillsArray,
        experienceYears,
        location,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Salary & Compensation Predictor</h3>
              <p className="text-xs text-slate-500">Estimate market pay based on tech stack & experience</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handlePredict} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Core Skills (comma separated)</label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              placeholder="e.g. React, Python, AWS..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            {loading ? "Calculating Market Estimates..." : "Predict Salary Package"}
          </button>
        </form>

        {result && (
          <div className="mt-5 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Estimated Range</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                {result.marketDemand}
              </span>
            </div>

            <div className="text-2xl font-extrabold text-emerald-400">{result.medianSalary}</div>
            <p className="text-xs text-slate-300">
              Range: <span className="font-semibold text-white">{result.estimatedMin}</span> to{" "}
              <span className="font-semibold text-white">{result.estimatedMax}</span>
            </p>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Top High-Paying Skills to Learn:</span>
              <div className="flex flex-wrap gap-1">
                {result.topRecommendedSkills.map((s, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-md border border-slate-700">
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
