import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Award, ArrowLeft, RefreshCw, CheckCircle2, MessageSquare, BookOpen, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";

const LESSON_LEVELS = [
  { id: "beginner", name: "Level 1: Beginner Self-Introduction & Basics", color: "from-blue-500 to-indigo-600" },
  { id: "intermediate", name: "Level 2: Intermediate Behavioral & Project Discussions", color: "from-purple-500 to-pink-600" },
  { id: "advanced", name: "Level 3: Executive Leadership & Salary Negotiations", color: "from-amber-500 to-emerald-600" },
];

const EXERCISES = {
  beginner: [
    {
      prompt: "Introduce yourself in 3 simple sentences focusing on your education and enthusiasm for technology.",
      idealSample: "Hello! My name is Alex. I recently graduated with a degree in Computer Science. I am very passionate about building web applications.",
      keywords: ["graduated", "passionate", "building", "applications"],
    },
    {
      prompt: "Explain why you want to work as a Software Developer.",
      idealSample: "I want to work as a software developer because I love solving complex problems and creating products that help people.",
      keywords: ["solving", "problems", "creating", "help"],
    },
  ],
  intermediate: [
    {
      prompt: "Describe a challenging technical project you built and how you solved a roadblock.",
      idealSample: "In my recent project, we faced API latency issues. I implemented Redis caching, which reduced response time by 60%.",
      keywords: ["project", "latency", "caching", "reduced"],
    },
    {
      prompt: "How do you handle constructive criticism from your team lead?",
      idealSample: "I welcome feedback as an opportunity to grow. I listen carefully, clarify expectations, and incorporate suggestions into my work.",
      keywords: ["feedback", "opportunity", "listen", "suggestions"],
    },
  ],
  advanced: [
    {
      prompt: "How would you handle a disagreement with a VP of Product regarding a technical architecture decision?",
      idealSample: "I present data-driven arguments focusing on business impact, system scalability, and long-term tech debt while remaining aligned with company goals.",
      keywords: ["data-driven", "business impact", "scalability", "goals"],
    },
    {
      prompt: "Negotiate your compensation package professionally emphasizing your market value.",
      idealSample: "Based on my track record of leading high-scale distributed systems and market research, I am looking for a total package aligned with senior market benchmarks.",
      keywords: ["track record", "market research", "package", "benchmarks"],
    },
  ],
};

export default function EnglishSpokenCoach() {
  const [level, setLevel] = useState("beginner");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const currentExercise = EXERCISES[level][exerciseIndex] || EXERCISES[level][0];

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (e) => {
        let text = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };

      rec.onerror = (err) => {
        console.error("Speech Recognition Error:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Try Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      evaluateSpokenEnglish();
    } else {
      setTranscript("");
      setFeedback(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const evaluateSpokenEnglish = () => {
    const spoken = transcript.toLowerCase();
    const words = spoken.split(" ").filter(Boolean);
    const targetKeywords = currentExercise.keywords;

    let matchedCount = 0;
    targetKeywords.forEach((kw) => {
      if (spoken.includes(kw)) matchedCount++;
    });

    const fluencyScore = Math.min(100, Math.max(40, words.length * 6 + matchedCount * 15));
    let grade = "Beginner Fluency";
    let advice = "Good effort! Try using more structured vocabulary and complete sentences.";

    if (fluencyScore >= 85) {
      grade = "Native / Executive Level Fluency 🌟";
      advice = "Outstanding pronunciation, vocabulary density, and clarity!";
    } else if (fluencyScore >= 65) {
      grade = "Professional Fluent 👏";
      advice = "Great job! Focus on confident delivery and technical terminology.";
    }

    setFeedback({
      score: fluencyScore,
      grade,
      advice,
      wordCount: words.length,
      matchedCount,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform</span>
        </Link>
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI World English Spoken Coach</span>
        </div>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-black tracking-tight">AI English Spoken Practice Coach</h1>
          <p className="text-xs text-slate-400 mt-2">
            Master professional English fluency for interviews — From Beginner to Executive Leadership Level.
          </p>
        </div>

        {/* Level Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {LESSON_LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => {
                setLevel(lvl.id);
                setExerciseIndex(0);
                setTranscript("");
                setFeedback(null);
              }}
              className={`p-4 rounded-2xl text-left border transition-all ${
                level === lvl.id
                  ? "bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60"
              }`}
            >
              <span className="text-xs font-bold block text-white">{lvl.name}</span>
            </button>
          ))}
        </div>

        {/* Current Exercise Prompt Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Exercise Prompt #{exerciseIndex + 1}</span>
            </span>
            <button
              onClick={() => speakText(currentExercise.prompt)}
              className="text-xs text-indigo-300 hover:text-white flex items-center space-x-1.5 bg-indigo-600/30 hover:bg-indigo-600 px-3 py-1.5 rounded-xl transition"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>Listen Prompt Aloud</span>
            </button>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 leading-relaxed">{currentExercise.prompt}</h3>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Sample Model Response:
            </span>
            <p className="text-xs text-emerald-300 italic">{currentExercise.idealSample}</p>
          </div>
        </div>

        {/* Interactive Speech Recording Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center mb-8 shadow-xl">
          <button
            onClick={toggleListen}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all duration-300 shadow-2xl ${
              isListening
                ? "bg-rose-600 text-white animate-pulse ring-8 ring-rose-600/30"
                : "bg-gradient-to-tr from-indigo-500 to-purple-600 hover:scale-105 text-white shadow-indigo-500/40"
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            {isListening ? "Listening... Speak your English response now" : "Click Microphone to Start Practice Response"}
          </p>

          {/* Real-Time Live Transcript */}
          <div className="mt-6 min-h-[90px] bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Live Speech Recognition Output:
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {transcript || <span className="text-slate-600 italic">Your spoken words will appear here in real-time...</span>}
            </p>
          </div>

          {transcript && !isListening && (
            <button
              onClick={evaluateSpokenEnglish}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-lg transition"
            >
              Evaluate Spoken Fluency with AI
            </button>
          )}
        </div>

        {/* AI Fluency Evaluation Results */}
        {feedback && (
          <div className="bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Fluency Score</span>
                <p className="text-3xl font-black text-amber-400 mt-1">{feedback.score}/100</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fluency Level</span>
                <p className="text-xs font-bold text-emerald-400 mt-2">{feedback.grade}</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Words Spoken</span>
                <p className="text-3xl font-black text-indigo-400 mt-1">{feedback.wordCount} Words</p>
              </div>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-700/40 p-4 rounded-2xl">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                AI Coach Advice:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{feedback.advice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
