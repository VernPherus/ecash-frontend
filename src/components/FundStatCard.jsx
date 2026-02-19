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
    <div className="card-static group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] bg-white dark:bg-base-100 shadow-xl border border-gray-300 dark:border-base-300 border-t-[6px] border-t-orange-500 rounded-xl">
      {/* Header Section */}
      <div className="px-6 py-5 flex items-start justify-between bg-gray-50 dark:bg-base-200/50 border-b border-gray-200 dark:border-base-200">
        <div className="flex items-center gap-4 w-full">
          {/* Orange Wallet with Gradient */}
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md shadow-orange-500/30 flex items-center justify-center text-white border border-orange-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-gray-800 dark:text-base-content leading-tight truncate pr-2">
                {fundName}
              </h3>
              <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-orange-50 dark:bg-base-300 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400">
                {fundCode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* NCA Received - EMERALD (Lively Tint) */}
        <div className="relative overflow-hidden rounded-2xl bg-emerald-50/80 dark:bg-base-200 border border-emerald-200 dark:border-emerald-500/20 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="flex items-center p-4 pl-5 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 text-white shrink-0">
              <ArrowDownRight className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center min-w-0 items-start">
              {/* FIXED: White Background for Pop (Not Grey) */}
              <div className="mb-1 px-2 py-0.5 rounded-md bg-white dark:bg-base-300 border border-emerald-200 dark:border-transparent shadow-sm">
                <p className="text-sm lg:text-base font-bold uppercase tracking-wide text-emerald-800 dark:text-base-content/80 truncate">
                  Total NCA Received
                </p>
              </div>
              <p className="text-3xl font-black tracking-tight text-gray-800 dark:text-base-content font-mono leading-none">
                {formatCurrency(totalNCA)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Disbursement - AMBER (Lively Tint) */}
        <div className="relative overflow-hidden rounded-2xl bg-amber-50/80 dark:bg-base-200 border border-amber-200 dark:border-amber-500/20 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="flex items-center p-4 pl-5 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 text-white shrink-0">
              <ArrowUpRight className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center min-w-0 items-start">
              {/* FIXED: White Background for Pop (Not Grey) */}
              <div className="mb-1 px-2 py-0.5 rounded-md bg-white dark:bg-base-300 border border-amber-200 dark:border-transparent shadow-sm">
                <p className="text-sm lg:text-base font-bold uppercase tracking-wide text-amber-800 dark:text-base-content/80 truncate">
                  Total Disbursement
                </p>
              </div>
              <p className="text-3xl font-black tracking-tight text-gray-800 dark:text-base-content font-mono leading-none">
                {formatCurrency(totalDisbursements)}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Balance - BLUE (Lively Tint) */}
        <div className="relative overflow-hidden rounded-2xl bg-blue-50/80 dark:bg-base-200 border border-blue-200 dark:border-blue-500/20 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="flex items-center p-5 pl-5 gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20 text-white shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div className="flex flex-col justify-center min-w-0 items-start">
              {/* FIXED: White Background for Pop (Not Grey) */}
              <div className="mb-1 px-2 py-0.5 rounded-md bg-white dark:bg-base-300 border border-blue-200 dark:border-transparent shadow-sm">
                <p className="text-base lg:text-lg font-extrabold uppercase tracking-wide text-blue-800 dark:text-base-content/80 truncate">
                  Cash Balance as of {month || "Month"}
                </p>
              </div>
              <p className="text-4xl font-black tracking-tight text-gray-800 dark:text-base-content font-mono leading-none">
                {formatCurrency(totalMonthly)}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Utilization - VIOLET (Lively Gradient) */}
        <div className="relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-base-200 dark:to-base-200 border border-violet-200 dark:border-base-300 overflow-hidden shadow-sm">
          <div
            className="absolute left-0 top-0 bottom-0 bg-white/40 dark:bg-violet-900/10 z-0"
            style={{ width: `${Math.min(totalCashUtil, 100)}%` }}
          />
          {/* Violet Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-1.5 bg-violet-600 z-10"
            style={{ width: `${Math.min(totalCashUtil, 100)}%` }}
          ></div>

          <div className="flex items-center gap-3 z-10">
            <div className="p-2 rounded-full bg-white dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 shadow-sm">
              <PieChart className="w-5 h-5" />
            </div>
            {/* Darker Text for Contrast */}
            <span className="text-base font-bold text-violet-900 dark:text-base-content/80 uppercase">
              Cash Utilization
            </span>
          </div>

          <span className="text-2xl font-black text-violet-800 dark:text-violet-400 z-10 font-mono">
            {totalCashUtil}%
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 dark:bg-base-300 my-1"></div>

        {/* Secondary Metrics - Footer Items (Lively Gradients) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Processed DV - AMBER/ORANGE Gradient */}
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-base-200 dark:to-base-200 border border-amber-200 dark:border-amber-500/20 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-amber-600 mb-2" />
            <span className="text-2xl font-black text-amber-900 dark:text-base-content font-mono leading-none">
              {processedDVNum || 0}
            </span>
            {/* Colored Label (No Background, just text color) */}
            <span className="text-sm font-bold text-amber-800 dark:text-base-content uppercase mt-2 leading-tight">
              Processed DV
            </span>
          </div>

          {/* Cancelled LDDAP Count - ROSE/RED Gradient */}
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 dark:from-base-200 dark:to-base-200 border border-rose-200 dark:border-rose-500/20 shadow-sm">
            <Ban className="w-6 h-6 text-rose-600 mb-2" />
            <span className="text-2xl font-black text-rose-900 dark:text-base-content font-mono leading-none">
              {cancelledLDDAPNum || 0}
            </span>
            {/* Colored Label */}
            <span className="text-sm font-bold text-rose-800 dark:text-base-content uppercase mt-2 leading-tight">
              Cancelled LDDAP
            </span>
          </div>

          {/* Cancelled Check Count - ROSE/RED Gradient */}
          <div className="py-4 px-2 flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 dark:from-base-200 dark:to-base-200 border border-rose-200 dark:border-rose-500/20 shadow-sm">
            <Ban className="w-6 h-6 text-rose-600 mb-2" />
            <span className="text-2xl font-black text-rose-900 dark:text-base-content font-mono leading-none">
              {cancelledCheckNum || 0}
            </span>
            {/* Colored Label */}
            <span className="text-sm font-bold text-rose-800 dark:text-base-content uppercase mt-2 leading-tight">
              Cancelled Check
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
