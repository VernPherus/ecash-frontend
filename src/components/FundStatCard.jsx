import React, { useEffect, useMemo } from "react";
import useFundStore from "../store/useFundStore";
import { formatCurrency } from "../lib/formatters";
import {
  Wallet,
  CheckCircle2,
  Ban,
  PieChart,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
} from "lucide-react";

const FundStatCard = ({
  fundId,
  totalNCA,
  totalDisbursements,
  totalMonthly,
  totalCashUtil,
  processedDVNum,
  cancelledDVNum,
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
    // Card container with corporate styling
    <div className="card-static group flex h-full flex-col overflow-hidden border border-base-200 bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4 bg-base-100 flex items-center justify-between border-b border-base-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-base-content leading-tight">
              {fundName}
            </h3>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-base-200 text-base-content/60 mt-1">
              {fundCode}
            </span>
          </div>
        </div>
      </div>

      {/* Main Metrics Section - Stacked with distinct theme colors */}
      <div className="p-6 space-y-4 flex-1">
        {/* NCA Received - PRIMARY (Green) */}
        <div className="relative overflow-hidden rounded-xl bg-primary/5 border border-primary/10 transition-colors">
          {/* Solid decorative bar on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-primary/20 text-primary">
                <ArrowDownRight className="w-3 h-3" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary/80">
                NCA Received
              </p>
            </div>
            <p className="text-2xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalNCA)}
            </p>
          </div>
        </div>

        {/* Total Disbursement - WARNING (Amber/Orange) */}
        <div className="relative overflow-hidden rounded-xl bg-warning/5 border border-warning/10 transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-warning/20 text-warning-content/80 lg:text-warning">
                <ArrowUpRight className="w-3 h-3" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-warning/80">
                Total Disbursement
              </p>
            </div>
            <p className="text-2xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalDisbursements)}
            </p>
          </div>
        </div>

        {/* Balance - INFO (Blue) */}
        <div className="relative overflow-hidden rounded-xl bg-info/5 border border-info/10 transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-info"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-info/20 text-info">
                <Activity className="w-3 h-3" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-info/80">
                Balance as of the Month
              </p>
            </div>
            <p className="text-2xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics - Grid Layout (Processed, Cancelled, Utilization) */}
      <div className="grid grid-cols-3 divide-x divide-base-200 border-t border-base-200 bg-base-50/80">
        {/* Processed Count */}
        <div className="py-4 px-2 flex flex-col items-center justify-center text-center hover:bg-base-100 transition-colors">
          <CheckCircle2 className="w-4 h-4 text-success mb-2" />
          <span className="text-xl font-bold text-base-content">
            {processedDVNum || 0}
          </span>
          <span className="text-[9px] font-bold text-base-content/40 uppercase mt-1 leading-tight">
            Processed
            <br />
            DVs
          </span>
        </div>

        {/* Cancelled Count */}
        <div className="py-4 px-2 flex flex-col items-center justify-center text-center hover:bg-base-100 transition-colors">
          <Ban className="w-4 h-4 text-error mb-2" />
          <span className="text-xl font-bold text-base-content">
            {cancelledDVNum || 0}
          </span>
          <span className="text-[9px] font-bold text-base-content/40 uppercase mt-1 leading-tight">
            Cancelled
            <br />
            DVs
          </span>
        </div>

        {/* Utilization Rate */}
        <div className="py-4 px-2 flex flex-col items-center justify-center text-center hover:bg-base-100 transition-colors">
          <PieChart className="w-4 h-4 text-secondary mb-2" />
          <span className="text-xl font-bold text-base-content">
            {totalCashUtil}%
          </span>
          <span className="text-[9px] font-bold text-base-content/40 uppercase mt-1 leading-tight">
            Cash
            <br />
            Utilization
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
