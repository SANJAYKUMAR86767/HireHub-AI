import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Mail,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Send,
  Users,
  Building,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function RecruiterOutreachGenerator() {
  const [form, setForm] = useState({
    candidateName: "Aarav Sharma",
    candidateSkill: "Distributed React, Node.js & Kubernetes",
    roleTitle: "Staff Software Architect",
    companyName: "Acme Cloud Infrastructure",
    compRange: "₹38 - 48 LPA",
    equityNote: "with 0.35% equity grant & 4-day hybrid policy",
  });

  const [generating, setGenerating] = useState(false);
  const [sequenceData, setSequenceData] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const generateOutreach = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/advanced/outreach-sequence", form);
      setSequenceData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const copyStep = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/recruiter/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recruiter Studio</span>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              AI Candidate Sourcing & Cold Outreach Generator
            </h1>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>High-Conversion Copy</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4" />
            <span>Target Candidate Parameters</span>
          </h3>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Candidate First Name
            </label>
            <input
              type="text"
              value={form.candidateName}
              onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Candidate Core Skill Highlight
            </label>
            <input
              type="text"
              value={form.candidateSkill}
              onChange={(e) => setForm({ ...form, candidateSkill: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Open Job Role Title
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
              Hiring Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Compensation Range
            </label>
            <input
              type="text"
              value={form.compRange}
              onChange={(e) => setForm({ ...form, compRange: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={generateOutreach}
            disabled={generating}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs py-3.5 rounded-2xl transition shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{generating ? "Drafting Sequences..." : "Generate 3-Step Cold Outreach"}</span>
          </button>
        </div>

        {/* 3-Step Sequence Output (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {sequenceData ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-white">
                <span className="font-extrabold text-indigo-300">
                  Target Candidate: {sequenceData.targetCandidate}
                </span>
                <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {sequenceData.estimatedResponseRate}
                </span>
              </div>

              {sequenceData.sequence.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                        {step.step}
                      </span>
                      <h4 className="font-extrabold text-xs text-white">{step.channel}</h4>
                    </div>
                    <button
                      onClick={() => copyStep(`${step.subject}\n\n${step.body}`, idx)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-slate-700"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Subject Line:</span>
                    <p className="font-bold text-amber-300 text-xs mt-0.5">{step.subject}</p>
                  </div>

                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                    {step.body}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-xl flex flex-col items-center justify-center min-h-[400px]">
              <Mail className="w-12 h-12 text-indigo-400 mb-3" />
              <h3 className="text-base font-black">Generate High-Conversion Cold Outreach</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter your candidate's name and skill highlights on the left to generate a personalized 3-stage email and LinkedIn headhunting sequence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
