import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  X,
  Eye,
} from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";
import { formatCurrency, formatDate } from "../lib/formatters";

const DisbursementPage = () => {
  const navigate = useNavigate();

  // --- Local State for Filters ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Access Store
  const {
    disbursements,
    fetchDisbursements,
    isLoading,
    pagination,
    getDisbursementStatus,
  } = useDisbursementStore();

  // --- Fetch Data on Filter Change ---
  // Debounce search could be added here, but for now we fetch on effect
  useEffect(() => {
    fetchDisbursements(
      pagination.currentPage || 1,
      10, // Limit
      search,
      statusFilter === "ALL" ? "" : statusFilter,
      dateRange.start,
      dateRange.end,
    );
  }, [
    fetchDisbursements,
    pagination.currentPage,
    search,
    statusFilter,
    dateRange,
  ]);

  // --- Handlers ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchDisbursements(
        newPage,
        10,
        search,
        statusFilter === "ALL" ? "" : statusFilter,
        dateRange.start,
        dateRange.end,
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateRange({ start: "", end: "" });
  };

  const hasActiveFilters =
    search || statusFilter !== "ALL" || dateRange.start || dateRange.end;

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      {/* --- HEADER --- */}
      <header className="bg-base-100 border-b border-base-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight">
              Disbursements
            </h1>
            <p className="text-sm text-base-content/60 mt-0.5">
              Manage and track all fund disbursements.
            </p>
          </div>

          {/* Create Button (Non-functional as requested) */}
          <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Record</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* --- TOOLBAR --- */}
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="Search by payee, DV number, or reference..."
              className="input input-bordered w-full pl-10 h-10 text-sm bg-base-200/50 focus:bg-base-100 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Date Start */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-base-content/40" />
              </div>
              <input
                type="date"
                className="input input-bordered h-10 pl-10 text-sm w-full sm:w-auto bg-base-200/50 focus:bg-base-100"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
            </div>

            <span className="text-base-content/30 hidden sm:inline">-</span>

            {/* Date End */}
            <div className="relative">
              <input
                type="date"
                className="input input-bordered h-10 px-3 text-sm w-full sm:w-auto bg-base-200/50 focus:bg-base-100"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>

            {/* Status Dropdown */}
            <select
              className="select select-bordered h-10 min-h-0 text-sm bg-base-200/50 focus:bg-base-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
            </select>

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-ghost btn-square btn-sm text-base-content/50 hover:text-error hover:bg-error/10"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* --- TABLE CARD --- */}
        <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            // Loading Skeleton
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-base-200/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : disbursements.length === 0 ? (
            // Empty State
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-base-content/30" />
              </div>
              <h3 className="text-lg font-bold text-base-content/70">
                No records found
              </h3>
              <p className="text-sm text-base-content/40 mt-1 max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Get started by creating a new disbursement record."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-link btn-sm mt-2 text-primary no-underline hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase font-semibold tracking-wider">
                    <tr className="border-b border-base-200">
                      <th className="px-6 py-4">Reference & Date</th>
                      <th className="px-6 py-4">Payee</th>
                      <th className="px-6 py-4 text-center">Fund Source</th>
                      <th className="px-6 py-4 text-right cursor-pointer group flex items-center justify-end gap-1 hover:text-base-content">
                        Amount
                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-base-100">
                    {disbursements.map((item) => {
                      const { status, label, className } =
                        getDisbursementStatus(item);

                      return (
                        <tr
                          key={item.id}
                          className="group hover:bg-base-200/40 transition-colors"
                        >
                          {/* Reference & Date */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono font-medium text-base-content group-hover:text-primary transition-colors">
                                DV-{item.dvNum || item.id}
                              </span>
                              <span className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.dateReceived)}
                              </span>
                            </div>
                          </td>

                          {/* Payee */}
                          <td className="px-6 py-4">
                            <div
                              className="max-w-[200px] truncate font-medium text-base-content/90"
                              title={item.payee?.name}
                            >
                              {item.payee?.name || "—"}
                            </div>
                            <div className="text-xs text-base-content/40 mt-0.5">
                              {item.payee?.type || "Supplier"}
                            </div>
                          </td>

                          {/* Fund Source */}
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-base-200 text-xs font-mono text-base-content/70 border border-base-300">
                              {item.fundSource?.code || "---"}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4 text-right">
                            <span className="font-mono font-bold text-base-content">
                              {formatCurrency(item.netAmount)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${className}`}
                              >
                                {status === "approved" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                {label}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                navigate(`/disbursement/${item.id}`)
                              }
                              className="btn btn-xs btn-outline border-base-300 text-base-content/60 hover:text-primary hover:border-primary gap-1 font-normal"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* --- PAGINATION --- */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-50/30">
                  <span className="text-xs text-base-content/50">
                    Showing page{" "}
                    <span className="font-medium">
                      {pagination.currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalPages}</span>
                  </span>

                  <div className="join">
                    <button
                      className="join-item btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:text-primary hover:border-base-300"
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="join-item btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:text-primary hover:border-base-300"
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DisbursementPage;
