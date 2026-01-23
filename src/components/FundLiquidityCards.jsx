import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, PieChart } from "lucide-react";
import useFundStore from "../store/useFundStore";
import { formatCurrency } from "../lib/formatters";

const FundLiquidityCards = () => {
  const navigate = useNavigate();
  const { dashboard, fetchDashboardStats, isLoading, getFundColor } =
    useFundStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-base-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Fallback if no data
  if (!dashboard.funds?.length && !dashboard.totals) {
    return null;
  }

  // Calculate Global Utilization for the Total Card
//   const globalUtilization = dashboard.totals
//     ? (dashboard.totals.totalSpent / dashboard.totals.totalBudget) * 100
//     : 0;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-semibold text-base-content flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          Fund Overview
        </h2>
        <button
          onClick={() => navigate("/funds")}
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* --- TOTAL SUMMARY CARD --- */}
        {dashboard.totals && (
          // CHANGED: Replaced 'bg-primary' with a deep gradient and added a subtle border
          <div className="bg-linear-to-br from-indigo-600 to-violet-600 text-white rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center border border-indigo-400/20">
            {/* Background decoration - Adjusted opacity for the new dark background */}
            <PieChart className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10" />

            <div className="relative z-10 text-center">
              {/* CHANGED: Adjusted text opacity for better contrast on dark gradient */}
              <p className="text-xs font-medium text-indigo-100/80 uppercase tracking-widest mb-1">
                Total Remaining
              </p>
              <h3 className="text-3xl font-bold tracking-tight mb-2">
                {formatCurrency(dashboard.totals.totalRemaining)}
              </h3>
            </div>
          </div>
        )}

        {/* --- INDIVIDUAL FUND CARDS (Minimal & Centered) --- */}
        {dashboard.funds.slice(0, 5).map((fund, index) => {
          const isCritical = fund.utilizationRate >= 95;
          const badgeClass = getFundColor(index);

          return (
            <div
              key={fund.id}
              onClick={() => navigate(`/funds/${fund.id}`)}
              className="group bg-base-100 hover:bg-base-50 border border-base-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              {/* 1. Badge (Pill) */}
              <span
                className={`badge ${badgeClass} badge-sm border-none text-white font-bold shadow-sm mb-3`}
              >
                {fund.code}
              </span>

              {/* 2. Big Amount */}
              <h3
                className={`text-2xl font-bold tracking-tight mb-1 ${
                  isCritical ? "text-error" : "text-base-content"
                }`}
              >
                {formatCurrency(fund.remaining)}
              </h3>

              {/* 3. Name (Subtle) */}
              <p className="text-xs text-base-content/50 font-medium truncate max-w-full px-2">
                {fund.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FundLiquidityCards;
