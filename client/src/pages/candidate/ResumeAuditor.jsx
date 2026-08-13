import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FileText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Award,
  RefreshCw,
  TrendingUp,
  Sliders,
  FileCode2,
} from "lucide-react";

const SAMPLE_RESUME = `Alex Rivera — Senior Full Stack Software Engineer
Email: alex.rivera@techdev.io | Phone: +1 555 0192 | GitHub: github.com/alexrivera

SUMMARY:
Results-driven Senior Full Stack Software Engineer with 5+ years of experience architecting high-throughput distributed microservices and modern React web applications. Proven track record reducing latency by 45% and leading cross-functional engineering teams.

EXPERIENCE:
Staff Full Stack Engineer | CloudTech Solutions (2022 - Present)
• Architected and deployed high-concurrency Node.js and TypeScript microservices handling 12M+ daily requests with 99.99% uptime.
• Spearheaded frontend performance optimization using React 19, reducing p99 Largest Contentful Paint (LCP) from 3.8s to 1.1s.
• Implemented Redis distributed caching and PostgreSQL indexing, cutting database query latency by 52%.
• Engineered CI/CD pipelines with GitHub Actions and Docker Kubernetes deployments.

Software Engineer | WebInnovate Corp (2020 - 2022)
• Developed responsive single-page web applications using React, Tailwind CSS, and Express.
• Implemented JWT authentication and OAuth2 SSO authorization protocols.
• Automated end-to-end integration tests using Jest, achieving 88% test coverage.

SKILLS:
Languages & Frameworks: React, Next.js, Node.js, Express, TypeScript, JavaScript, Python
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2, Lambda), Docker, Kubernetes, CI/CD, Git`;

export default function ResumeAuditor() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [auditing, setAuditing] = useState(false);
  const [auditData, setAuditData] = useState(null);

  // Bullet transformer
  const [inputBullet, setInputBullet] = useState("Built REST APIs for user authentication and fixed several bugs in the database.");
  const [enhancedBullets, setEnhancedBullets] = useState(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);

  const runAudit = async () => {
    setAuditing(true);
    try {
      const res = await api.post("/advanced/resume-auditor", {
        resumeText,
        targetRole,
      });
      setAuditData(res.data);
      setEnhancedBullets(res.data.enhancedBullets);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditing(false);
    }
  };

  const transformBullet = () => {
    const words = inputBullet.split(" ").length;
    setEnhancedBullets([
      {
        type: "Metric-Driven (Google XYZ Formula)",
        text: `Architected scalable REST authentication endpoints with JWT & Redis caching, increasing throughput by 38% and reducing login latency to <45ms.`,
      },
      {
        type: "Technical Leadership & Scale",
        text: `Spearheaded database query optimization and connection pooling, eliminating race conditions and boosting peak concurrency by 2.4x.`,
      },
      {
        type: "Problem-Action-Result (PAR)",
        text: `Resolved critical auth bottleneck by decoupling session validation into distributed token verification, saving $12,000 in monthly server compute.`,
      },
    ]);
  };

  const copyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
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
              AI ATS Resume Deep Auditor & Bullet Transformer
            </h1>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ATS Precision 2.0</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Resume Input (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Paste Resume Plain Text</span>
            </h3>
            <button
              onClick={() => setResumeText(SAMPLE_RESUME)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Load Sample Resume
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Target Engineering Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Full Stack Engineer">Full Stack Software Engineer</option>
              <option value="Frontend Lead">Staff Frontend Engineer (React/Next.js)</option>
              <option value="Backend Architect">Senior Backend Architect (Node/Go/Python)</option>
              <option value="Cloud DevOps">Cloud & DevOps SRE Lead (AWS/K8s)</option>
              <option value="AI Engineer">AI & Machine Learning Engineer</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Resume Content
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              placeholder="Paste your full resume text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={runAudit}
            disabled={auditing || !resumeText.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs py-3.5 rounded-2xl transition shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{auditing ? "Auditing Resume ATS..." : "Run Deep ATS Audit"}</span>
          </button>
        </div>

        {/* Right Column: ATS Scorecard & Bullet Transformer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {auditData ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Top ATS Score Meter */}
              <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 text-white shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Overall ATS Compatibility Rating
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">ATS Optimization Grade</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Audited across metrics density, action verbs, and keyword taxonomy.
                  </p>
                </div>
                <div className="text-center bg-slate-950 border border-indigo-500/40 px-6 py-3 rounded-2xl">
                  <span className="text-4xl font-black text-amber-400">{auditData.overallAtsScore}%</span>
                  <span className="block text-[10px] font-extrabold text-emerald-400 uppercase mt-0.5">
                    {auditData.overallAtsScore >= 85 ? "ATS Ready 🎉" : "Needs Polish ⚡"}
                  </span>
                </div>
              </div>

              {/* 5 Pillar Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <h3 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider">
                  5-Pillar ATS Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <PillarMeter label="Impact & Numbers" score={auditData.pillars.impactAndMetrics} />
                  <PillarMeter label="Action Verb Strength" score={auditData.pillars.actionVerbStrength} />
                  <PillarMeter label="Structural Layout" score={auditData.pillars.structuralFormatting} />
                  <PillarMeter label="Keyword Density" score={auditData.pillars.keywordDensity} />
                </div>

                {/* Detected Action Verbs */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    Detected High-Impact Action Verbs ({auditData.detectedVerbs.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {auditData.detectedVerbs.map((v, i) => (
                      <span key={i} className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg capitalize font-semibold">
                        ✓ {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Google XYZ Bullet Transformer */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Google XYZ Bullet Point Transformer</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Formula: *Accomplished [X], as measured by [Y], by doing [Z].* Paste any weak bullet point below to generate high-impact versions.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputBullet}
                    onChange={(e) => setInputBullet(e.target.value)}
                    placeholder="Enter weak resume bullet..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={transformBullet}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0"
                  >
                    Enhance Bullet
                  </button>
                </div>

                {/* Enhanced Variations */}
                {enhancedBullets && (
                  <div className="space-y-3 pt-2">
                    {enhancedBullets.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2"
                      >
                        <div className="flex items-center justify-between text-[10px] font-black text-indigo-400 uppercase tracking-wider">
                          <span>{b.type}</span>
                          <button
                            onClick={() => copyBullet(b.text, bIdx)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition"
                          >
                            {copiedBulletIdx === bIdx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          • {b.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-xl flex flex-col items-center justify-center min-h-[420px]">
              <FileCode2 className="w-12 h-12 text-indigo-400 mb-3" />
              <h3 className="text-base font-black">Audit Your Resume Against ATS Systems</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Paste your resume on the left or click 'Load Sample Resume' to run an in-depth ATS compliance scan and optimize your bullet points with the Google XYZ formula.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PillarMeter({ label, score }) {
  return (
    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-400 font-semibold">{label}</span>
        <span className="font-extrabold text-amber-400">{score}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
