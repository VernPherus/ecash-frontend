import React, { useState } from "react";
import {
  Save,
  X,
  Banknote,
  FileText,
  Hash,
  RefreshCw,
  AlignLeft,
  AlertTriangle,
} from "lucide-react";
import useFundStore from "../store/useFundStore";
import { formatCurrency } from "../lib/formatters";

const defaultFormData = (fund) => ({
  code: fund?.code ?? "",
  seriesCode: fund?.seriesCode ?? "",
  name: fund?.name ?? "",
  initialBalance:
    fund?.initialBalance != null && String(fund.initialBalance).trim() !== ""
      ? String(fund.initialBalance)
      : "",
  description: fund?.description ?? "",
  reset: fund?.reset ?? "NONE",
});

const FundSourceForm = ({ fund, onClose }) => {
  const { createFund, updateFund, isLoading } = useFundStore();
  const isEditing = Boolean(fund?.id);

  const [formData, setFormData] = useState(() => defaultFormData(fund));
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Fund code is required";
    if (!formData.name.trim()) newErrors.name = "Fund name is required";
    if (!formData.seriesCode.trim()) newErrors.seriesCode = "Fund series code is required"

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

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);

    const payload = {
      ...formData,
      initialBalance: Number(formData.initialBalance),
    };

    let result;
    if (isEditing && fund?.id) {
      result = await updateFund(fund.id, payload);
    } else {
      result = await createFund(payload);
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

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
            aria-hidden="true"
          />
          <div className="relative bg-base-100 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scaleIn border border-base-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-base-content mb-2">
                  {isEditing ? "Confirm Update" : "Confirm Creation"}
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {isEditing
                    ? `Are you sure you want to update the fund source "${formData.code}"? This will modify the existing record.`
                    : `Are you sure you want to create a new fund source "${formData.code}"? Please verify all information is correct.`}
                </p>
              </div>
            </div>

            {/* Summary of key data */}
            <div className="bg-base-200/50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Code:</span>
                <span className="font-medium text-base-content font-mono">
                  {formData.code}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Series Code:</span>
                <span className="font-medium text-base-content font-mono">
                  {formData.seriesCode}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Name:</span>
                <span className="font-medium text-base-content">
                  {formData.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Initial Balance:</span>
                <span className="font-medium text-primary font-mono">
                  {formatCurrency(Number(formData.initialBalance))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Reset Frequency:</span>
                <span className="font-medium text-base-content">
                  {formData.reset}
                </span>
              </div>
              {formData.description && (
                <div className="pt-2 border-t border-base-300">
                  <span className="text-xs text-base-content/60">
                    Description:
                  </span>
                  <p className="text-sm text-base-content/80 mt-1 line-clamp-2">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="btn btn-ghost flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-5">
          {/* Code & Reset Frequency */}
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
                  Series Code <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <input 
                type="text" 
                name="seriesCode" 
                placeholder="e.g., 0000000" 
                className={`input input-bordered w-full pl-10 ${errors.seriesCode ? "input-error" : ""}`}
                value={formData.seriesCode}
                onChange={handleChange}
              />

              </div>
            </div>
          </div>

          {/* Reset Frequency */}
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
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          {/* Fund Name */}
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
    </>
  );
};

export default FundSourceForm;
