import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import {
  Search,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  X,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";
import { formatCurrency, formatDate } from "../lib/formatters";
import DisbursementForm from "../components/DisbursementForm";
import DataTable from "../components/DataTable"; //
import FloatingNotification from "../components/FloatingNotification";

const DisbursementPage = () => {
  const navigate = useNavigate();

  // --- Local State for Filters ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // --- Modal & Edit State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisbursement, setEditingDisbursement] = useState(null);

  // Access Store
  const {
    disbursements,
    fetchDisbursements,
    handleSocketUpdate,
    isLoading,
    pagination,
    getDisbursementStatus,
  } = useDisbursementStore();

  // --- Fetch Data on Filter Change ---
  useEffect(() => {
    fetchDisbursements(
      pagination.currentPage || 1,
      10, // Limit
      search,
      statusFilter === "ALL" ? "" : statusFilter,
      dateRange.start,
      dateRange.end,
    );

    const onDisbursementupdate = (payload) => {
      handleSocketUpdate(payload);
    };

    socket.on("disbursement_updates", onDisbursementupdate);

    return () => {
      socket.off("disbursement_updates", onDisbursementupdate);
    };
  }, [
    fetchDisbursements,
    handleSocketUpdate,
    pagination.currentPage,
    search,
    statusFilter,
    dateRange.start,
    dateRange.end,
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

  // Open Modal for Create
  const handleCreate = () => {
    setEditingDisbursement(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEdit = (item) => {
    setEditingDisbursement(item);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDisbursement(null);
  };

  const hasActiveFilters =
    search || statusFilter !== "ALL" || dateRange.start || dateRange.end;

  // --- Table Configuration ---
  const columns = useMemo(
    () => [
      {
        key: "reference",
        header: "Reference & Date",
        headerAlign: "text-left",
        align: "text-left",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-mono font-medium text-base-content group-hover:text-primary transition-colors">
              {row.lddapNum || row.checkNum || `ID#${row.id}`}
            </span>
            <span className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(row.dateReceived)}
            </span>
          </div>
        ),
      },
      {
        key: "payee",
        header: "Payee",
        headerAlign: "text-left",
        align: "text-left",
        render: (row) => (
          <>
            <div
              className="max-w-[200px] truncate font-medium text-base-content/90"
              title={row.payee?.name}
            >
              {row.payee?.name || "—"}
            </div>
            <div className="text-xs text-base-content/40 mt-0.5">
              {row.payee?.type || "Supplier"}
            </div>
          </>
        ),
      },
      {
        key: "fundSource",
        header: "Fund Source",
        headerAlign: "text-center",
        align: "text-center",
        render: (row) => (
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-base-200 text-xs font-mono text-base-content/70 border border-base-300">
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
          <span className="font-mono font-bold text-base-content">
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
          const { label, className } = getDisbursementStatus(row);
          return (
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${className}`}
              >
                {label.includes("Approved") || label.includes("Paid") ? (
                  <CheckCircle2 className="w-3 h-3" />
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
        header: "Actions",
        headerAlign: "text-center",
        align: "text-center",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              className="btn btn-xs btn-outline border-base-300 text-base-content/60 hover:text-warning hover:border-warning gap-1 font-normal"
              title="Edit Record"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/disbursement/${row.id}`);
              }}
              className="btn btn-xs btn-outline border-base-300 text-base-content/60 hover:text-primary hover:border-primary gap-1 font-normal"
              title="View Details"
            >
              <Eye className="w-3 h-3" /> View
            </button>
          </div>
        ),
      },
    ],
    [getDisbursementStatus, navigate],
  );

  const filterOptions = [
    { value: "ALL", label: "All Status" },
    { value: "PAID", label: "Paid / Approved" },
    { value: "PENDING", label: "Pending" },
  ];

  const headerActions = (
    <button
      onClick={handleCreate}
      className="btn btn-sm btn-primary gap-2 shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">New Record</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      {/* --- HEADER --- */}
      <FloatingNotification />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* --- TOOLBAR (Search & Date) --- */}
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

        {/* --- DATA TABLE --- */}
        <DataTable
          data={disbursements}
          isLoading={isLoading}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          filters={filterOptions}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          headerActions={headerActions}
          onRowClick={(row) => navigate(`/disbursement/${row.id}`)}
          emptyState={{
            icon: FileText,
            title: "No records found",
            description: hasActiveFilters
              ? "Try adjusting your search or filters."
              : "Get started by creating a new disbursement record.",
          }}
        />
      </main>

      {/* --- MODAL (CREATE / EDIT) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-base-100 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn border border-base-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50 shrink-0">
              <h3 className="text-lg font-bold text-base-content">
                {editingDisbursement
                  ? "Edit Disbursement"
                  : "Create New Disbursement"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              <DisbursementForm
                onClose={handleCloseModal}
                initialData={editingDisbursement}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisbursementPage;
