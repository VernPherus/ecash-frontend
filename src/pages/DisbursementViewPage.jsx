import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Edit2,
    Printer,
    Hash,
    Users,
    Copy,
    Check,
    X,
    ShieldCheck,
    Loader2,
} from "lucide-react";

import useDisbursementStore from "../store/useDisbursementStore";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (dateString, styles = "long") => {
    if (!dateString) return "—";
    const options = styles === "short" ? {
        year: "numeric",
        month: "short",
        day: "numeric",
    } : {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-PH", options);
};

const CopyButton = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="btn btn-ghost btn-xs btn-square opacity-50 hover:opacity-100 transition-opacity"
            title={`Copy ${label}`}
        >
            {copied ? (
                <Check className="w-3 h-3 text-success" />
            ) : (
                <Copy className="w-3 h-3" />
            )}
        </button>
    );
};

const StatusTimeline = ({ status, dates }) => {
    const steps = [
        { label: "Received", date: dates.received, icon: Clock, done: true },
        { label: "Processing", date: dates.entered, icon: FileText, done: true },
        { label: "Approved", date: dates.approved, icon: CheckCircle, done: status === "approved" },
    ];

    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto py-6">
            {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center relative z-0 flex-1 group">
                    {/* Connector Line */}
                    {idx !== 0 && (
                        <div
                            className={`absolute top-5 right-1/2 w-full h-1 -z-10 transition-colors duration-500 ease-in-out ${step.done ? "bg-primary" : "bg-base-300"
                                }`}
                        />
                    )}

                    {/* Step Icon */}
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${step.done
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                            : "bg-base-100 border-base-300 text-base-content/30"
                            }`}
                    >
                        <step.icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="mt-3 text-center">
                        <p
                            className={`text-sm font-semibold transition-colors duration-300 ${step.done ? "text-primary" : "text-base-content/40"
                                }`}
                        >
                            {step.label}
                        </p>
                        <p className="text-xs text-base-content/60 mt-0.5">
                            {formatDate(step.date, "short")}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`card bg-base-100 shadow-sm border border-base-200 h-full ${className}`}>
        <div className="card-body p-6">
            <h3 className="card-title text-sm font-bold text-base-content/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {title}
            </h3>
            {children}
        </div>
    </div>
);

// ============================================
// APPROVAL MODAL COMPONENT
// ============================================
const ApprovalModal = ({ isOpen, onClose, disbursement, onConfirm, isLoading }) => {
    const [remarks, setRemarks] = useState("");

    const handleConfirm = () => {
        onConfirm(remarks);
    };

    const handleClose = () => {
        if (!isLoading) {
            setRemarks("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn border border-base-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-content">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Confirm Approval</h2>
                                <p className="text-sm text-primary-content/80">Review before proceeding</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Transaction Summary */}
                    <div className="bg-base-200/50 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                            Transaction Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-base-content/60">Reference</span>
                                <p className="font-mono font-semibold">DV-{disbursement?.dvNum || disbursement?.id}</p>
                            </div>
                            <div>
                                <span className="text-base-content/60">Payee</span>
                                <p className="font-semibold truncate">{disbursement?.payee?.name || "—"}</p>
                            </div>
                            <div>
                                <span className="text-base-content/60">Fund Source</span>
                                <p className="font-semibold">{disbursement?.fundSource?.code || "—"}</p>
                            </div>
                            <div>
                                <span className="text-base-content/60">Net Amount</span>
                                <p className="font-bold text-primary text-lg">
                                    {formatCurrency(disbursement?.netAmount || 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Remarks Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Remarks <span className="text-base-content/40 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add any notes or comments for this approval..."
                            className="textarea textarea-bordered w-full h-24 resize-none focus:textarea-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Warning */}
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <p className="text-sm text-warning-content/80">
                            This action is <strong>irreversible</strong>. Once approved, this disbursement will be marked as finalized in the system.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-base-200/30 px-6 py-4 flex items-center justify-end gap-3 border-t border-base-200">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="btn btn-primary gap-2 min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Approve Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Animation Styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================
const DisbursementViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedDisbursement, showDisbursement, approveDisbursement, isLoading, getDisbursementStatus } = useDisbursementStore();

    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        if (id) {
            showDisbursement(id);
        }
    }, [id, showDisbursement]);

    const handleApprove = async (remarks) => {
        setIsApproving(true);
        const result = await approveDisbursement(Number(id), remarks);
        setIsApproving(false);

        if (result.success) {
            setIsApprovalModalOpen(false);
            // Data is already updated in store by approveDisbursement
        }
    };

    if (isLoading && !selectedDisbursement) {
        return (
            <div className="min-h-screen bg-base-200/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-infinity loading-lg text-primary"></span>
                    <p className="text-sm font-medium text-base-content/60">Fetching Details...</p>
                </div>
            </div>
        );
    }

    if (!selectedDisbursement) {
        return (
            <div className="min-h-screen bg-base-200/50 flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-base-content/20" />
                    </div>
                    <h3 className="text-xl font-bold text-base-content mb-2">Record Not Found</h3>
                    <p className="text-base-content/60 mb-8">
                        The disbursement record you are looking for might have been removed or accessed via an invalid link.
                    </p>
                    <button onClick={() => navigate("/")} className="btn btn-primary w-full">
                        <ArrowLeft className="w-4 h-4" />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const status = getDisbursementStatus(selectedDisbursement);
    const disbursement = selectedDisbursement;

    return (
        <div className="min-h-screen bg-base-200/50 pb-20">
            {/* Approval Modal */}
            <ApprovalModal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                disbursement={disbursement}
                onConfirm={handleApprove}
                isLoading={isApproving}
            />

            {/* Top Navigation */}
            <nav className="bg-base-100 border-b border-base-200 sticky top-0 z-20 backdrop-blur-md bg-base-100/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/")}
                                className="btn btn-ghost btn-circle btn-sm"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                                    Disbursement Record
                                </span>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold text-base-content">
                                        DV-{disbursement.dvNum || disbursement.id}
                                    </h1>
                                    <div className={`badge badge-sm font-medium ${status.status === "approved" ? "badge-success gap-1" :
                                        status.status === "overdue" ? "badge-error gap-1" :
                                            "badge-warning gap-1"
                                        }`}>
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
                            <button className="btn btn-ghost btn-sm gap-2">
                                <Printer className="w-4 h-4" />
                                <span className="hidden sm:inline">Print</span>
                            </button>
                            <button className="btn btn-neutral btn-sm gap-2">
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                {/* Visual Status Timeline */}
                <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
                    <StatusTimeline
                        status={status.status}
                        dates={{
                            received: disbursement.dateReceived,
                            entered: disbursement.dateEntered,
                            approved: disbursement.approvedAt
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Financial Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="stats shadow bg-base-100 border border-base-200">
                                <div className="stat">
                                    <div className="stat-title">Gross Amount</div>
                                    <div className="stat-value text-xl">{formatCurrency(disbursement.grossAmount)}</div>
                                    <div className="stat-desc">Total Items</div>
                                </div>
                            </div>
                            <div className="stats shadow bg-base-100 border border-base-200">
                                <div className="stat">
                                    <div className="stat-title text-error">Deductions</div>
                                    <div className="stat-value text-xl text-error">-{formatCurrency(disbursement.totalDeductions)}</div>
                                    <div className="stat-desc text-error">Total Withheld</div>
                                </div>
                            </div>
                            <div className="stats shadow bg-primary text-primary-content border border-primary">
                                <div className="stat">
                                    <div className="stat-title text-primary-content/80">Net Amount</div>
                                    <div className="stat-value text-2xl">{formatCurrency(disbursement.netAmount)}</div>
                                    <div className="stat-desc text-primary-content/60">Final Payout</div>
                                </div>
                            </div>
                        </div>

                        {/* Particulars Section */}
                        <div className="card bg-base-100 shadow-sm border border-base-200">
                            <div className="card-body">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Particulars
                                </h3>
                                <div className="bg-base-200/50 p-4 rounded-xl font-mono text-sm leading-relaxed text-base-content/80">
                                    {disbursement.particulars || "No particulars specified."}
                                </div>
                            </div>
                        </div>

                        {/* Line Items & Deductions */}
                        <div className="space-y-6">
                            <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                                <div className="bg-base-200/40 px-6 py-3 border-b border-base-200 flex justify-between items-center">
                                    <h3 className="font-bold text-sm uppercase tracking-wide text-base-content/70">
                                        Line Items
                                    </h3>
                                    <span className="badge badge-ghost text-xs font-mono">
                                        {disbursement.items?.length || 0} items
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="w-16">#</th>
                                                <th>Description</th>
                                                <th>Account Code</th>
                                                <th className="text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disbursement.items?.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-base-200/30 transition-colors">
                                                    <td className="font-mono text-xs text-base-content/50">{idx + 1}</td>
                                                    <td className="font-medium">{item.description}</td>
                                                    <td>
                                                        <span className="badge badge-ghost badge-sm font-mono">
                                                            {item.accountCode || "—"}
                                                        </span>
                                                    </td>
                                                    <td className="text-right font-mono">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!disbursement.items || disbursement.items.length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-8 text-base-content/40 italic">
                                                        No line items found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {disbursement.deductions?.length > 0 && (
                                <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                                    <div className="bg-error/5 px-6 py-3 border-b border-error/10 flex justify-between items-center">
                                        <h3 className="font-bold text-sm uppercase tracking-wide text-error">
                                            Deductions
                                        </h3>
                                        <span className="badge badge-ghost text-xs font-mono text-error">
                                            {disbursement.deductions.length} total
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th className="text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {disbursement.deductions.map((ded, idx) => (
                                                    <tr key={idx} className="hover:bg-error/5 transition-colors">
                                                        <td className="font-medium">{ded.deductionType}</td>
                                                        <td className="text-right font-mono text-error">
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
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Reference Codes Panel */}
                        <InfoCard icon={Hash} title="Reference Codes">
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { label: "DV Number", value: disbursement.dvNum },
                                    { label: "ORS Number", value: disbursement.orsNum },
                                    { label: "LDDAP Number", value: disbursement.lddapNum },
                                    { label: "ACIC Number", value: disbursement.acicNum },
                                    { label: "UACS Code", value: disbursement.uacsCode },
                                    { label: "RESP Code", value: disbursement.respCode },
                                ].map((ref, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition-colors group">
                                        <div>
                                            <p className="text-xs text-base-content/50 uppercase font-semibold">{ref.label}</p>
                                            <p className={`font-mono font-medium ${!ref.value && "text-base-content/30 italic"}`}>
                                                {ref.value || "Not Set"}
                                            </p>
                                        </div>
                                        {ref.value && <CopyButton text={ref.value} label={ref.label} />}
                                    </div>
                                ))}
                            </div>
                        </InfoCard>

                        {/* Entities */}
                        <InfoCard icon={Users} title="Involved Entities">
                            <div className="space-y-6">
                                {/* Payee */}
                                <div>
                                    <p className="text-xs text-base-content/50 uppercase mb-2">Payee</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {disbursement.payee?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-base-content line-clamp-1">{disbursement.payee?.name}</p>
                                            <p className="text-xs bg-base-200 px-2 py-0.5 rounded-full inline-block mt-1">
                                                {disbursement.payee?.type || "Supplier"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="divider my-0"></div>
                                {/* Fund Source */}
                                <div>
                                    <p className="text-xs text-base-content/50 uppercase mb-2">Fund Source</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs ring-1 ring-emerald-500/20">
                                            {disbursement.fundSource?.code}
                                        </div>
                                        <div>
                                            <p className="font-bold text-base-content line-clamp-1">{disbursement.fundSource?.name}</p>
                                            <p className="text-xs text-base-content/60 mt-0.5">
                                                Code: <span className="font-mono">{disbursement.fundSource?.code}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>

                        {/* Actions */}
                        {status.status !== "approved" && (
                            <div className="card bg-base-100 shadow-lg border border-primary/20">
                                <div className="card-body p-6">
                                    <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-4">
                                        Quick Actions
                                    </h3>
                                    <button
                                        onClick={() => setIsApprovalModalOpen(true)}
                                        className="btn btn-primary w-full shadow-primary/20 shadow-lg"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Disbursement
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Approved Status Card */}
                        {status.status === "approved" && (
                            <div className="card bg-success/5 border border-success/20">
                                <div className="card-body p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-success" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-success">Approved</p>
                                            <p className="text-xs text-base-content/60">
                                                {formatDate(disbursement.approvedAt, "short")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DisbursementViewPage;
