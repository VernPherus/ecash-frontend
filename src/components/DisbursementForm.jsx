import React, { useState } from "react";
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
                LDDAP
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
                Check
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* --- DYNAMIC FORM CONTENT --- */}
      {/* We use 'overflow-hidden' here because the child components (Lddap/Check) 
          are already set to 'h-full' with their own internal 'overflow-y-auto'.
          This ensures the header stays sticky and only the form body scrolls.
      */}
      <div className="flex-1 overflow-hidden relative min-h-0">
        {mode === "LDDAP" && <Lddap onClose={onClose} />}
        {mode === "CHECK" && <Check onClose={onClose} />}
      </div>
    </div>
  );
};

export default DisbursementForm;
