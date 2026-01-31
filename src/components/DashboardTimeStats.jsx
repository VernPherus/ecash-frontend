import React from "react";
import { formatDate } from "../lib/formatters";

/**
 * DISPLAYS DASHBOARD STATS:
 * TIME:
 * - Current date
 * - Quarter
 */

function DashboardTimeStats({ currentDate, quarter }) {
  return (
    <div className="">
      {/* Time  */}
      <h1 className="card-title">Time</h1>
      <p>Current date: {formatDate(currentDate)}</p>
      <p>Quarter: {quarter}</p>
    </div>
  );
}

export default DashboardTimeStats;
