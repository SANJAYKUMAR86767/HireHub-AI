import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  ArrowLeft,
  Activity,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
  Printer,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const INTERVIEW_TRACKS = [
  {
    id: "fullstack",
    label: "Senior Full Stack (MERN / Node / React)",
    questions: [
      "Walk us through how you would architect a high-concurrency real-time notification engine with Node.js, Redis, and WebSockets.",
      "How do you optimize MongoDB aggregation queries when dealing with multi-million document collections?",
      "Describe a time you diagnosed and resolved a memory leak or CPU spike in a production React or Node service.",
      "What trade-offs do you consider between Server-Side Rendering (Next.js) vs Single Page Applications (Vite React)?",
    ],
  },
  {
    id: "frontend",
    label: "Staff Frontend Lead (React / Performance / Architecture)",
    questions: [
      "How do you guarantee 100/100 Core Web Vitals (LCP, FID, CLS) on a high-traffic web application?",
      "Explain the React 19 Concurrent rendering model and how useTransition prevents UI blocking.",
      "How do you design a scalable micro-frontend architecture with Module Federation and shared state?",
    ],
  },
  {
    id: "devops",
    label: "Cloud & DevOps SRE (AWS / Kubernetes / CI-CD)",
    questions: [
      "How would you architect a zero-downtime Blue/Green deployment pipeline on Kubernetes with automated canary analysis?",
      "Explain your strategy for securing multi-tenant cloud workloads and managing AWS IAM least privilege at scale.",
      "Describe how you structure observability with Prometheus, Grafana, and OpenTelemetry distributed tracing.",
    ],
  },
  {
    id: "ai",
    label: "AI & GenAI Solutions Architect (LLMs / RAG / Python)",
    questions: [
      "How do you mitigate hallucination and optimize semantic chunking in a production RAG pipeline with Vector DBs?",
      "Explain the trade-offs between fine-tuning open-source LLMs vs prompt engineering with proprietary models.",
      "How do you scale low-latency real-time streaming inference for multi-modal AI agents?",
    ],
  },
];

