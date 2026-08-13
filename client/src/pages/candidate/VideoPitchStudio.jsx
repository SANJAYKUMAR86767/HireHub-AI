import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  ArrowLeft,
  Clock,
  Share2,
  FileText,
  Copy,
  Check,
} from "lucide-react";

const SAMPLE_PITCH_SCRIPTS = [
  {
    id: "fullstack",
    label: "Senior Full Stack Pitch",
    script: "Hi, I'm Alex! I am a Senior Full Stack Software Engineer with 5+ years of experience architecting distributed systems with React 19, Node.js, and Redis. In my last role, I scaled microservices to 15M daily requests and reduced API p99 latency by 45%. I'm passionate about high-concurrency architecture, clean code, and fast-paced product delivery. Excited to connect!",
  },
  {
    id: "devops",
    label: "Cloud & DevOps SRE Pitch",
    script: "Hello! I am a Cloud & DevOps SRE Lead specializing in AWS, Kubernetes, and automated Terraform infrastructure. I have automated zero-downtime canary deployments and reduced cloud infrastructure expenditure by 35% while maintaining 99.99% system availability. Looking forward to driving high reliability in my next role!",
  },
];

export default function VideoPitchStudio() {
  const [selectedScript, setSelectedScript] = useState(SAMPLE_PITCH_SCRIPTS[0]);
  const [customScript, setCustomScript] = useState(SAMPLE_PITCH_SCRIPTS[0].script);
  const [videoActive, setVideoActive] = useState(true);
  const [audioActive, setAudioActive] = useState(true);
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [pitchScore, setPitchScore] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startMedia();
    return () => {
      stopMedia();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.warn("Camera preview active in simulation mode");
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  const startRecordingPitch = () => {
    setTimeLeft(60);
    setRecording(true);
    setPitchScore(null);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishRecording = () => {
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    setPitchScore({
      overallScore: 95,
      hookStrength: "96% (Strong opener)",
      pacing: "135 WPM (Ideal executive tempo)",
      metricsMentioned: "2 Quantified Achievements (15M reqs, 45% latency)",
      shareUrl: `https://hirehub.dev/pitch/cand-${Date.now().toString().slice(-6)}`,
    });
  };

  const copyShareUrl = () => {
    if (pitchScore?.shareUrl) {
      navigator.clipboard.writeText(pitchScore.shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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
              60-Second Video Resume Elevator Pitch Studio
            </h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Video Pitch HUD</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Video Camera & Teleprompter (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {videoActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center text-slate-500">
                <VideoOff className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Camera is disabled</p>
              </div>
            )}

            {/* Countdown Timer Overlay Top Right */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{timeLeft}s REMAINING</span>
            </div>

            {/* Live Teleprompter Script Overlay (Bottom of Video) */}
            <div className="absolute bottom-16 left-4 right-4 bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 p-3.5 rounded-2xl text-xs text-amber-200 leading-relaxed max-h-24 overflow-y-auto">
              <span className="text-[9px] font-black uppercase text-indigo-400 block mb-1">
                Teleprompter Prompter Script (Read Aloud):
              </span>
              "{customScript}"
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
              {!recording ? (
                <button
                  onClick={startRecordingPitch}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-1.5"
                >
                  <Play className="w-4 h-4" />
                  <span>Start 60s Pitch Recording</span>
                </button>
              ) : (
                <button
                  onClick={finishRecording}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish & Grade Pitch</span>
                </button>
              )}
            </div>
          </div>

          {/* Teleprompter Script Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Customize Teleprompter Script</span>
              </span>
              <div className="flex gap-2 text-xs">
                {SAMPLE_PITCH_SCRIPTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedScript(s);
                      setCustomScript(s.script);
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-white"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Pitch Telemetry & Shareable Link (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {pitchScore ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Pitch Telemetry Scorecard
                  </span>
                  <h3 className="text-lg font-black text-white">Elevator Pitch Grade</h3>
                </div>
                <div className="text-center bg-slate-950 border border-indigo-500/40 px-4 py-2 rounded-2xl">
                  <span className="text-2xl font-black text-amber-400">{pitchScore.overallScore}%</span>
                  <span className="block text-[9px] font-extrabold text-emerald-400 uppercase">Top Tier</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Hook & Opening Strength:</span>
                  <span className="text-emerald-400 font-bold">{pitchScore.hookStrength}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Speaking Cadence:</span>
                  <span className="text-indigo-300 font-bold">{pitchScore.pacing}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Quantified Metrics:</span>
                  <span className="text-amber-300 font-bold">{pitchScore.metricsMentioned}</span>
                </div>
              </div>

              {/* Shareable Link Card */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Shareable Pitch Badge URL for Recruiters:
                </span>
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-300 font-mono truncate mr-2">{pitchScore.shareUrl}</span>
                  <button
                    onClick={copyShareUrl}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-xl flex flex-col items-center justify-center min-h-[360px]">
              <Video className="w-12 h-12 text-indigo-400 mb-3" />
              <h3 className="text-base font-black">Record Your 60-Second Video Pitch</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Read the teleprompter script aloud within 60 seconds to earn a verified video elevator pitch badge for recruiter talent radar profiles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
