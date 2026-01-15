import React, { useEffect, useState } from "react";
import {
    Users,
    Plus,
    Search,
    Edit2,
    Eye,
    MoreHorizontal,
    X,
    Building,
    Phone,
    Mail,
    CreditCard,
    Filter,
} from "lucide-react";

import usePayeeStore from "../store/usePayeeStore";
import PayeeForm from "../components/PayeeForm";

const PayeeManagerPage = () => {
    const {
        payees,
        fetchPayees,
        isLoading,
        setSelectedPayee,
        selectedPayee,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        getFilteredPayees,
        getPayeeTypes,
    } = usePayeeStore();

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchPayees();
    }, [fetchPayees]);

    const filteredPayees = getFilteredPayees();
    const payeeTypes = getPayeeTypes();

    const handleEdit = (payee) => {
        setSelectedPayee(payee);
        setShowForm(true);
    };

    const handleView = (payee) => {
        setSelectedPayee(payee);
        setShowDetails(true);
    };

    const handleCloseForm = () => {
        setSelectedPayee(null);
        setShowForm(false);
    };

    const handleCloseDetails = () => {
        setSelectedPayee(null);
        setShowDetails(false);
    };

    const getTypeColor = (type) => {
        const colors = {
            supplier: "bg-blue-100 text-blue-800 border-blue-200",
            contractor: "bg-purple-100 text-purple-800 border-purple-200",
            employee: "bg-green-100 text-green-800 border-green-200",
            utility: "bg-amber-100 text-amber-800 border-amber-200",
        };
        return colors[type?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-accent" />
                            </div>
                            Payee Management
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            Manage suppliers, contractors, and payment recipients
                        </p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2">
                        <Plus className="w-4 h-4" />
                        Add Payee
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-base-content">{payees.length}</p>
                        <p className="text-sm text-base-content/60">Total Payees</p>
                    </div>
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {payees.filter((p) => p.type === "supplier").length}
                        </p>
                        <p className="text-sm text-base-content/60">Suppliers</p>
                    </div>
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {payees.filter((p) => p.type === "contractor").length}
                        </p>
                        <p className="text-sm text-base-content/60">Contractors</p>
                    </div>
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {payees.filter((p) => p.isActive !== false).length}
                        </p>
                        <p className="text-sm text-base-content/60">Active</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-static p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or TIN..."
                                className="input input-bordered w-full pl-11 bg-base-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="select select-bordered bg-base-200"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                {payeeTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payee Table */}
                <div className="card-static overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="mt-4 text-base-content/60">Loading payees...</p>
                        </div>
                    ) : filteredPayees.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                            <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                                {searchQuery || filterType !== "all" ? "No payees match your criteria" : "No Payees Yet"}
                            </h3>
                            <p className="text-sm text-base-content/40 mb-6">
                                {searchQuery || filterType !== "all"
                                    ? "Try adjusting your filters"
                                    : "Add your first payee to get started"}
                            </p>
                            {!searchQuery && filterType === "all" && (
                                <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Payee
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Payee Name</th>
                                        <th>Type</th>
                                        <th>Contact</th>
                                        <th>TIN Number</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayees.map((payee) => (
                                        <tr key={payee.id}>
                                            <td>
                                                <div>
                                                    <p className="font-semibold text-base-content">{payee.name}</p>
                                                    <p className="text-sm text-base-content/50 truncate max-w-xs">
                                                        {payee.address || "No address"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getTypeColor(payee.type)}`}>
                                                    {payee.type || "supplier"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="space-y-1">
                                                    {payee.email && (
                                                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {payee.email}
                                                        </p>
                                                    )}
                                                    {payee.mobileNum && (
                                                        <p className="text-sm text-base-content/70 flex items-center gap-1">
                                                            <Phone className="w-3 h-3" /> {payee.mobileNum}
                                                        </p>
                                                    )}
                                                    {!payee.email && !payee.mobileNum && <span className="text-base-content/40">—</span>}
                                                </div>
                                            </td>
                                            <td className="font-mono text-sm text-base-content/70">
                                                {payee.tinNum || "—"}
                                            </td>
                                            <td className="text-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${payee.isActive !== false
                                                            ? "bg-success/10 text-success border-success/20"
                                                            : "bg-base-300 text-base-content/50 border-base-300"
                                                        }`}
                                                >
                                                    {payee.isActive !== false ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleView(payee)}
                                                        className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(payee)}
                                                        className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
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

            {/* Slide-over Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseForm} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-base-100 shadow-2xl animate-fade-in-up overflow-hidden">
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                                <h3 className="text-lg font-bold">
                                    {selectedPayee ? "Edit Payee" : "New Payee"}
                                </h3>
                                <button onClick={handleCloseForm} className="btn btn-ghost btn-sm btn-square">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <PayeeForm payee={selectedPayee} onClose={handleCloseForm} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetails && selectedPayee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseDetails} />
                    <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                            <h3 className="text-lg font-bold">Payee Details</h3>
                            <button onClick={handleCloseDetails} className="btn btn-ghost btn-sm btn-square">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                                    {selectedPayee.name?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">{selectedPayee.name}</h4>
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize mt-1 ${getTypeColor(selectedPayee.type)}`}>
                                        {selectedPayee.type || "supplier"}
                                    </span>
                                </div>
                            </div>

                            <div className="divider my-0"></div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                {selectedPayee.address && (
                                    <div className="flex gap-3">
                                        <Building className="w-5 h-5 text-base-content/40 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-base-content/50 uppercase tracking-wide">Address</p>
                                            <p className="text-base-content">{selectedPayee.address}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedPayee.email && (
                                    <div className="flex gap-3">
                                        <Mail className="w-5 h-5 text-base-content/40 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-base-content/50 uppercase tracking-wide">Email</p>
                                            <p className="text-base-content">{selectedPayee.email}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedPayee.mobileNum && (
                                    <div className="flex gap-3">
                                        <Phone className="w-5 h-5 text-base-content/40 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-base-content/50 uppercase tracking-wide">Phone</p>
                                            <p className="text-base-content">{selectedPayee.mobileNum}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedPayee.tinNum && (
                                    <div className="flex gap-3">
                                        <CreditCard className="w-5 h-5 text-base-content/40 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-base-content/50 uppercase tracking-wide">TIN Number</p>
                                            <p className="text-base-content font-mono">{selectedPayee.tinNum}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bank Details */}
                            {(selectedPayee.bankName || selectedPayee.accountNumber) && (
                                <>
                                    <div className="divider my-0"></div>
                                    <div>
                                        <h5 className="font-semibold mb-3">Banking Information</h5>
                                        <div className="bg-base-200 rounded-xl p-4 space-y-2">
                                            {selectedPayee.bankName && (
                                                <p className="text-sm"><span className="text-base-content/50">Bank:</span> {selectedPayee.bankName}</p>
                                            )}
                                            {selectedPayee.bankBranch && (
                                                <p className="text-sm"><span className="text-base-content/50">Branch:</span> {selectedPayee.bankBranch}</p>
                                            )}
                                            {selectedPayee.accountName && (
                                                <p className="text-sm"><span className="text-base-content/50">Account Name:</span> {selectedPayee.accountName}</p>
                                            )}
                                            {selectedPayee.accountNumber && (
                                                <p className="text-sm"><span className="text-base-content/50">Account Number:</span> <span className="font-mono">{selectedPayee.accountNumber}</span></p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-base-300 flex gap-3">
                            <button onClick={handleCloseDetails} className="btn btn-ghost flex-1">
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleCloseDetails();
                                    handleEdit(selectedPayee);
                                }}
                                className="btn btn-primary flex-1"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Payee
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayeeManagerPage;
