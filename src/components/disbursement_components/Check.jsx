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
} from "lucide-react";
import useDisbursementStore from "../../store/useDisbursementStore";
import useFundStore from "../../store/useFundStore";
import usePayeeStore from "../../store/usePayeeStore";

const Check = ({ onClose }) => {
  const { createDisbursement, isLoading } = useDisbursementStore();
  const { funds, fetchFunds } = useFundStore();
  const { payees, fetchPayees } = usePayeeStore();

  const [formData, setFormData] = useState({
    payeeId: "",
    fundSourceId: "",
    dateReceived: new Date().toISOString().split("T")[0],
    checkNum: "",
    dvNum: "",
    orsNum: "",
    uacsCode: "",
    particulars: "",
  });

  const [items, setItems] = useState([
    { description: "", accountCode: "", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([]);
  const [isApproved, setIsApproved] = useState(true); // Default: Checked
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFunds();
    fetchPayees();
  }, [fetchFunds, fetchPayees]);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleArrayChange = (setter, list, idx, field, val) => {
    const updated = [...list];
    updated[idx][field] = val;
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

    const payload = {
      ...formData,
      payeeId: Number(formData.payeeId),
      fundSourceId: Number(formData.fundSourceId),
      method: "CHECK",
      grossAmount,
      totalDeductions,
      netAmount: grossAmount - totalDeductions,
      approvedAt: isApproved ? new Date().toISOString() : null,
      status: isApproved ? "PAID" : "PENDING", // FIX: Use PAID instead of APPROVED
      items: items.map((i) => ({
        description: i.description,
        accountCode: i.accountCode,
        amount: Number(i.amount),
      })),
      deductions: deductions.map((d) => ({
        deductionType: d.deductionType || "",
        amount: Number(d.amount),
      })),
    };

    const result = await createDisbursement(payload);
    if (result.success) onClose();
  };

  // --- Render Helper ---
  const inputClass = (err) =>
    `input input-bordered input-sm w-full ${err ? "input-error" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
        {/* 1. Primary Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Payee",
              name: "payeeId",
              icon: User,
              options: payees,
              display: "name",
            },
            {
              label: "Fund Source",
              name: "fundSourceId",
              icon: Wallet,
              options: funds,
              display: (f) => `${f.code} - ${f.name}`,
            },
          ].map((field) => (
            <div key={field.name} className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">
                  {field.label} <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <field.icon className="absolute left-3 top-2.5 w-4 h-4 text-base-content/40" />
                <select
                  name={field.name}
                  className={`select select-bordered select-sm w-full pl-10 ${errors[field.name] ? "select-error" : ""}`}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select {field.label}...</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {typeof field.display === "function"
                        ? field.display(opt)
                        : opt[field.display]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Items & Deductions */}
        <div className="space-y-4">
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
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-base-content/60 border-b border-base-200 pb-1">
            References
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Check Number",
                name: "checkNum",
                icon: Hash,
                required: true,
              },
              {
                label: "Date",
                name: "dateReceived",
                icon: Calendar,
                type: "date",
              },
              { label: "DV Number", name: "dvNum" },
              { label: "ORS Number", name: "orsNum" },
              { label: "UACS Code", name: "uacsCode", fullWidth: true },
            ].map((f) => (
              <div
                key={f.name}
                className={`form-control ${f.fullWidth ? "col-span-2" : ""}`}
              >
                <label className="label pt-0">
                  <span className="text-xs font-medium uppercase text-base-content/70">
                    {f.label}{" "}
                    {f.required && <span className="text-error">*</span>}
                  </span>
                </label>
                <div className="relative">
                  {f.icon && (
                    <f.icon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-base-content/40" />
                  )}
                  <input
                    type={f.type || "text"}
                    name={f.name}
                    placeholder="..."
                    className={`input input-bordered input-sm w-full ${f.icon ? "pl-9" : ""} ${errors[f.name] ? "input-error" : ""}`}
                    value={formData[f.name]}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-control">
            <label className="label pt-0">
              <span className="text-xs font-medium uppercase text-base-content/70">
                Particulars
              </span>
            </label>
            <textarea
              name="particulars"
              placeholder="Details..."
              className="textarea textarea-bordered h-20 text-sm resize-none"
              value={formData.particulars}
              onChange={handleChange}
            />
          </div>

          {/* --- APPROVAL CHECKBOX --- */}
          <div className="form-control mt-2 p-3 bg-base-200/50 rounded-lg border border-base-200">
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
                Mark as Paid / Approved Immediately
              </span>
            </label>
          </div>
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
          Submit
        </button>
      </div>
    </form>
  );
};

export default Check;
