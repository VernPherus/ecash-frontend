import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wallet,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    PlusCircle,
    Search,
    Bell,
    Filter,
    MoreHorizontal,
    Eye,
} from "lucide-react";

import useFundStore from "../store/useFundStore";
import useDisbursementStore from "../store/useDisbursementStore";
import useAuthStore from "../store/useAuthStore";

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { funds, fetchFunds, isLoading: fundsLoading, getFundColor } = useFundStore();
    const {
        disbursements,
        fetchDisbursements,
        getStats,
        getDisbursementStatus,
        getRecentDisbursements,
        isLoading: disbursementsLoading,
    } = useDisbursementStore();

    useEffect(() => {
        fetchFunds();
        fetchDisbursements();
    }, [fetchFunds, fetchDisbursements]);

    const stats = getStats();
    const recentDisbursements = getRecentDisbursements();

    // Calculate fund liquidity for each fund
    const getFundLiquidity = (fund) => {
        const spent = disbursements
            .filter((d) => d.fundSourceId === fund.id && d.status === "approved")
            .reduce((sum, d) => sum + Number(d.netAmount || 0), 0);
        const remaining = Number(fund.initialBalance || 0) - spent;
        const percentage = fund.initialBalance > 0
            ? (spent / Number(fund.initialBalance)) * 100
            : 0;
        return { spent, remaining, percentage };
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-base-content">
                            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.firstName || "User"}
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            {new Date().toLocaleDateString("en-PH", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search disbursements..."
                                className="input input-bordered pl-11 pr-4 h-11 w-72 bg-base-200 border-base-300 focus:bg-base-100"
                            />
                        </div>
                        {/* Notifications */}
                        <button className="btn btn-ghost btn-circle relative">
                            <Bell className="w-5 h-5" />
                            {stats.overdueCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse" />
                            )}
                        </button>
                        {/* New Entry Button */}
                        <button
                            onClick={() => navigate("/disbursement/new")}
                            className="btn btn-primary gap-2"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">New Entry</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Fund Liquidity Section */}
                <section className="animate-fade-in-up">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-primary" />
                            </div>
                            Fund Liquidity
                            <span className="text-sm font-normal text-base-content/50 ml-1">
                                Monthly Availability
                            </span>
                        </h2>
                        <button
                            onClick={() => navigate("/funds")}
                            className="btn btn-ghost btn-sm text-primary"
                        >
                            View All
                        </button>
                    </div>

                    {fundsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="card-static p-6 animate-pulse">
                                    <div className="h-6 bg-base-300 rounded w-20 mb-4" />
                                    <div className="h-8 bg-base-300 rounded w-32 mb-4" />
                                    <div className="h-2 bg-base-300 rounded w-full mb-2" />
                                    <div className="h-4 bg-base-300 rounded w-24" />
                                </div>
                            ))}
                        </div>
                    ) : funds.length === 0 ? (
                        <div className="card-static p-12 text-center">
                            <Wallet className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
                            <h3 className="font-semibold text-base-content/60 mb-2">No Fund Sources</h3>
                            <p className="text-sm text-base-content/40 mb-4">Get started by adding your first fund source</p>
                            <button onClick={() => navigate("/funds")} className="btn btn-primary btn-sm">
                                Add Fund Source
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                            {funds.slice(0, 6).map((fund, idx) => {
                                const { spent, remaining, percentage } = getFundLiquidity(fund);
                                const isLow = percentage > 80;
                                const isCritical = percentage > 95;

                                return (
                                    <div
                                        key={fund.id}
                                        className="card-elevated p-6 cursor-pointer group"
                                        onClick={() => navigate(`/funds`)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className={`fund-badge ${getFundColor(idx)}`}>
                                                    {fund.code}
                                                </span>
                                                <h3 className="font-bold text-base-content mt-2 group-hover:text-primary transition-colors">
                                                    {fund.name}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-base-content/50 uppercase tracking-wide">
                                                    Available
                                                </p>
                                                <p className={`text-lg font-bold ${isCritical ? "text-error" : isLow ? "text-warning" : "text-primary"}`}>
                                                    {formatCurrency(remaining)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="progress-bar mb-2">
                                            <div
                                                className={`progress-bar-fill ${isCritical
                                                    ? "bg-error"
                                                    : isLow
                                                        ? "bg-warning"
                                                        : "bg-slate-800"
                                                    }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-base-content/50">
                                            <span>Used: {formatCurrency(spent)}</span>
                                            <span className={isCritical ? "text-error font-medium" : ""}>
                                                {Math.round(percentage)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* KPI Stats Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    {/* Pending */}
                    <div className="stat-card">
                        <div>
                            <p className="text-sm text-base-content/60 font-medium mb-1">
                                Pending Approval
                            </p>
                            <h3 className="text-3xl font-bold text-base-content">
                                {stats.pendingCount}
                                <span className="text-lg font-normal text-base-content/50 ml-1">
                                    Records
                                </span>
                            </h3>
                            {stats.pendingCount > 0 && (
                                <p className="text-xs text-warning mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Requires attention
                                </p>
                            )}
                        </div>
                        <div className="stat-icon bg-warning/10 border border-warning/20">
                            <FileText className="w-6 h-6 text-warning" />
                        </div>
                    </div>

                    {/* Approved */}
                    <div className="stat-card">
                        <div>
                            <p className="text-sm text-base-content/60 font-medium mb-1">
                                Total Approved
                            </p>
                            <h3 className="text-3xl font-bold text-base-content">
                                {stats.approvedCount}
                                <span className="text-lg font-normal text-base-content/50 ml-1">
                                    Records
                                </span>
                            </h3>
                            <p className="text-xs text-success mt-2 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Processed this month
                            </p>
                        </div>
                        <div className="stat-icon bg-success/10 border border-success/20">
                            <CheckCircle2 className="w-6 h-6 text-success" />
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="stat-card">
                        <div>
                            <p className="text-sm text-base-content/60 font-medium mb-1">
                                Overdue Items
                            </p>
                            <h3 className="text-3xl font-bold text-base-content">
                                {stats.overdueCount}
                                <span className="text-lg font-normal text-base-content/50 ml-1">
                                    Records
                                </span>
                            </h3>
                            {stats.overdueCount > 0 && (
                                <p className="text-xs text-error mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Immediate action needed
                                </p>
                            )}
                        </div>
                        <div className="stat-icon bg-error/10 border border-error/20">
                            <AlertCircle className="w-6 h-6 text-error" />
                        </div>
                    </div>
                </section>

                {/* Recent Transactions Table */}
                <section className="card-static overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
                        <h3 className="font-semibold text-base-content flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Recent Transactions
                        </h3>
                        <div className="flex items-center gap-2">
                            <button className="btn btn-ghost btn-sm gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <button className="text-sm text-primary font-medium hover:underline">
                                View All
                            </button>
                        </div>
                    </div>

                    {disbursementsLoading ? (
                        <div className="p-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                                    <div className="h-4 bg-base-300 rounded w-24" />
                                    <div className="h-4 bg-base-300 rounded w-32" />
                                    <div className="h-4 bg-base-300 rounded flex-1" />
                                    <div className="h-4 bg-base-300 rounded w-20" />
                                </div>
                            ))}
                        </div>
                    ) : recentDisbursements.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
                            <h3 className="font-semibold text-base-content/60 mb-2">No Transactions Yet</h3>
                            <p className="text-sm text-base-content/40">Disbursements will appear here once created</p>
                        </div>
                    ) : (
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
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentDisbursements.map((disbursement) => {
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
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => navigate(`/disbursement/${disbursement.id}`)}
                                                        className="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
