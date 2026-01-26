import { useState } from "react";
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Building,
  Hash,
  Briefcase,
} from "lucide-react";
import usePayeeStore from "../store/usePayeeStore";

const PayeeForm = ({ payee, onClose }) => {
  const { createPayee, updatePayee, isLoading } = usePayeeStore();
  const isEditing = Boolean(payee?.id);

  const [formData, setFormData] = useState({
    name: payee?.name || "",
    type: payee?.type || "SUPPLIER",
    mobileNum: payee?.mobileNum || "", // Required by backend
    address: payee?.address || "",
    email: payee?.email || "",
    contactPerson: payee?.contactPerson || "",
    tinNum: payee?.tinNum || "",
    bankName: payee?.bankName || "",
    bankBranch: payee?.bankBranch || "",
    accountName: payee?.accountName || "",
    accountNumber: payee?.accountNumber || "",
    remarks: payee?.remarks || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Backend Requirements: Name, Type, Mobile Number
    if (!formData.name.trim()) newErrors.name = "Payee name is required";
    if (!formData.mobileNum.trim())
      newErrors.mobileNum = "Mobile number is required";
    if (!formData.type) newErrors.type = "Payee type is required";

    // Optional Validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let result;
    if (isEditing && payee?.id) {
      result = await updatePayee(payee.id, formData);
    } else {
      result = await createPayee(formData);
    }

    if (result?.success) {
      onClose?.();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Helper for Section Headers
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 pb-2 border-b border-base-200 mb-4 mt-2">
      <Icon className="w-4 h-4 text-primary" />
      <h4 className="text-sm font-bold text-base-content/70 uppercase tracking-wide">
        {title}
      </h4>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar max-h-[60vh] md:max-h-[65vh]">
        {/* 1. Core Information */}
        <div>
          <SectionHeader icon={Briefcase} title="Core Information" />
          <div className="space-y-4">
            {/* Name (Required) */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">
                  Payee Name <span className="text-error" aria-label="required">*</span>
                </span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter company or individual name (required)"
                required
                aria-required="true"
                className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="label-text-alt text-error mt-1" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type (Required) */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">
                    Type <span className="text-error" aria-label="required">*</span>
                  </span>
                </label>
                <select
                  name="type"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.type)}
                  className={`select select-bordered w-full ${errors.type ? "select-error" : ""}`}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type...</option>
                  <option value="SUPPLIER">Supplier</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
                {errors.type && (
                  <span className="label-text-alt text-error mt-1" role="alert">
                    {errors.type}
                  </span>
                )}
              </div>

              {/* Mobile Number (Required) */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">
                    Mobile Number <span className="text-error" aria-label="required">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                  <input
                    type="tel"
                    name="mobileNum"
                    placeholder="09XX XXX XXXX (required)"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.mobileNum)}
                    className={`input input-bordered w-full pl-10 ${errors.mobileNum ? "input-error" : ""}`}
                    value={formData.mobileNum}
                    onChange={handleChange}
                  />
                </div>
                {errors.mobileNum && (
                  <span className="label-text-alt text-error mt-1" role="alert">
                    {errors.mobileNum}
                  </span>
                )}
              </div>
            </div>

            {/* TIN Number */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">TIN Number</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                <input
                  type="text"
                  name="tinNum"
                  placeholder="000-000-000"
                  className="input input-bordered w-full pl-10 font-mono"
                  value={formData.tinNum}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Contact Details */}
        <div>
          <SectionHeader icon={User} title="Contact Details" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Person */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Contact Person</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Representative Name"
                  className="input input-bordered w-full"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <span className="label-text-alt text-error mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">Address</span>
              </label>
              <textarea
                name="address"
                placeholder="Registered business address"
                className="textarea textarea-bordered h-20 resize-none w-full"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 3. Banking & Remarks */}
        <div>
          <SectionHeader icon={Building} title="Banking & Other" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bank Name */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Bank Name</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="e.g. BDO, BPI"
                  className="input input-bordered w-full"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>

              {/* Branch */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Branch</span>
                </label>
                <input
                  type="text"
                  name="bankBranch"
                  placeholder="Branch Location"
                  className="input input-bordered w-full"
                  value={formData.bankBranch}
                  onChange={handleChange}
                />
              </div>

              {/* Account Name */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Account Name</span>
                </label>
                <input
                  type="text"
                  name="accountName"
                  placeholder="Account Holder Name"
                  className="input input-bordered w-full"
                  value={formData.accountName}
                  onChange={handleChange}
                />
              </div>

              {/* Account Number */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">Account Number</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="0000 0000 00"
                    className="input input-bordered w-full pl-10 font-mono"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">Remarks</span>
              </label>
              <textarea
                name="remarks"
                placeholder="Additional notes..."
                className="textarea textarea-bordered h-20 resize-none w-full"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- FIXED FOOTER ACTIONS --- */}
      <div className="pt-4 mt-2 border-t border-base-200 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost flex-1"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary flex-1 shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEditing ? "Save Changes" : "Create Payee"}
        </button>
      </div>
    </form>
  );
};

export default PayeeForm;
