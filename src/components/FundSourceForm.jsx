import React, { useState } from "react";
import { Save, X, DollarSign, FileText, Code } from "lucide-react";
import useFundStore from "../store/useFundStore";

const FundSourceForm = ({ fund, onClose }) => {
    const { createFund, updateFund, isLoading } = useFundStore();
    const isEditing = Boolean(fund);

    const [formData, setFormData] = useState({
        code: fund?.code || "",
        name: fund?.name || "",
        initialBalance: fund?.initialBalance || "",
        description: fund?.description || "",
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.code.trim()) newErrors.code = "Fund code is required";
        if (!formData.name.trim()) newErrors.name = "Fund name is required";
        if (formData.initialBalance && isNaN(Number(formData.initialBalance))) {
            newErrors.initialBalance = "Must be a valid number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            initialBalance: formData.initialBalance ? Number(formData.initialBalance) : 0,
        };

        let result;
        if (isEditing) {
            result = await updateFund(fund.id, payload);
        } else {
            result = await createFund(payload);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fund Code */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        Fund Code
                        <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="text"
                    name="code"
                    placeholder="e.g., GF-101"
                    className={`input input-bordered ${errors.code ? "input-error" : ""}`}
                    value={formData.code}
                    onChange={handleChange}
                    disabled={isEditing}
                />
                {errors.code && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.code}</span>
                    </label>
                )}
                {isEditing && (
                    <label className="label">
                        <span className="label-text-alt text-base-content/50">Code cannot be changed after creation</span>
                    </label>
                )}
            </div>

            {/* Fund Name */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Fund Name
                        <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="e.g., General Fund"
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

            {/* Initial Balance */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Initial Balance
                    </span>
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 font-medium">
                        ₱
                    </span>
                    <input
                        type="number"
                        name="initialBalance"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`input input-bordered w-full pl-8 ${errors.initialBalance ? "input-error" : ""}`}
                        value={formData.initialBalance}
                        onChange={handleChange}
                    />
                </div>
                {errors.initialBalance && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.initialBalance}</span>
                    </label>
                )}
            </div>

            {/* Description */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Description</span>
                    <span className="label-text-alt text-base-content/50">Optional</span>
                </label>
                <textarea
                    name="description"
                    placeholder="Add notes about this fund source..."
                    className="textarea textarea-bordered resize-none h-24"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

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
                            {isEditing ? "Update" : "Create"} Fund
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default FundSourceForm;
