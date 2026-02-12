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
  cancelledLDDAPNum,
  cancelledCheckNum,
  month,
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
    // Card container
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

      {/* Main Metrics Section */}
      <div className="p-6 space-y-4 flex-1">
        {/* NCA Received - PRIMARY */}
        <div className="relative overflow-hidden rounded-xl bg-primary/5 border border-primary/10 transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-primary/20 text-primary">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              {/* Label made larger */}
              <p className="text-sm font-bold uppercase tracking-wide text-primary/80">
                Total NCA Received
              </p>
            </div>
            {/* Value made larger */}
            <p className="text-3xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalNCA)}
            </p>
          </div>
        </div>

        {/* Total Disbursement - WARNING */}
        <div className="relative overflow-hidden rounded-xl bg-warning/5 border border-warning/10 transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-warning/20 text-warning-content/80 lg:text-warning">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              {/* Label made larger */}
              <p className="text-sm font-bold uppercase tracking-wide text-warning/80">
                Total Disbursement
              </p>
            </div>
            {/* Value made larger */}
            <p className="text-3xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalDisbursements)}
            </p>
          </div>
        </div>

        {/* Balance - INFO (Prominent) */}
        {/* Added thicker border and slightly darker background for prominence */}
        <div className="relative overflow-hidden rounded-xl bg-info/10 border-2 border-info/20 shadow-sm transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-info"></div>
          <div className="p-5 pl-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-info/20 text-info">
                <Activity className="w-4 h-4" />
              </div>
              {/* Label made larger */}
              <p className="text-sm font-extrabold uppercase tracking-wide text-info">
                Cash Balance as of {month || "the Month"}
              </p>
            </div>
            {/* Value made significantly larger (4xl) */}
            <p className="text-4xl font-black tracking-tight text-base-content font-mono">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
        </div>

        {/* Cash Utilization - Styled as a sleek bar below Balance */}
        <div className="relative flex items-center justify-between p-3 rounded-lg bg-base-200/50 border border-base-200 overflow-hidden">
          {/* subtle background progress bar effect */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-secondary/5 z-0"
            style={{ width: `${Math.min(totalCashUtil, 100)}%` }}
          />

          <div className="flex items-center gap-3 z-10">
            <div className="p-1.5 rounded-full bg-base-100 shadow-sm text-secondary">
              <PieChart className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-base-content/70 uppercase">
              Cash Utilization
            </span>
          </div>

          <span className="text-lg font-black text-secondary z-10 font-mono">
            {totalCashUtil}%
          </span>
        </div>
      </div>

      {/* Secondary Metrics - Grid Layout (3 Columns) */}
      <div className="grid grid-cols-3 divide-x divide-base-200 border-t border-base-200 bg-base-50/80">
        {/* Processed Count */}
        <div className="py-4 px-2 flex flex-col items-center justify-center text-center hover:bg-base-100 transition-colors">
          <CheckCircle2 className="w-5 h-5 text-success mb-2" />
          <span className="text-xl font-bold text-base-content font-mono">
            {processedDVNum || 0}
          </span>
          <span className="text-[10px] font-bold text-base-content/40 uppercase mt-1 leading-tight">
            Processed
            <br />
            DVs
          </span>
        </div>

        {/* Cancelled LDDAP Count */}
        <div className="py-4 px-2 flex flex-col items-center justify-center text-center hover:bg-base-100 transition-colors">
          <Ban className="w-5 h-5 text-error mb-2" />
          <span className="text-xl font-bold text-base-content font-mono">
            {cancelledLDDAPNum || 0}
          </span>
          <span className="text-[10px] font-bold text-base-content/40 uppercase mt-1 leading-tight">
            Cancelled
            <br />
            LDDAP
          </span>
        </div>

        {/* Cancelled Check Count (New Field) */}
        <div className="py-4 px-2 flex flex-col items-center justify-center text-center hover:bg-base-100 transition-colors">
          <Ban className="w-5 h-5 text-warning mb-2" />
          <span className="text-xl font-bold text-base-content font-mono">
            {cancelledCheckNum || 0}
          </span>
          <span className="text-[10px] font-bold text-base-content/40 uppercase mt-1 leading-tight">
            Cancelled
            <br />
            Check
          </span>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
