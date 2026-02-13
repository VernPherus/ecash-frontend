import React from "react";

const InfoCard = ({ icon: Icon, title, action, children, className = "" }) => {
  return (
    <div
      className={`bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden h-fit w-full ${className}`}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-base-200 flex items-center justify-between bg-base-200/50">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-base-200 text-primary">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <h3 className="font-bold text-xs text-base-content/70 uppercase tracking-wide">
            {title}
          </h3>
        </div>

        {/* Optional Action Button */}
        {action && <div>{action}</div>}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="space-y-0.5">{children}</div>
      </div>
    </div>
  );
};

export const InfoRow = ({ label, value, subValue, className = "" }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 py-2 first:pt-0 last:pb-0 border-b border-dashed border-base-200 last:border-0 ${className}`}
    >
      <span className="text-xs font-medium text-base-content/50 min-w-[120px] pt-1">
        {label}
      </span>
      <div className="text-sm sm:text-right flex-1 break-words min-w-0">
        <div className="font-medium text-base-content leading-snug">
          {value || "—"}
        </div>
        {subValue && (
          <div className="text-[11px] text-base-content/40 mt-0.5 leading-tight">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
