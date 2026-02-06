import React, { useState, useEffect } from "react";
import {
  Save,
  Calendar,
  User,
  Wallet,
  Plus,
  Trash2,
  Hash,
  CheckCircle2,
  FileText,
  Mail, // Added Mail icon
} from "lucide-react";
import useDisbursementStore from "../../store/useDisbursementStore";
import useFundStore from "../../store/useFundStore";
import usePayeeStore from "../../store/usePayeeStore";

const defaultFormData = () => ({
  payeeId: "",
  fundSourceId: "",
  dateReceived: new Date().toISOString().split("T")[0],
  checkNum: "",
  dvNum: "",
  orsNum: "",
  uacsCode: "",
  acicNum: "",
  respCode: "",
  particulars: "",
  ageLimit: "",
  sendMail: false, // Initialize sendMail
});

const Check = ({ onClose, initialData }) => {
  const isEdit = Boolean(initialData?.id);
  const { createDisbursement, updateDisbursement, isLoading } =
    useDisbursementStore();
  const { funds, fetchFunds } = useFundStore();
  const { payees, fetchPayees } = usePayeeStore();

  const [formData, setFormData] = useState(defaultFormData());
  const [items, setItems] = useState([
    { description: "", accountCode: "", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([]);
  const [isApproved, setIsApproved] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFunds();
    fetchPayees();
  }, [fetchFunds, fetchPayees]);

  useEffect(() => {
    if (!initialData) return;
    const ref = initialData.references?.[0];
    setFormData({
      payeeId: String(initialData.payeeId ?? ""),
      fundSourceId: String(initialData.fundSourceId ?? ""),
      dateReceived: initialData.dateReceived
        ? new Date(initialData.dateReceived).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      checkNum: initialData.checkNum ?? "",
      dvNum: ref?.dvNum ?? "",
      orsNum: ref?.orsNum ?? "",
      uacsCode: ref?.uacsCode ?? "",
      acicNum: ref?.acicNum ?? "",
      respCode: ref?.respCode ?? "",
      particulars: initialData.particulars ?? "",
      ageLimit:
        initialData.ageLimit != null ? String(initialData.ageLimit) : "",
      sendMail: false, // Default to false on edit
    });
    setItems(
      initialData.items?.length
        ? initialData.items.map((i) => ({
            description: i.description ?? "",
            accountCode: i.accountCode ?? "",
            amount: String(i.amount ?? ""),
          }))
        : [{ description: "", accountCode: "", amount: "" }],
    );
    setDeductions(
      initialData.deductions?.length
        ? initialData.deductions.map((d) => ({
            deductionType: d.deductionType ?? "",
            amount: String(d.amount ?? ""),
          }))
        : [],
    );
    const paid =
      initialData.status === "PAID" || initialData.approvedAt != null;
    setIsApproved(paid);
  }, [initialData]);

  // --- Handlers ---
  const handleChange = (e) => {
    // Check if input is a checkbox to handle value correctly
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleArrayChange = (setter, list, idx, field, val) => {
    const updated = list.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item,
    );
    setter(updated);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.payeeId) newErrors.payeeId = "Required";
    if (!formData.fundSourceId) newErrors.fundSourceId = "Required";
    if (!formData.checkNum) newErrors.checkNum = "Required";
    if (items.some((i) => !i.description || !i.amount))
      newErrors.items = "Incomplete items";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const grossAmount = items.reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0,
    );
    const totalDeductions = deductions.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0,
    );

    const ageLimitVal = formData.ageLimit?.trim()
      ? Number(formData.ageLimit)
      : 5;
    const payload = {
      ...formData,
      payeeId: Number(formData.payeeId),
      fundSourceId: Number(formData.fundSourceId),
      method: "CHECK",
      lddapMethod: null,
      ageLimit: ageLimitVal,
      grossAmount,
      totalDeductions,
      netAmount: grossAmount - totalDeductions,
      approvedAt: isApproved ? new Date().toISOString() : null,
      status: isApproved ? "PAID" : "PENDING",
      items: items.map((i) => ({
        description: i.description,
        accountCode: i.accountCode,
        amount: Number(i.amount),
      })),
      deductions: deductions
        .filter(
          (d) => d.deductionType && d.deductionType.trim() !== "" && d.amount,
        )
        .map((d) => ({
          deductionType: d.deductionType.trim(),
          amount: Number(d.amount),
        })),
      acicNum: formData.acicNum ?? "",
      orsNum: formData.orsNum ?? "",
      dvNum: formData.dvNum ?? "",
      uacsCode: formData.uacsCode ?? "",
      respCode: formData.respCode ?? "",
      sendMail: formData.sendMail, // Pass checkbox value
    };

    if (isEdit) {
      const result = await updateDisbursement(initialData.id, payload);
      if (result.success) onClose();
    } else {
      const result = await createDisbursement(payload);
      if (result.success) onClose();
    }
  };

  // --- Render Helper ---
  const inputClass = (err) =>
    `input input-bordered input-sm w-full ${err ? "input-error" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
        {/* 1. Primary Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payee */}
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">
                Payee <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-base-content/40" />
              <select
                name="payeeId"
                className={`select select-bordered select-sm w-full pl-10 ${errors.payeeId ? "select-error" : ""}`}
                value={formData.payeeId}
                onChange={handleChange}
              >
                <option value="">Select Payee...</option>
                {payees.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fund Source */}
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">
                Fund Source <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-2.5 w-4 h-4 text-base-content/40" />
              <select
                name="fundSourceId"
                className={`select select-bordered select-sm w-full pl-10 ${errors.fundSourceId ? "select-error" : ""}`}
                value={formData.fundSourceId}
                onChange={handleChange}
              >
                <option value="">Select Fund...</option>
                {funds
                  .filter((f) => f.isActive)
                  .map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.code} - {opt.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Items & Deductions */}
        <div className="space-y-4">
          {/* Items */}
          <div className="flex justify-between items-center border-b border-base-200 pb-1">
            <span className="text-xs font-bold uppercase text-base-content/60">
              Line Items
            </span>
            <button
              type="button"
              onClick={() =>
                setItems([
                  ...items,
                  { description: "", accountCode: "", amount: "" },
                ])
              }
              className="btn btn-xs btn-ghost gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Description"
                className={inputClass()}
                value={item.description}
                onChange={(e) =>
                  handleArrayChange(
                    setItems,
                    items,
                    idx,
                    "description",
                    e.target.value,
                  )
                }
              />
              <input
                type="text"
                placeholder="Code"
                className={`${inputClass()} w-24`}
                value={item.accountCode}
                onChange={(e) =>
                  handleArrayChange(
                    setItems,
                    items,
                    idx,
                    "accountCode",
                    e.target.value,
                  )
                }
              />
              <input
                type="number"
                placeholder="0.00"
                className={`${inputClass()} w-32 text-right`}
                value={item.amount}
                onChange={(e) =>
                  handleArrayChange(
                    setItems,
                    items,
                    idx,
                    "amount",
                    e.target.value,
                  )
                }
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  className="btn btn-xs btn-square btn-ghost text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {errors.items && <p className="text-error text-xs">{errors.items}</p>}

          {/* Deductions */}
          <div className="flex justify-between items-center border-b border-base-200 pb-1 pt-2">
            <span className="text-xs font-bold uppercase text-base-content/60">
              Deductions
            </span>
            <button
              type="button"
              onClick={() =>
                setDeductions([
                  ...deductions,
                  { deductionType: "", amount: "" },
                ])
              }
              className="btn btn-xs btn-ghost gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          {deductions.map((d, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Tax/Deduction Type"
                className={inputClass()}
                value={d.deductionType}
                onChange={(e) =>
                  handleArrayChange(
                    setDeductions,
                    deductions,
                    idx,
                    "deductionType",
                    e.target.value,
                  )
                }
              />
              <input
                type="number"
                placeholder="0.00"
                className={`${inputClass()} w-32 text-right text-error`}
                value={d.amount}
                onChange={(e) =>
                  handleArrayChange(
                    setDeductions,
                    deductions,
                    idx,
                    "amount",
                    e.target.value,
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  setDeductions(deductions.filter((_, i) => i !== idx))
                }
                className="btn btn-xs btn-square btn-ghost text-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* 3. References Grid */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold uppercase text-base-content/70 border-b border-base-200 pb-2">
            References
          </h4>

          {/* Row 1: Check No. & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  Check Number <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-base-content/40" />
                <input
                  type="text"
                  name="checkNum"
                  placeholder="Check #..."
                  className={`input input-bordered input-sm w-full pl-9 ${errors.checkNum ? "input-error" : ""}`}
                  value={formData.checkNum}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  Date
                </span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-base-content/40" />
                <input
                  type="date"
                  name="dateReceived"
                  className="input input-bordered input-sm w-full pl-9"
                  value={formData.dateReceived}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Row 2: DV & ORS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  DV Number
                </span>
              </label>
              <input
                type="text"
                name="dvNum"
                className="input input-bordered input-sm w-full font-mono"
                placeholder="DV-XXXX"
                value={formData.dvNum}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  ORS Number
                </span>
              </label>
              <input
                type="text"
                name="orsNum"
                className="input input-bordered input-sm w-full font-mono"
                placeholder="ORS-XXXX"
                value={formData.orsNum}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3: UACS, ACIC, Resp Code */}
          <div className="grid grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  UACS Code
                </span>
              </label>
              <input
                type="text"
                name="uacsCode"
                className="input input-bordered input-sm w-full font-mono"
                value={formData.uacsCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  ACIC Number
                </span>
              </label>
              <input
                type="text"
                name="acicNum"
                className="input input-bordered input-sm w-full font-mono"
                placeholder="ACIC-XXXX"
                value={formData.acicNum}
                onChange={handleChange}
              />
            </div>

            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium text-xs uppercase">
                  Response Code
                </span>
              </label>
              <input
                type="text"
                name="respCode"
                className="input input-bordered input-sm w-full font-mono"
                value={formData.respCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Age Limit */}
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium text-xs uppercase">
                Age limit (days)
              </span>
            </label>
            <input
              type="number"
              name="ageLimit"
              min={1}
              placeholder="5"
              title="Days until overdue; default 5 if empty"
              className="input input-bordered input-sm w-full font-mono"
              value={formData.ageLimit}
              onChange={handleChange}
            />
          </div>

          {/* Particulars */}
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium text-xs uppercase">
                Particulars
              </span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
              <textarea
                name="particulars"
                placeholder="Details..."
                className="textarea textarea-bordered h-20 text-sm resize-none pl-10"
                value={formData.particulars}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* --- SETTINGS SECTION (Approval & Email) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Approved Checkbox */}
          <div className="form-control p-3 bg-base-200/50 rounded-lg border border-base-200">
            <label className="label cursor-pointer justify-start gap-3 py-0">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-success"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
              />
              <span className="label-text font-medium flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${isApproved ? "text-success" : "text-base-content/40"}`}
                />
                Mark as Paid / Approved
              </span>
            </label>
          </div>

          {/* Send Mail Checkbox */}
          {!isEdit ? (
            <div className="form-control p-3 bg-base-200/50 rounded-lg border border-base-200">
              <label className="label cursor-pointer justify-start gap-3 py-0">
                <input
                  type="checkbox"
                  name="sendMail"
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={formData.sendMail}
                  onChange={handleChange}
                />
                <span className="label-text font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Send Email Notification
                </span>
              </label>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-200 flex gap-3 bg-base-100 mt-auto">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-ghost flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-sm btn-primary flex-1"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Save className="w-4 h-4 mr-1" />
          )}{" "}
          {isEdit ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Check;
