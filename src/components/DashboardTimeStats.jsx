import React from "react";
import { formatDate } from "../lib/formatters";
import { CalendarDays, PieChart, Clock } from "lucide-react";

/**
 * DISPLAYS DASHBOARD STATS:
 * TIME:
 * - Current date
 * - Quarter
 */

function DashboardTimeStats({ currentDate, quarter }) {
  const dateObj = currentDate ? new Date(currentDate) : new Date();

  return (
    // Converted to grid with gap to separate the cards completely
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      {/* Date Card */}
      <div className="group relative overflow-hidden bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
        {/* Decorative Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>

        <div className="flex items-center gap-6 pl-2">
          {/* Icon Container */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <CalendarDays className="w-8 h-8" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-1">
              Current Date
            </p>
            <h2 className="text-3xl font-bold text-base-content tracking-tight leading-none mb-1">
              {formatDate(dateObj)}
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium text-base-content/60">
              <Clock className="w-4 h-4" />
              <span>
                {dateObj.toLocaleDateString("en-PH", { weekday: "long" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quarter Card */}
      <div className="group relative overflow-hidden bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all duration-300">
        {/* Decorative Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>

        <div className="flex items-center gap-6 pl-2">
          {/* Icon Container */}
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
            <PieChart className="w-8 h-8" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-1">
              Fiscal Period
            </p>
            <h2 className="text-3xl font-bold text-base-content tracking-tight leading-none mb-1">
              {quarter ? `Quarter ${quarter}` : "—"}
            </h2>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-base-200 border border-base-300 text-base-content/60">
                FY {dateObj.getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTimeStats;
