import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Calendar,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import useLogStore from "../../store/useLogStore";
import Header from "../../components/Header";

const LogsPage = () => {
  const {
    logs,
    fetchLogs,
    isLoading,
    pagination,
    setPage,
    setFilters,
    applyFilters,
    clearFilters,
    formatLogEntry,
  } = useLogStore();

  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleApplyFilters = () => {
    setFilters(dateRange);
    applyFilters();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    clearFilters();
    setShowFilters(false);
  };

  const formattedLogs = logs.map(formatLogEntry);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <div className="card-static p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search logs..."
                className="input input-bordered w-full pl-11 bg-base-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilters({ search: e.target.value });
                    applyFilters();
                  }
                }}
                onChange={(e) => {
                  // Optional: could debounce search here, but Enter is safer for performance
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn gap-2 ${showFilters ? "btn-primary" : "btn-ghost"}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-base-300 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-base-200"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-base-200"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">User</span>
                  </label>
                  <select className="select select-bordered bg-base-200">
                    <option value="">All Users</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleClearFilters}
                  className="btn btn-ghost btn-sm"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="btn btn-primary btn-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="card-static overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-base-content/60">Loading logs...</p>
            </div>
          ) : formattedLogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
              <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                No Logs Found
              </h3>
              <p className="text-sm text-base-content/40">
                Activity logs will appear here as users interact with the system
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-base-content/60 whitespace-nowrap">
                          {log.formattedDate}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{log.userId}</span>
                          </div>
                        </td>
                        <td className="text-base-content/80">{log.log}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-base-300 flex items-center justify-between">
                  <p className="text-sm text-base-content/60">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="btn btn-ghost btn-sm btn-square"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium">
                      Page {pagination.page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                      className="btn btn-ghost btn-sm btn-square"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
