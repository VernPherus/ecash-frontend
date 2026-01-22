import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  Edit2,
  Printer,
  Hash,
  Users,
  Copy,
  Check,
  AlertTriangle,
  Wallet,
  TrendingDown,
  Banknote,
} from "lucide-react";

import InfoCard, { InfoRow } from "../components/InfoCard";
import useDisbursementStore from "../store/useDisbursementStore";
import ApprovalModal from "../components/ApprovalModal";
import { formatCurrency, formatDate } from "../lib/formatters";

// Minimal Copy Button Component
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!text) return null;

  return (
    <button
      onClick={handleCopy}
      className="btn btn-ghost btn-xs btn-square opacity-30 hover:opacity-100 transition-all ml-2"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
};

const DisbursementViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedDisbursement,
    showDisbursement,
    approveDisbursement,
    isLoading,
    getDisbursementStatus,
  } = useDisbursementStore();

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (id) {
      showDisbursement(id);
    }
  }, [id, showDisbursement]);

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await approveDisbursement(Number(id));
    setIsApproving(false);

    if (result?.success) {
      setIsApprovalModalOpen(false);
    }
  };

  // --- Loading State ---
  if (isLoading && !selectedDisbursement) {
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
  if (!selectedDisbursement) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-base-content/30" />
          </div>
          <h3 className="text-lg font-bold text-base-content mb-2">
            Record Not Found
          </h3>
          <p className="text-sm text-base-content/60 mb-8">
            The disbursement record you are looking for might have been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary btn-sm w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const disbursement = selectedDisbursement;
  const status = getDisbursementStatus(disbursement);

  return (
    // FIX: Changed from 'bg-base-50/30' to 'bg-base-200' to serve as a proper dark mode background
    <div className="min-h-screen bg-base-200 pb-20 font-sans">
      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        disbursement={disbursement}
        onConfirm={handleApprove}
        isLoading={isApproving}
      />

      {/* --- Top Navigation --- */}
      {/* FIX: Changed 'bg-white/80' to 'bg-base-100/80' */}
      <nav className="bg-base-100/80 border-b border-base-300 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content hover:bg-base-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="h-8 w-px bg-base-300 mx-1"></div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-base-content uppercase tracking-wider">
                    Disbursement
                  </h1>
                  <span className="text-base-content/30 text-xs">•</span>
                  <span className="text-xs font-mono text-base-content/60">
                    #{disbursement.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.className}`}
                  >
                    {status.status === "approved" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {status.label}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm btn-square text-base-content/60"
                title="Print Record"
              >
                <Printer className="w-4 h-4" />
              </button>
              {status.status === "PENDING" && (
                <button
                  className="btn btn-ghost btn-sm btn-square text-base-content/60"
                  title="Edit Record"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Financial Highlights (Clean Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Gross */}
              {/* FIX: Changed 'bg-white' to 'bg-base-100' */}
              <div className="bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
                <div className="flex items-center gap-2 text-base-content/50 mb-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Gross Amount
                  </span>
                </div>
                <div className="text-xl font-medium text-base-content">
                  {formatCurrency(disbursement.grossAmount)}
                </div>
              </div>

              {/* Deductions */}
              {/* FIX: Changed 'bg-white' to 'bg-base-100' */}
              <div className="bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
                <div className="flex items-center gap-2 text-error/70 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Deductions
                  </span>
                </div>
                <div className="text-xl font-medium text-error">
                  - {formatCurrency(disbursement.totalDeductions)}
                </div>
              </div>

              {/* Net (Highlighted) */}
              <div className="bg-primary/10 p-5 rounded-xl border border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Banknote className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-primary mb-2 relative z-10">
                  <Banknote className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Net Amount
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary relative z-10">
                  {formatCurrency(disbursement.netAmount)}
                </div>
              </div>
            </div>

            {/* 2. Particulars */}
            {/* FIX: Changed 'bg-white' to 'bg-base-100' */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
              {/* FIX: Changed 'bg-base-50/50' to 'bg-base-200/50' */}
              <div className="bg-base-200/50 px-6 py-3 border-b border-base-200">
                <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Particulars
                </h3>
              </div>
              <div className="p-6">
                <p className="font-mono text-sm leading-relaxed text-base-content/80 whitespace-pre-wrap">
                  {disbursement.particulars || "No particulars specified."}
                </p>
              </div>
            </div>

            {/* 3. Line Items Table */}
            {/* FIX: Changed 'bg-white' to 'bg-base-100' */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center bg-base-200/50">
                <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                  Line Items
                </h3>
                <span className="text-xs font-medium text-base-content/40">
                  {disbursement.items?.length || 0} Entries
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-base-content/50 uppercase bg-base-200/30 border-b border-base-200">
                    <tr>
                      <th className="px-6 py-3 font-medium w-16">#</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium text-center">
                        Code
                      </th>
                      <th className="px-6 py-3 font-medium text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {disbursement.items?.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-base-200/50 transition-colors"
                      >
                        <td className="px-6 py-3 text-base-content/40 font-mono text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-3 font-medium text-base-content/80">
                          {item.description}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="inline-block bg-base-200 text-base-content/60 text-[10px] px-2 py-1 rounded font-mono">
                            {item.accountCode || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-base-content/80">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    {(!disbursement.items ||
                      disbursement.items.length === 0) && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-base-content/40 italic"
                        >
                          No line items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Deductions (Conditional) */}
            {disbursement.deductions?.length > 0 && (
              // FIX: Changed 'bg-white' to 'bg-base-100'
              <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center bg-error/5">
                  <h3 className="text-xs font-bold text-error/70 uppercase tracking-wider flex items-center gap-2">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Applied Deductions
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-error/50 uppercase bg-error/5 border-b border-error/10">
                      <tr>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium text-right">
                          Deduction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200">
                      {disbursement.deductions.map((ded, idx) => (
                        <tr key={idx} className="hover:bg-base-200/50">
                          <td className="px-6 py-3 font-medium text-base-content/70">
                            {ded.deductionType}
                          </td>
                          <td className="px-6 py-3 text-right font-mono text-error">
                            - {formatCurrency(ded.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN (Sidebar) --- */}
          <div className="space-y-6">
            {/* A. Action Panel (Only if PENDING) */}
            {status.status === "PENDING" && (
              // FIX: Changed 'bg-white' to 'bg-base-100'
              <div className="bg-base-100 rounded-xl shadow-lg border border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <div className="p-6">
                  <h3 className="text-sm font-bold text-base-content uppercase tracking-wider mb-2">
                    Action Required
                  </h3>
                  <p className="text-xs text-base-content/60 mb-4 leading-relaxed">
                    This disbursement is currently pending. Review the details
                    before approving.
                  </p>
                  <button
                    onClick={() => setIsApprovalModalOpen(true)}
                    className="btn btn-primary w-full shadow-lg shadow-primary/20 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Disbursement
                  </button>
                </div>
              </div>
            )}

            {/* B. Approved Panel (Only if PAID) */}
            {status.status === "PAID" && (
              // This usually looks okay in dark mode, but let's tweak the text colors just in case
              <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-5 flex items-start gap-4">
                <div className="bg-base-100 p-2 rounded-full border border-emerald-500/30 shadow-sm text-emerald-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-500">
                    Successfully Approved
                  </h3>
                  <p className="text-xs text-emerald-600/80 mt-1">
                    Processed on {formatDate(disbursement.approvedAt, "short")}
                  </p>
                </div>
              </div>
            )}

            {/* C. Reference Codes */}
            <InfoCard icon={Hash} title="Reference Codes">
              {/* Internal References Loop */}
              {disbursement.references && disbursement.references.length > 0 ? (
                disbursement.references.map((ref, idx) => (
                  <div
                    key={ref.id || idx}
                    className={
                      idx > 0
                        ? "mt-4 pt-4 border-t border-dashed border-base-200"
                        : ""
                    }
                  >
                    {disbursement.references.length > 1 && (
                      <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest mb-2">
                        Group #{idx + 1}
                      </p>
                    )}
                    <InfoRow
                      label="DV Number"
                      value={
                        <span className="font-mono flex items-center">
                          {ref.dvNum || "—"} <CopyButton text={ref.dvNum} />
                        </span>
                      }
                    />
                    <InfoRow
                      label="ORS Number"
                      value={
                        <span className="font-mono flex items-center">
                          {ref.orsNum || "—"} <CopyButton text={ref.orsNum} />
                        </span>
                      }
                    />
                    <InfoRow
                      label="UACS Code"
                      value={
                        <span className="font-mono flex items-center">
                          {ref.uacsCode || "—"}{" "}
                          <CopyButton text={ref.uacsCode} />
                        </span>
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="py-2 text-xs text-base-content/40 italic flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  No internal references linked.
                </div>
              )}

              {/* Bank Docs */}
              {(disbursement.lddapNum || disbursement.acicNum) && (
                <>
                  <div className="my-3 border-t border-dashed border-base-200" />
                  <InfoRow
                    label="LDDAP Number"
                    value={
                      <span className="font-mono flex items-center">
                        {disbursement.lddapNum || "—"}{" "}
                        <CopyButton text={disbursement.lddapNum} />
                      </span>
                    }
                  />
                  <InfoRow
                    label="ACIC Number"
                    value={
                      <span className="font-mono flex items-center">
                        {disbursement.acicNum || "—"}{" "}
                        <CopyButton text={disbursement.acicNum} />
                      </span>
                    }
                  />
                </>
              )}
            </InfoCard>

            {/* D. Involved Entities */}
            <InfoCard icon={Users} title="Involved Entities">
              {/* Payee */}
              <div className="flex items-center gap-4 py-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                  {disbursement.payee?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p
                    className="font-bold text-sm text-base-content truncate"
                    title={disbursement.payee?.name}
                  >
                    {disbursement.payee?.name || "Unknown Payee"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium text-base-content/50 bg-base-200 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      {disbursement.payee?.type || "Supplier"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divider my-2 opacity-50 h-px bg-base-200"></div>

              {/* Fund Source */}
              <div className="flex items-center gap-4 py-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs shadow-sm">
                  {disbursement.fundSource?.code?.substring(0, 3) || "$"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm text-base-content truncate">
                    {disbursement.fundSource?.name || "Unknown Fund"}
                  </p>
                  <p className="text-xs text-base-content/50 font-mono mt-0.5 flex items-center gap-1">
                    Code:{" "}
                    <span className="text-base-content/70">
                      {disbursement.fundSource?.code}
                    </span>
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DisbursementViewPage;
