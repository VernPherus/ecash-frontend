import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "../lib/formatters";
import useDisbursementStore from "../store/useDisbursementStore";
import toast from "react-hot-toast";

function ApprovalModal({ isOpen, onClose, disbursement }) {
  const { approveDisbursement } = useDisbursementStore();
  const [isApproving, setIsApproving] = useState(false);

  const handleConfirm = async () => {
    if (!disbursement?.id) return;

    setIsApproving(true);
    try {
      await approveDisbursement(disbursement.id);
      toast.success("Disbursement approved successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve disbursement");
    } finally {
      setIsApproving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isApproving ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-base-100 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-base-200 animate-scaleIn">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-base-content">
              Approve Transaction
            </h2>
            <p className="text-sm text-base-content/60 mt-1">
              Please verify the details below before finalizing.
            </p>
          </div>

          {/* Minimal Details Block */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-base-200 pb-3">
              <span className="text-sm font-medium text-base-content/60">
                Payee
              </span>
              <span className="text-base font-medium text-right text-base-content truncate max-w-50">
                {disbursement?.payee?.name || "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-base-200 pb-3">
              <span className="text-sm font-medium text-base-content/60">
                Net Amount
              </span>
              <span className="text-lg font-bold text-primary font-mono">
                {formatCurrency(disbursement?.netAmount || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-base-content/40">Reference</span>
              <span className="text-xs font-mono text-base-content/60 bg-base-200 px-2 py-1 rounded">
                {disbursement?.dvNum || disbursement?.id}
              </span>
            </div>
          </div>

          {/* Subtle Warning */}
          <div className="mt-6 flex gap-3 text-warning text-sm bg-warning/5 p-3 rounded-lg border border-warning/10">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-warning-content/80 text-xs leading-relaxed">
              This action cannot be undone. The disbursement will be permanently
              recorded as approved.
            </span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isApproving}
              className="btn btn-sm btn-ghost font-normal"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isApproving}
              className="btn btn-sm btn-primary min-w-25"
            >
              {isApproving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm Approval"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Simple Animation */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ApprovalModal;
