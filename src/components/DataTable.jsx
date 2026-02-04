import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Filter, FileText } from "lucide-react";

const DataTable = ({
  // Data props
  data = [],
  isLoading = false,

  // Column configuration
  columns = [],

  // Pagination props
  pagination = null,
  onPageChange,

  // Filter props
  filters = [],
  activeFilter = "ALL",
  onFilterChange,

  // Action buttons
  headerActions = null,

  // Empty state
  emptyState = {
    icon: FileText,
    title: "No data found",
    description: "Try adjusting your filters.",
  },

  // Row click handler
  onRowClick = null,

  // Custom class names
  className = "",
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

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

  const handleFilterSelect = (filter) => {
    onFilterChange?.(filter);
    setIsFilterOpen(false);
  };

  const EmptyIcon = emptyState?.icon || FileText;

  return (
    <section
      className={`bg-white dark:bg-base-100 border border-base-300 rounded-xl shadow-md overflow-visible animate-fade-in-up ${className}`}
    >
      {/* --- HEADER --- */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200">
        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          {filters.length > 0 && (
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`btn btn-sm gap-2 font-medium ${
                  activeFilter !== "ALL"
                    ? "btn-primary text-white"
                    : "btn-outline border-base-300 text-base-content/70 hover:bg-base-100"
                }`}
              >
                <Filter className="w-4 h-4" />
                {activeFilter === "ALL" ? "Filter" : activeFilter}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-lg shadow-xl border border-base-200 z-50 overflow-hidden">
                  <div className="p-1">
                    {filters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => handleFilterSelect(filter.value)}
                        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                          activeFilter === filter.value
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-base-200 text-base-content/80"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Header Actions */}
          {headerActions}
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
        ) : data.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-base-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <EmptyIcon className="w-8 h-8 text-base-content/20" />
            </div>
            <h3 className="text-base font-semibold text-base-content/70">
              {emptyState?.title || "No data found"}
            </h3>
            <p className="text-sm text-base-content/40 mt-1">
              {emptyState?.description || "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-base-200/50 text-base-content/70">
                  <tr className="border-b border-base-200 text-xs uppercase tracking-wider font-semibold">
                    {columns.map((column, index) => (
                      <th
                        key={column.key}
                        className={`px-6 py-4 ${
                          index === 0 ? "rounded-tl-lg" : ""
                        } ${index === columns.length - 1 ? "rounded-tr-lg" : ""} ${
                          column.headerAlign || "text-left"
                        }`}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.map((row, rowIndex) => (
                    <tr
                      key={row.id || rowIndex}
                      onClick={() => onRowClick?.(row)}
                      className={`group border-b border-base-100 last:border-0 hover:bg-base-200/60 even:bg-base-100/40 transition-colors duration-150 ${
                        onRowClick ? "cursor-pointer" : ""
                      }`}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`px-6 py-4 ${column.align || "text-left"}`}
                        >
                          {column.render
                            ? column.render(row, rowIndex)
                            : row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
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
                    onClick={() => onPageChange?.(pagination.currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="join-item btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:border-base-300 hover:text-primary"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange?.(pagination.currentPage + 1)}
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

export default DataTable;
