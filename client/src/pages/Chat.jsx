import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { getSocket } from "../services/socket";
import { Send, User, CheckCheck, Video, Calendar, Sparkles, PhoneCall, Paperclip } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState(null);
  const bottomRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    // Fetch recipient user details
    api.get("/auth/me").then(() => {
      api.get(`/messages/${userId}`).then((res) => setMessages(res.data));
    });

    if (!socket) return;
    const handler = (msg) => {
      if (msg.senderId === userId || msg.receiverId === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("chat:receive", handler);
    return () => socket.off("chat:receive", handler);
  }, [userId, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (socket) {
      socket.emit("chat:send", { receiverId: userId, text });
    }

    // Local optimistic update
    const newMsg = {
      _id: Date.now().toString(),
      senderId: currentUser?.id,
      receiverId: userId,
      text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[82vh]">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold flex items-center justify-center text-sm shadow-md">
                <User className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Live Recruiter & Candidate Chat</h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Socket.io Real-Time Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://meet.jit.si/HireHubLiveInterviewRoom"
              target="_blank"
              rel="noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-sm"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Video Call</span>
            </a>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Sparkles className="w-10 h-10 mx-auto mb-2 text-indigo-400 animate-pulse" />
              <p className="font-bold text-slate-700 text-sm">Real-time messaging session initialized</p>
              <p className="text-xs text-slate-400 mt-1">Send a message to discuss application details and interview schedules.</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderId === currentUser?.id || m.senderId?.id === currentUser?.id;
              return (
                <div key={m._id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3.5 rounded-2xl max-w-sm text-xs font-medium leading-relaxed shadow-sm ${
                      isMine
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center space-x-1 mt-1 text-[10px] text-slate-400 px-1">
                    <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {isMine && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={send} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          <button
            disabled={!text.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-3 rounded-xl shadow-md transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
