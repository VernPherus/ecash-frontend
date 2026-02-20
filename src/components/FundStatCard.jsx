import React, { useEffect, useMemo } from "react";
import useFundStore from "../store/useFundStore";
import { formatCurrency } from "../lib/formatters";
import {
  Wallet,
  CheckCircle2,
  Ban,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ---------------------------------------------------------------------------
// Tooltips
// ---------------------------------------------------------------------------
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-base-100 border border-gray-200 dark:border-base-300 rounded-xl shadow-lg px-4 py-2 text-sm">
        <p className="font-bold text-gray-700 dark:text-base-content">
          {payload[0].name}
        </p>
        <p className="font-mono font-black text-gray-900 dark:text-base-content">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const filtered = payload.filter((e) => e.value > 0);
    if (!filtered.length) return null;
    return (
      <div className="bg-white dark:bg-base-100 border border-gray-200 dark:border-base-300 rounded-xl shadow-lg px-4 py-2 text-sm">
        <p className="font-bold text-gray-600 dark:text-base-content/70 mb-1">
          {label}
        </p>
        {filtered.map((entry) => (
          <p
            key={entry.name}
            className="font-mono font-bold"
            style={{ color: entry.fill }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
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
    if (funds.length === 0 && !isLoading) fetchFunds();
  }, [funds.length, fetchFunds, isLoading]);

  const fund = useMemo(
    () => funds.find((f) => Number(f.id) === Number(fundId)),
    [funds, fundId],
  );

  const fundName = fund?.name || "Unknown Fund";
  const fundCode = fund?.code || `ID-${fundId}`;

  // ── Donut data ────────────────────────────────────────────────────────────
  const remaining = Math.max(0, totalNCA - totalDisbursements);
  const donutData = [
    { name: "Total Disbursements", value: totalDisbursements },
    { name: "Remaining Balance", value: remaining },
  ];
  const DONUT_COLORS = ["#f59e0b", "#10b981"];

  // ── Gauge data ────────────────────────────────────────────────────────────
  const clampedUtil = Math.min(Math.max(totalCashUtil, 0), 100);
  const gaugeColor =
    clampedUtil >= 90 ? "#ef4444" : clampedUtil >= 70 ? "#f59e0b" : "#8b5cf6";
  const gaugeTrackColor =
    clampedUtil >= 90 ? "#fee2e2" : clampedUtil >= 70 ? "#fef3c7" : "#ede9fe";
  const gaugeTextColor =
    clampedUtil >= 90
      ? "text-red-600 dark:text-red-400"
      : clampedUtil >= 70
        ? "text-amber-600 dark:text-amber-400"
        : "text-violet-700 dark:text-violet-400";
  // ── Bar data ──────────────────────────────────────────────────────────────
  const barData = [
    { name: "Processed DV", count: processedDVNum || 0, fill: "#f59e0b" },
    { name: "Cancelled LDDAP", count: cancelledLDDAPNum || 0, fill: "#f43f5e" },
    { name: "Cancelled Check", count: cancelledCheckNum || 0, fill: "#fb7185" },
  ];

  return (
    <div className="group flex h-full flex-col overflow-hidden bg-white dark:bg-base-100 shadow-[0_4px_32px_rgba(0,0,0,0.13)] dark:shadow-xl border border-gray-200 dark:border-base-300 border-t-[6px] border-t-orange-500 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)]">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="px-6 py-5 flex items-center gap-4 bg-gray-50 dark:bg-base-200/50 border-b border-gray-200 dark:border-base-200">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md shadow-orange-500/30 flex items-center justify-center text-white">
          <Wallet className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <h3 className="font-bold text-xl text-gray-800 dark:text-base-content truncate">
            {fundName}
          </h3>
          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-orange-50 dark:bg-base-300 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400">
            {fundCode}
          </span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col gap-5 flex-1">

        {/* ── Top stats: Cash Balance (left) | NCA + Disbursements (right) ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* LEFT — Total Cash Balance: icon+label top, value bottom */}
          <div className="w-full rounded-2xl bg-blue-50 dark:bg-base-200 border border-blue-200 dark:border-blue-500/20 px-5 py-9 flex flex-col justify-between gap-4">
            {/* Top: icon + label */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-md shadow-blue-500/20 text-white">
                <TrendingUp className="w-7 h-7" />
              </div>
              <span className="text-2xl font-extrabold uppercase tracking-widest text-blue-700 dark:text-blue-400 leading-snug">
                Total Cash Balance as of {month || "Month"}
              </span>
            </div>
            {/* Bottom: value */}
            <span className="text-5xl font-black font-mono text-gray-800 dark:text-base-content leading-none">
              {formatCurrency(totalMonthly)}
            </span>
          </div>

          {/* RIGHT — NCA Received + Disbursements stacked */}
          <div className="flex flex-col gap-4">
            {/* Total NCA */}
            <div className="w-full rounded-2xl bg-emerald-50 dark:bg-base-200 border border-emerald-200 dark:border-emerald-500/20 px-5 py-4 flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/20 text-white shrink-0">
                <ArrowDownRight className="w-7 h-7" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-2xl font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 leading-none mb-1.5">
                  Total NCA Received
                </span>
                <span className="text-4xl font-black font-mono text-gray-800 dark:text-base-content leading-none truncate">
                  {formatCurrency(totalNCA)}
                </span>
              </div>
            </div>

            {/* Total Disbursements */}
            <div className="w-full rounded-2xl bg-amber-50 dark:bg-base-200 border border-amber-200 dark:border-amber-500/20 px-5 py-4 flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20 text-white shrink-0">
                <ArrowUpRight className="w-7 h-7" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-2xl font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 leading-none mb-1.5">
                  Total Disbursements
                </span>
                <span className="text-4xl font-black font-mono text-gray-800 dark:text-base-content leading-none truncate">
                  {formatCurrency(totalDisbursements)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row: Donut + Gauge side by side ──────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Donut — NCA Allocation Breakdown: legend LEFT, chart RIGHT */}
          <div className="rounded-2xl bg-gray-50 dark:bg-base-200 border border-gray-200 dark:border-base-300 p-5 flex flex-col">
            <p className="text-base font-bold uppercase tracking-widest text-gray-500 dark:text-base-content/50 mb-4">
              NCA Breakdown
            </p>
            <div className="flex flex-1 items-center gap-3">
              {/* Legend — left side */}
              <div className="flex flex-col gap-4 shrink-0 w-[45%]">
                {donutData.map((entry, i) => (
                  <div key={entry.name} className="flex items-start gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                      style={{ background: DONUT_COLORS[i] }}
                    />
                    <div className="min-w-0">
                      <p className="text-xl font-bold text-gray-400 dark:text-base-content/40 uppercase leading-tight mb-1">
                        {entry.name}
                      </p>
                      <p className="text-2xl font-black font-mono text-gray-700 dark:text-base-content">
                        {formatCurrency(entry.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Donut chart — right side */}
              <div className="flex-1 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="52%"
                      outerRadius="96%"
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Full-circle donut — Cash Utilization with % centered */}
          <div className="rounded-2xl bg-violet-50 dark:bg-base-200 border border-violet-200 dark:border-violet-500/20 p-5 flex flex-col">
            <p className="text-base font-bold uppercase tracking-widest text-gray-500 dark:text-base-content/50 mb-4">
              Cash Utilization
            </p>

            {/* PieChart donut — two slices so value renders correctly */}
            <div className="relative flex-1 w-full" style={{ minHeight: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Cash Utilization", value: clampedUtil },
                      { name: "Remaining", value: 100 - clampedUtil },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="82%"
                    outerRadius="96%"
                    paddingAngle={clampedUtil > 0 && clampedUtil < 100 ? 3 : 0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    <Cell fill={gaugeColor} />
                    <Cell fill={gaugeTrackColor} />
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-4xl font-black font-mono leading-none ${gaugeTextColor}`}>
                  {clampedUtil}%
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-base-content/40 mt-1">
                  utilized
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="h-px bg-gray-200 dark:bg-base-300" />

        {/* ── Disbursement Count Chips ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="py-5 px-3 flex flex-col items-center justify-center text-center rounded-2xl bg-amber-50 dark:bg-base-200 border border-amber-200 dark:border-amber-500/20">
            <CheckCircle2 className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-4xl font-black font-mono text-amber-900 dark:text-base-content leading-none">
              {processedDVNum || 0}
            </span>
            <span className="text-sm font-bold text-amber-700 dark:text-base-content/60 uppercase mt-2 leading-tight">
              Processed DV
            </span>
          </div>
          <div className="py-5 px-3 flex flex-col items-center justify-center text-center rounded-2xl bg-rose-50 dark:bg-base-200 border border-rose-200 dark:border-rose-500/20">
            <Ban className="w-8 h-8 text-rose-600 mb-2" />
            <span className="text-4xl font-black font-mono text-rose-900 dark:text-base-content leading-none">
              {cancelledLDDAPNum || 0}
            </span>
            <span className="text-sm font-bold text-rose-700 dark:text-base-content/60 uppercase mt-2 leading-tight">
              Cancelled LDDAP
            </span>
          </div>
          <div className="py-5 px-3 flex flex-col items-center justify-center text-center rounded-2xl bg-rose-50 dark:bg-base-200 border border-rose-200 dark:border-rose-500/20">
            <Ban className="w-8 h-8 text-rose-600 mb-2" />
            <span className="text-4xl font-black font-mono text-rose-900 dark:text-base-content leading-none">
              {cancelledCheckNum || 0}
            </span>
            <span className="text-sm font-bold text-rose-700 dark:text-base-content/60 uppercase mt-2 leading-tight">
              Cancelled Check
            </span>
          </div>
        </div>

        {/* ── Bar Chart: Disbursement Count Breakdown ───────────────────── */}
        <div className="rounded-2xl bg-gray-50 dark:bg-base-200 border border-gray-200 dark:border-base-300 p-5 flex flex-col">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-base-content/50 mb-4">
            Disbursement Count Breakdown
          </p>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                barCategoryGap="35%"
                barSize={56}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 13, fontWeight: 700, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 13, fontWeight: 700, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  content={<BarTooltip />}
                  cursor={{ fill: "#f3f4f660" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} isAnimationActive>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
            {barData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ background: d.fill }}
                />
                <span className="text-sm font-semibold text-gray-500 dark:text-base-content/50">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundStatCard;
