import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Bell } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const Header = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
            , {authUser?.firstName || "User"}
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="btn btn-ghost btn-circle relative">
            <Bell className="w-5 h-5" />
          </button>
          {/* New Entry Button */}
          <button
            onClick={() => navigate("/disbursement/new")}
            className="btn btn-primary gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Record</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
