import React, { useState } from "react";
import { Calendar, Video, Send, CheckCircle, ExternalLink } from "lucide-react";
import api from "../services/api";

export default function InterviewSchedulerModal({ isOpen, onClose, application, onScheduled }) {
  const [interviewDate, setInterviewDate] = useState("");
  const [meetingLink, setMeetingLink] = useState("https://meet.jit.si/HireHubInterview");
  const [notes, setNotes] = useState("Technical Round - Coding & Architecture");
  const [loading, setLoading] = useState(false);
  const [scheduledResult, setScheduledResult] = useState(null);

  if (!isOpen || !application) return null;

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/advanced/schedule-interview", {
        applicationId: application._id,
        interviewDate,
        meetingLink,
        notes,
      });
      setScheduledResult(res.data);
      if (onScheduled) onScheduled();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Schedule Live Interview</h3>
              <p className="text-[11px] text-slate-500">Applicant: {application.candidateId?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>

        {!scheduledResult ? (
          <form onSubmit={handleSchedule} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Interview Date & Time</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Video Meeting Room Link</label>
              <input
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Notes / Instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              disabled={loading || !interviewDate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition"
            >
              {loading ? "Generating Calendar Invite..." : "Confirm & Send Calendar Invite"}
            </button>
          </form>
        ) : (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Interview Scheduled & Invitation Ready!</span>
            </div>
            <p className="text-emerald-800">
              Candidate status moved to <span className="font-bold">Interviewing</span>.
            </p>
            <div className="pt-2 border-t border-emerald-200 flex flex-col gap-2">
              <a
                href={scheduledResult.gcalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-center font-semibold flex items-center justify-center space-x-1.5 hover:bg-emerald-700 transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={scheduledResult.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-emerald-300 text-emerald-800 px-3 py-2 rounded-xl text-center font-semibold flex items-center justify-center space-x-1.5 hover:bg-emerald-100 transition"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Test Video Meeting Room</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
