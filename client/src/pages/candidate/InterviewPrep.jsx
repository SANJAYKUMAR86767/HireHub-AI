import React, { useState } from "react";
import api from "../../services/api";
import { Sparkles, Mic, Volume2, CheckCircle2, RotateCcw, Award, ArrowRight, MessageSquare, AlertCircle } from "lucide-react";

export default function InterviewPrep() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingF, setLoadingF] = useState(false);
  const [started, setStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const start = async () => {
    if (!role.trim()) return;
    setLoadingQ(true);
    try {
      const res = await api.post("/interview/questions", { role });
      setQuestions(res.data.questions || []);
      setCurrent(0);
      setHistory([]);
      setStarted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQ(false);
    }
  };

  // Web Speech API Voice Recognition (Browser Native)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // Text to Speech Question Reader
  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoadingF(true);
    try {
      const q = questions[current];
      const res = await api.post("/interview/feedback", { question: q.question, answer });
      setHistory((h) => [...h, { question: q.question, answer, ...res.data }]);
      setAnswer("");
      setCurrent((c) => c + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingF(false);
    }
  };

  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + (h.score || 0), 0) / history.length)
    : null;

  const isDone = started && current >= questions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl mb-8 border border-purple-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">AI Voice & Text Simulator</span>
        </div>
        <h1 className="text-2xl font-bold">Interactive AI Mock Interview</h1>
        <p className="text-xs text-purple-200 mt-1">
          Speak or type your answers to role-specific questions and get instant AI scoring & tailored recommendations.
        </p>
      </div>

      {!started && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 mb-2">Target Job Role / Title</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior React Developer, Full Stack Engineer, Product Manager..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 mb-4"
          />
          <button
            onClick={start}
            disabled={loadingQ || !role.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loadingQ ? "Generating Tailored Questions..." : "Start Mock Interview Session"}</span>
          </button>
        </div>
      )}

      {started && !isDone && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Question {current + 1} of {questions.length}
            </span>
            <button
              onClick={() => speakQuestion(questions[current]?.question)}
              className="text-xs font-semibold text-slate-600 hover:text-purple-600 flex items-center space-x-1.5 bg-slate-100 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition"
            >
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Read Question Aloud</span>
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug mb-4">
            {questions[current]?.question}
          </h3>

          <div className="relative mb-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Type your structured answer here, or click the mic button below to speak..."
              className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-3 bottom-4 p-2.5 rounded-xl border transition flex items-center space-x-1 text-xs font-semibold ${
                isListening
                  ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isListening ? "Listening..." : "Voice Input"}</span>
            </button>
          </div>

          <button
            onClick={submitAnswer}
            disabled={loadingF || !answer.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm flex items-center justify-center space-x-2"
          >
            <span>{loadingF ? "Evaluating AI Feedback..." : "Submit Answer & Next"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isDone && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-8 text-center shadow-xl mb-8">
          <div className="w-16 h-16 bg-purple-500/20 text-purple-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-400/30">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold">Mock Interview Completed!</h2>
          <p className="text-xs text-indigo-200 mt-1">Overall Performance Score</p>
          <div className="text-5xl font-extrabold text-amber-400 my-4">{avgScore}/100</div>
          <button
            onClick={() => {
              setStarted(false);
              setQuestions([]);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-3 rounded-xl transition inline-flex items-center space-x-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Session</span>
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">AI Evaluation & Answer Feedback</h3>
          {history.map((h, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="font-bold text-sm text-slate-900">
                  <span className="text-purple-600 mr-1.5">Q{i + 1}.</span> {h.question}
                </h4>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    h.score >= 75
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {h.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 italic">
                "{h.answer}"
              </p>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Improvement Tips:</span>
                <ul className="text-xs text-slate-700 space-y-1.5 pl-1">
                  {(h.tips || []).map((tip, ti) => (
                    <li key={ti} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
