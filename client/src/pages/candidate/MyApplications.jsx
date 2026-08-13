import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FileText, Calendar, CheckCircle2, Clock, Video, ExternalLink, Sparkles, Building, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications/mine")
      .then((res) => setApps(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">Offered / Hired 🎉</span>;
      case "interview":
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1"><Video className="w-3.5 h-3.5 text-amber-600" /> Interview Scheduled</span>;
      case "shortlisted":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full uppercase">Shortlisted</span>;
      case "rejected":
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full uppercase">Not Selected</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full uppercase">Application Submitted</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Job Applications</h1>
          <p className="text-xs text-slate-500 mt-1">Track interview schedules, AI match scores, and hiring status</p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          {apps.length} Applications Total
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-sm">No applications submitted yet</h3>
          <p className="text-xs text-slate-400 mt-1">Explore featured opportunities and apply with your AI match profile.</p>
          <Link to="/" className="inline-flex items-center space-x-1.5 mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
            <span>Explore Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => (
            <div key={a._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500">{a.jobId?.company || "Company"}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{a.jobId?.title || "Job Position"}</h3>
                  {a.jobId?.location && (
                    <p className="text-xs text-slate-500 mt-0.5">{a.jobId.location} · {a.jobId.jobType || "Full-time"}</p>
                  )}
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  {getStatusBadge(a.status)}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">AI Compatibility:</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {a.aiScore}% Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Interview schedule notification alert if status === 'interview' */}
              {a.status === "interview" && (
                <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-amber-900 font-medium">
                    <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Interview Scheduled: {a.interviewDate ? new Date(a.interviewDate).toLocaleString() : "Date set by recruiter"}
                    </span>
                  </div>
                  <a
                    href="https://meet.jit.si/HireHubInterview"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shrink-0"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting Room</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
