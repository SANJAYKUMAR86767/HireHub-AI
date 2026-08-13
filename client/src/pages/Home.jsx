import React, { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import SalaryPredictorModal from "../components/SalaryPredictorModal";
import {
  Search,
  Sparkles,
  Briefcase,
  DollarSign,
  Compass,
  Zap,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Flame,
  Globe2,
  Building2,
  Cpu,
  Layers,
  ChevronRight,
  Filter,
  RefreshCw,
  Globe,
  Bot,
  ExternalLink,
  Video,
  Star,
  Building,
  CheckCircle2,
  Clock,
  Heart,
  Target,
  MessageSquare,
  FileCode2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Live Ticker News
  const [tickerIndex, setTickerIndex] = useState(0);
  const liveActivities = [
    "⚡ Global Match Engine: Rahul S. scored 96% AI Precision Match for Staff Architect Role",
    "💼 Priya M. initiated automated Google Calendar & Meet link for Senior Full Stack position",
    "🤖 ATS Parser Processed 5,200+ Resumes with 99.8% semantic extraction accuracy",
    "🔥 Trending Global Listing: Principal Cloud DevOps Lead (USD $140,000 - $180,000 / ₹35 LPA)",
    "🎉 Verified Recruiter Hiring Velocity reached record high of 4.2x efficiency",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: "All", label: "All Global Roles", icon: Layers, keywords: [] },
    { name: "Frontend", label: "Frontend", icon: Cpu, keywords: ["frontend", "react", "vue", "ui", "javascript", "web", "developer", "engineer", "css"] },
    { name: "Backend", label: "Backend", icon: Building2, keywords: ["backend", "node", "python", "java", "api", "express", "server", "engineer", "django", "spring"] },
    { name: "Full Stack", label: "Full Stack", icon: Zap, keywords: ["full stack", "fullstack", "mern", "developer", "engineer"] },
    { name: "Cloud & DevOps", label: "Cloud & DevOps", icon: Globe2, keywords: ["cloud", "devops", "aws", "docker", "kubernetes", "architect", "sre", "security"] },
  ];

  const topCompanies = [
    { name: "Meta / Instagram", logo: "M", rating: "4.9 ★", activeJobs: "14 Positions", verified: true },
    { name: "Uber Infrastructure", logo: "U", rating: "4.8 ★", activeJobs: "22 Positions", verified: true },
    { name: "OpenAI Platform Partner", logo: "O", rating: "5.0 ★", activeJobs: "18 Positions", verified: true },
    { name: "Amazon Web Services", logo: "A", rating: "4.9 ★", activeJobs: "35 Positions", verified: true },
    { name: "TechCorp Global", logo: "T", rating: "4.7 ★", activeJobs: "12 Positions", verified: true },
  ];

  const advancedPlatformFeatures = [
    {
      title: "AI ATS Resume Parser & Score",
      desc: "Instant 0-100% precision match score with missing skills matrix & AI Cover Letter.",
      icon: Sparkles,
      color: "from-indigo-500 to-purple-600",
      link: "/jobs/mock-1",
    },
    {
      title: "Voice Mock Interview Simulator",
      desc: "Web Speech API microphone voice practice with aloud text-to-speech question reader.",
      icon: Video,
      color: "from-purple-500 to-pink-600",
      link: "/candidate/interview-prep",
    },
    {
      title: "Real-Time Socket.io Chat Workspace",
      desc: "Direct candidate-recruiter messaging with 1-click Google Meet video room launcher.",
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-600",
      link: "/chat/cand-1",
    },
    {
      title: "Executive Smart Resume Studio",
      desc: "Live PDF resume preview builder with 1-click export and ATS templates.",
      icon: FileCode2,
      color: "from-amber-500 to-orange-600",
      link: "/candidate/resume-builder",
    },
    {
      title: "AI English Spoken Practice Coach",
      desc: "Practice interview spoken English from Beginner to Executive level with real-time AI voice evaluation.",
      icon: BookOpen,
      color: "from-blue-600 to-cyan-500",
      link: "/candidate/english-coach",
    },
    {
      title: "AI Live Technical Coding Sandbox",
      desc: "Solve Meta/Google/Uber LeetCode data structure problems with instant AI execution & complexity auditor.",
      icon: Terminal,
      color: "from-emerald-600 to-teal-500",
      link: "/candidate/coding-sandbox",
    },
    {
      title: "AI Verifiable Skill Certificate Badge",
      desc: "Earn AI-Verified skill credential badges displayed on recruiter candidate pipelines.",
      icon: ShieldCheck,
      color: "from-purple-600 to-indigo-600",
      link: "/candidate/certification",
    },
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (q.trim()) {
      const query = q.toLowerCase();
      const title = (job.title || "").toLowerCase();
      const company = (job.companyName || job.company || "").toLowerCase();
      const skills = (job.skills || []).map((s) => s.toLowerCase()).join(" ");
      const location = (job.location || "").toLowerCase();

      const matchesSearch =
        title.includes(query) || company.includes(query) || skills.includes(query) || location.includes(query);
      if (!matchesSearch) return false;
    }

    if (activeCategory !== "All") {
      const selectedCat = categories.find((c) => c.name === activeCategory);
      if (selectedCat) {
        const title = (job.title || "").toLowerCase();
        const skills = (job.skills || []).map((s) => s.toLowerCase()).join(" ");
        const desc = (job.description || "").toLowerCase();

        const matchesKeyword = selectedCat.keywords.some(
          (kw) => title.includes(kw) || skills.includes(kw) || desc.includes(kw)
        );

        if (!matchesKeyword) return false;
      }
    }

    if (workModeFilter !== "all") {
      const mode = (job.workMode || "").toLowerCase();
      const title = (job.title || "").toLowerCase();
      const location = (job.location || "").toLowerCase();
      const targetMode = workModeFilter.toLowerCase();

      const matchesMode = mode.includes(targetMode) || location.includes(targetMode) || title.includes(targetMode);
      if (!matchesMode && mode !== targetMode) {
        return true;
      }
    }

    return true;
  });

  const resetFilters = () => {
    setActiveCategory("All");
    setWorkModeFilter("all");
    setQ("");
  };

  const encodedSearch = encodeURIComponent(q.trim() || "Software Engineer");
  const globalLinkedinSearch = `https://www.linkedin.com/jobs/search/?keywords=${encodedSearch}`;
  const globalNaukriSearch = `https://www.naukri.com/${encodedSearch}-jobs`;
  const globalGoogleSearch = `https://www.google.com/search?q=${encodedSearch}+jobs`;
  const globalInternshalaSearch = `https://internshala.com/jobs/${encodedSearch}-jobs/`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white bg-grid-pattern relative">
      {/* Live Activity Ticker Bar */}
      <div className="bg-indigo-950/90 border-b border-indigo-500/20 py-2.5 px-4 backdrop-blur-xl text-xs font-semibold flex items-center justify-center text-indigo-300 relative z-30">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-hidden">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="uppercase text-[10px] tracking-widest text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Realtime Global Activity
          </span>
          <span className="truncate transition-all duration-500 text-slate-200">{liveActivities[tickerIndex]}</span>
        </div>
      </div>

      {/* World-Class Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/25 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[220px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2.5 bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/30 px-4 py-2 rounded-full text-xs font-extrabold text-indigo-300 mb-8 shadow-xl glow-indigo animate-float">
            <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>Next-Gen World Class MERN + AI Career Portal</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.1]">
            Empowering Careers Worldwide with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300">
              Autonomous AI Intelligence
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Real-time ATS Resume Parser, AI Cover Letter Generator, Voice Mock Interviewer, and Recruiter Kanban Pipelines in a unified, world-class ecosystem.
          </p>

          {/* Interactive Search Box */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-3xl shadow-2xl glow-purple border border-slate-700/80">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-indigo-400 absolute left-4" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Type any job title or skill (e.g. Python, React, DevOps, Django)..."
                    className="w-full bg-slate-900/80 text-white placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium focus:outline-none border border-slate-700/60 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("jobs-marketplace")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white px-7 py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Platform</span>
                  </button>
                </div>
              </div>

              {/* Live External World Search Launchers */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Live External Global Search Engine:</span>
                    {q.trim() && <span className="text-amber-400 font-bold">"{q.trim()}"</span>}
                  </span>
                  <span className="text-[10px] text-slate-500">Instant redirection to live verified global postings</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={globalLinkedinSearch}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600/25 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>Search LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={globalNaukriSearch}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-600/25 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>Search Naukri.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={globalGoogleSearch}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-600/25 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>Search Google Jobs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={globalInternshalaSearch}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-cyan-600/25 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>Search Internshala</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowSalaryModal(true)}
                className="inline-flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-lg backdrop-blur-xl"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>AI Compensation Predictor</span>
              </button>

              <Link
                to="/candidate/interview-prep"
                className="inline-flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/30 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-lg backdrop-blur-xl"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Voice Mock Interview Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Hiring Partners & Companies */}
      <div className="max-w-6xl mx-auto px-4 mb-16 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            Top Verified Hiring Partners & Enterprises
          </h3>
          <span className="text-xs text-slate-500 font-semibold">240+ Companies Hiring Now</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {topCompanies.map((c, i) => (
            <div
              key={i}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 p-4 rounded-2xl transition-all shadow-lg flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                  {c.logo}
                </div>
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  {c.rating}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors truncate">
                  {c.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{c.activeJobs}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Global Jobs Marketplace */}
      <div id="jobs-marketplace" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Globe className="w-7 h-7 text-indigo-400" />
              Explore Global Opportunities
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing <span className="text-indigo-400 font-bold">{filteredJobs.length}</span> positions for category:{" "}
              <span className="text-amber-400 font-bold uppercase tracking-wider">{activeCategory}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category pills */}
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 flex items-center space-x-1 overflow-x-auto max-w-full backdrop-blur-xl">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setActiveCategory(cat.name);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeCategory === cat.name
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Work mode selector */}
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 flex items-center space-x-1 backdrop-blur-xl">
              {["all", "Remote", "Hybrid", "Onsite"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setWorkModeFilter(mode)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    workModeFilter === mode
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {mode === "all" ? "All Modes" : mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-52 bg-slate-900/60 border border-slate-800/80 rounded-3xl animate-pulse p-6" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto border border-slate-800">
            <Briefcase className="w-14 h-14 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-200">No jobs match this specific filter query</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Click <span className="text-indigo-400 font-semibold">"Reset Filters"</span> to view all verified positions.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-5 py-3 rounded-2xl transition shadow-xl"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Filters & Show All Jobs</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Advanced Platform Suite Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Unified Autonomous Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Next-Gen Autonomous AI Capabilities</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need for candidate evaluation, interview simulation, real-time messaging, and ATS resume creation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advancedPlatformFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={i}
                to={f.link}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition-all shadow-xl flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} text-white font-bold flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-indigo-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Salary Modal */}
      <SalaryPredictorModal isOpen={showSalaryModal} onClose={() => setShowSalaryModal(false)} />
    </div>
  );
}

function MetricItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center space-x-3.5">
      <div className={`p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 ${color} shadow-inner`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}
