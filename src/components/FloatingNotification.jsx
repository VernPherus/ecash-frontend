import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import useNotificationStore from "../store/useNotificationStore";
import NotificationDropdown from "./NotificationDropdown"; // Reusing your existing dropdown logic

const FloatingNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Access store for unread count
//   const { unreadCount, fetchNotifications } = useNotificationStore();

  // Initial fetch
//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

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
            <NotificationDropdown isFloating={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotification;
