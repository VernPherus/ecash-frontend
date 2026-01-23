import React, { useState, useEffect } from "react";
import { Save, Calendar, User, Wallet, Plus, Trash2 } from "lucide-react";
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
    dvNum: "",
    orsNum: "",
    particulars: "",
  });

  const [items, setItems] = useState([
    { description: "", accountCode: "", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFunds();
    fetchPayees();
  }, [fetchFunds, fetchPayees]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  // Item Logic
  const handleItemChange = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };
  const addItem = () =>
    setItems([...items, { description: "", accountCode: "", amount: "" }]);
  const removeItem = (index) =>
    items.length > 1 && setItems(items.filter((_, i) => i !== index));

  // Deduction Logic
  const handleDeductionChange = (idx, field, val) => {
    const newDed = [...deductions];
    newDed[idx][field] = val;
    setDeductions(newDed);
  };
  const addDeduction = () =>
    setDeductions([...deductions, { deductionType: "", amount: "" }]);
  const removeDeduction = (index) =>
    setDeductions(deductions.filter((_, i) => i !== index));

  const validate = () => {
    const newErrors = {};
    if (!formData.payeeId) newErrors.payeeId = "Required";
    if (!formData.fundSourceId) newErrors.fundSourceId = "Required";
    if (items.some((i) => !i.description || !i.amount))
      newErrors.items = "Incomplete items";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const grossAmount = items.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalDeductions = deductions.reduce(
      (sum, d) => sum + Number(d.amount),
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
      items: items.map((i) => ({ ...i, amount: Number(i.amount) })),
      deductions: deductions.map((d) => ({ ...d, amount: Number(d.amount) })),
    };

    const result = await createDisbursement(payload);
    if (result.success) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 p-6 custom-scrollbar space-y-6">
        {/* 1. Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">
                Payee <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
              <select
                name="payeeId"
                className={`select select-bordered w-full pl-10 ${errors.payeeId ? "select-error" : ""}`}
                value={formData.payeeId}
                onChange={handleChange}
              >
                <option value="">Select Payee...</option>
                {payees.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">
                Fund Source <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
              <select
                name="fundSourceId"
                className={`select select-bordered w-full pl-10 ${errors.fundSourceId ? "select-error" : ""}`}
                value={formData.fundSourceId}
                onChange={handleChange}
              >
                <option value="">Select Fund...</option>
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code} - {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Items & Deductions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-base-200 pb-2">
            <h4 className="text-sm font-bold uppercase text-base-content/70">
              Line Items
            </h4>
            <button
              type="button"
              onClick={addItem}
              className="btn btn-xs btn-outline border-base-300 gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-2 items-start bg-base-200/50 p-2 rounded-lg"
            >
              <input
                type="text"
                placeholder="Description"
                className="input input-bordered input-sm flex-1 w-full"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(idx, "description", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Code"
                className="input input-bordered input-sm w-24"
                value={item.accountCode}
                onChange={(e) =>
                  handleItemChange(idx, "accountCode", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered input-sm w-32"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(idx, "amount", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="btn btn-xs btn-square btn-ghost text-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {errors.items && <p className="text-error text-xs">{errors.items}</p>}

          <div className="flex justify-between items-center border-b border-base-200 pb-2 pt-2">
            <h4 className="text-sm font-bold uppercase text-base-content/70">
              Deductions
            </h4>
            <button
              type="button"
              onClick={addDeduction}
              className="btn btn-xs btn-ghost text-base-content/60 gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {deductions.map((d, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Tax/Deduction"
                className="input input-bordered input-sm flex-1"
                value={d.deductionType}
                onChange={(e) =>
                  handleDeductionChange(idx, "deductionType", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered input-sm w-32 text-error"
                value={d.amount}
                onChange={(e) =>
                  handleDeductionChange(idx, "amount", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeDeduction(idx)}
                className="btn btn-xs btn-square btn-ghost text-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* 3. References */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium text-xs uppercase">
                Date
              </span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
              <input
                type="date"
                name="dateReceived"
                className="input input-bordered w-full pl-10"
                value={formData.dateReceived}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium text-xs uppercase">
                DV Number
              </span>
            </label>
            <input
              type="text"
              name="dvNum"
              className="input input-bordered"
              placeholder="DV-XXXX"
              value={formData.dvNum}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-base-200 flex gap-3 bg-base-100">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary flex-1"
        >
          {isLoading ? (
            <span className="loading loading-spinner" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Submit Check
        </button>
      </div>
    </form>
  );
};

export default Check;