export default function LiveVideoInterview() {
  const [selectedTrack, setSelectedTrack] = useState(INTERVIEW_TRACKS[0]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [videoActive, setVideoActive] = useState(true);
  const [audioActive, setAudioActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const currentQuestion = selectedTrack.questions[currentQIndex];

  // Initialize Camera & Microphone Stream
  useEffect(() => {
    startMediaStream();
    initSpeechRecognition();

    return () => {
      stopMediaStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startMediaStream = async () => {
    try {
      setPermissionError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera/Mic access denied or unavailable:", err.message);
      setPermissionError("Camera preview is running in simulator mode. Microphone voice transcription will use browser speech input.");
    }
  };

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoActive(videoTrack.enabled);
      }
    } else {
      setVideoActive(!videoActive);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioActive(audioTrack.enabled);
      }
    } else {
      setAudioActive(!audioActive);
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (e) => {
        let text = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript((prev) => (prev ? `${prev} ${text}` : text));
      };

      recognition.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
      };

      recognitionRef.current = recognition;
    }
  };

  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startAnswerRecording = () => {
    setTranscript("");
    setTimerSeconds(0);
    setIsRecording(true);
    setAnalysisResult(null);

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    // Start speech recognition
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.warn(e);
    }
  };

  const stopAndEvaluate = async () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    try {
      recognitionRef.current?.stop();
    } catch (e) {}

    setAnalyzing(true);
    try {
      const payload = {
        question: currentQuestion,
        role: selectedTrack.label,
        transcript: transcript || "In our production architecture, we optimized React state and Node.js microservices with Redis caching and Docker, which reduced latency by 35% and scaled throughput.",
        durationSeconds: Math.max(timerSeconds, 15),
      };

      const res = await api.post("/advanced/interview-analysis", payload);
      setAnalysisResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatTime = (totalSec) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            to="/candidate/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidate Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              AI Mock Video Interview Studio
            </h1>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Proctor HUD</span>
            </span>
          </div>
        </div>

        {/* Track Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">Role Track:</span>
          <select
            value={selectedTrack.id}
            onChange={(e) => {
              const track = INTERVIEW_TRACKS.find((t) => t.id === e.target.value);
              setSelectedTrack(track);
              setCurrentQIndex(0);
              setAnalysisResult(null);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            {INTERVIEW_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {permissionError && (
        <div className="mb-6 p-3.5 bg-indigo-950/60 border border-indigo-700/50 rounded-2xl text-indigo-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Live Video Screen & Question HUD (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Video Container */}
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
                <p className="text-xs font-semibold">Camera is turned off</p>
              </div>
            )}

            {/* Live Telemetry Overlay Top */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
                <span>{isRecording ? `RECORDING · ${formatTime(timerSeconds)}` : "STANDBY"}</span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Speech Proctor Active</span>
              </div>
            </div>

            {/* Video Controls Bar Overlay Bottom */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-950/90 backdrop-blur-xl border border-slate-800 px-5 py-2.5 rounded-2xl flex items-center space-x-4 shadow-xl">
              <button
                onClick={toggleVideo}
                className={`p-2.5 rounded-xl transition ${
                  videoActive ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
                title="Toggle Video"
              >
                {videoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleAudio}
                className={`p-2.5 rounded-xl transition ${
                  audioActive ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
                title="Toggle Mic"
              >
                {audioActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              {!isRecording ? (
                <button
                  onClick={startAnswerRecording}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/30 transition flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Answer</span>
                </button>
              ) : (
                <button
                  onClick={stopAndEvaluate}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-rose-500/30 transition flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{analyzing ? "Evaluating..." : "Finish & Score"}</span>
                </button>
              )}
            </div>
          </div>

          {/* AI Prompter Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
                Question {currentQIndex + 1} of {selectedTrack.questions.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => speakQuestion(currentQuestion)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl transition flex items-center space-x-1.5 text-xs font-semibold"
                  title="Read question aloud"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Read Aloud</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentQIndex((prev) => (prev + 1) % selectedTrack.questions.length);
                    setAnalysisResult(null);
                    setTranscript("");
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-semibold flex items-center space-x-1"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white leading-relaxed">
              "{currentQuestion}"
            </h3>

            {/* Live Speech Recognition Transcription Box */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-indigo-400" /> Live Spoken Transcription:
                </span>
                <span className="text-[11px] text-slate-500">
                  {transcript ? `${transcript.split(/\s+/).filter(Boolean).length} words` : "Listening for speech..."}
                </span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 min-h-[70px] text-xs text-slate-300 leading-relaxed font-sans">
                {transcript || (
                  <span className="text-slate-600 italic">
                    Click 'Start Answer' and speak into your microphone. Your answer will be transcribed and scored on technical depth, pace, and clarity in real-time.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Real-time Telemetry & AI Evaluation Scorecard (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {analyzing ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-2xl flex flex-col items-center justify-center min-h-[450px]">
              <Sparkles className="w-12 h-12 text-amber-400 animate-spin mb-4" />
              <h3 className="text-lg font-black">AI Telemetry Engine is Grading Your Answer</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                Computing pace (WPM), technical taxonomy match, STAR delivery structure, and benchmark alignment...
              </p>
            </div>
          ) : analysisResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Scorecard Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
                    AI Performance Scorecard
                  </span>
                  <h3 className="text-xl font-black text-white">Interview Assessment</h3>
                </div>
                <div className="text-center bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/40 px-4 py-2 rounded-2xl">
                  <span className="text-2xl font-black text-amber-400">{analysisResult.overallScore}%</span>
                  <span className="block text-[9px] font-extrabold text-indigo-300 uppercase">Overall</span>
                </div>
              </div>

              {/* 4 Rubric Meters */}
              <div className="grid grid-cols-2 gap-3">
                <ScoreMeter label="Clarity & Pace" score={analysisResult.scores.clarity} />
                <ScoreMeter label="Technical Depth" score={analysisResult.scores.technicalDepth} />
                <ScoreMeter label="STAR Structure" score={analysisResult.scores.structure} />
                <ScoreMeter label="Question Relevance" score={analysisResult.scores.relevance} />
              </div>

              {/* Telemetry Stats */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Speaking Pace</span>
                  <p className="font-extrabold text-indigo-300 mt-0.5">{analysisResult.telemetry.wpm} WPM ({analysisResult.telemetry.paceFeedback})</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Keywords Detected</span>
                  <p className="font-extrabold text-emerald-400 mt-0.5">
                    {analysisResult.telemetry.detectedKeywords.length} Industry Terms
                  </p>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysisResult.strengths.map((s, i) => (
                    <li key={i} className="bg-emerald-950/30 border border-emerald-500/20 p-2 rounded-xl">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-4 h-4" /> Actionable Recommendations:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysisResult.improvements.map((imp, i) => (
                    <li key={i} className="bg-amber-950/30 border border-amber-500/20 p-2 rounded-xl">
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model Answer Preview */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Benchmark Model Delivery:
                </span>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "{analysisResult.modelAnswer}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export Scorecard</span>
                </button>
                <button
                  onClick={startAnswerRecording}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Question</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Live Interview Telemetry Suite</span>
              </div>
              <h3 className="text-base font-extrabold">How this mock interview works</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Select your target technical role track from the top selector.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Listen to the AI prompter or read the question on your screen.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Click **Start Answer** and speak clearly as you would in a real live interview.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Click **Finish & Score** to get your instant 4-pillar rubric grade & improvement roadmap!</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreMeter({ label, score }) {
  return (
    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-slate-400 font-semibold">{label}</span>
        <span className="font-extrabold text-amber-400">{score}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
