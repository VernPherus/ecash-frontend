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
    <div className="card-static group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] bg-base-100 border border-base-200 border-t-[6px] border-t-orange-500 rounded-xl">
      {/* Header Section */}
      <div className="px-6 py-5 flex items-start justify-between bg-base-200/50 border-b border-base-200">
        <div className="flex items-center gap-4 w-full">
          {/* Accent: Orange Icon Background - FIXED FOR DARK MODE */}
          <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-50 dark:bg-orange-500/10 shadow-sm flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-base-content leading-tight truncate pr-2">
                {fundName}
              </h3>
              {/* Accent: Orange Badge - FIXED FOR DARK MODE */}
              <span className="shrink-0 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-white dark:bg-base-300 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 shadow-sm">
                {fundCode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* NCA Received */}
        <div className="relative overflow-hidden rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
          <div className="flex items-center p-4 pl-5 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-base-100/60 dark:bg-base-200/20 text-primary shadow-sm backdrop-blur-sm shrink-0">
              <ArrowDownRight className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-lg font-bold uppercase tracking-wide text-base-content mb-0.5 truncate">
                Total NCA Received
              </p>
              <p className="text-3xl font-bold tracking-tight text-base-content font-mono leading-none">
                {formatCurrency(totalNCA)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Disbursement */}
        <div className="relative overflow-hidden rounded-xl bg-warning/15 border border-warning/30 shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-warning"></div>
          <div className="flex items-center p-4 pl-5 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-base-100/60 dark:bg-base-200/20 text-warning-content/80 lg:text-warning shadow-sm backdrop-blur-sm shrink-0">
              <ArrowUpRight className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-lg font-bold uppercase tracking-wide text-base-content mb-0.5 truncate">
                Total Disbursement
              </p>
              <p className="text-3xl font-bold tracking-tight text-base-content font-mono leading-none">
                {formatCurrency(totalDisbursements)}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="relative overflow-hidden rounded-xl bg-info/15 border-2 border-info/30 shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-info"></div>
          <div className="flex items-center p-5 pl-5 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-base-100/60 dark:bg-base-200/20 text-info shadow-sm backdrop-blur-sm shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-xl font-extrabold uppercase tracking-wide text-base-content mb-0.5 truncate">
                Cash Balance as of {month || "Month"}
              </p>
              <p className="text-4xl font-black tracking-tight text-base-content font-mono leading-none">
                {formatCurrency(totalMonthly)}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Utilization */}
        <div className="relative flex items-center justify-between p-4 rounded-xl bg-base-200 border border-base-300 overflow-hidden shadow-sm">
          <div
            className="absolute left-0 top-0 bottom-0 bg-secondary/10 z-0"
            style={{ width: `${Math.min(totalCashUtil, 100)}%` }}
          />

          <div className="flex items-center gap-3 z-10">
            <div className="p-2 rounded-full bg-base-100 shadow-sm text-secondary">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-base-content/80 uppercase">
              Cash Utilization
            </span>
          </div>

          <span className="text-2xl font-black text-secondary z-10 font-mono">
            {totalCashUtil}%
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-base-200 my-1"></div>

        {/* Secondary Metrics - Footer Items */}
        <div className="grid grid-cols-3 gap-3">
          {/* Processed Count */}
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center rounded-xl bg-warning/10 border border-warning/30 shadow-sm transition-all duration-300">
            <CheckCircle2 className="w-7 h-7 text-success mb-2" />
            <span className="text-2xl font-black text-base-content font-mono leading-none">
              {processedDVNum || 0}
            </span>
            <span className="text-sm font-bold text-base-content uppercase mt-2 leading-tight">
              Processed
            </span>
          </div>

          {/* Cancelled LDDAP Count */}
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center rounded-xl bg-red-500/10 border border-red-500/20 shadow-sm transition-all duration-300">
            <Ban className="w-7 h-7 text-red-600 mb-2" />
            <span className="text-2xl font-black text-base-content font-mono leading-none">
              {cancelledLDDAPNum || 0}
            </span>
            <span className="text-sm font-bold text-base-content uppercase mt-2 leading-tight">
              Cancelled LDDAP
            </span>
          </div>

          {/* Cancelled Check Count */}
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center rounded-xl bg-red-500/10 border border-red-500/20 shadow-sm transition-all duration-300">
            <Ban className="w-7 h-7 text-red-600 mb-2" />
            <span className="text-2xl font-black text-base-content font-mono leading-none">
              {cancelledCheckNum || 0}
            </span>
            <span className="text-sm font-bold text-base-content uppercase mt-2 leading-tight">
              Cancelled Check
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
