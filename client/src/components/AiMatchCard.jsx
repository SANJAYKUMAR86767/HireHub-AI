import React, { useState } from "react";
import { Sparkles, CheckCircle, AlertCircle, FileText, HelpCircle, Copy, Check, ExternalLink, Globe } from "lucide-react";
import api from "../services/api";

export default function AiMatchCard({ jobId, jobTitle, jobSkills }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [copiedCover, setCopiedCover] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/ai/insights", { jobId });
      setInsights(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load AI insights.");
    } finally {
      setLoading(false);
    }
  };

  const copyCoverLetter = () => {
    if (insights?.coverLetter) {
      navigator.clipboard.writeText(insights.coverLetter);
      setCopiedCover(true);
      setTimeout(() => setCopiedCover(false), 2000);
    }
  };

  const encodedTitle = encodeURIComponent(jobTitle || "Developer");
  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}`;
  const naukriUrl = `https://www.naukri.com/${encodedTitle}-jobs`;
  const googleJobsUrl = `https://www.google.com/search?q=${encodedTitle}+jobs`;
  const internshalaUrl = `https://internshala.com/jobs/${encodedTitle}-jobs/`;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-indigo-700/50 my-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/20 backdrop-blur rounded-2xl border border-indigo-400/30 text-indigo-300">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-white">AI Skill Matching & Real-Time Portal Benchmark</h3>
            <p className="text-xs text-indigo-200">Cross-reference candidate skills against real LinkedIn, Naukri & Internshala requirements</p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 font-extrabold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? "Analyzing Skills..." : insights ? "Refresh AI Benchmarks" : "Analyze Fit & Benchmark Skills"}</span>
        </button>
      </div>

      {/* Real-time Global Portal Live Links */}
      <div className="mt-4 pt-3 border-b border-indigo-800/40 pb-4">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 mb-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span>Cross-Verify Skill Requirements on Live Portals:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600/25 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
          >
            <span>LinkedIn Requirements</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={naukriUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-sky-600/25 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
          >
            <span>Naukri.com Skills</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={googleJobsUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-rose-600/25 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
          >
            <span>Google Market Standard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={internshalaUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-cyan-600/25 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
          >
            <span>Internshala Criteria</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {insights && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Match Score & Verdict */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-950/80 border border-indigo-700/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">AI Match Precision</span>
              <span className="text-4xl font-black text-amber-400">{insights.matchResult?.score}%</span>
              <span className="text-xs mt-1 font-semibold text-indigo-200">{insights.matchResult?.verdict}</span>
            </div>

            <div className="bg-indigo-950/80 border border-indigo-700/50 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Matched Skills</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(insights.matchResult?.matchedSkills || []).length > 0 ? (
                  insights.matchResult.matchedSkills.map((s, i) => (
                    <span key={i} className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full capitalize font-semibold">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-indigo-300">No direct skills matched yet</span>
                )}
              </div>
            </div>

            <div className="bg-indigo-950/80 border border-indigo-700/50 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Missing Skill Benchmark</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(insights.matchResult?.missingSkills || []).length > 0 ? (
                  insights.matchResult.missingSkills.map((s, i) => (
                    <span key={i} className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full capitalize font-semibold">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-300">You match all required skills! 🎉</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Cover Letter */}
          <div className="bg-indigo-950/80 border border-indigo-700/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-200">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>AI Generated Tailored Cover Letter</span>
              </div>
              <button
                onClick={copyCoverLetter}
                className="text-xs text-indigo-300 hover:text-white flex items-center space-x-1 bg-indigo-800/80 hover:bg-indigo-700 px-3 py-1 rounded-xl transition font-semibold"
              >
                {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCover ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <pre className="text-xs text-indigo-100 whitespace-pre-wrap font-sans bg-slate-900/90 p-4 rounded-xl border border-indigo-800/50 leading-relaxed">
              {insights.coverLetter}
            </pre>
          </div>

          {/* Practice Interview Questions */}
          <div className="bg-indigo-950/80 border border-indigo-700/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-200 mb-3">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Recommended Practice Interview Questions</span>
            </div>
            <ul className="space-y-2">
              {(insights.interviewQuestions || []).map((q, i) => (
                <li key={i} className="text-xs text-indigo-100 bg-slate-900/90 p-3 rounded-xl border border-indigo-800/40 flex items-start space-x-2">
                  <span className="font-bold text-purple-400">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
