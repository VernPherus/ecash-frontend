import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Shield,
  FileText,
  UserPlus,
  Sun,
  Moon,
  TrendingUp,
  PlusCircleIcon,
} from "lucide-react";
import dostSeal from "../assets/dost_seal.svg";

import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      section: "Management",
      items: [
        { path: "/", icon: LayoutDashboard, label: "Dashboard" },
        {
          path: "/disbursement/new",
          icon: PlusCircleIcon,
          label: "Disbursements",
        },
        { path: "/funds", icon: Wallet, label: "Fund Sources" },
        { path: "/payees", icon: Users, label: "Payees" },
      ],
    },
    {
      section: "Administration",
      items: [
        {
          path: "/admin/users",
          icon: Shield,
          label: "User Manager",
          adminOnly: true,
        },
        {
          path: "/admin/logs",
          icon: FileText,
          label: "Activity Logs",
          adminOnly: true,
        },
        {
          path: "/admin/signup",
          icon: UserPlus,
          label: "Add User",
          adminOnly: true,
        },
      ],
    },
    {
      section: "Account",
      items: [
        { path: "/profile", icon: User, label: "Profile" },
        { path: "/settings", icon: Settings, label: "Settings" },
      ],
    },
  ];

  // Filter admin-only items based on user role
  const filteredNavItems = navItems
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.adminOnly && authUser?.role !== "ADMIN") return false;
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={`
        ${isCollapsed ? "w-20" : "w-72"}
        bg-slate-900 text-white flex flex-col shadow-2xl
        transition-all duration-300 ease-in-out
        relative z-20
      `}
    >
      {/* Logo Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary shrink-0 p-1">
          <img
            src={dostSeal}
            alt="DOST Seal"
            className="w-full h-full object-contain"
          />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in-up">
            <span className="text-xl font-bold tracking-tight">
              DOST 1 - eCash
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-hidden">
        {filteredNavItems.map((section) => (
          <div key={section.section}>
            {!isCollapsed && (
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                {section.section}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""} ${isCollapsed ? "justify-center px-0" : ""}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} className="shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 py-2 border-t border-slate-800">
        <button
          onClick={toggleTheme}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg
            text-slate-400 hover:bg-slate-800 hover:text-white
            transition-all duration-200
            ${isCollapsed ? "justify-center px-0" : ""}
          `}
          title={isCollapsed ? "Toggle Theme" : undefined}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          )}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-800">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
            {authUser?.firstName?.[0] || "U"}
            {authUser?.lastName?.[0] || ""}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {authUser?.firstName} {authUser?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {authUser?.role || "User"}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          absolute -right-3 top-20 w-6 h-6
          bg-slate-800 border border-slate-700 rounded-full
          flex items-center justify-center
          text-slate-400 hover:text-white hover:bg-primary
          transition-all duration-200
          shadow-lg
        "
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
