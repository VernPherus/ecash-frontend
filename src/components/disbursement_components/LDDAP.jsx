import { useState, useEffect } from "react";
import {
  Save,
  Calendar,
  User,
  Wallet,
  Wifi,
  FileEdit,
  Plus,
  Trash2,
  Hash,
  FileText,
  RefreshCw,
  Mail, // Import Mail icon
} from "lucide-react";
import useDisbursementStore from "../../store/useDisbursementStore";
import useFundStore from "../../store/useFundStore";
import usePayeeStore from "../../store/usePayeeStore";

const defaultFormData = () => ({
  payeeId: "",
  fundSourceId: "",
  dateReceived: new Date().toISOString().split("T")[0],
  lddapNum: "",
  dvNum: "",
  orsNum: "",
  uacsCode: "",
  acicNum: "",
  respCode: "",
  particulars: "",
  ageLimit: "",
  sendMail: false, // Initialize sendMail
});

const Lddap = ({ onClose, initialData }) => {
  const isEdit = Boolean(initialData?.id);
  const { createDisbursement, updateDisbursement, isLoading, getLddapCode } =
    useDisbursementStore();
  const { funds, fetchFunds } = useFundStore();
  const { payees, fetchPayees } = usePayeeStore();

  const [method, setMethod] = useState("ONLINE");
  const [formData, setFormData] = useState(defaultFormData());
  const [items, setItems] = useState([
    { description: "", accountCode: "", amount: "" },
  ]);
  const [deductions, setDeductions] = useState([]);
  const [onlineAmount, setOnlineAmount] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Code Generation Handler
  const handleGenerateLDDAPCode = async () => {
    const date = formData.dateReceived;

    // Find the fund that matches the selected fundSourceId
    const selectedFund = funds.find((f) => f.id === Number(formData.fundSourceId));

    if (!selectedFund || !selectedFund.seriesCode) {
      // Handle case where fund is not found or has no seriesCode
      alert("Please select a valid fund source first");
      return;
    }

    const seriesCode = selectedFund.seriesCode;

    console.log("Sending to backend:", { date, seriesCode });

    setIsGenerating(true);
    const code = await getLddapCode({ date, seriesCode });
    setIsGenerating(false);

    if (code) {
      setFormData((prev) => ({ ...prev, lddapNum: code }));
      if (errors.lddapNum) setErrors((prev) => ({ ...prev, lddapNum: null }));
    }
  };

  useEffect(() => {
    fetchFunds(1, 100);
    fetchPayees();
  }, [fetchFunds, fetchPayees]);

  useEffect(() => {
    if (!initialData) return;
    const ref = initialData.references?.[0];
    const isOnline =
      initialData.lddapMthd === "ONLINE" ||
      (initialData.items?.length === 1 &&
        initialData.items[0]?.description === "LDDAP Online Transfer");
    setMethod(isOnline ? "ONLINE" : "MANUAL");
    setFormData({
      payeeId: String(initialData.payeeId ?? ""),
      fundSourceId: String(initialData.fundSourceId ?? ""),
      dateReceived: initialData.dateReceived
        ? new Date(initialData.dateReceived).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      lddapNum: initialData.lddapNum ?? "",
      dvNum: ref?.dvNum ?? "",
      orsNum: ref?.orsNum ?? "",
      uacsCode: ref?.uacsCode ?? "",
      acicNum: ref?.acicNum ?? "",
      respCode: ref?.respCode ?? "",
      particulars: initialData.particulars ?? "",
      ageLimit:
        initialData.ageLimit != null ? String(initialData.ageLimit) : "",
      sendMail: false, // Default to false on edit to prevent accidental resend
    });
    if (isOnline) {
      setOnlineAmount(String(initialData.grossAmount ?? ""));
      setItems([{ description: "", accountCode: "", amount: "" }]);
      setDeductions([]);
    } else {
      setOnlineAmount("");
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
    }
    setIsApproved(
      initialData.status === "PAID" || initialData.approvedAt != null,
    );
  }, [initialData]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleItemChange = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };
  const addItem = () =>
    setItems([...items, { description: "", accountCode: "", amount: "" }]);
  const removeItem = (index) =>
    items.length > 1 && setItems(items.filter((_, i) => i !== index));

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

    if (method === "ONLINE") {
      if (!onlineAmount || isNaN(onlineAmount))
        newErrors.onlineAmount = "Amount is required";
      if (!formData.lddapNum) newErrors.lddapNum = "LDDAP No. Required";
    } else {
      if (items.some((i) => !i.description || !i.amount))
        newErrors.items = "Incomplete items";
      if (!formData.lddapNum) newErrors.lddapNum = "LDDAP No. Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let finalItems = [];
    let finalDeductions = [];
    let grossAmount = 0;
    let totalDeductions = 0;

    if (method === "ONLINE") {
      grossAmount = Number(onlineAmount);
      finalItems = [
        {
          description: "LDDAP Online Transfer",
          accountCode: "N/A",
          amount: grossAmount,
        },
      ];
    } else {
      finalItems = items.map((i) => ({ ...i, amount: Number(i.amount) }));
      finalDeductions = deductions
        .filter(
          (d) => d.deductionType && d.deductionType.trim() !== "" && d.amount,
        )
        .map((d) => ({
          deductionType: d.deductionType.trim(),
          amount: Number(d.amount),
        }));

      grossAmount = finalItems.reduce((sum, i) => sum + i.amount, 0);
      totalDeductions = finalDeductions.reduce((sum, d) => sum + d.amount, 0);
    }

    const ageLimitVal = formData.ageLimit?.trim()
      ? Number(formData.ageLimit)
      : 5;
    const payload = {
      ...formData,
      payeeId: Number(formData.payeeId),
      fundSourceId: Number(formData.fundSourceId),
      method: "LDDAP",
      lddapMethod: method,
      ageLimit: ageLimitVal,
      grossAmount,
      totalDeductions,
      netAmount: grossAmount - totalDeductions,
      approvedAt: isApproved ? new Date().toISOString() : null,
      status: isApproved ? "PAID" : "PENDING",
      items: finalItems,
      deductions: finalDeductions,
      acicNum: formData.acicNum ?? "",
      orsNum: formData.orsNum ?? "",
      dvNum: formData.dvNum ?? "",
      uacsCode: formData.uacsCode ?? "",
      respCode: formData.respCode ?? "",
      sendMail: formData.sendMail, // Pass the checkbox value
    };

    if (isEdit) {
      const result = await updateDisbursement(initialData.id, payload);
      if (result.success) onClose();
    } else {
      const result = await createDisbursement(payload);
      if (result.success) onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 p-6 custom-scrollbar">
        {/* Mode Switcher */}
        <div className="flex justify-center mb-6">
          <div
            className={`bg-base-200 p-1 rounded-lg inline-flex shadow-inner ${isEdit ? "opacity-70 pointer-events-none" : ""}`}
          >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Fund Source Dropdown */}
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
                  {funds
                    .filter((f) => f.isActive)
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.code} - {f.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

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
                className="input input-bordered w-full font-mono"
                value={formData.ageLimit}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* References Grid */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold uppercase text-base-content/70 border-b border-base-200 pb-2">
              References
            </h4>

            {/* LDDAP No. & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium text-xs uppercase">
                    LDDAP Number <span className="text-error">*</span>
                  </span>
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
                    <input
                      type="text"
                      name="lddapNum"
                      placeholder="LDDAP #..."
                      className={`input input-bordered w-full pl-10 ${errors.lddapNum ? "input-error" : ""}`}
                      value={formData.lddapNum}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateLDDAPCode}
                    disabled={isGenerating || isEdit || !formData.fundSourceId}
                    className="btn btn-square btn-outline border-base-300"
                    title="Generate Code"
                  >
                    {isGenerating ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
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
            </div>

            {/* DV & ORS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium text-xs uppercase">
                    DV Number<span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="dvNum"
                  className="input input-bordered w-full font-mono"
                  placeholder="DV-XXXX"
                  value={formData.dvNum}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium text-xs uppercase">
                    ORS Number<span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="orsNum"
                  className="input input-bordered w-full font-mono"
                  placeholder="ORS-XXXX"
                  value={formData.orsNum}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* UACS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium text-xs uppercase">
                    UACS Code<span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="uacsCode"
                  className="input input-bordered w-full font-mono"
                  value={formData.uacsCode}
                  onChange={handleChange}
                />
              </div>

              {/* ACIC */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium text-xs uppercase">
                    ACIC Number<span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="acicNum"
                  className="input input-bordered w-full font-mono"
                  placeholder="ACIC-XXXX"
                  value={formData.acicNum}
                  onChange={handleChange}
                />
              </div>

              {/* RESP CODE */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium text-xs uppercase">
                    Responsibility Code <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="respCode"
                  className="input input-bordered w-full font-mono"
                  placeholder="RESP-CODE-XXXX"
                  value={formData.respCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Particulars */}
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-medium">Particulars</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
                <textarea
                  name="particulars"
                  placeholder="Enter details..."
                  className="textarea textarea-bordered w-full pl-10 h-20 resize-none"
                  value={formData.particulars}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ONLINE MODE SPECIFIC */}
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
            </div>
          )}

          {/* MANUAL MODE SPECIFIC */}
          {method === "MANUAL" && (
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Items */}
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
                      className="input input-bordered input-sm w-24 font-mono text-xs"
                      value={item.accountCode}
                      onChange={(e) =>
                        handleItemChange(idx, "accountCode", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-bordered input-sm w-32 font-mono"
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
                {errors.items && (
                  <p className="text-error text-xs">{errors.items}</p>
                )}

                {/* Deductions */}
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
                        handleDeductionChange(
                          idx,
                          "deductionType",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-bordered input-sm w-32 text-error font-mono"
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
            </div>
          )}

          {/* Settings Section (Approved & Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Approved checkbox */}
            <div className="form-control p-3 bg-base-200/50 rounded-lg border border-base-200">
              <label className="label cursor-pointer justify-start gap-3 py-0">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-success"
                  checked={isApproved}
                  onChange={(e) => {setIsApproved(e.target.checked); if (!e.target.checked) {
                    setFormData((prev) =>({...prev, sendMail: false}))
                  }}}
                />
                <span className="label-text font-medium">
                  Mark as Paid / Approved
                </span>
              </label>
            </div>

            {/* Send Mail checkbox */}
            {isApproved && (
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
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-base-200 flex gap-3 bg-base-100 mt-auto">
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
          {isEdit ? "Update" : "Submit LDDAP"}
        </button>
      </div>
    </form>
  );
};

export default Lddap;
