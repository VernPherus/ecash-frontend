import React, { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  X,
  DollarSign,
  CheckCircle,
  FileSpreadsheet, // New Icon for Excel
  Download,
} from "lucide-react";

import useFundStore from "../store/useFundStore";
import { useReportStore } from "../store/useReportStore"; 
import FundSourceForm from "../components/FundSourceForm";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

const FundManagerPage = () => {
  // Stores
  const {
    funds,
    fetchFunds,
    isLoading,
    getFundColor,
    setSelectedFund,
    selectedFund,
  } = useFundStore();
  const { downloadSPV, isLoading: isDownloading } = useReportStore(); // Report Store

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // Default to current month
    targetFund: null,
  });

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  // Filter Logic
  const filteredFunds = funds.filter((fund) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && fund.isActive) ||
      (filterActive === "inactive" && !fund.isActive);
    return matchesSearch && matchesActive;
  });

  // --- Handlers ---

  const handleEdit = (fund) => {
    setSelectedFund(fund);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedFund(null);
    setShowForm(false);
  };

  // Open the Report Modal
  const handleOpenReport = (fund) => {
    setReportConfig((prev) => ({ ...prev, targetFund: fund }));
    setShowReportModal(true);
  };

  // Execute Download
  const handleDownloadReport = async (e) => {
    e.preventDefault();
    if (!reportConfig.targetFund) return;

    const success = await downloadSPV(
      reportConfig.year,
      reportConfig.month,
      reportConfig.targetFund.id,
      reportConfig.targetFund.code
    );

    if (success) {
      setShowReportModal(false);
    }
  };

  const totalBudget = funds.reduce(
    (sum, f) => sum + Number(f.initialBalance || 0),
    0
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              Fund Sources
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Manage your fund allocations and track balances
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Fund Source
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div>
              <p className="text-sm text-base-content/60 font-medium mb-1">
                Total Fund Sources
              </p>
              <h3 className="text-3xl font-bold text-base-content">
                {funds.length}
              </h3>
            </div>
            <div className="stat-icon bg-primary/10 border border-primary/20">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-sm text-base-content/60 font-medium mb-1">
                Total Budget
              </p>
              <h3 className="text-2xl font-bold text-base-content">
                {formatCurrency(totalBudget)}
              </h3>
            </div>
            <div className="stat-icon bg-success/10 border border-success/20">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-sm text-base-content/60 font-medium mb-1">
                Active Funds
              </p>
              <h3 className="text-3xl font-bold text-base-content">
                {funds.filter((f) => f.isActive !== false).length}
              </h3>
            </div>
            <div className="stat-icon bg-info/10 border border-info/20">
              <CheckCircle className="w-6 h-6 text-info" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-static p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by name or code..."
                className="input input-bordered w-full pl-11 bg-base-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="select select-bordered bg-base-200"
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fund Table */}
        <div className="card-static overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-base-content/60">
                Loading fund sources...
              </p>
            </div>
          ) : filteredFunds.length === 0 ? (
            <div className="p-12 text-center">
              <Wallet className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
              <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                {searchQuery
                  ? "No funds match your search"
                  : "No Fund Sources Yet"}
              </h3>
              <p className="text-sm text-base-content/40 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first fund source to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Fund Source
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto h-[500px]">
              <table className="table-modern">
                <thead className="sticky top-0 bg-base-100 z-10">
                  <tr>
                    <th>Code</th>
                    <th>Fund Name</th>
                    <th>Description</th>
                    <th className="text-right">Initial Balance</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFunds.map((fund, idx) => (
                    <tr key={fund.id}>
                      <td>
                        <span className={`fund-badge ${getFundColor(idx)}`}>
                          {fund.code}
                        </span>
                      </td>
                      <td className="font-semibold text-base-content">
                        {fund.name}
                      </td>
                      <td className="text-base-content/60 max-w-xs truncate">
                        {fund.description || "—"}
                      </td>
                      <td className="text-right font-bold text-base-content">
                        {formatCurrency(fund.initialBalance)}
                      </td>
                      <td className="text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            fund.isActive !== false
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-base-300 text-base-content/50 border-base-300"
                          }`}
                        >
                          {fund.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(fund)}
                            className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          <div className="dropdown dropdown-end dropdown-bottom">
                            <label
                              tabIndex={0}
                              className="btn btn-ghost btn-sm btn-square"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[20] menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300"
                            >
                              <li>
                                <button onClick={() => handleEdit(fund)}>
                                  <Edit2 className="w-4 h-4" /> Edit Details
                                </button>
                              </li>
                              <li>
                                {/* NEW: Audit Report Action */}
                                <button onClick={() => handleOpenReport(fund)}>
                                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                  Generate Report
                                </button>
                              </li>
                              <div className="divider my-1"></div>
                              <li>
                                <button className="text-error">
                                  <Trash2 className="w-4 h-4" /> Deactivate
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Form Slider */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseForm}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-base-100 shadow-2xl animate-fade-in-up">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                <h3 className="text-lg font-bold">
                  {selectedFund ? "Edit Fund Source" : "New Fund Source"}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <FundSourceForm fund={selectedFund} onClose={handleCloseForm} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: Audit Report Modal --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          />
          <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-primary/5 p-6 border-b border-base-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-base-content">
                    Export Audit Report
                  </h3>
                  <p className="text-sm text-base-content/60 mt-1">
                    Summary of Paid Vouchers
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-base-100 rounded-md border border-base-300 text-xs font-medium text-base-content/70">
                Fund: {reportConfig.targetFund?.code}
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleDownloadReport} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Month</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={reportConfig.month}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        month: Number(e.target.value),
                      })
                    }
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Year</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={reportConfig.year}
                    min="2020"
                    max="2030"
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        year: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  className="btn flex-1"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 gap-2"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? "Downloading..." : "Download Excel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundManagerPage;
