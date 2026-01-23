import React, { useState, useEffect } from "react";
import { Save, Calendar, User, Wallet, Wifi, FileEdit } from "lucide-react";
import useDisbursementStore from "../../store/useDisbursementStore";
import useFundStore from "../../store/useFundStore";
import usePayeeStore from "../../store/usePayeeStore";

const Lddap = ({ onClose }) => {
  const { createDisbursement, isLoading } = useDisbursementStore();
  const { funds, fetchFunds } = useFundStore();
  const { payees, fetchPayees } = usePayeeStore();

  // "ONLINE" or "MANUAL"
  const [method, setMethod] = useState("ONLINE");

  const [formData, setFormData] = useState({
    payeeId: "",
    fundSourceId: "",
    dateReceived: new Date().toISOString().split("T")[0],
    // Manual fields
    dvNum: "",
    orsNum: "",
    particulars: "",
  });

  // For Manual: Line Items
  const [items, setItems] = useState([
    { description: "", accountCode: "", amount: "" },
  ]);
  // For Online: Single Total Amount
  const [onlineAmount, setOnlineAmount] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFunds();
    fetchPayees();
  }, [fetchFunds, fetchPayees]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  // --- Validation & Submit ---
  const validate = () => {
    const newErrors = {};
    if (!formData.payeeId) newErrors.payeeId = "Required";
    if (!formData.fundSourceId) newErrors.fundSourceId = "Required";

    if (method === "ONLINE") {
      if (!onlineAmount || isNaN(onlineAmount))
        newErrors.onlineAmount = "Amount is required";
    } else {
      const invalidItems = items.some((i) => !i.description || !i.amount);
      if (invalidItems) newErrors.items = "Incomplete items";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Construct Payload based on Method
    let finalItems = [];
    let grossAmount = 0;

    if (method === "ONLINE") {
      // Online: Create a generic item automatically
      grossAmount = Number(onlineAmount);
      finalItems = [
        {
          description: "LDDAP Online Transfer",
          accountCode: "N/A",
          amount: grossAmount,
        },
      ];
    } else {
      // Manual: Use the list
      finalItems = items.map((i) => ({ ...i, amount: Number(i.amount) }));
      grossAmount = finalItems.reduce((sum, i) => sum + i.amount, 0);
    }

    const payload = {
      ...formData,
      payeeId: Number(formData.payeeId),
      fundSourceId: Number(formData.fundSourceId),
      method: method, // "ONLINE" or "MANUAL" (Mapped to LDDAP logic in backend)
      grossAmount,
      netAmount: grossAmount, // Assuming no deductions for simple LDDAP for now
      items: finalItems,
      deductions: [], // Add deductions logic here if Manual LDDAP needs it
    };

    const result = await createDisbursement(payload);
    if (result.success) onClose();
  };

  // --- Render Helpers ---
  const handleItemChange = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 p-6 custom-scrollbar">
        {/* Method Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-base-200 p-1 rounded-lg inline-flex">
            <button
              type="button"
              onClick={() => setMethod("ONLINE")}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${method === "ONLINE" ? "bg-primary text-white shadow-md" : "text-base-content/60 hover:text-base-content"}`}
            >
              <Wifi className="w-4 h-4" /> ONLINE
            </button>
            <button
              type="button"
              onClick={() => setMethod("MANUAL")}
              className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${method === "MANUAL" ? "bg-primary text-white shadow-md" : "text-base-content/60 hover:text-base-content"}`}
            >
              <FileEdit className="w-4 h-4" /> MANUAL
            </button>
          </div>
        </div>

        <div className="space-y-6 animate-fade-in">
          {/* Common Fields */}
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

          {/* --- ONLINE MODE SPECIFIC --- */}
          {method === "ONLINE" && (
            <div className="bg-base-200/50 p-6 rounded-xl border border-base-200 text-center space-y-4">
              <h4 className="font-bold text-sm text-base-content/70 uppercase">
                Quick Transfer Details
              </h4>
              <div className="form-control max-w-xs mx-auto">
                <label className="label justify-center">
                  <span className="label-text font-medium">
                    Total Amount <span className="text-error">*</span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 font-bold">
                    ₱
                  </span>
                  <input
                    type="number"
                    className={`input input-bordered w-full pl-10 text-lg font-bold text-center ${errors.onlineAmount ? "input-error" : ""}`}
                    placeholder="0.00"
                    value={onlineAmount}
                    onChange={(e) => setOnlineAmount(e.target.value)}
                  />
                </div>
                {errors.onlineAmount && (
                  <span className="text-error text-xs mt-1">
                    {errors.onlineAmount}
                  </span>
                )}
              </div>
              <div className="text-xs text-base-content/50">
                This will generate a standard LDDAP Online record.
              </div>
            </div>
          )}

          {/* --- MANUAL MODE SPECIFIC --- */}
          {method === "MANUAL" && (
            <div className="space-y-4">
              {/* Date & Refs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium">Date</span>
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
                    <span className="label-text font-medium">DV Number</span>
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

              {/* Items */}
              <div className="border-t border-base-200 pt-4">
                <h4 className="font-bold text-sm mb-2">Line Items</h4>
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      className="input input-bordered input-sm flex-1"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, "description", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered input-sm w-32"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(idx, "amount", e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setItems([
                      ...items,
                      { description: "", accountCode: "", amount: "" },
                    ])
                  }
                  className="btn btn-xs btn-ghost"
                >
                  + Add Item
                </button>
                {errors.items && (
                  <p className="text-error text-xs">{errors.items}</p>
                )}
              </div>
            </div>
          )}
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
          Submit LDDAP
        </button>
      </div>
    </form>
  );
};

export default Lddap;
