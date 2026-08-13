import React, { useState } from "react";
import { User, CheckCircle2, Clock, Calendar, CheckSquare, XCircle, Mail, FileText, Video } from "lucide-react";
import InterviewSchedulerModal from "./InterviewSchedulerModal";

const STAGES = [
  { id: "applied", label: "Applied", icon: Clock, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "shortlisted", label: "Shortlisted", icon: CheckCircle2, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "interview", label: "Interviewing", icon: Calendar, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "hired", label: "Hired / Offered", icon: CheckSquare, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "rejected", label: "Rejected", icon: XCircle, color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function KanbanBoard({ apps, onStatusChange }) {
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => {
          const StageIcon = stage.icon;
          const stageApps = apps.filter((a) => (a.status || "applied") === stage.id);

          return (
            <div key={stage.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col min-w-[240px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center space-x-2">
                  <StageIcon className="w-4 h-4 text-slate-600" />
                  <h3 className="font-semibold text-sm text-slate-800">{stage.label}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {stageApps.length}
                </span>
              </div>

              {/* Application Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {stageApps.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {app.candidateId?.name ? app.candidateId.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-xs text-slate-900 leading-tight">
                            {app.candidateId?.name || "Applicant"}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate max-w-[120px]">
                            {app.candidateId?.email}
                          </p>
                        </div>
                      </div>
                      {app.aiScore !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            app.aiScore >= 75
                              ? "bg-emerald-100 text-emerald-800"
                              : app.aiScore >= 40
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {app.aiScore}%
                        </span>
                      )}
                    </div>

                    {/* Schedule Video Call Action */}
                    <button
                      onClick={() => setSelectedAppForInterview(app)}
                      className="mt-2.5 w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 py-1 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Video className="w-3 h-3 text-amber-600" />
                      <span>Schedule Live Interview</span>
                    </button>

                    {/* Skills badges */}
                    {app.matchedSkills && app.matchedSkills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {app.matchedSkills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action dropdown */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      {app.candidateId?.resumeUrl ? (
                        <a
                          href={app.candidateId.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                        >
                          <FileText className="w-3 h-3" /> Resume
                        </a>
                      ) : (
                        <span />
                      )}

                      <select
                        value={app.status || "applied"}
                        onChange={(e) => onStatusChange(app._id, e.target.value)}
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move to {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center text-xs text-slate-400">
                    No applicants
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <InterviewSchedulerModal
        isOpen={!!selectedAppForInterview}
        onClose={() => setSelectedAppForInterview(null)}
        application={selectedAppForInterview}
        onScheduled={() => {
          if (selectedAppForInterview) {
            onStatusChange(selectedAppForInterview._id, "interview");
          }
        }}
      />
    </>
  );
}
