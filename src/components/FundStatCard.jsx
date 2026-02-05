import React, { useEffect, useMemo } from "react";
import useFundStore from "../store/useFundStore";
import { formatCurrency } from "../lib/formatters";
import { Wallet } from "lucide-react";

// Note: This component renders a SINGLE card for a specific fund.
// It is mapped over in DashboardPage.jsx
const FundStatCard = ({
  fundId,
  totalEntries,
  totalDisbursements,
  totalMonthly,
  totalCashUtil,
}) => {
  const { funds, fetchFunds, isLoading } = useFundStore();

  // Ensure funds are loaded to look up names
  useEffect(() => {
    if (funds.length === 0 && !isLoading) {
      fetchFunds();
    }
  }, [funds.length, fetchFunds, isLoading]);

  // Lookup Fund Details
  const fund = useMemo(() => {
    return funds.find((f) => Number(f.id) === Number(fundId));
  }, [funds, fundId]);

  const fundName = fund?.name || "Unknown Fund";
  const fundCode = fund?.code || `ID-${fundId}`;

  return (
    <div className="card-static group flex h-full flex-col overflow-hidden border border-base-200 bg-base-100 transition-all hover:border-primary/40 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4">
        <div className="flex-1 space-y-1">
          <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary">
            {fundCode}
          </span>
          <h3
            className="line-clamp-1 text-sm font-semibold text-base-content/90"
            title={fundName}
          >
            {fundName}
          </h3>
        </div>
        <Wallet className="w-5 h-5 text-base-content/20 group-hover:text-primary/40 transition-colors shrink-0" />
      </div>

      {/* Primary Metrics - Equal Visual Weight */}
      <div className="flex-1 px-5 space-y-6">
        {/* Monthly Total */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-base-content/50 mb-1.5">
            Monthly Total
          </p>
          <p className="text-2xl font-bold tracking-tight text-base-content">
            {formatCurrency(totalMonthly)}
          </p>
        </div>

        {/* Entries Total */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-base-content/50 mb-1.5">
            Entries Total
          </p>
          <p className="text-2xl font-bold tracking-tight text-base-content">
            {formatCurrency(totalEntries) || 0}
          </p>
        </div>

        {/* Cash Utilization */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-base-content/50 mb-1.5">
            Cash Utilization
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-base-content">
              {totalCashUtil}
            </span>
            <span className="text-lg font-semibold text-primary">%</span>
          </div>
        </div>
      </div>

      {/* Secondary Metric */}
      <div className="mt-auto px-5 pb-5 pt-4 border-t border-base-200">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
            Disbursed
          </span>
          <span className="text-sm font-semibold text-base-content/70">
            {formatCurrency(totalDisbursements)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
