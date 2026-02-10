import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  User,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Hash,
  FileText,
  Clock,
  ToolboxIcon,
} from "lucide-react";

import InfoCard, { InfoRow } from "../components/InfoCard";
import usePayeeStore from "../store/usePayeeStore";
import useAuthStore from "../store/useAuthStore";
import PayeeForm from "../components/PayeeForm";
import { formatDate } from "../lib/formatters";

const PayeeViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { selectedPayee, showPayee, deletePayee, isLoading } = usePayeeStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check access for Edit/Delete buttons (ADMIN or STAFF)
  const isAuthorized = authUser?.role === "ADMIN" || authUser?.role === "STAFF";

  useEffect(() => {
    if (id) {
      showPayee(id);
    }
  }, [id, showPayee]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate this payee? This action will prevent future disbursements to this entity.",
      )
    ) {
      const result = await deletePayee(Number(id));
      if (result.success) {
        navigate("/payees");
      }
    }
  };

  // --- Loading State ---
  if (isLoading && !selectedPayee) {
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
  if (!selectedPayee) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-base-content/30" />
          </div>
          <h3 className="text-lg font-bold text-base-content mb-2">
            Payee Not Found
          </h3>
          <p className="text-sm text-base-content/60 mb-8">
            The payee record you are looking for might have been removed or does
            not exist.
          </p>
          <button
            onClick={() => navigate("/payees")}
            className="btn btn-primary btn-sm w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to List
          </button>
        </div>
      </div>
    );
  }

  const payee = selectedPayee;

  return (
    <div className="min-h-screen bg-base-200 pb-20 font-sans">
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-base-100 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn border border-base-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50 shrink-0">
              <h3 className="text-lg font-bold text-base-content">
                Edit Payee
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <PayeeForm
                payee={payee}
                onClose={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Top Navigation --- */}
      <nav className="bg-base-100/80 border-b border-base-300 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/payees")}
                className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content hover:bg-base-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="h-8 w-px bg-base-300 mx-1"></div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-base-content uppercase tracking-wider">
                    Payee Profile
                  </h1>
                  <span className="text-base-content/30 text-xs">•</span>
                  <span className="text-xs font-mono text-base-content/60">
                    #{payee.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      payee.isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-base-300/50 text-base-content/50 border-base-300"
                    }`}
                  >
                    {payee.isActive ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {payee.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control: STAFF or ADMIN can Edit/Delete */}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (Details) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Briefcase className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-sm">
                    {payee.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-base-content">
                      {payee.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge badge-sm badge-ghost font-medium text-xs uppercase tracking-wide">
                        {payee.type || "Unknown Type"}
                      </span>
                      {payee.tinNum && (
                        <span className="text-xs font-mono text-base-content/60 flex items-center gap-1 bg-base-200/50 px-2 py-0.5 rounded">
                          <Hash className="w-3 h-3" />
                          {payee.tinNum}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-base-200">
                  <div>
                    <h4 className="text-xs font-bold text-base-content/40 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-base-content/40" />
                        <span className="text-sm font-medium">
                          {payee.contactPerson || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-base-content/40" />
                        <span className="text-sm font-mono text-base-content/80">
                          {payee.mobileNum || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-base-content/40" />
                        <span className="text-sm text-base-content/80">
                          {payee.email || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-base-content/40 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Address
                    </h4>
                    <p className="text-sm leading-relaxed text-base-content/70">
                      {payee.address || "No address provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <InfoCard icon={Building} title="Banking Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                <InfoRow label="Bank Name" value={payee.bankName || "—"} />
                <InfoRow label="Branch" value={payee.bankBranch || "—"} />
                <InfoRow
                  label="Account Name"
                  value={payee.accountName || "—"}
                />
                <InfoRow
                  label="Account Number"
                  value={
                    <span className="font-mono text-base-content/80">
                      {payee.accountNumber || "—"}
                    </span>
                  }
                />
              </div>
            </InfoCard>
          </div>

          {/* --- RIGHT COLUMN (Meta) --- */}
          <div className="space-y-6">
            {/* Remarks */}
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
              <h3 className="text-xs font-bold text-amber-800/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Remarks
              </h3>
              <p className="text-sm text-amber-900/80 leading-relaxed italic">
                {payee.remarks || "No remarks found."}
              </p>
            </div>

            {/* System Info */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm p-5">
              <h3 className="text-xs font-bold text-base-content/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> System Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Created</span>
                  <span className="font-mono text-base-content/80">
                    {formatDate(payee.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">Last Updated</span>
                  <span className="font-mono text-base-content/80">
                    {formatDate(payee.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {isAuthorized && (
              <InfoCard icon={ToolboxIcon} title="Actions">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
                    title="Deactivate Payee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary hover:bg-base-200"
                    title="Edit Payee"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </InfoCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PayeeViewPage;
