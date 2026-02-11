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
  Mail,
  AlertTriangle,
} from "lucide-react";
import useDisbursementStore from "../../store/useDisbursementStore";
import useFundStore from "../../store/useFundStore";
import usePayeeStore from "../../store/usePayeeStore";
import { formatCurrency } from "../../lib/formatters";

const defaultFormData = () => ({
  payeeId: "",
  fundSourceId: "",
  dateReceived: new Date().toISOString().split("T")[0],
  approvedAt: new Date().toISOString().split("T")[0],
  lddapNum: "",
  projectName: "",
  ncaNum: "",
  dvNum: "",
  orsNum: "",
  uacsCode: "",
  acicNum: "",
  respCode: "",
  particulars: "",
  ageLimit: "",
  sendMail: false,
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
  const [isApproved, setIsApproved] = useState(true);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Code Generation Handler
  const handleGenerateLDDAPCode = async () => {
    const date = formData.dateReceived;
    const selectedFund = funds.find(
      (f) => f.id === Number(formData.fundSourceId),
    );

    if (!selectedFund || !selectedFund.seriesCode) {
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
      approvedAt: initialData.approvedAt
        ? new Date(initialData.approvedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      lddapNum: initialData.lddapNum ?? "",
      projectName: initialData.projectName ?? "",
      ncaNum: initialData.ncaNum ?? "",
      dvNum: ref?.dvNum ?? "",
      orsNum: ref?.orsNum ?? "",
      uacsCode: ref?.uacsCode ?? "",
      acicNum: ref?.acicNum ?? "",
      respCode: ref?.respCode ?? "",
      particulars: initialData.particulars ?? "",
      ageLimit:
        initialData.ageLimit != null ? String(initialData.ageLimit) : "",
      sendMail: false,
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
    if (!formData.lddapNum) newErrors.lddapNum = "LDDAP No. Required";

    if (items.every((i) => !i.description || !i.amount)) {
      newErrors.items = "At least one item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);

    const finalItems = items
      .filter((i) => i.description && i.amount)
      .map((i) => ({ ...i, amount: Number(i.amount) }));

    const finalDeductions = deductions
      .filter(
        (d) => d.deductionType && d.deductionType.trim() !== "" && d.amount,
      )
      .map((d) => ({
        deductionType: d.deductionType.trim(),
        amount: Number(d.amount),
      }));

    const grossAmount = finalItems.reduce((sum, i) => sum + i.amount, 0);
    const totalDeductions = finalDeductions.reduce(
      (sum, d) => sum + d.amount,
      0,
    );

    const ageLimitVal = formData.ageLimit?.trim()
      ? Number(formData.ageLimit)
      : 5;

    const payload = {
      ...formData,
      payeeId: Number(formData.payeeId),
      fundSourceId: Number(formData.fundSourceId),
      method: "LDDAP",
      lddapMethod: method,
      projectName: formData.projectName,
      ncaNum: formData.ncaNum,
      ageLimit: ageLimitVal,
      grossAmount,
      totalDeductions,
      netAmount: grossAmount - totalDeductions,
      status: isApproved ? "PAID" : "PENDING",
      items: finalItems,
      deductions: finalDeductions,
      acicNum: formData.acicNum ?? "",
      orsNum: formData.orsNum ?? "",
      dvNum: formData.dvNum ?? "",
      uacsCode: formData.uacsCode ?? "",
      respCode: formData.respCode ?? "",
      sendMail: formData.sendMail,
    };

    if (isEdit) {
      const result = await updateDisbursement(initialData.id, payload);
      if (result.success) onClose();
    } else {
      const result = await createDisbursement(payload);
      if (result.success) onClose();
    }
  };

  const getConfirmationAmounts = () => {
    const grossAmount = items
      .filter((i) => i.description && i.amount)
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    const totalDeductions = deductions
      .filter(
        (d) => d.deductionType && d.deductionType.trim() !== "" && d.amount,
      )
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    return {
      gross: grossAmount,
      deductions: totalDeductions,
      net: grossAmount - totalDeductions,
    };
  };

  const getPayeeName = () => {
    const payee = payees.find((p) => p.id === Number(formData.payeeId));
    return payee ? payee.name : "N/A";
  };

  const getFundName = () => {
    const fund = funds.find((f) => f.id === Number(formData.fundSourceId));
    return fund ? `${fund.code} - ${fund.name}` : "N/A";
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
                  {isEdit ? "Confirm Update" : "Confirm LDDAP Creation"}
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {isEdit
                    ? `Are you sure you want to update LDDAP "${formData.lddapNum}"? This will modify the existing record.`
                    : `Are you sure you want to create a new LDDAP "${formData.lddapNum}"? Please verify all information is correct.`}
                </p>
              </div>
            </div>

            {/* Summary of key data */}
            <div className="bg-base-200/50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">LDDAP Number:</span>
                <span className="font-medium text-base-content font-mono">
                  {formData.lddapNum}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Method:</span>
                <span className="font-medium text-base-content">{method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Payee:</span>
                <span className="font-medium text-base-content">
                  {getPayeeName()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Fund Source:</span>
                <span className="font-medium text-base-content text-xs">
                  {getFundName()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Date Received:</span>
                <span className="font-medium text-base-content">
                  {formData.dateReceived}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Date Processed:</span>
                <span className="font-medium text-base-content">
                  {formData.approvedAt}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Project:</span>
                <span className="font-medium text-base-content">
                  {formData.projectName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">NCA Number:</span>
                <span className="font-medium text-base-content font-mono">
                  {formData.ncaNum || "N/A"}
                </span>
              </div>

              {/* Financial Summary */}
              <div className="pt-3 mt-3 border-t border-base-300 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-base-content/60">Gross Amount:</span>
                  <span className="font-bold text-success font-mono">
                    {formatCurrency(getConfirmationAmounts().gross)}
                  </span>
                </div>
                {getConfirmationAmounts().deductions > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">Deductions:</span>
                    <span className="font-medium text-error font-mono">
                      -{formatCurrency(getConfirmationAmounts().deductions)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-base-300">
                  <span className="text-base-content font-semibold">
                    Net Amount:
                  </span>
                  <span className="font-bold text-primary font-mono text-base">
                    {formatCurrency(getConfirmationAmounts().net)}
                  </span>
                </div>
              </div>

              {/* Status badges */}
              <div className="pt-3 mt-3 border-t border-base-300 flex gap-2 flex-wrap">
                <span
                  className={`badge badge-sm ${isApproved ? "badge-success" : "badge-warning"}`}
                >
                  {isApproved ? "PAID" : "PENDING"}
                </span>
                {formData.sendMail && isApproved && (
                  <span className="badge badge-sm badge-info gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </span>
                )}
              </div>
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

      {/* Form */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payee Dropdown */}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">
                    Project <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="projectName"
                  className="input input-bordered w-full font-mono"
                  placeholder="Project Name"
                  value={formData.projectName}
                  onChange={handleChange}
                />
              </div>

              {/* NCA Number */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">
                    NCA Number <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="ncaNum"
                  className="input input-bordered w-full font-mono"
                  placeholder="NCA #"
                  value={formData.ncaNum}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date Section */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold uppercase text-base-content/70 border-b border-base-200 pb-2">
                Date
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Received */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-xs uppercase">
                      Date Received
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

                {/* Date Processed */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-xs uppercase">
                      Date Processed
                    </span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-base-content/40" />
                    <input
                      type="date"
                      name="approvedAt"
                      className="input input-bordered w-full pl-10"
                      value={formData.approvedAt}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Age Field */}
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
            </div>

            {/* References Grid */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold uppercase text-base-content/70 border-b border-base-200 pb-2">
                References
              </h4>

              {/* LDDAP No. (full width with generate button) */}
              <div className="grid grid-cols-1 gap-4">
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
                      disabled={
                        isGenerating || isEdit || !formData.fundSourceId
                      }
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

              {/* UACS, ACIC & RESP CODE */}
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

                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-xs uppercase">
                      Responsibility Code <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    type="text"
                    name="respCode"
                    className="select select-bordered select-sm w-full pl-10"
                    placeholder="RESP-CODE-XXXX"
                    value={formData.respCode}
                    onChange={handleChange}
                  >
                    <option value="19-001-00-00000">
                      OSEC - 19-001-00-00000
                    </option>
                    <option value="19-001-03-00001">
                      ORD - 19-001-03-00001
                    </option>
                    <option value="19-001-03-00001-01">
                      TOS - 19-001-03-00001-01
                    </option>
                    <option value="19-001-03-00001-02">
                      FAS - 19-001-03-00001-02
                    </option>
                    <option value="19-001-03-0001-03">
                      QMS - 19-001-03-0001-03
                    </option>
                    <option value="19-001-03-00001-99">
                      COA - 19-001-03-00001-99
                    </option>
                  </select>
                </div>
              </div>

              {/* Particulars */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-medium">
                    Particulars{" "}
                    <i>(This will be displayed in notification email)</i>
                  </span>
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

            {/* Line Items & Deductions */}
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

            {/* Settings Section (Approved & Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Approved checkbox */}
              <div className="form-control p-3 bg-base-200/50 rounded-lg border border-base-200">
                <label className="label cursor-pointer justify-start gap-3 py-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-success"
                    checked={isApproved}
                    onChange={(e) => {
                      setIsApproved(e.target.checked);
                      if (!e.target.checked) {
                        setFormData((prev) => ({ ...prev, sendMail: false }));
                      }
                    }}
                  />
                  <span className="label-text font-medium">
                    Mark as Paid / Approved
                  </span>
                </label>
              </div>

              {/* Send Mail checkbox */}
              {(isApproved && !isEdit) && (
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
    </>
  );
};

export default Lddap;
