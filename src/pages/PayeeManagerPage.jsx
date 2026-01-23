import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Eye,
  X,
  Building,
  Phone,
  Mail,
  CreditCard,
  Filter,
  Briefcase,
} from "lucide-react";

import usePayeeStore from "../store/usePayeeStore";
import PayeeForm from "../components/PayeeForm";

const PayeeManagerPage = () => {
  const {
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

  // Updated colors to be dark-mode friendly (using opacity)
  const getTypeColor = (type) => {
    const t = type?.toLowerCase();
    switch (t) {
      case "supplier":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "contractor":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "employee":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "utility":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "government":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-base-200 text-base-content/70 border-base-300";
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      {/* --- HEADER --- */}
      <header className="bg-base-100 border-b border-base-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight flex items-center gap-3">
              Payee Management
            </h1>
            <p className="text-sm text-base-content/60 mt-0.5">
              Directory of suppliers, contractors, and employees.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Payee</span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* FILTERS TOOLBAR */}
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by name, TIN, or email..."
              className="input input-bordered w-full pl-10 h-10 text-sm bg-base-200/50 focus:bg-base-100 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-base-200/50 rounded-lg border border-base-300 w-full md:w-auto">
              <Filter className="w-4 h-4 text-base-content/50" />
              <select
                className="bg-transparent text-sm font-medium text-base-content focus:outline-none cursor-pointer w-full"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {payeeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-base-200/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredPayees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-base-content/20" />
              </div>
              <h3 className="text-lg font-semibold text-base-content/70">
                {searchQuery || filterType !== "all"
                  ? "No payees match your filters"
                  : "No Payees Found"}
              </h3>
              <p className="text-sm text-base-content/40 mt-1 max-w-xs mx-auto">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search criteria."
                  : "Get started by adding your first supplier or contractor."}
              </p>
              {!searchQuery && filterType === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary btn-sm mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Payee
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-base-200/50 text-base-content/60 text-xs uppercase font-semibold tracking-wider">
                  <tr className="border-b border-base-200">
                    <th className="px-6 py-4">Payee Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">TIN</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-base-100">
                  {filteredPayees.map((payee) => (
                    <tr
                      key={payee.id}
                      className="group hover:bg-base-200/40 transition-colors"
                    >
                      {/* Name & Address */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[250px]">
                          <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
                            {payee.name}
                          </span>
                          <span className="text-xs text-base-content/50 truncate mt-0.5">
                            {payee.address || "No address provided"}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getTypeColor(payee.type)}`}
                        >
                          {payee.type || "supplier"}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {payee.email ? (
                            <div className="flex items-center gap-2 text-xs text-base-content/70">
                              <Mail className="w-3 h-3 text-base-content/40" />
                              {payee.email}
                            </div>
                          ) : null}
                          {payee.mobileNum ? (
                            <div className="flex items-center gap-2 text-xs text-base-content/70">
                              <Phone className="w-3 h-3 text-base-content/40" />
                              {payee.mobileNum}
                            </div>
                          ) : null}
                          {!payee.email && !payee.mobileNum && (
                            <span className="text-xs text-base-content/40 italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </td>

                      {/* TIN */}
                      <td className="px-6 py-4 font-mono text-xs text-base-content/70">
                        {payee.tinNum || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        {payee.isActive !== false ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-base-300 text-base-content/50 border border-base-300">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(payee)}
                            className="btn btn-xs btn-outline border-base-300 text-base-content/60 hover:text-info hover:border-info"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleEdit(payee)}
                            className="btn btn-xs btn-outline border-base-300 text-base-content/60 hover:text-primary hover:border-primary"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
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
      </main>

      {/* --- MODAL: CREATE / EDIT FORM --- */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseForm}
          />
          <div className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col overflow-hidden animate-scaleIn border border-base-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50 shrink-0">
              <h3 className="text-lg font-bold text-base-content">
                {selectedPayee ? "Edit Payee" : "Create New Payee"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - PayeeForm handles its own scrolling now */}
            <div className="flex-1 overflow-hidden p-6">
              <PayeeForm payee={selectedPayee} onClose={handleCloseForm} />
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: VIEW DETAILS --- */}
      {showDetails && selectedPayee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseDetails}
          />
          <div className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-base-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50/50">
              <h3 className="text-lg font-bold text-base-content">
                Payee Details
              </h3>
              <button
                onClick={handleCloseDetails}
                className="btn btn-ghost btn-sm btn-square"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
                  {selectedPayee.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-base-content leading-tight">
                    {selectedPayee.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${getTypeColor(selectedPayee.type)}`}
                    >
                      {selectedPayee.type || "supplier"}
                    </span>
                    {selectedPayee.isActive === false && (
                      <span className="badge badge-xs badge-ghost">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="divider my-4"></div>

              {/* Info Grid */}
              <div className="space-y-5">
                <div className="flex gap-4">
                  <Building className="w-5 h-5 text-base-content/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <p className="text-sm text-base-content">
                      {selectedPayee.address || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-base-content/40 shrink-0 mt-0.5" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="text-sm text-base-content truncate">
                        {selectedPayee.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-base-content/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
                        Mobile
                      </p>
                      <p className="text-sm text-base-content">
                        {selectedPayee.mobileNum || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CreditCard className="w-5 h-5 text-base-content/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-wide mb-1">
                      TIN Number
                    </p>
                    <p className="text-sm text-base-content font-mono">
                      {selectedPayee.tinNum || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              {(selectedPayee.bankName || selectedPayee.accountNumber) && (
                <>
                  <div className="divider my-4"></div>
                  <div className="bg-base-200/50 rounded-xl p-4 border border-base-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="w-4 h-4 text-base-content/60" />
                      <h5 className="font-bold text-sm text-base-content/80">
                        Banking Information
                      </h5>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-base-content/50">Bank:</span>
                        <span className="font-medium">
                          {selectedPayee.bankName || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/50">Branch:</span>
                        <span className="font-medium">
                          {selectedPayee.bankBranch || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/50">
                          Account Name:
                        </span>
                        <span className="font-medium">
                          {selectedPayee.accountName || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-base-300 pt-2 mt-2">
                        <span className="text-base-content/50">
                          Account No:
                        </span>
                        <span className="font-mono font-bold">
                          {selectedPayee.accountNumber || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-base-200 bg-base-50/50 flex gap-3">
              <button
                onClick={handleCloseDetails}
                className="btn btn-ghost flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCloseDetails();
                  handleEdit(selectedPayee);
                }}
                className="btn btn-primary flex-1 shadow-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit Payee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out forwards;
                }
            `}</style>
    </div>
  );
};

export default PayeeManagerPage;
