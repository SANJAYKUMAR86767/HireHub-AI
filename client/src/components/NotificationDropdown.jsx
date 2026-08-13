import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, Calendar, Sparkles, Briefcase, Award, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch notifications from server
    api
      .get("/advanced/notifications")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setNotifications(res.data);
          const unread = res.data.filter((n) => !n.read).length;
          setUnreadCount(unread);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // Close on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type) => {
    switch (type) {
      case "interview":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case "candidate_match":
      case "job_match":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "badge":
        return <Award className="w-4 h-4 text-emerald-400" />;
      default:
        return <Briefcase className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition"
        title="Live Notification Feed"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-200 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Dropdown Header */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xs text-white">Live Activity Feed</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-full font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-900">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link || "/"}
                  onClick={() => setOpen(false)}
                  className={`p-3.5 block hover:bg-slate-900/80 transition ${
                    !n.read ? "bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{n.title}</h4>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.desc}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              Real-Time WebSocket & Push Notification Sync
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
