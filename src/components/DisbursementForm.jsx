import React, { useState, useMemo } from "react";
import Lddap from "./disbursement_components/LDDAP";
import Check from "./disbursement_components/Check";

const DisbursementForm = ({ onClose, initialData }) => {
  const isEdit = Boolean(initialData?.id);
  const initialMode = useMemo(() => {
    if (!initialData?.method) return "LDDAP";
    return initialData.method === "CHECK" ? "CHECK" : "LDDAP";
  }, [initialData?.method]);

  const [mode, setMode] = useState(initialMode);

  return (
    <div className="flex flex-col h-full bg-base-100 overflow-hidden">
      {/* --- FIXED HEADER SECTION --- */}
      <div className="flex-none bg-base-100 z-10 shrink-0">
        <div
          className={`px-6 py-3 border-b border-base-200 bg-base-50/50 flex items-center gap-4 ${isEdit ? "opacity-70" : ""}`}
        >
          <span className="text-xs font-bold text-base-content/50 uppercase tracking-wide">
            Payment Mode:
          </span>

          <div className="flex items-center gap-6">
            <label
              className={`flex items-center gap-2 group ${isEdit ? "cursor-default" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name="payment_mode"
                className="radio radio-sm radio-primary"
                checked={mode === "LDDAP"}
                onChange={() => !isEdit && setMode("LDDAP")}
                disabled={isEdit}
              />
              <span
                className={`text-sm font-medium transition-colors ${mode === "LDDAP" ? "text-primary font-bold" : "text-base-content/70 group-hover:text-base-content"}`}
              >
                LDDAP
              </span>
            </label>

            <label
              className={`flex items-center gap-2 group ${isEdit ? "cursor-default" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name="payment_mode"
                className="radio radio-sm radio-primary"
                checked={mode === "CHECK"}
                onChange={() => !isEdit && setMode("CHECK")}
                disabled={isEdit}
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
      <div className="flex-1 overflow-hidden relative min-h-0">
        {mode === "LDDAP" && (
          <Lddap onClose={onClose} initialData={isEdit ? initialData : undefined} />
        )}
        {mode === "CHECK" && (
          <Check onClose={onClose} initialData={isEdit ? initialData : undefined} />
        )}
      </div>
    </div>
  );
};

export default DisbursementForm;
