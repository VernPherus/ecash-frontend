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

  useEffect(() => {
    if (funds.length === 0 && !isLoading) {
      fetchFunds();
    }
  }, [funds.length, fetchFunds, isLoading]);

  const fund = useMemo(() => {
    return funds.find((f) => Number(f.id) === Number(fundId));
  }, [funds, fundId]);

  const fundName = fund?.name || "Unknown Fund";
  const fundCode = fund?.code || `ID-${fundId}`;

  return (
    <div className="card-static group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-medium">
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-base-200">
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

      {/* Main Content Section */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* NCA Received - PRIMARY */}
        <div className="relative overflow-hidden rounded-xl bg-primary/10 border border-primary/20 shadow-sm transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-base-100/50 text-primary shadow-sm backdrop-blur-sm">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold uppercase tracking-wide text-base-content/70">
                Total NCA Received
              </p>
            </div>
            <p className="text-3xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalNCA)}
            </p>
          </div>
        </div>

        {/* Total Disbursement - WARNING */}
        <div className="relative overflow-hidden rounded-xl bg-warning/15 border border-warning/30 shadow-sm transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning"></div>
          <div className="p-4 pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-base-100/50 text-warning-content/80 lg:text-warning shadow-sm backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold uppercase tracking-wide text-base-content/70">
                Total Disbursement
              </p>
            </div>
            <p className="text-3xl font-bold tracking-tight text-base-content font-mono">
              {formatCurrency(totalDisbursements)}
            </p>
          </div>
        </div>

        {/* Balance - INFO */}
        <div className="relative overflow-hidden rounded-xl bg-info/15 border-2 border-info/30 shadow-sm transition-colors">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-info"></div>
          <div className="p-5 pl-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-base-100/50 text-info shadow-sm backdrop-blur-sm">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-base-content/80">
                Cash Balance as of {month || "the Month"}
              </p>
            </div>
            <p className="text-4xl font-black tracking-tight text-base-content font-mono">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
        </div>

        {/* Cash Utilization */}
        <div className="relative flex items-center justify-between p-3 rounded-lg bg-base-200 border border-base-300 overflow-hidden shadow-sm">
          <div
            className="absolute left-0 top-0 bottom-0 bg-secondary/10 z-0"
            style={{ width: `${Math.min(totalCashUtil, 100)}%` }}
          />

          <div className="flex items-center gap-3 z-10">
            <div className="p-1.5 rounded-full bg-base-100 shadow-sm text-secondary">
              <PieChart className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-base-content/80 uppercase">
              Cash Utilization
            </span>
          </div>

          <span className="text-lg font-black text-secondary z-10 font-mono">
            {totalCashUtil}%
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-base-200 my-1"></div>

        {/* Secondary Metrics - Footer Items */}
        <div className="grid grid-cols-3 gap-3">
          {/* Processed Count */}
          <div className="py-3 px-2 flex flex-col items-center justify-center text-center rounded-xl bg-warning/10 border border-warning/30 shadow-sm transition-all duration-300">
            <CheckCircle2 className="w-4 h-4 text-success mb-1.5" />
            <span className="text-lg font-bold text-base-content font-mono leading-none">
              {processedDVNum || 0}
            </span>
            <span className="text-[9px] font-bold text-base-content uppercase mt-1 leading-tight">
              Processed
            </span>
          </div>

          {/* Cancelled LDDAP Count */}
          <div className="py-3 px-2 flex flex-col items-center justify-center text-center rounded-xl bg-warning/10 border border-warning/30 shadow-sm transition-all duration-300">
            <Ban className="w-4 h-4 text-error mb-1.5" />
            <span className="text-lg font-bold text-base-content font-mono leading-none">
              {cancelledLDDAPNum || 0}
            </span>
            <span className="text-[9px] font-bold text-base-content uppercase mt-1 leading-tight">
              Cancelled LDDAP
            </span>
          </div>

          {/* Cancelled Check Count */}
          <div className="py-3 px-2 flex flex-col items-center justify-center text-center rounded-xl bg-warning/10 border border-warning/30 shadow-sm transition-all duration-300">
            <Ban className="w-4 h-4 text-warning mb-1.5" />
            <span className="text-lg font-bold text-base-content font-mono leading-none">
              {cancelledCheckNum || 0}
            </span>
            <span className="text-[9px] font-bold text-base-content uppercase mt-1 leading-tight">
              Cancelled Check
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
