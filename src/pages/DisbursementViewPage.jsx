import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    Calendar,
    Building,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle,
    Edit2,
    Printer,
    MoreHorizontal,
    Hash,
    Users,
    Wallet,
    Minus,
} from "lucide-react";

import useDisbursementStore from "../store/useDisbursementStore";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const DisbursementViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedDisbursement, showDisbursement, isLoading, getDisbursementStatus } = useDisbursementStore();

    useEffect(() => {
        if (id) {
            showDisbursement(id);
        }
    }, [id, showDisbursement]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading disbursement...</p>
                </div>
            </div>
        );
    }

    if (!selectedDisbursement) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                    <h3 className="text-lg font-semibold text-base-content/60 mb-2">Disbursement Not Found</h3>
                    <p className="text-sm text-base-content/40 mb-4">The requested record could not be found</p>
                    <button onClick={() => navigate("/")} className="btn btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const status = getDisbursementStatus(selectedDisbursement);
    const disbursement = selectedDisbursement;

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-ghost btn-sm btn-square"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">
                                Disbursement Details
                            </h1>
                            <p className="text-sm text-base-content/60 mt-1">
                                Reference: {disbursement.dvNum || disbursement.orsNum || `#${disbursement.id}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-ghost gap-2">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button className="btn btn-primary gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-6xl mx-auto space-y-6">
                {/* Status Banner */}
                <div className={`card-static p-4 flex items-center justify-between ${status.status === "approved" ? "border-success/30 bg-success/5" :
                        status.status === "overdue" ? "border-error/30 bg-error/5" :
                            "border-warning/30 bg-warning/5"
                    }`}>
                    <div className="flex items-center gap-3">
                        {status.status === "approved" ? (
                            <CheckCircle className="w-6 h-6 text-success" />
                        ) : status.status === "overdue" ? (
                            <AlertCircle className="w-6 h-6 text-error" />
                        ) : (
                            <Clock className="w-6 h-6 text-warning" />
                        )}
                        <div>
                            <p className={`font-semibold ${status.status === "approved" ? "text-success" :
                                    status.status === "overdue" ? "text-error" :
                                        "text-warning"
                                }`}>
                                {status.status === "approved" ? "Approved" :
                                    status.status === "overdue" ? "Overdue" :
                                        "Pending Approval"}
                            </p>
                            <p className="text-sm text-base-content/60">
                                {status.status === "approved"
                                    ? `Approved on ${formatDate(disbursement.approvedAt)}`
                                    : `${status.days || 0} days since received`}
                            </p>
                        </div>
                    </div>
                    {status.status !== "approved" && (
                        <button className="btn btn-success gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Reference Codes */}
                        <div className="card-static p-6">
                            <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-primary" />
                                Reference Codes
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-base-200 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">DV Number</p>
                                    <p className="font-mono font-medium">{disbursement.dvNum || "—"}</p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">ORS Number</p>
                                    <p className="font-mono font-medium">{disbursement.orsNum || "—"}</p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">LDDAP Number</p>
                                    <p className="font-mono font-medium">{disbursement.lddapNum || "—"}</p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">ACIC Number</p>
                                    <p className="font-mono font-medium">{disbursement.acicNum || "—"}</p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">UACS Code</p>
                                    <p className="font-mono font-medium">{disbursement.uacsCode || "—"}</p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">RESP Code</p>
                                    <p className="font-mono font-medium">{disbursement.respCode || "—"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Particulars */}
                        {disbursement.particulars && (
                            <div className="card-static p-6">
                                <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Particulars
                                </h3>
                                <p className="text-base-content/80 whitespace-pre-wrap">
                                    {disbursement.particulars}
                                </p>
                            </div>
                        )}

                        {/* Line Items */}
                        {disbursement.items && disbursement.items.length > 0 && (
                            <div className="card-static overflow-hidden">
                                <div className="px-6 py-4 border-b border-base-300">
                                    <h3 className="font-semibold text-base-content flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Line Items
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table-modern">
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>Account Code</th>
                                                <th className="text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disbursement.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.description}</td>
                                                    <td className="font-mono text-sm">{item.accountCode || "—"}</td>
                                                    <td className="text-right font-medium">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Deductions */}
                        {disbursement.deductions && disbursement.deductions.length > 0 && (
                            <div className="card-static overflow-hidden">
                                <div className="px-6 py-4 border-b border-base-300">
                                    <h3 className="font-semibold text-base-content flex items-center gap-2">
                                        <Minus className="w-4 h-4 text-error" />
                                        Deductions
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table-modern">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th className="text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disbursement.deductions.map((deduction, idx) => (
                                                <tr key={idx}>
                                                    <td>{deduction.deductionType}</td>
                                                    <td className="text-right font-medium text-error">
                                                        -{formatCurrency(deduction.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Amount Summary */}
                        <div className="card-static p-6">
                            <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Amount Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-base-content/60">Gross Amount</span>
                                    <span className="font-medium">{formatCurrency(disbursement.grossAmount)}</span>
                                </div>
                                <div className="flex justify-between text-error">
                                    <span>Total Deductions</span>
                                    <span className="font-medium">-{formatCurrency(disbursement.totalDeductions || 0)}</span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex justify-between text-lg">
                                    <span className="font-semibold">Net Amount</span>
                                    <span className="font-bold text-primary">{formatCurrency(disbursement.netAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payee Info */}
                        <div className="card-static p-6">
                            <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Payee
                            </h3>
                            {disbursement.payee ? (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {disbursement.payee.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{disbursement.payee.name}</p>
                                        <p className="text-sm text-base-content/60 capitalize">{disbursement.payee.type || "Supplier"}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-base-content/50">No payee assigned</p>
                            )}
                        </div>

                        {/* Fund Source */}
                        <div className="card-static p-6">
                            <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-primary" />
                                Fund Source
                            </h3>
                            {disbursement.fundSource ? (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                        {disbursement.fundSource.code}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{disbursement.fundSource.name}</p>
                                        <p className="text-sm text-base-content/60">{disbursement.fundSource.code}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-base-content/50">No fund source assigned</p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="card-static p-6">
                            <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                Dates
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-base-content/50">Date Received</p>
                                    <p className="font-medium">{formatDate(disbursement.dateReceived)}</p>
                                </div>
                                <div>
                                    <p className="text-base-content/50">Date Entered</p>
                                    <p className="font-medium">{formatDate(disbursement.dateEntered)}</p>
                                </div>
                                {disbursement.approvedAt && (
                                    <div>
                                        <p className="text-base-content/50">Date Approved</p>
                                        <p className="font-medium">{formatDate(disbursement.approvedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Method */}
                        <div className="card-static p-6">
                            <h3 className="font-semibold text-base-content mb-2">Payment Method</h3>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${disbursement.method === "ONLINE"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                {disbursement.method || "MANUAL"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisbursementViewPage;
