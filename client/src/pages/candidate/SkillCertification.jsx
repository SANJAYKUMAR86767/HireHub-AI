import React, { useState } from "react";
import { Sparkles, ArrowLeft, ShieldCheck, CheckCircle2, RefreshCw, Cpu, Award, Zap, ChevronRight, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function AiSkillCertification() {
  const [activeTrack, setActiveTrack] = useState("fullstack");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [score, setScore] = useState(0);
  const [certified, setCertified] = useState(false);

  const TRACKS = [
    { id: "fullstack", name: "Senior Full Stack MERN Architect", icon: Cpu, badge: "Master Certified" },
    { id: "frontend", name: "Staff React & Next.js Frontend Lead", icon: Zap, badge: "Expert Certified" },
    { id: "cloud", name: "AWS Cloud & Kubernetes DevOps Specialist", icon: ShieldCheck, badge: "Cloud Certified" },
  ];

  const QUESTIONS = {
    fullstack: [
      {
        q: "What is the primary benefit of MongoDB aggregation pipeline over basic find queries?",
        options: [
          "It executes queries multi-threaded in browser memory",
          "It provides multi-stage data transformation, filtering, and joining at server layer",
          "It replaces JSON with XML data storage",
          "It converts MongoDB queries into SQL",
        ],
        correct: 1,
      },
      {
        q: "In Node.js event loop, which phase executes timers like setTimeout and setInterval?",
        options: ["Poll Phase", "Check Phase", "Timers Phase", "Close Callbacks Phase"],
        correct: 2,
      },
      {
        q: "Which React hook ensures memoization of callback functions across re-renders?",
        options: ["useMemo", "useCallback", "useRef", "useEffect"],
        correct: 1,
      },
    ],
  };

  const currentQuestions = QUESTIONS.fullstack;

  const answerQuestion = (idx) => {
    setSelectedAns(idx);
    if (idx === currentQuestions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < currentQuestions.length) {
      setCurrentQ(currentQ + 1);
      setSelectedAns(null);
    } else {
      setCertified(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform</span>
        </Link>
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI Verifiable Skill Certificate Badge Engine</span>
        </div>
      </div>

      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-black tracking-tight">AI Skill Certification & Verified Candidate Badge</h1>
          <p className="text-xs text-slate-400 mt-2">
            Earn AI-Verified skill badges directly displayed on recruiter pipelines & profile cards.
          </p>
        </div>

        {/* Track Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {TRACKS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTrack(t.id);
                  setQuizStarted(false);
                  setCurrentQ(0);
                  setSelectedAns(null);
                  setCertified(false);
                  setScore(0);
                }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  activeTrack === t.id
                    ? "bg-indigo-900/60 border-indigo-500 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">{t.name}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quiz Body */}
        {!quizStarted && !certified ? (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-xl">
            <Award className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-extrabold text-white mb-2">Ready for AI Skill Verification?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Complete the 3-question adaptive evaluation to earn your verified badge for recruiters.
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/25 transition"
            >
              Start AI Certification Test
            </button>
          </div>
        ) : certified ? (
          /* Certificate Result Badge Card */
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
              <ShieldCheck className="w-10 h-10 text-amber-400" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Verified Candidate Credential Issued ✓
            </span>

            <h2 className="text-2xl font-black text-white mt-4">AI Certified MERN Full Stack Architect</h2>
            <p className="text-xs text-slate-300 mt-1">Credential ID: <span className="font-mono text-amber-300">HIREHUB-CERT-{Date.now().toString().slice(-6)}</span></p>

            <div className="my-6 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate Status:</span>
                <span className="text-emerald-400 font-bold">Passed (Score: {score}/{currentQuestions.length})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recruiter Visibility:</span>
                <span className="text-indigo-300 font-bold">Featured Top Rank Badge Active</span>
              </div>
            </div>

            <Link
              to="/candidate/dashboard"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-xl transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>View Badge on My Dashboard</span>
            </Link>
          </div>
        ) : (
          /* Question View */
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-indigo-400">
                Question {currentQ + 1} of {currentQuestions.length}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Adaptive AI Evaluation</span>
            </div>

            <h3 className="text-base font-bold text-white mb-6">{currentQuestions[currentQ].q}</h3>

            <div className="space-y-3 mb-6">
              {currentQuestions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => answerQuestion(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl text-xs font-semibold border transition-all ${
                    selectedAns === idx
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              disabled={selectedAns === null}
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white text-xs font-extrabold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>{currentQ + 1 === currentQuestions.length ? "Finish & Generate Verified Badge" : "Next Question"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
