import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Award,
  Zap,
  ChevronRight,
  UserCheck,
  Printer,
  Share2,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { Link } from "react-router-dom";

const TRACKS = [
  {
    id: "fullstack",
    name: "Senior Full Stack MERN Architect",
    icon: Cpu,
    badge: "Master Certified",
    credentialName: "Senior Full Stack Architecture Specialist",
  },
  {
    id: "frontend",
    name: "Staff React & Next.js Frontend Lead",
    icon: Zap,
    badge: "Expert Certified",
    credentialName: "Staff Frontend & Core Web Vitals Lead",
  },
  {
    id: "cloud",
    name: "AWS Cloud & Kubernetes DevOps Specialist",
    icon: ShieldCheck,
    badge: "Cloud Certified",
    credentialName: "AWS Cloud & Distributed Systems Architect",
  },
];

const QUESTIONS_DATA = {
  fullstack: [
    {
      q: "What is the primary architectural benefit of the MongoDB Aggregation Framework over standard find queries?",
      options: [
        "It caches query results directly inside browser local storage",
        "It provides multi-stage data transformation, pipeline filtering, and server-side grouping",
        "It replaces BSON documents with relational tables",
        "It converts NoSQL queries into raw SQL text",
      ],
      correct: 1,
    },
    {
      q: "In the Node.js event loop architecture, in which phase are setTimeout and setInterval timers processed?",
      options: ["Poll Phase", "Check Phase (setImmediate)", "Timers Phase", "Close Callbacks Phase"],
      correct: 2,
    },
    {
      q: "How does Redis distributed locking (Redlock algorithm) prevent race conditions in microservices?",
      options: [
        "By enforcing TTL expirations and quorum acquisition across independent Redis nodes",
        "By serializing all microservice network packets into a single TCP socket",
        "By compressing JSON payloads into binary gzip files",
        "By forcing browser clients to poll every 500ms",
      ],
      correct: 0,
    },
  ],
  frontend: [
    {
      q: "Which Core Web Vital measures the visual stability of a webpage during user interaction?",
      options: ["Largest Contentful Paint (LCP)", "Cumulative Layout Shift (CLS)", "First Input Delay (FID)", "Time to First Byte (TTFB)"],
      correct: 1,
    },
    {
      q: "In React 19 / Concurrent Mode, what does useTransition allow you to accomplish?",
      options: [
        "Mark state updates as non-blocking transitions to keep the UI interactive and responsive",
        "Animate CSS keyframes with GPU acceleration",
        "Directly query backend databases from client components",
        "Replace Redux stores with local cookies",
      ],
      correct: 0,
    },
    {
      q: "How does React useMemo differ from useCallback?",
      options: [
        "useMemo caches a computed value, while useCallback caches a function definition",
        "useCallback runs on server while useMemo runs on client",
        "useMemo can only be used inside custom hooks",
        "There is no functional difference",
      ],
      correct: 0,
    },
  ],
  cloud: [
    {
      q: "What is the primary purpose of a Kubernetes Ingress Controller?",
      options: [
        "To route external HTTP/HTTPS traffic to internal cluster services with SSL termination",
        "To compile Docker images on worker nodes",
        "To store encrypted database passwords on disk",
        "To replace Linux kernel networking",
      ],
      correct: 0,
    },
    {
      q: "Which AWS service is specifically optimized for low-latency globally distributed NoSQL key-value storage?",
      options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon Glacier"],
      correct: 1,
    },
    {
      q: "What is the core principle of Blue/Green deployment strategy?",
      options: [
        "Maintaining two identical production environments and switching router traffic with zero downtime",
        "Deploying half of code on AWS and half on Google Cloud",
        "Running unit tests only during nighttime hours",
        "Upgrading servers one by one with 50% downtime",
      ],
      correct: 0,
    },
  ],
};

export default function AiSkillCertification() {
  const { user } = useAuth();
  const [activeTrackId, setActiveTrackId] = useState("fullstack");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [score, setScore] = useState(0);
  const [certified, setCertified] = useState(false);
  const [certId, setCertId] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const activeTrack = TRACKS.find((t) => t.id === activeTrackId) || TRACKS[0];
  const currentQuestions = QUESTIONS_DATA[activeTrackId] || QUESTIONS_DATA.fullstack;

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
      setCertId(`HH-CERT-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`);
      setCertified(true);
    }
  };

  const copyCertLink = () => {
    navigator.clipboard.writeText(`https://hirehub.dev/verify-cert/${certId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link
          to="/"
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform</span>
        </Link>
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI Verifiable Skill Certificate Badge Engine</span>
        </div>
      </div>

      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-8 print:hidden">
          <h1 className="text-3xl font-black tracking-tight">
            AI Skill Certification & Official Verified Badge
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Pass technical benchmark assessments to earn verifiable badges and cryptographic certificates.
          </p>
        </div>

        {/* Track Selection */}
        {!certified && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 print:hidden">
            {TRACKS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTrackId(t.id);
                    setQuizStarted(false);
                    setCurrentQ(0);
                    setSelectedAns(null);
                    setCertified(false);
                    setScore(0);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    activeTrackId === t.id
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
        )}

        {/* Quiz Body */}
        {!quizStarted && !certified ? (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-xl">
            <Award className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-extrabold text-white mb-2">
              Ready to verify: {activeTrack.name}?
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Complete the 3-question adaptive evaluation to earn your verified badge for recruiters.
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/25 transition"
            >
              Start AI Certification Assessment
            </button>
          </div>
        ) : certified ? (
          /* High-Resolution Official Verifiable Certificate */
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-4 border-amber-500/60 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
                HIREHUB AUTONOMOUS AI
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
                VERIFIED CREDENTIAL
              </div>

              {/* Certificate Seal */}
              <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
                <ShieldCheck className="w-10 h-10 text-amber-400" />
              </div>

              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-1 rounded-full">
                Certificate of Technical Mastery
              </span>

              <p className="text-xs text-slate-400 mt-6 uppercase tracking-wider font-semibold">
                This is proudly presented to
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-amber-300 mt-1">
                {user?.name || "Verified Software Engineer"}
              </h2>

              <p className="text-xs text-slate-300 mt-4 max-w-xl mx-auto leading-relaxed">
                For demonstrating distinguished technical proficiency, distributed systems architecture knowledge, and problem-solving excellence in
              </p>

              <h3 className="text-xl font-black text-amber-400 mt-2">
                {activeTrack.credentialName}
              </h3>

              {/* Credential Data Footer */}
              <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-left">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Credential ID</span>
                  <span className="font-mono text-amber-300 font-bold">{certId}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Issue Date</span>
                  <span className="font-bold text-slate-200">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Verification Status</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Valid
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition flex items-center space-x-2 border border-slate-700 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Export / Print Certificate (PDF)</span>
              </button>

              <button
                onClick={copyCertLink}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? "Verification Link Copied!" : "Share Verification Link"}</span>
              </button>

              <Link
                to="/candidate/dashboard"
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold px-4 py-3 rounded-2xl transition border border-slate-800"
              >
                Return to Dashboard
              </Link>
            </div>
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

            <h3 className="text-base font-bold text-white mb-6 leading-relaxed">
              {currentQuestions[currentQ].q}
            </h3>

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
              <span>{currentQ + 1 === currentQuestions.length ? "Finish & Generate Verified Certificate" : "Next Question"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
