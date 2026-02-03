import React from "react";
import { formatDate } from "../lib/formatters";
import { Calendar, PieChart, Clock } from "lucide-react";

/**
 * DISPLAYS DASHBOARD STATS:
 * TIME:
 * - Current date
 * - Quarter
 */

function DashboardTimeStats({ currentDate, quarter }) {
  const dateObj = currentDate ? new Date(currentDate) : new Date();

  return (
    <div className="card-static p-4 border-l-4 border-l-primary flex items-center justify-between gap-4 animate-fade-in-up">
      {/* Date Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
            Current Date
          </h2>
          <p className="text-lg font-bold text-base-content leading-tight">
            {formatDate(dateObj)}
          </p>
          <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {dateObj.toLocaleDateString("en-PH", { weekday: "long" })}
          </p>
        </div>
      </div>

      <div className="w-px h-10 bg-base-300"></div>

      {/* Quarter Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
          <PieChart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
            Fiscal Period
          </h2>
          <p className="text-lg font-bold text-base-content leading-tight">
            {quarter ? `Quarter ${quarter}` : "—"}
          </p>
          <p className="text-xs text-base-content/60 mt-0.5">
            FY {dateObj.getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardTimeStats;
