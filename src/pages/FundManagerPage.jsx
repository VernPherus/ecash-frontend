/* eslint-disable react-hooks/preserve-manual-memoization */
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import {
  Wallet,
  Search,
  Edit2,
  X,
  Banknote,
  Layers,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  Ban,
  Trash2,
  Power,
  Plus,
} from "lucide-react";

import useFundStore from "../store/useFundStore";
import FundSourceForm from "../components/FundSourceForm";
import DataTable from "../components/DataTable"; //
import { formatCurrency, formatDate } from "../lib/formatters";
import { totalAllocation } from "../lib/formulas";
import toast from "react-hot-toast";

const FundManagerPage = () => {
  // --- Store ---
  const {
    funds,
    entries,
    fetchFunds,
    fetchEntries,
    createEntry,
    deleteEntry,
    deactivateFund,
    setSelectedFund,
    selectedFund,
    isLoading: isStoreLoading,
  } = useFundStore();

  // --- UI State ---
  const [activeTab, setActiveTab] = useState("FUNDS"); // 'FUNDS' | 'LEDGER'
  const [searchQuery, setSearchQuery] = useState("");
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  // --- Entry Form State ---
  const [entryForm, setEntryForm] = useState({
    sourceId: "",
    name: "",
    amount: "",
  });
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Initial Fetch ---
  useEffect(() => {
    fetchFunds();
    fetchEntries();
  }, [fetchFunds, fetchEntries]);

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();

    if (activeTab === "FUNDS") {
      return funds.filter(
        (f) =>
          f &&
          ((f.name || "").toLowerCase().includes(lowerSearch) ||
            (f.code || "").toLowerCase().includes(lowerSearch)),
      );
    } else {
      return entries.filter(
        (e) =>
          e &&
          ((e.name || "").toLowerCase().includes(lowerSearch) ||
            (e.fundSource?.code || "").toLowerCase().includes(lowerSearch)),
      );
    }
  }, [activeTab, funds, entries, searchQuery]);

  // --- Handlers ---
  const openFundModal = (fund = null) => {
    setSelectedFund(fund);
    setIsFundModalOpen(true);
  };

  const closeFundModal = () => {
    setSelectedFund(null);
    setIsFundModalOpen(false);
  };

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    if (!entryForm.sourceId || !entryForm.amount || !entryForm.name) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmittingEntry(true);
    const result = await createEntry({
      sourceId: Number(entryForm.sourceId),
      name: entryForm.name,
      amount: Number(entryForm.amount),
    });
    setIsSubmittingEntry(false);

    if (result.success) {
      setIsEntryModalOpen(false);
      setEntryForm({ sourceId: "", name: "", amount: "" });
      fetchFunds();
    }
  };

  const handleDeleteEntry = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this ledger entry? This will revert the fund balance.",
      )
    ) {
      return;
    }
    setIsDeleting(true);
    const result = await deleteEntry(id);
    setIsDeleting(false);

    if (result.success) {
      fetchFunds();
    }
  };

  const handleDeactivateFund = async (id, code) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate fund "${code}"? This will prevent new entries from being created under this fund.`,
      )
    ) {
      return;
    }
    setIsDeleting(true);
    const result = await deactivateFund(id);
    setIsDeleting(false);
  };

  // --- Column Definitions ---
  const fundColumns = useMemo(
    () => [
      {
        key: "code",
        header: "Fund Code",
        render: (row, idx) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
              idx % 2 === 0
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-secondary/10 text-secondary border-secondary/20"
            }`}
          >
            {row.code}
          </span>
        ),
      },
      {
        key: "name",
        header: "Name",
        render: (row) => (
          <span className="font-medium text-base-content">{row.name}</span>
        ),
      },
      {
        key: "balance",
        header: "Balance",
        align: "text-right",
        headerAlign: "text-right",
        render: (row) => (
          <span className="font-mono font-medium">
            {formatCurrency(row.initialBalance)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        align: "text-center",
        headerAlign: "text-center",
        render: (row) =>
          row.isActive !== false ? (
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-base-300 text-base-content/50 border border-base-300">
                <Ban className="w-3 h-3" /> Inactive
              </span>
            </div>
          ),
      },
      {
        key: "actions",
        header: "Action",
        align: "text-center",
        headerAlign: "text-center",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openFundModal(row);
              }}
              className="btn btn-xs btn-ghost text-base-content/60 hover:text-primary hover:bg-primary/10"
              title="Edit Fund"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            {row.isActive !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeactivateFund(row.id, row.code);
                }}
                className="btn btn-xs btn-ghost text-base-content/40 hover:text-error hover:bg-error/10"
                title="Deactivate Fund"
                disabled={isDeleting}
              >
                <Power className="w-3 h-3" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [isDeleting],
  );

  const ledgerColumns = useMemo(
    () => [
      {
        key: "date",
        header: "Date",
        render: (row) => (
          <span className="text-base-content/60 font-mono text-xs">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        key: "description",
        header: "Description",
        render: (row) => (
          <span className="font-medium text-base-content">{row.name}</span>
        ),
      },
      {
        key: "fund",
        header: "Fund Source",
        render: (row) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-base-200 text-base-content/70 border border-base-300">
            {row.fundSource?.code || "UNK"}
          </span>
        ),
      },
      {
        key: "amount",
        header: "Amount",
        align: "text-right",
        headerAlign: "text-right",
        render: (row) => (
          <span className="font-mono font-bold text-base-content">
            {formatCurrency(row.amount)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Action",
        align: "text-center",
        headerAlign: "text-center",
        render: (row) => (
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEntry(row.id);
              }}
              disabled={isDeleting}
              className="btn btn-xs btn-ghost text-base-content/40 hover:text-error hover:bg-error/10"
              title="Delete Entry"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ),
      },
    ],
    [isDeleting],
  );

  const headerActions = (
    <button
      onClick={() =>
        activeTab === "FUNDS" ? openFundModal() : setIsEntryModalOpen(true)
      }
      className="btn btn-sm btn-primary gap-2 shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">
        {activeTab === "FUNDS" ? "New Fund" : "New Entry"}
      </span>
    </button>
  );

  const totalBudget = totalAllocation(funds);

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      {/* --- HEADER --- */}
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* --- STATS OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 shadow-xl text-white relative overflow-hidden border border-indigo-500/20">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Wallet className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-100/80 mb-1">
                <Banknote className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Total Allocation
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {formatCurrency(totalBudget)}
              </h2>
            </div>
          </div>
        </div>

        {/* --- TABS & FILTERS --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="bg-base-100 p-1 rounded-lg border border-base-300 flex gap-1">
            <button
              onClick={() => setActiveTab("FUNDS")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "FUNDS"
                  ? "bg-base-200 text-base-content shadow-sm"
                  : "text-base-content/50 hover:text-base-content hover:bg-base-200/50"
              }`}
            >
              <Layers className="w-4 h-4" /> Fund Sources
            </button>
            <button
              onClick={() => setActiveTab("LEDGER")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "LEDGER"
                  ? "bg-base-200 text-base-content shadow-sm"
                  : "text-base-content/50 hover:text-base-content hover:bg-base-200/50"
              }`}
            >
              <FileText className="w-4 h-4" /> Ledger Entries
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder={
                activeTab === "FUNDS" ? "Search funds..." : "Search entries..."
              }
              className="input input-bordered w-full pl-10 h-10 text-sm bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <DataTable
          data={filteredData}
          isLoading={isStoreLoading && !isDeleting}
          columns={activeTab === "FUNDS" ? fundColumns : ledgerColumns}
          headerActions={headerActions}
          onRowClick={
            activeTab === "FUNDS" ? (row) => openFundModal(row) : undefined
          }
          emptyState={{
            icon: activeTab === "FUNDS" ? Layers : FileText,
            title: "No records found",
            description: `Try adding a new ${
              activeTab === "FUNDS" ? "fund" : "entry"
            }.`,
          }}
        />
      </main>

      {/* --- MODAL: FUND FORM --- */}
      {isFundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeFundModal}
          />
          <div className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn border border-base-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50">
              <h3 className="font-bold text-lg text-base-content">
                {selectedFund ? "Edit Fund Source" : "Create Fund Source"}
              </h3>
              <button
                onClick={closeFundModal}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <FundSourceForm fund={selectedFund} onClose={closeFundModal} />
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ENTRY FORM --- */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEntryModalOpen(false)}
          />
          <div className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-base-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50">
              <h3 className="font-bold text-lg text-base-content">
                New Ledger Entry
              </h3>
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEntrySubmit} className="p-6 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/70">
                    Fund Source
                  </span>
                </label>
                <select
                  className="select select-bordered w-full bg-base-100"
                  value={entryForm.sourceId}
                  onChange={(e) =>
                    setEntryForm({ ...entryForm, sourceId: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select a fund...
                  </option>
                  {funds.map((f) =>
                    f ? (
                      <option key={f.id} value={f.id}>
                        {f.code} - {f.name}
                      </option>
                    ) : null,
                  )}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/70">
                    Description
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q1 Budget Alignment"
                  className="input input-bordered w-full bg-base-100"
                  value={entryForm.name}
                  onChange={(e) =>
                    setEntryForm({ ...entryForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/70">
                    Amount
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 font-mono">
                    ₱
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="input input-bordered w-full pl-8 font-mono bg-base-100"
                    value={entryForm.amount}
                    onChange={(e) =>
                      setEntryForm({ ...entryForm, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="btn flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 gap-2"
                  disabled={isSubmittingEntry}
                >
                  {isSubmittingEntry ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
            animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FundManagerPage;
