import React, { useEffect, useMemo } from "react";
import useFundStore from "../store/useFundStore";
import { formatCurrency } from "../lib/formatters";
import { Wallet, FileText, TrendingUp, Activity, Banknote } from "lucide-react";

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
    <div className="card-static p-0 overflow-hidden flex flex-col h-full border border-base-300 hover:border-primary/50 transition-colors group">
      {/* Header */}
      <div className="px-5 py-4 border-b border-base-200 bg-base-50/50 group-hover:bg-primary/5 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-sm font-mono font-bold bg-primary text-white border-none">
                {fundCode}
              </span>
            </div>
            <h3
              className="font-bold text-base-content line-clamp-1"
              title={fundName}
            >
              {fundName}
            </h3>
          </div>
          <div className="p-2 rounded-lg bg-base-200 text-primary/80">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
        {/* Total Cash Util (Highlighted) */}
        <div className="col-span-2">
          <p className="text-xs font-bold text-base-content/50 uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5" />
            Cash Utilization
          </p>
          <p className="text-xl font-bold text-primary tracking-tight">
            {formatCurrency(totalCashUtil)}
          </p>
        </div>

        {/* Entries */}
        <div>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wide mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Entries
          </p>
          <p className="font-semibold text-base-content">{totalEntries || 0}</p>
        </div>

        {/* Disbursements */}
        <div>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wide mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Disbursed
          </p>
          <p className="font-semibold text-base-content">
            {formatCurrency(totalDisbursements)}
          </p>
        </div>

        {/* Monthly (Full Width if needed, or keeping grid) */}
        <div className="col-span-2 pt-2 border-t border-dashed border-base-200">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wide flex items-center gap-1">
              <Banknote className="w-3 h-3" /> Monthly Total
            </p>
            <p className="font-mono font-medium text-sm text-base-content/80">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
