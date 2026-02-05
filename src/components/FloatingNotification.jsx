import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import useNotificationStore from "../store/useNotificationStore";
import { formatRelativeTime } from "../lib/formatters";

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
};

const typeStyles = {
  info: "text-info bg-info/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
  error: "text-error bg-error/10",
};

const FloatingNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Access store for unread count
  //   const { unreadCount, fetchNotifications } = useNotificationStore();

  // Initial fetch
  //   useEffect(() => {
  //     fetchNotifications();
  //   }, [fetchNotifications]);
  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2"
    >
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle shadow-xl border border-base-content/10 transition-all duration-300 ${
          isOpen ? "btn-neutral rotate-90" : "btn-primary hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="indicator">
            <Bell className="w-6 h-6" />
            {/* {unreadCount > 0 && (
              <span className="badge badge-error badge-xs indicator-item animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )} */}
          </div>
        )}
      </button>

      {/* Dropdown Content */}
      <div
        className={`transition-all duration-300 ease-in-out origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-base-100 rounded-box shadow-2xl border border-base-200 w-80 sm:w-96 max-h-[80vh] overflow-hidden flex flex-col">
          {/* Reusing your existing component. 
              If NotificationDropdown has its own trigger/button, you might need to 
              extract just the 'list' part or pass a prop to hide its default trigger.
           */}
          <div className="p-2">
            <div
              className={`
                        absolute mt-2 w-80 sm:w-96 bg-base-100 border border-base-300 rounded-2xl shadow-elevated z-50 overflow-hidden animate-fade-in-up
                    `}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/50">
                <h3 className="font-semibold text-base-content flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-xs bg-error text-white px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-100 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-base-content/50">
                    <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No notifications</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-base-200">
                    {notifications.map((notification) => {
                      const TypeIcon = typeIcons[notification.type] || Info;
                      const typeStyle =
                        typeStyles[notification.type] || typeStyles.info;

                      return (
                        <div
                          key={notification.id}
                          className={`
                                                relative px-4 py-3 hover:bg-base-200/50 cursor-pointer
                                                transition-colors duration-200
                                                ${!notification.isRead ? "bg-primary/5" : ""}
                                            `}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            {/* Type Icon */}
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeStyle}`}
                            >
                              <TypeIcon className="w-4 h-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-sm font-medium truncate ${!notification.isRead ? "text-base-content" : "text-base-content/70"}`}
                                >
                                  {notification.title}
                                </p>
                                {/* Remove Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="p-1 rounded-lg hover:bg-base-300 text-base-content/40 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-xs text-base-content/60 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-base-content/40 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-base-300 bg-base-200/30">
                  <button
                    onClick={() => {
                      navigate("/notifications");
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotification;
