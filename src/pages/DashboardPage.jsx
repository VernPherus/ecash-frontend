import { useEffect, useState } from "react";
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

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await getTime();
        fetchFunds();

        const { time: updatedTime } = useSystemStore.getState();

        if (updatedTime?.month) {
          await displayFundStats({
            month: Number(updatedTime.month),
          });
        }
      } catch (error) {
        console.error("Failed to initialize dashboard:", error);
      }
    };

    initializeDashboard();
  }, [getTime, displayFundStats, fetchFunds]);

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
    <div className="min-h-screen bg-base-200/50 pb-20">
      <FloatingNotification />

      <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Time Stats Section */}
        <DashboardTimeStats
          currentDate={time.currentDate}
          quarter={time.quarter}
        />

        {/* Fund Liquidity Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Fund Liquidity Overview
            </h3>
          </div>

          {fundStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fundStats.map((fundStat) => (
                <FundStatCard
                  key={fundStat.fundId}
                  fundId={fundStat.fundId}
                  totalEntries={fundStat.totalEntries}
                  totalMonthly={fundStat.totalMonthly}
                  totalDisbursements={fundStat.totalDisbursement}
                  totalCashUtil={fundStat.totalCashUtil}
                />
              ))}
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
