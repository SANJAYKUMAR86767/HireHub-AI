import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  FileText,
  Upload,
  Sparkles,
  Code2,
  Award,
  ArrowRight,
  CheckCircle2,
  Compass,
  Briefcase,
  Video,
  MessageSquare,
  Globe,
  ExternalLink,
  TrendingUp,
  Terminal,
  ShieldCheck,
  BookOpen,
  DollarSign,
  Layers,
  FileCode2,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setProfile(res.data);
      setSkillsInput((res.data.skills || []).join(", "));
    });

    api
      .get("/advanced/recommendations")
      .then((res) => setRecommendedJobs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingRecs(false));
  }, []);

  const saveSkills = async () => {
    try {
      const skillsArray = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      await api.put("/auth/me", { skills: skillsArray });
      setSaved(true);
      setProfile((p) => ({ ...p, skills: skillsArray }));
      setTimeout(() => setSaved(false), 2000);

      api.get("/advanced/recommendations").then((res) => setRecommendedJobs(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      setUploading(true);
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMsg("Resume parsed & uploaded successfully!");
      setProfile((p) => ({ ...p, resumeUrl: res.data.resumeUrl }));
    } catch (err) {
      setUploadMsg(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white mb-8 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Autonomous Candidate Career Command Hub</span>
          </div>
          <h1 className="text-3xl font-black">Welcome back, {user?.name || "Candidate"}!</h1>
          <p className="text-xs text-indigo-200 mt-1">
            AI Offer Analyzer, Deep ATS Auditor, System Design Studio, Live Mock Video Studio & 1-Click Portals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/candidate/offer-analyzer"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-emerald-500/25"
          >
            <DollarSign className="w-4 h-4" />
            <span>Audit Job Offer Package</span>
          </Link>
          <Link
            to="/candidate/applications"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-indigo-500/25"
          >
            <span>My Application Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Global 1-Click Direct Application Portals Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            Direct Global Job Application Portals (1-Click Search & Apply)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <a
            href="https://www.linkedin.com/jobs"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Apply on LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.naukri.com"
            target="_blank"
            rel="noreferrer"
            className="bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Apply on Naukri.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.google.com/search?q=software+engineer+jobs"
            target="_blank"
            rel="noreferrer"
            className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Apply on Google Jobs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://internshala.com/jobs"
            target="_blank"
            rel="noreferrer"
            className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Apply on Internshala</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Integrated Master AI Acceleration Tools */}
      <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        Integrated Master AI Workspaces & Acceleration Tools
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <FeatureCommandCard
          title="1. AI Offer Letter & Comp Analyzer"
          desc="4-year comp calculation, tax in-hand estimates & counter-offer script."
          icon={DollarSign}
          color="bg-emerald-50 text-emerald-800 border-emerald-200"
          link="/candidate/offer-analyzer"
        />
        <FeatureCommandCard
          title="2. ATS Deep Resume Auditor"
          desc="5-pillar ATS scan & Google XYZ bullet point transformer."
          icon={FileCode2}
          color="bg-indigo-50 text-indigo-800 border-indigo-200"
          link="/candidate/resume-auditor"
        />
        <FeatureCommandCard
          title="3. System Design Whiteboard Studio"
          desc="Visual node architecture canvas & live AI SPOF resilience audit."
          icon={Layers}
          color="bg-purple-50 text-purple-800 border-purple-200"
          link="/candidate/system-design-studio"
        />
        <FeatureCommandCard
          title="4. Live Video Mock Interview Studio"
          desc="Camera/mic stream, speech transcription, WPM HUD & AI scorecards."
          icon={Video}
          color="bg-amber-50 text-amber-800 border-amber-200"
          link="/candidate/live-interview"
        />
        <FeatureCommandCard
          title="5. Career Leveling & Comp Roadmap"
          desc="L1-L5 leveling ladder, salary bands in INR/USD & promotion checklists."
          icon={TrendingUp}
          color="bg-blue-50 text-blue-800 border-blue-200"
          link="/candidate/career-roadmap"
        />
        <FeatureCommandCard
          title="6. AI Skill Verification & Certificate"
          desc="Adaptive exams with official cryptographic verified certificates."
          icon={ShieldCheck}
          color="bg-rose-50 text-rose-800 border-rose-200"
          link="/candidate/certification"
        />
        <FeatureCommandCard
          title="7. Spoken English Voice Coach"
          desc="Mic speech analyzer for behavioral rounds, pacing & fluency."
          icon={BookOpen}
          color="bg-cyan-50 text-cyan-800 border-cyan-200"
          link="/candidate/english-coach"
        />
        <FeatureCommandCard
          title="8. AI Coding & Algorithm Sandbox"
          desc="Browser code execution engine, test case runner & algorithmic analysis."
          icon={Terminal}
          color="bg-teal-50 text-teal-800 border-teal-200"
          link="/candidate/coding-sandbox"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={User} label="Profile Status" value={profile ? "Verified Active" : "Loading..."} color="text-indigo-600 bg-indigo-50" />
        <StatCard icon={Award} label="Tracked Skills" value={`${(profile?.skills || []).length} Skills`} color="text-emerald-600 bg-emerald-50" />
        <StatCard icon={FileText} label="ATS Resume" value={profile?.resumeUrl ? "Uploaded ✓" : "Ready for Upload"} color="text-purple-600 bg-purple-50" />
      </div>

      {/* AI Smart Job Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            AI Smart Recommendation Engine (Matched to Your Skills)
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{recommendedJobs.length} Top Matches</span>
        </div>

        {loadingRecs ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
            No matched jobs yet. Try adding more tech skills below!
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {recommendedJobs.map(({ job, matchPercentage }) => (
              <div key={job._id} className="relative">
                <div className="absolute top-3 right-3 z-10 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {matchPercentage}% Match
                </div>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Skills Management */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Your Tech Stack & Skills</h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">Add comma-separated skills to power the AI matching algorithm.</p>
          <textarea
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, Node.js, MongoDB, TypeScript, Python, AWS, Docker, Kubernetes..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-3"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={saveSkills}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
            >
              Save Skills Profile
            </button>
            {saved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
              </span>
            )}
          </div>
        </div>

        {/* ATS Resume Upload */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Upload ATS Resume</h3>
          </div>
          {profile?.resumeUrl ? (
            <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              Active Resume:{" "}
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">
                View PDF File
              </a>
            </p>
          ) : (
            <p className="text-xs text-slate-500 mb-3">Upload your PDF resume for instant AI scoring against job postings.</p>
          )}
          <form onSubmit={uploadResume} className="space-y-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button
              disabled={uploading || !resumeFile}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              {uploading ? "Parsing PDF..." : "Upload & Sync Resume"}
            </button>
          </form>
          {uploadMsg && <p className="text-xs text-slate-600 mt-2 font-semibold">{uploadMsg}</p>}
        </div>
      </div>
    </div>
  );
}

function FeatureCommandCard({ title, desc, icon: Icon, color, link }) {
  return (
    <Link
      to={link}
      className={`p-5 rounded-3xl border ${color} hover:shadow-lg transition-all flex flex-col justify-between group`}
    >
      <div>
        <div className="p-2.5 rounded-2xl bg-white w-fit shadow-sm mb-3 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-extrabold text-xs text-slate-900 mb-1">{title}</h4>
        <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
      </div>
      <div className="mt-4 pt-2 border-t border-slate-200/60 text-[11px] font-bold flex items-center justify-between">
        <span>Launch Workspace</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
      <div className={`p-3.5 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="text-lg font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
