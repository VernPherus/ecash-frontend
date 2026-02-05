// src/components/FloatingNotification.jsx
import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck, Clock, Info } from "lucide-react";
import useNotifStore from "../store/useNotifStore"; // Ensure using useNotifStore
import { formatRelativeTime } from "../lib/formatters";

const FloatingNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Use useNotifStore actions and state
  const { notifs, unreadCount, getNotifs, markAsRead, markAllAsRead } =
    useNotifStore();

  // Fetch notifications on mount
  useEffect(() => {
    getNotifs();
  }, [getNotifs]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2"
    >
      {/* Trigger Button with Unread Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle shadow-xl ${isOpen ? "btn-neutral" : "btn-primary"}`}
      >
        <div className="indicator">
          {isOpen ? <X className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
          {!isOpen && unreadCount > 0 && (
            <span className="badge badge-error badge-sm indicator-item animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-80 sm:w-96 overflow-hidden flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/50">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-base-200">
            {notifs.length === 0 ? (
              <div className="p-8 text-center text-base-content/40 text-sm">
                No notifications yet
              </div>
            ) : (
              notifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`p-4 cursor-pointer hover:bg-base-200 transition-colors ${!notif.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <p
                      className={`text-sm ${!notif.isRead ? "font-bold" : "text-base-content/70"}`}
                    >
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-base-content/40">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(notif.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingNotification;
