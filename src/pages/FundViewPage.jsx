import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  PieChart,
  Edit2,
  Trash2,
  Calendar,
  FileText,
  RefreshCw,
  Activity,
  CheckCircle,
  XCircle,
  X,
  Download,
  FileBarChart,
  ToolboxIcon,
} from "lucide-react";

import InfoCard, { InfoRow } from "../components/InfoCard";
import useFundStore from "../store/useFundStore";
import useAuthStore from "../store/useAuthStore";
import useReportStore from "../store/useReportStore";
import FundSourceForm from "../components/FundSourceForm";
import { formatCurrency, formatDate } from "../lib/formatters";

const FundViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const { selectedFund, fetchFundDetails, deactivateFund, isLoading } =
    useFundStore();

  const {
    downloadDebitReport,
    downloadCheckReport,
    isLoading: isReportLoading,
  } = useReportStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Report Form State
  const [reportConfig, setReportConfig] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: "CHECK",
  });

  // Access Control: Allow ADMIN and STAFF to modify
  const isAuthorized = authUser?.role === "ADMIN" || authUser?.role === "STAFF";

  useEffect(() => {
    if (id) {
      fetchFundDetails(id);
    }
  }, [id, fetchFundDetails]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate this fund source? It will no longer be selectable for new disbursements.",
      )
    ) {
      const result = await deactivateFund(Number(id));
      if (result.success) {
        navigate("/funds");
      }
    }
  };

  const handleDownloadReport = async (e) => {
    e.preventDefault();
    if (!selectedFund) return;

    let success = false;
    if (reportConfig.type === "CHECK") {
      success = await downloadCheckReport(
        reportConfig.year,
        reportConfig.month,
        selectedFund.id,
        selectedFund.code,
      );
    } else {
      success = await downloadDebitReport(
        reportConfig.year,
        reportConfig.month,
        selectedFund.id,
        selectedFund.code,
      );
    }

    if (success) {
      setIsReportModalOpen(false);
    }
  };

  // --- Loading State ---
  if (isLoading && !selectedFund) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-base-300"></div>
          <div className="h-4 w-32 bg-base-300 rounded"></div>
        </div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!selectedFund) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-base-content/30" />
          </div>
          <h3 className="text-lg font-bold text-base-content mb-2">
            Fund Not Found
          </h3>
          <p className="text-sm text-base-content/60 mb-8">
            The fund source you are looking for might have been removed or does
            not exist.
          </p>
          <button
            onClick={() => navigate("/funds")}
            className="btn btn-primary btn-sm w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to List
          </button>
        </div>
      </div>
    );
  }

  const fund = selectedFund;
  const stats = fund.stats || {
    initialBalance: fund.initialBalance || 0,
    remainingBalance: 0,
    utilizationRate: 0,
  };

  return (
    <div className="min-h-screen bg-base-200 pb-20 font-sans">
      {/* --- MODALS --- */}

      {/* 1. Edit Fund Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-base-100 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn border border-base-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50 shrink-0">
              <h3 className="text-lg font-bold text-base-content">
                Edit Fund Source
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FundSourceForm
                fund={fund}
                onClose={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Generate Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isReportLoading && setIsReportModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-base-100 rounded-xl shadow-2xl overflow-hidden animate-scaleIn border border-base-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-primary" />
                Generate Monthly Audit
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
                disabled={isReportLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDownloadReport} className="p-6 space-y-5">
              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pt-0">
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
                  <label className="label pt-0">
                    <span className="label-text font-medium">Year</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={reportConfig.year}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        year: Number(e.target.value),
                      })
                    }
                    min="2000"
                    max="2100"
                  />
                </div>
              </div>

              {/* Report Type Selection */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Report Type</span>
                </label>
                <div className="flex flex-col gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${reportConfig.type === "CHECK" ? "border-primary bg-primary/5" : "border-base-300 hover:bg-base-200"}`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      className="radio radio-primary radio-sm mt-0.5"
                      checked={reportConfig.type === "CHECK"}
                      onChange={() =>
                        setReportConfig({ ...reportConfig, type: "CHECK" })
                      }
                    />
                    <div>
                      <span className="font-bold text-sm block">
                        Report of Checks Issued (RCI)
                      </span>
                      <span className="text-xs text-base-content/60">
                        For check disbursements
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${reportConfig.type === "DEBIT" ? "border-primary bg-primary/5" : "border-base-300 hover:bg-base-200"}`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      className="radio radio-primary radio-sm mt-0.5"
                      checked={reportConfig.type === "DEBIT"}
                      onChange={() =>
                        setReportConfig({ ...reportConfig, type: "DEBIT" })
                      }
                    />
                    <div>
                      <span className="font-bold text-sm block">
                        Report of Advice to Debit Account (ADA)
                      </span>
                      <span className="text-xs text-base-content/60">
                        For LDDAP disbursements
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full shadow-lg shadow-primary/20 gap-2"
                  disabled={isReportLoading}
                >
                  {isReportLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isReportLoading ? "Generating..." : "Download Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Top Navigation --- */}
      <nav className="bg-base-100/80 border-b border-base-300 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/funds")}
                className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content hover:bg-base-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="h-8 w-px bg-base-300 mx-1"></div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-base-content uppercase tracking-wider">
                    {fund.code}
                  </h1>
                  <span className="text-base-content/30 text-xs">•</span>
                  <span className="text-xs text-base-content/60 truncate max-w-[200px]">
                    {fund.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      fund.isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-base-300/50 text-base-content/50 border-base-300"
                    }`}
                  >
                    {fund.isActive ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {fund.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Report Button - Visible to all authorized users */}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="btn btn-ghost btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors gap-2"
                title="Generate Monthly Audit"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-bold">
                  Audit Report
                </span>
              </button>

              {/* Access Control: STAFF and ADMIN can Edit/Delete */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (Main Stats & Details) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Initial Balance */}
              <div className="bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
                <div className="flex items-center gap-2 text-base-content/50 mb-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Initial Balance
                  </span>
                </div>
                <div className="text-xl font-medium text-base-content">
                  {formatCurrency(stats.initialBalance)}
                </div>
              </div>

              {/* Utilization Rate */}
              <div className="bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
                <div className="flex items-center gap-2 text-base-content/50 mb-2">
                  <PieChart className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Utilization
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-xl font-medium ${
                      Number(stats.utilizationRate) > 90
                        ? "text-error"
                        : Number(stats.utilizationRate) > 70
                          ? "text-warning"
                          : "text-emerald-500"
                    }`}
                  >
                    {stats.utilizationRate}%
                  </span>
                  <span className="text-xs text-base-content/40">utilized</span>
                </div>
                <progress
                  className={`progress w-full h-1 mt-3 ${
                    Number(stats.utilizationRate) > 90
                      ? "progress-error"
                      : Number(stats.utilizationRate) > 70
                        ? "progress-warning"
                        : "progress-success"
                  }`}
                  value={Number(stats.utilizationRate)}
                  max="100"
                ></progress>
              </div>

              {/* Remaining Balance (Highlighted) */}
              <div className="bg-primary/10 p-5 rounded-xl border border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <TrendingUp className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-primary mb-2 relative z-10">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Remaining
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary relative z-10">
                  {formatCurrency(stats.remainingBalance)}
                </div>
              </div>
            </div>

            {/* Fund Details */}
            <InfoCard icon={FileText} title="Fund Details">
              <div className="p-2 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-base-content/40 uppercase tracking-wide">
                    Description
                  </span>
                  <p className="text-sm leading-relaxed text-base-content/80">
                    {fund.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 pt-4 border-t border-dashed border-base-200">
                <InfoRow
                  label="Reset Frequency"
                  value={
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 text-base-content/40" />
                      {fund.reset || "NONE"}
                    </span>
                  }
                />
                <InfoRow
                  label="Created At"
                  value={
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-base-content/40" />
                      {formatDate(fund.createdAt, "short")}
                    </span>
                  }
                />
              </div>
            </InfoCard>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="space-y-6">
            {/* Activity Summary */}
            <InfoCard icon={Activity} title="Activity Summary">
              <div className="py-2">
                <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
                  <span className="text-sm font-medium text-base-content/70">
                    Total Disbursements
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {fund._count?.disbursements || 0}
                  </span>
                </div>

                {/* Visual placeholder for recent entries if we wanted to add them later */}
                <div className="mt-4 text-center p-4 border border-dashed border-base-300 rounded-lg">
                  <p className="text-xs text-base-content/40 italic">
                    Transaction history is available in the Reports section.
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* System Info */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-5">
              <h3 className="text-xs font-bold text-base-content/40 uppercase tracking-wider mb-4">
                System Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Last Updated</span>
                  <span className="font-mono text-base-content/80">
                    {formatDate(fund.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Database ID</span>
                  <span className="font-mono text-base-content/80">
                    #{fund.id}
                  </span>
                </div>
              </div>
            </div>

            {isAuthorized && (
              <InfoCard icon={ToolboxIcon} title="Actions">
                <button
                  onClick={handleDelete}
                  className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
                  title="Deactivate Fund"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary hover:bg-base-200"
                  title="Edit Fund"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </InfoCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FundViewPage;
