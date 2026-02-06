import { useEffect, useState, useMemo } from "react";
import { FileText, Search, Calendar, Filter, User, X } from "lucide-react";
import useLogStore from "../../store/useLogStore";
import FloatingNotification from "../../components/FloatingNotification";
import DataTable from "../../components/DataTable";

const LogsPage = () => {
  const {
    logs,
    fetchLogs,
    isLoading,
    pagination, // Contains: { page, limit, total, totalPages }
    setPage, // Action: Updates page state and fetches new data
    setFilters,
    applyFilters,
    clearFilters,
    formatLogEntry,
  } = useLogStore();

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handle Search on Enter
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setFilters({ search: searchInput });
      applyFilters();
    }
  };

  const handleApplyFilters = () => {
    setFilters(dateRange);
    applyFilters();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDateRange({ startDate: "", endDate: "" });
    clearFilters();
    setShowFilters(false);
  };

  // Format data for the table
  const formattedLogs = useMemo(
    () => logs.map(formatLogEntry),
    [logs, formatLogEntry],
  );

  // --- Column Configuration ---
  const columns = useMemo(
    () => [
      {
        key: "formattedDate",
        header: "Timestamp",
        render: (row) => (
          <span className="text-base-content/60 font-mono text-sm whitespace-nowrap">
            {row.formattedDate}
          </span>
        ),
      },
      {
        key: "userId",
        header: "User",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-base-content/80">
              {row.userId || "System"}
            </span>
          </div>
        ),
      },
      {
        key: "log",
        header: "Activity",
        render: (row) => (
          <span className="text-base-content/80 leading-relaxed block min-w-[300px]">
            {row.log}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      <FloatingNotification />

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* --- Toolbar / Filters --- */}
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search logs (Press Enter)..."
                className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-colors"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn gap-2 flex-1 md:flex-none ${
                  showFilters
                    ? "btn-primary"
                    : "btn-outline border-base-300 text-base-content/70"
                }`}
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Filters"}
              </button>
              {(searchInput || dateRange.startDate || dateRange.endDate) && (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-ghost btn-square text-error"
                  title="Clear all filters"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Expandable Date Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-base-200 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium flex items-center gap-2 text-base-content/70">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-base-200/50 focus:bg-base-100"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium flex items-center gap-2 text-base-content/70">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-base-200/50 focus:bg-base-100"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleApplyFilters}
                    className="btn btn-primary flex-1"
                  >
                    Apply Date Range
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Data Table --- */}
        <DataTable
          data={formattedLogs}
          isLoading={isLoading}
          columns={columns}
          // --- Pagination Implementation ---
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages || 1,
          }}
          onPageChange={setPage} // Passes the new page number to the store
          emptyState={{
            icon: FileText,
            title: "No logs found",
            description:
              searchInput || dateRange.startDate
                ? "Try adjusting your search or date filters."
                : "Activity logs will appear here as users interact with the system.",
          }}
        />
      </main>
    </div>
  );
};

export default LogsPage;
