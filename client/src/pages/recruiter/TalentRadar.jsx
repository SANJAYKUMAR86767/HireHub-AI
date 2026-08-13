import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import InterviewSchedulerModal from "../../components/InterviewSchedulerModal";
import {
  Users,
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Award,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const SKILL_FILTERS = ["All", "React", "Node.js", "TypeScript", "AWS", "Python", "Docker", "Kubernetes", "MongoDB"];

export default function TalentRadar() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [minScore, setMinScore] = useState(80);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [activeCandidateForSchedule, setActiveCandidateForSchedule] = useState(null);
  const navigate = useNavigate();

  const fetchTalent = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.q = search;
      if (selectedSkill !== "All") params.skill = selectedSkill;
      if (minScore) params.minScore = minScore;

      const res = await api.get("/advanced/talent-pool", { params });
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalent();
  }, [selectedSkill, minScore]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 mb-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Autonomous Recruiter Sourcing Radar</span>
          </div>
          <h1 className="text-3xl font-black">Candidate Talent Discovery</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Directly scout, filter, and schedule pre-vetted AI-certified engineers for your high-priority roles.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/recruiter/dashboard"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition"
          >
            Dashboard
          </Link>
          <Link
            to="/recruiter/post-job"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
          >
            <span>+ Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Radar Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchTalent()}
              placeholder="Search talent by title, name, location, or tech stack (e.g. 'Senior Architect', 'TypeScript')..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Search Button */}
          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={fetchTalent}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition shadow-md flex items-center justify-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Radar</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {/* Skill Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-slate-400 text-xs font-bold mr-1">Skills:</span>
            {SKILL_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSkill(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedSkill === s
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Min Score Slider */}
          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-600">Min AI Match:</span>
            <span className="font-extrabold text-indigo-600">{minScore}%</span>
            <input
              type="range"
              min="75"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer w-24"
            />
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-slate-900 text-lg">
          Available Pre-Vetted Talent ({candidates.length})
        </h3>
        <span className="text-xs text-slate-500 font-semibold">
          Showing AI-ranked matches
        </span>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No candidates matched your filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search query or adjusting the AI match score threshold.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => {
            const isBookmarked = bookmarkedIds.has(c._id);
            return (
              <div
                key={c._id}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <Award className="w-3 h-3 text-indigo-600" />
                          {c.verifiedBadge || "Verified"}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-lg mt-1.5">{c.name}</h4>
                      <p className="text-xs font-semibold text-slate-600">{c.title}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-sm">
                        {c.aiScore}% Match
                      </div>
                      <button
                        onClick={() => toggleBookmark(c._id)}
                        className={`p-1.5 rounded-lg border transition ${
                          isBookmarked
                            ? "bg-indigo-50 border-indigo-300 text-indigo-600"
                            : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                        }`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark candidate"}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-indigo-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium mt-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {c.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                      {c.experienceYears}y exp
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {c.expectedSalary}
                    </span>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2">
                    {c.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.skills.slice(0, 5).map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                    {c.skills.length > 5 && (
                      <span className="text-[10px] font-bold text-slate-400 self-center">
                        +{c.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveCandidateForSchedule(c)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Invite Interview</span>
                  </button>

                  <Link
                    to={`/chat/${c._id}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Direct Chat</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Auto-Calendar Scheduler Modal */}
      {activeCandidateForSchedule && (
        <InterviewSchedulerModal
          candidate={activeCandidateForSchedule}
          applicationId="talent-direct-invite"
          onClose={() => setActiveCandidateForSchedule(null)}
          onScheduled={() => {
            alert(`Interview invite successfully generated and Google Meet link dispatched to ${activeCandidateForSchedule.name}!`);
            setActiveCandidateForSchedule(null);
          }}
        />
      )}
    </div>
  );
}
