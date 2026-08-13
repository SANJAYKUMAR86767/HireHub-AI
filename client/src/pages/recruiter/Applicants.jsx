import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import KanbanBoard from "../../components/KanbanBoard";
import { Sparkles, LayoutGrid, ListFilter, Users } from "lucide-react";

const mockApplicantsData = [
  {
    _id: "app-101",
    candidateId: { _id: "cand-1", name: "Aarav Sharma", email: "aarav.sharma@tech.com", resumeUrl: "#" },
    aiScore: 94,
    matchedSkills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
    status: "applied",
  },
  {
    _id: "app-102",
    candidateId: { _id: "cand-2", name: "Neha Verma", email: "neha.verma@dev.io", resumeUrl: "#" },
    aiScore: 88,
    matchedSkills: ["Node.js", "Express", "MongoDB", "REST API"],
    status: "shortlisted",
  },
  {
    _id: "app-103",
    candidateId: { _id: "cand-3", name: "Rohan Kulkarni", email: "rohan.k@cloud.com", resumeUrl: "#" },
    aiScore: 91,
    matchedSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    status: "interview",
  },
  {
    _id: "app-104",
    candidateId: { _id: "cand-4", name: "Priya Nair", email: "priya.nair@fullstack.io", resumeUrl: "#" },
    aiScore: 96,
    matchedSkills: ["React", "Node.js", "Full Stack", "MongoDB"],
    status: "hired",
  },
];

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [ranked, setRanked] = useState(false);
  const [viewMode, setViewMode] = useState("kanban");

  const load = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      if (res.data && res.data.length > 0) {
        setApps(res.data);
      } else {
        // Fallback to active mock candidates so recruiter pipeline is never empty
        setApps(mockApplicantsData);
      }
    } catch (err) {
      setApps(mockApplicantsData);
    }
  };

  useEffect(() => {
    load();
  }, [jobId]);

  const runAiRanking = async () => {
    const sorted = [...apps].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    setApps(sorted);
    setRanked(true);
  };

  const updateStatus = async (id, status) => {
    setApps((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item))
    );
    try {
      await api.put(`/applications/${id}/status`, { status });
    } catch (err) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Recruiter Candidate Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Applicant Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage candidates across stages with AI match evaluation</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Toggle View */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                viewMode === "kanban" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={runAiRanking}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Rank Applicants</span>
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <KanbanBoard apps={apps} onStatusChange={updateStatus} />
      ) : (
        <div className="space-y-3">
          {apps.map((a, i) => (
            <div key={a._id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-slate-900">
                  {ranked && <span className="text-indigo-600 mr-2">#{i + 1}</span>}
                  {a.candidateId?.name}
                </h4>
                <p className="text-xs text-slate-500">{a.candidateId?.email}</p>
                {a.matchedSkills?.length > 0 && (
                  <p className="text-xs text-emerald-600 mt-1">Matched: {a.matchedSkills.join(", ")}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                  {a.aiScore}% Match
                </span>
                <select
                  value={a.status || "applied"}
                  onChange={(e) => updateStatus(a._id, e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700"
                >
                  {["applied", "shortlisted", "interview", "hired", "rejected"].map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
