import React, { useState } from "react";
import { X } from "lucide-react"; // Make sure you have this imported if you plan to use it, though I don't see it used in your snippet below, I'll keep it just in case.
import Lddap from "./disbursement_components/LDDAP";
import Check from "./disbursement_components/Check";

const DisbursementForm = ({ onClose }) => {
  const [mode, setMode] = useState("LDDAP");

  return (
    <div className="flex flex-col h-full bg-base-100 overflow-hidden">
      {/* --- FIXED HEADER SECTION --- */}
      <div className="flex-none bg-base-100 z-10 shrink-0">
        {/* Mode Selection (Radio Buttons) */}
        <div className="px-6 py-3 border-b border-base-200 bg-base-50/50 flex items-center gap-4">
          <span className="text-xs font-bold text-base-content/50 uppercase tracking-wide">
            Payment Mode:
          </span>

          <div className="flex items-center gap-6">
            <label className="cursor-pointer flex items-center gap-2 group">
              <input
                type="radio"
                name="payment_mode"
                className="radio radio-sm radio-primary"
                checked={mode === "LDDAP"}
                onChange={() => setMode("LDDAP")}
              />
              <span
                className={`text-sm font-medium transition-colors ${mode === "LDDAP" ? "text-primary font-bold" : "text-base-content/70 group-hover:text-base-content"}`}
              >
                LDDAP - ADA
              </span>
            </label>

            <label className="cursor-pointer flex items-center gap-2 group">
              <input
                type="radio"
                name="payment_mode"
                className="radio radio-sm radio-primary"
                checked={mode === "CHECK"}
                onChange={() => setMode("CHECK")}
              />
              <span
                className={`text-sm font-medium transition-colors ${mode === "CHECK" ? "text-primary font-bold" : "text-base-content/70 group-hover:text-base-content"}`}
              >
                Commercial Check
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* --- DYNAMIC FORM CONTENT --- */}
      {/* 1. overflow-y-auto: Enables scrolling on this specific container.
          2. flex-1: Takes up all remaining height.
          3. min-h-0: Vital for nested flex containers to scroll correctly.
      */}
      <div className="flex-1 overflow-y-auto relative min-h-0 custom-scrollbar">
        <div className="h-full">
          {mode === "LDDAP" && <Lddap onClose={onClose} />}
          {mode === "CHECK" && <Check onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default DisbursementForm;
