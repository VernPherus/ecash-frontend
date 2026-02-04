import React from "react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const Header = () => {
  const location = useLocation();

  /**
   * Dynamic Title Mapping
   * Maps routes to readable titles for the header.
   */
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/" || path === "/dashboard") return "Dashboard Overview";
    if (path.startsWith("/disbursement/new")) return "Disbursement";
    if (path.startsWith("/disbursement/edit")) return "Edit Disbursement";
    if (path.startsWith("/disbursement/")) return "Transaction Details";
    if (path === "/funds") return "Fund Management";
    if (path === "/payees") return "Payee Directory";
    if (path === "/profile") return "Account Profile";
    if (path === "/settings") return "System Settings";
    if (path === "/admin/users") return "User Management";
    if (path === "/admin/logs") return "System Logs";
    if (path === "/admin/signup") return "Register New User";

    return "eCash System";
  };

  return (
    <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Dynamic Title Section */}
        <div>
          <h1 className="text-xl font-bold text-base-content tracking-tight uppercase">
            {getPageTitle()}
          </h1>
          <div className="h-1 w-12 bg-primary rounded-full mt-1" />
        </div>

        {/* Minimal Actions Section */}
        <div className="flex items-center gap-3">
          {/* Only the Notification Bell is displayed here now */}
          <NotificationDropdown align="right" />
        </div>
      </div>
    </header>
  );
};

export default Header;
