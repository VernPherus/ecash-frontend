import React, { useState } from "react";
import {
    Save,
    X,
    User,
    MapPin,
    Mail,
    Phone,
    CreditCard,
    Building,
    FileText,
} from "lucide-react";
import usePayeeStore from "../store/usePayeeStore";

const PayeeForm = ({ payee, onClose }) => {
    const { createPayee, updatePayee, isLoading } = usePayeeStore();
    const isEditing = Boolean(payee);

    const [formData, setFormData] = useState({
        name: payee?.name || "",
        type: payee?.type || "supplier",
        address: payee?.address || "",
        email: payee?.email || "",
        mobileNum: payee?.mobileNum || "",
        contactPerson: payee?.contactPerson || "",
        tinNum: payee?.tinNum || "",
        bankName: payee?.bankName || "",
        bankBranch: payee?.bankBranch || "",
        accountName: payee?.accountName || "",
        accountNumber: payee?.accountNumber || "",
        remarks: payee?.remarks || "",
    });

    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("basic");

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Payee name is required";
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
        if (isEditing) {
            result = await updatePayee(payee.id, formData);
        } else {
            result = await createPayee(formData);
        }

        if (result.success) {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const tabs = [
        { id: "basic", label: "Basic Info" },
        { id: "contact", label: "Contact" },
        { id: "banking", label: "Banking" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex bg-base-200 rounded-lg p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-base-100 text-base-content shadow-sm"
                                : "text-base-content/60 hover:text-base-content"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Payee Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Payee Name
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter payee/company name"
                            className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.name}</span>
                            </label>
                        )}
                    </div>

                    {/* Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Payee Type</span>
                        </label>
                        <select
                            name="type"
                            className="select select-bordered"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="supplier">Supplier</option>
                            <option value="contractor">Contractor</option>
                            <option value="employee">Employee</option>
                            <option value="utility">Utility</option>
                            <option value="government">Government</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Address
                            </span>
                        </label>
                        <textarea
                            name="address"
                            placeholder="Full address"
                            className="textarea textarea-bordered resize-none h-20"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    {/* TIN Number */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                TIN Number
                            </span>
                        </label>
                        <input
                            type="text"
                            name="tinNum"
                            placeholder="000-000-000-000"
                            className="input input-bordered font-mono"
                            value={formData.tinNum}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Contact Person */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Contact Person
                            </span>
                        </label>
                        <input
                            type="text"
                            name="contactPerson"
                            placeholder="Primary contact name"
                            className="input input-bordered"
                            value={formData.contactPerson}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                Email Address
                            </span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.email}</span>
                            </label>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                Mobile Number
                            </span>
                        </label>
                        <input
                            type="tel"
                            name="mobileNum"
                            placeholder="+63 XXX XXX XXXX"
                            className="input input-bordered"
                            value={formData.mobileNum}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            {/* Banking Tab */}
            {activeTab === "banking" && (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Bank Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Building className="w-4 h-4 text-primary" />
                                Bank Name
                            </span>
                        </label>
                        <input
                            type="text"
                            name="bankName"
                            placeholder="e.g., BDO, BPI, Metrobank"
                            className="input input-bordered"
                            value={formData.bankName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Bank Branch */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Bank Branch</span>
                        </label>
                        <input
                            type="text"
                            name="bankBranch"
                            placeholder="Branch name/location"
                            className="input input-bordered"
                            value={formData.bankBranch}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Account Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Account Name</span>
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            placeholder="Name on bank account"
                            className="input input-bordered"
                            value={formData.accountName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Account Number */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                Account Number
                            </span>
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            placeholder="Bank account number"
                            className="input input-bordered font-mono"
                            value={formData.accountNumber}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Remarks */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Remarks
                            </span>
                        </label>
                        <textarea
                            name="remarks"
                            placeholder="Additional notes..."
                            className="textarea textarea-bordered resize-none h-20"
                            value={formData.remarks}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-base-300">
                <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                    <X className="w-4 h-4" />
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {isEditing ? "Update" : "Create"} Payee
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default PayeeForm;
