import React, { useState } from "react";
import {
  Save,
  X,
  Banknote,
  FileText,
  Hash,
  RefreshCw,
  AlignLeft,
} from "lucide-react";
import useFundStore from "../store/useFundStore";

const FundSourceForm = ({ fund, onClose }) => {
  const { createFund, updateFund, isLoading } = useFundStore();
  const isEditing = Boolean(fund);

  const [formData, setFormData] = useState({
    code: fund?.code || "",
    name: fund?.name || "",
    initialBalance: fund?.initialBalance || "",
    description: fund?.description || "",
    reset: fund?.reset || "NONE",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Fund code is required";
    if (!formData.name.trim()) newErrors.name = "Fund name is required";

    // Balance is required
    if (formData.initialBalance === "" || formData.initialBalance === null) {
      newErrors.initialBalance = "Initial balance is required";
    } else if (isNaN(Number(formData.initialBalance))) {
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
      initialBalance: Number(formData.initialBalance),
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 space-y-5">
        {/* 1. Code & Reset Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium text-base-content/70">
                Fund Code <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
              <input
                type="text"
                name="code"
                placeholder="e.g., GF-101"
                className={`input input-bordered w-full pl-10 ${errors.code ? "input-error" : ""}`}
                value={formData.code}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
            {errors.code && (
              <span className="label-text-alt text-error mt-1">
                {errors.code}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium text-base-content/70">
                Reset Frequency <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <RefreshCw className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
              <select
                name="reset"
                className="select select-bordered w-full pl-10"
                value={formData.reset}
                onChange={handleChange}
              >
                <option value="NONE">None</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Fund Name */}
        <div className="form-control">
          <label className="label pt-0">
            <span className="label-text font-medium text-base-content/70">
              Fund Name <span className="text-error">*</span>
            </span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
            <input
              type="text"
              name="name"
              placeholder="e.g., General Fund"
              className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && (
            <span className="label-text-alt text-error mt-1">
              {errors.name}
            </span>
          )}
        </div>

        {/* 3. Initial Balance */}
        <div className="form-control">
          <label className="label pt-0">
            <span className="label-text font-medium text-base-content/70">
              Initial Balance <span className="text-error">*</span>
            </span>
          </label>
          <div className="relative">
            <Banknote className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
            <input
              type="number"
              name="initialBalance"
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`input input-bordered w-full pl-10 font-mono ${errors.initialBalance ? "input-error" : ""}`}
              value={formData.initialBalance}
              onChange={handleChange}
            />
          </div>
          {errors.initialBalance && (
            <span className="label-text-alt text-error mt-1">
              {errors.initialBalance}
            </span>
          )}
        </div>

        {/* 4. Description (Optional) */}
        <div className="form-control">
          <label className="label pt-0">
            <span className="label-text font-medium text-base-content/70">
              Description
            </span>
          </label>
          <div className="relative">
            <AlignLeft className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
            <textarea
              name="description"
              placeholder="Add notes about this fund source..."
              className="textarea textarea-bordered w-full pl-10 resize-none h-24"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 mt-2 border-t border-base-200">
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
          {isEditing ? "Update" : "Create"} Fund
        </button>
      </div>
    </form>
  );
};

export default FundSourceForm;
