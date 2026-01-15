import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
};

const DisbursementTable = ({ disbursements, isLoading, showActions = true }) => {
    const navigate = useNavigate();
    const { getDisbursementStatus } = useDisbursementStore();

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/60">Loading disbursements...</p>
            </div>
        );
    }

    if (!disbursements || disbursements.length === 0) {
        return (
            <div className="p-12 text-center">
                <p className="text-base-content/60">No disbursements found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-modern">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Payee</th>
                        <th>Fund</th>
                        <th className="text-right">Net Amount</th>
                        <th className="text-center">Status</th>
                        {showActions && <th className="text-center">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {disbursements.map((disbursement) => {
                        const status = getDisbursementStatus(disbursement);
                        return (
                            <tr key={disbursement.id}>
                                <td className="text-base-content/60">
                                    {disbursement.dateReceived
                                        ? new Date(disbursement.dateReceived).toLocaleDateString("en-PH", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                        : "---"}
                                </td>
                                <td className="text-base-content/40 font-mono text-sm">
                                    {disbursement.dvNum || disbursement.orsNum || "---"}
                                </td>
                                <td className="font-medium text-base-content">
                                    {disbursement.payee?.name || "---"}
                                </td>
                                <td>
                                    <span className="px-2.5 py-1 bg-base-200 text-base-content/70 rounded-lg text-xs font-semibold border border-base-300">
                                        {disbursement.fundSource?.code || "---"}
                                    </span>
                                </td>
                                <td className="text-right font-bold text-base-content">
                                    {formatCurrency(disbursement.netAmount)}
                                </td>
                                <td>
                                    <div className="flex justify-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                                            {status.status === "approved" ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : status.status === "overdue" ? (
                                                <AlertCircle className="w-3 h-3" />
                                            ) : (
                                                <Clock className="w-3 h-3" />
                                            )}
                                            {status.label}
                                        </span>
                                    </div>
                                </td>
                                {showActions && (
                                    <td className="text-center">
                                        <button
                                            onClick={() => navigate(`/disbursement/${disbursement.id}`)}
                                            className="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DisbursementTable;
