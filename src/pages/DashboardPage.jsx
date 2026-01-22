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
    Filter,
    MoreHorizontal,
    Eye,
} from "lucide-react";

import useFundStore from "../store/useFundStore";
import useDisbursementStore from "../store/useDisbursementStore";
import useAuthStore from "../store/useAuthStore";
import NotificationDropdown from "../components/NotificationDropdown";

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
        getDisbursementStatus,
        getRecentDisbursements,
        isLoading: disbursementsLoading,
    } = useDisbursementStore();

    useEffect(() => {
        fetchFunds();
        fetchDisbursements();
    }, [fetchFunds, fetchDisbursements]);

    const recentDisbursements = getRecentDisbursements();

    // Calculate Total Disbursement Amount (Net)
    const totalDisbursed = disbursements.reduce((sum, d) => sum + Number(d.netAmount || 0), 0);

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
                        <NotificationDropdown align="right" />

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
                                const { spent, remaining } = getFundLiquidity(fund);

                                return (
                                    <div
                                        key={fund.id}
                                        className="card-elevated p-6 cursor-pointer group hover:border-primary/30 transition-all duration-300"
                                        onClick={() => navigate(`/funds`)}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className={`fund-badge ${getFundColor(idx)}`}>
                                                    {fund.code}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-base font-medium text-base-content/70 mb-1">
                                                    {fund.name}
                                                </h3>
                                                <p className="text-2xl font-bold text-base-content tracking-tight group-hover:text-primary transition-colors">
                                                    {formatCurrency(remaining)}
                                                </p>
                                                <p className="text-xs text-base-content/40 mt-1 uppercase tracking-wider font-semibold">
                                                    Available Balance
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-base-200 flex items-center justify-between text-sm">
                                                <span className="text-base-content/50">Total Used</span>
                                                <span className="font-medium text-base-content/80">
                                                    {formatCurrency(spent)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Total Disbursement Section */}
                <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <div className="card-elevated bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 p-8 flex items-center justify-between relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                        <div className="relative z-10">
                            <h2 className="text-lg font-medium text-base-content/60 flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Total Disbursements
                            </h2>
                            <div className="flex items-baseline gap-2">
                                <h1 className="text-5xl font-bold text-base-content tracking-tight">
                                    {formatCurrency(totalDisbursed)}
                                </h1>
                                <span className="text-sm font-medium text-success py-1 px-2.5 bg-success/10 rounded-full border border-success/20 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    All time
                                </span>
                            </div>
                            <p className="text-sm text-base-content/40 mt-2">
                                Total net amount disbursed across all funds
                            </p>
                        </div>

                        <div className="relative z-10 hidden md:block">
                            <div className="w-16 h-16 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/20 transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                                <Wallet className="w-8 h-8" />
                            </div>
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
