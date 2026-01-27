import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye, // Added Eye icon for the View button
} from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";
import { formatCurrency, formatDate } from "../lib/formatters";

const DisbursementTable = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const {
    disbursements,
    fetchDisbursements,
    isLoading,
    pagination,
    getDisbursementStatus,
  } = useDisbursementStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch when filter or page changes
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

  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
  };

  return (
    <section className="bg-white dark:bg-base-100 border border-base-300 rounded-xl shadow-md overflow-visible animate-fade-in-up">
      {/* --- HEADER --- */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200">
        <div>
          <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Transactions
          </h3>
          <p className="text-xs text-base-content/50 mt-1">
            Recent disbursement activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn btn-sm gap-2 font-medium ${
                filterStatus !== "ALL"
                  ? "btn-primary text-white"
                  : "btn-outline border-base-300 text-base-content/70 hover:bg-base-100"
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterStatus === "ALL" ? "Filter" : filterStatus}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-lg shadow-xl border border-base-200 z-50 overflow-hidden">
                <div className="p-1">
                  {["ALL", "PAID", "PENDING"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterSelect(status)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                        filterStatus === status
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-base-200 text-base-content/80"
                      }`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/disbursement/new")}
            className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
          >
            View All
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="w-full">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 w-full bg-base-200/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : disbursements.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-base-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-base-content/20" />
            </div>
            <h3 className="text-base font-semibold text-base-content/70">
              No transactions found
            </h3>
            <p className="text-sm text-base-content/40 mt-1">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-base-200/50 text-base-content/70">
                  <tr className="border-b border-base-200 text-xs uppercase tracking-wider font-semibold">
                    {/* ALIGNMENT: Left */}
                    <th className="px-6 py-4 rounded-tl-lg text-left">
                      Payee & Date
                    </th>
                    {/* ALIGNMENT: Center for short codes */}
                    <th className="px-6 py-4 text-center">Fund Source</th>
                    {/* ALIGNMENT: Right for currency */}
                    <th className="px-6 py-4 text-right">Amount</th>
                    {/* ALIGNMENT: Center for badges */}
                    <th className="px-6 py-4 text-center">Status</th>
                    {/* ALIGNMENT: Center for buttons */}
                    <th className="px-6 py-4 text-center rounded-tr-lg">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {disbursements.map((item) => {
                    const { status, label, className } =
                      getDisbursementStatus(item);

                    return (
                      <tr
                        key={item.id}
                        className="group border-b border-base-100 last:border-0 hover:bg-base-200/60 even:bg-base-100/40 transition-colors duration-150"
                      >
                        {/* Payee & Date (Left) */}
                        <td className="px-6 py-4 text-left">
                          <div className="flex flex-col">
                            <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
                              {item.payee?.name || "Unknown Payee"}
                            </span>
                            <span className="text-xs text-base-content/50 mt-0.5">
                              {formatDate(item.dateReceived)}
                            </span>
                          </div>
                        </td>

                        {/* Fund Source (Center) */}
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-base-300/50 border border-base-300 text-xs font-medium text-base-content/80">
                            {item.fundSource?.code || "---"}
                          </div>
                        </td>

                        {/* Amount (Right) */}
                        <td className="px-6 py-4 text-right font-mono font-medium text-base-content">
                          {formatCurrency(item.netAmount)}
                        </td>

                        {/* Status (Center) */}
                        <td className="px-6 py-4">
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
                        </td>

                        {/* Action (Center) - CHANGED to "View" Button */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/disbursement/${item.id}`)}
                            className="btn btn-xs btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white text-base-content/70 gap-1.5 font-normal transition-all"
                          >
                            <Eye className="w-3 h-3" />
                            View
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
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-200">
                <span className="text-xs text-base-content/50 font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <div className="join">
                  <button
                    className="join-item btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:border-base-300 hover:text-primary"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="join-item btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:border-base-300 hover:text-primary"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DisbursementTable;
