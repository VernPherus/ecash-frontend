import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
//* Component imports
import {
  TrendingUp,
  Wallet,
  LayoutGrid,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DataTable from "../components/DataTable";
import DashboardTimeStats from "../components/DashboardTimeStats";
import FundStatCard from "../components/FundStatCard";
import FloatingNotification from "../components/FloatingNotification";

//* Store Imports
import useSystemStore from "../store/useSystemStore";
import useFundStore from "../store/useFundStore";
import useDisbursementStore from "../store/useDisbursementStore";

//* Utils
import { formatCurrency, formatDate } from "../lib/formatters";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { time, getTime } = useSystemStore();
  const { displayFundStats, fundStats, fetchFunds } = useFundStore();
  const {
    disbursements,
    fetchDisbursements,
    isLoading,
    pagination,
    getDisbursementStatus,
  } = useDisbursementStore();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentFundIndex, setCurrentFundIndex] = useState(0);

  // State for selected month (Defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Initialize Data
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await getTime();
        fetchFunds();

        // Initial fetch based on system time if available, otherwise keeps default state
        const { time: updatedTime } = useSystemStore.getState();
        if (updatedTime?.month) {
          setSelectedMonth(Number(updatedTime.month));
        }
      } catch (error) {
        console.error("Failed to initialize dashboard:", error);
      }
    };

    initializeDashboard();
  }, [getTime, fetchFunds]);

  // Fetch Stats whenever selectedMonth changes
  useEffect(() => {
    if (selectedMonth) {
      displayFundStats({
        month: Number(selectedMonth),
      });
    }
  }, [selectedMonth, displayFundStats]);

  // Fetch Disbursements
  useEffect(() => {
    fetchDisbursements(1, 10, "", filterStatus === "ALL" ? "" : filterStatus);
  }, [fetchDisbursements, filterStatus]);

  const handlePageChange = (newPage) => {
    fetchDisbursements(
      newPage,
      10,
      "",
      filterStatus === "ALL" ? "" : filterStatus,
    );
  };

  // Get the string name of the currently selected month
  const currentMonthName = useMemo(() => {
    return MONTH_NAMES[selectedMonth - 1] || "Month";
  }, [selectedMonth]);

  // Column definitions
  const disbursementColumns = [
    {
      key: "payee",
      header: "Payee & Date",
      headerAlign: "text-left",
      align: "text-left",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
            {row.payee?.name || "Unknown Payee"}
          </span>
          <span className="text-xs text-base-content/50 mt-0.5">
            {formatDate(row.dateReceived)}
          </span>
        </div>
      ),
    },
    {
      key: "fundSource",
      header: "Fund Source",
      headerAlign: "text-center",
      align: "text-center",
      render: (row) => (
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-base-300/50 border border-base-300 text-xs font-medium text-base-content/80">
          {row.fundSource?.code || "---"}
        </div>
      ),
    },
    {
      key: "projectName",
      header: "Project",
      headerAlign: "text-center",
      alight: "text-center",
      render: (row) => (
        <div className="font-semibold text-base-content group-hover:text-primary transition-colors text-center">
          {row.projectName || "---"}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      headerAlign: "text-right",
      align: "text-right",
      render: (row) => (
        <span className="font-mono font-medium text-base-content">
          {formatCurrency(row.netAmount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      headerAlign: "text-center",
      align: "text-center",
      render: (row) => {
        const { status, label, className } = getDisbursementStatus(row);
        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border shadow-sm ${className}`}
            >
              {status === "approved" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : status === "overdue" ? (
                <AlertCircle className="w-3 h-3" />
              ) : status === "cancelled" ? (
                <XCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {label}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Action",
      headerAlign: "text-center",
      align: "text-center",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/disbursement/${row.id}`);
            }}
            className="btn btn-xs btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white text-base-content/70 gap-1.5 font-normal transition-all"
            title="View Details"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  const disbursementFilters = [
    { value: "ALL", label: "All" },
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const tableHeaderActions = (
    <button
      onClick={() => navigate("/disbursement/new")}
      className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
    >
      View All
    </button>
  );

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        backgroundColor: "oklch(var(--b2))",
        backgroundImage:
          "radial-gradient(circle, oklch(var(--b3)) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <FloatingNotification />

      <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Time Stats Section */}
        <DashboardTimeStats
          currentDate={time.currentDate}
          quarter={time.quarter}
        />

        {/* Fund Liquidity Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Fund Liquidity Overview
            </h3>

            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-base-content/50" />
              <select
                className="select select-bordered select-sm w-full sm:w-auto font-medium text-base-content"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {MONTH_NAMES.map((name, index) => (
                  <option key={index + 1} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fundStats.length > 0 ? (
            <div
              className="flex flex-col gap-4 rounded-2xl p-4 border border-base-300/60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--b1)) 0%, oklch(var(--b2)) 100%)",
                boxShadow: "inset 0 1px 0 oklch(var(--b1) / 0.8)",
              }}
            >
              {/* Carousel row */}
              <div className="flex items-center gap-4">
                {/* Prev button */}
                <button
                  onClick={() => setCurrentFundIndex((i) => Math.max(0, i - 1))}
                  disabled={currentFundIndex === 0}
                  className="self-center flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-base-100 border border-base-300 shadow-md hover:bg-primary hover:border-primary hover:text-white hover:shadow-primary/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 text-base-content/70"
                  aria-label="Previous fund"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Active card — full width */}
                <div className="flex-1 min-w-0">
                  {(() => {
                    const fundStat = fundStats[currentFundIndex];
                    return (
                      <FundStatCard
                        key={fundStat.fundId}
                        fundId={fundStat.fundId}
                        month={currentMonthName}
                        totalNCA={fundStat.totalEntries}
                        totalMonthly={fundStat.totalMonthly}
                        totalDisbursements={fundStat.totalDisbursement}
                        totalCashUtil={fundStat.totalCashUtil}
                        processedDVNum={fundStat.processedDVNum}
                        cancelledLDDAPNum={fundStat.cancelledLDDAP}
                        cancelledCheckNum={fundStat.cancellledCheck}
                      />
                    );
                  })()}
                </div>

                {/* Next button */}
                <button
                  onClick={() => setCurrentFundIndex((i) => Math.min(fundStats.length - 1, i + 1))}
                  disabled={currentFundIndex === fundStats.length - 1}
                  className="self-center flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-base-100 border border-base-300 shadow-md hover:bg-primary hover:border-primary hover:text-white hover:shadow-primary/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 text-base-content/70"
                  aria-label="Next fund"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dot indicators */}
              {fundStats.length > 1 && (
                <div className="flex justify-center gap-2 pt-1">
                  {fundStats.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFundIndex(i)}
                      aria-label={`Go to fund ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-200 ${i === currentFundIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-gray-400 dark:bg-base-300 hover:bg-gray-500 dark:hover:bg-base-content/30 border border-gray-300 dark:border-transparent"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-base-100 rounded-xl border border-base-300 border-dashed">
              <LayoutGrid className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
              <p className="text-base-content/50">
                No fund statistics available for this period.
              </p>
            </div>
          )}
        </section>

        {/* Transactions Table Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Transactions
              </h3>
              <p className="text-xs text-base-content/50 mt-1">
                Latest disbursement activity across all funds
              </p>
            </div>
          </div>

          <DataTable
            data={disbursements}
            isLoading={isLoading}
            columns={disbursementColumns}
            pagination={pagination}
            onPageChange={handlePageChange}
            filters={disbursementFilters}
            activeFilter={filterStatus}
            onFilterChange={setFilterStatus}
            headerActions={tableHeaderActions}
            emptyState={{
              icon: FileText,
              title: "No transactions found",
              description: "Try adjusting your filters.",
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
