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
<div className="card-static p-6 border-l-4 border-l-primary flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
      {/* Date Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-base-content/50 uppercase tracking-wider">
            Current Date
          </h2>
          <p className="text-xl md:text-2xl font-bold text-base-content">
            {formatDate(dateObj)}
          </p>
          <p className="text-xs text-base-content/60 font-medium mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateObj.toLocaleDateString("en-PH", { weekday: "long" })}
          </p>
        </div>
      </div>

      <div className="h-px w-full md:w-px md:h-12 bg-base-300 hidden md:block"></div>

      {/* Quarter Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
          <PieChart className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-base-content/50 uppercase tracking-wider">
            Fiscal Period
          </h2>
          <p className="text-xl md:text-2xl font-bold text-base-content">
            {quarter ? `Quarter ${quarter}` : "—"}
          </p>
          <p className="text-xs text-base-content/60 font-medium mt-0.5">
            FY {dateObj.getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardTimeStats;
