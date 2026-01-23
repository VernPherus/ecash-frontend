import React, { useState } from "react";
import { PlusCircle, Bell, X } from "lucide-react"; // Added X icon
import useAuthStore from "../store/useAuthStore";
import NotificationDropdown from "./NotificationDropdown"; // Assuming this exists or is a placeholder
import DisbursementForm from "../components/DisbursementForm"; // Import the form component

const Header = () => {
  const { authUser } = useAuthStore();

  // Local state to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Greeting Section */}
          <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 18
                  ? "afternoon"
                  : "evening"}
              , {authUser?.firstName || "User"}
            </h1>
            <p className="text-sm text-base-content/60 mt-0.5 font-medium">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary">
              <Bell className="w-5 h-5" />
            </button>

            {/* New Entry Button - Triggers Modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary gap-2 shadow-lg shadow-primary/20 transition-transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">New Record</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />

          {/* --- MODAL OVERLAY --- */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Container */}
              <div className="relative w-full max-w-3xl bg-base-100 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn border border-base-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50 shrink-0">
                  <h3 className="text-lg font-bold text-base-content">
                    Create New Disbursement
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:bg-base-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body (The Form) - UPDATED */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                  <DisbursementForm onClose={() => setIsModalOpen(false)} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
