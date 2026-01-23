import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Search,
  Edit2,
  X,
  Banknote,
  ArrowRightLeft,
  Layers,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  Ban,
} from "lucide-react";

import useFundStore from "../store/useFundStore";
import FundSourceForm from "../components/FundSourceForm"; // Assuming this exists
import { formatCurrency, formatDate } from "../lib/formatters";
import toast from "react-hot-toast";

const FundManagerPage = () => {
  // --- Store ---
  const {
    funds,
    entries,
    fetchFunds,
    fetchEntries,
    createEntry,
    isLoading,
    setSelectedFund,
    selectedFund,
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

  // --- Initial Fetch ---
  useEffect(() => {
    fetchFunds();
    fetchEntries();
  }, [fetchFunds, fetchEntries]);

  // --- Handlers ---

  // Filter Logic
  const getFilteredData = () => {
    const lowerSearch = searchQuery.toLowerCase();

    if (activeTab === "FUNDS") {
      return funds.filter(
        (f) =>
          f.name.toLowerCase().includes(lowerSearch) ||
          f.code.toLowerCase().includes(lowerSearch),
      );
    } else {
      return entries.filter(
        (e) =>
          e.name?.toLowerCase().includes(lowerSearch) ||
          e.fundSource?.code?.toLowerCase().includes(lowerSearch),
      );
    }
  };

  const filteredData = getFilteredData();

  // Modal Handlers
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
      // Refresh funds to see updated balances
      fetchFunds();
    }
  };

  const totalBudget = funds.reduce(
    (sum, f) => sum + Number(f.initialBalance || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      {/* --- HEADER --- */}
      <header className="bg-base-100 border-b border-base-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight flex items-center gap-3">
              Fund Manager
            </h1>
            <p className="text-sm text-base-content/60 mt-0.5">
              Allocations, balances, and ledger entries.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Create Entry Button */}
            <button
              onClick={() => setIsEntryModalOpen(true)}
              className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-200 hover:border-base-300 gap-2 shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
            </button>

            {/* Create Fund Button */}
            <button
              onClick={() => openFundModal()}
              className="btn btn-primary gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Fund</span>
            </button>
          </div>
        </div>
      </header>

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
          {/* Tabs */}
          <div className="bg-base-100 p-1 rounded-lg border border-base-300 flex gap-1">
            <button
              onClick={() => setActiveTab("FUNDS")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "FUNDS" ? "bg-base-200 text-base-content shadow-sm" : "text-base-content/50 hover:text-base-content hover:bg-base-200/50"}`}
            >
              <Layers className="w-4 h-4" /> Fund Sources
            </button>
            <button
              onClick={() => setActiveTab("LEDGER")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "LEDGER" ? "bg-base-200 text-base-content shadow-sm" : "text-base-content/50 hover:text-base-content hover:bg-base-200/50"}`}
            >
              <FileText className="w-4 h-4" /> Ledger Entries
            </button>
          </div>

          {/* Search */}
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

        {/* --- TABLE CONTENT --- */}
        <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-base-200/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-base-content/20" />
              </div>
              <h3 className="text-base font-semibold text-base-content/70">
                No records found
              </h3>
              <p className="text-sm text-base-content/40 mt-1">
                Try adding a new {activeTab === "FUNDS" ? "fund" : "entry"}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase font-semibold tracking-wider">
                  <tr className="border-b border-base-200">
                    {activeTab === "FUNDS" ? (
                      <>
                        <th className="px-6 py-4">Fund Code</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4 text-right">Balance</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Fund Source</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-base-100">
                  {activeTab === "FUNDS"
                    ? // --- FUNDS ROWS ---
                      filteredData.map((fund, idx) => (
                        <tr
                          key={fund.id}
                          className="group hover:bg-base-200/40 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${idx % 2 === 0 ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}
                            >
                              {fund.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-base-content">
                            {fund.name}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-medium">
                            {formatCurrency(fund.initialBalance)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {fund.isActive !== false ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-base-300 text-base-content/50 border border-base-300">
                                <Ban className="w-3 h-3" /> Inactive
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => openFundModal(fund)}
                              className="btn btn-xs btn-ghost text-base-content/60 hover:text-primary"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    : // --- LEDGER ROWS ---
                      filteredData.map((entry) => (
                        <tr
                          key={entry.id}
                          className="group hover:bg-base-200/40 transition-colors"
                        >
                          <td className="px-6 py-4 text-base-content/60 font-mono text-xs">
                            {formatDate(entry.createdAt)}
                          </td>
                          <td className="px-6 py-4 font-medium text-base-content">
                            {entry.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-base-200 text-base-content/70 border border-base-300">
                              {entry.fundSource?.code || "UNK"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-base-content">
                            {formatCurrency(entry.amount)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
              {/* Assuming FundSourceForm handles its own layout/submit logic. 
                        If not, wrapping styling might be needed. */}
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
              {/* Fund Source Select */}
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
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code} - {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Particulars/Name */}
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

              {/* Amount */}
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

              {/* Actions */}
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

      {/* Animation Styles */}
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
