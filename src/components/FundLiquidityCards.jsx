import React, { useEffect } from "react";
import useFundStore from "../store/useFundStore";

const FundLiquidityCards = ({
  fundId,
  totalEntries,
  totalDisbursements,
  totalMonthly,
  totalCashUtil,
}) => {
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

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <p>Fund: {fundId}</p>
        <p>Total Entries: {totalEntries}</p>
        <p>Total Disb: {totalDisbursements}</p>
        <p>Total Monthy: {totalMonthly}</p>
        <p>Total Cash Utilization: {totalCashUtil}</p>
      </div>
    </section>
  );
};

export default FundLiquidityCards;
