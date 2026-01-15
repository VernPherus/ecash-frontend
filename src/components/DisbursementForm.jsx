import React, { useState, useEffect } from "react";
import {
    Save,
    X,
    Plus,
    Trash2,
    Calendar,
    FileText,
    DollarSign,
    Hash,
} from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";
import useFundStore from "../store/useFundStore";
import usePayeeStore from "../store/usePayeeStore";

const DisbursementForm = ({ disbursement, onClose }) => {
    const { createDisbursement, updateDisbursement, isLoading } = useDisbursementStore();
    const { funds, fetchFunds } = useFundStore();
    const { payees, fetchPayees } = usePayeeStore();
    const isEditing = Boolean(disbursement);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        payeeId: disbursement?.payeeId || "",
        fundSourceId: disbursement?.fundSourceId || "",
        dateReceived: disbursement?.dateReceived?.split("T")[0] || "",
        dvNum: disbursement?.dvNum || "",
        orsNum: disbursement?.orsNum || "",
        lddapNum: disbursement?.lddapNum || "",
        acicNum: disbursement?.acicNum || "",
        uacsCode: disbursement?.uacsCode || "",
        respCode: disbursement?.respCode || "",
        particulars: disbursement?.particulars || "",
        method: disbursement?.method || "MANUAL",
        ageLimit: disbursement?.ageLimit || 5,
    });

    const [items, setItems] = useState(
        disbursement?.items || [{ description: "", accountCode: "", amount: "" }]
    );

    const [deductions, setDeductions] = useState(
        disbursement?.deductions || []
    );

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchFunds();
        fetchPayees();
    }, [fetchFunds, fetchPayees]);

    const grossAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const netAmount = grossAmount - totalDeductions;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: "", accountCode: "", amount: "" }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleDeductionChange = (index, field, value) => {
        const newDeductions = [...deductions];
        newDeductions[index][field] = value;
        setDeductions(newDeductions);
    };

    const addDeduction = () => {
        setDeductions([...deductions, { deductionType: "", amount: "" }]);
    };

    const removeDeduction = (index) => {
        setDeductions(deductions.filter((_, i) => i !== index));
    };

    const validateStep = (stepNum) => {
        const newErrors = {};
        if (stepNum === 1) {
            if (!formData.payeeId) newErrors.payeeId = "Select a payee";
            if (!formData.fundSourceId) newErrors.fundSourceId = "Select a fund source";
        }
        if (stepNum === 2) {
            if (items.some((item) => !item.description || !item.amount)) {
                newErrors.items = "All items need description and amount";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        const payload = {
            ...formData,
            payeeId: Number(formData.payeeId),
            fundSourceId: Number(formData.fundSourceId),
            grossAmount,
            totalDeductions,
            netAmount,
            items: items.map((item) => ({
                ...item,
                amount: Number(item.amount),
            })),
            deductions: deductions.map((d) => ({
                ...d,
                amount: Number(d.amount),
            })),
        };

        let result;
        if (isEditing) {
            result = await updateDisbursement(disbursement.id, payload);
        } else {
            result = await createDisbursement(payload);
        }

        if (result.success) {
            onClose();
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const steps = [
        { num: 1, label: "Basic Info" },
        { num: 2, label: "Line Items" },
        { num: 3, label: "References" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
                {steps.map((s, idx) => (
                    <React.Fragment key={s.num}>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s.num
                                    ? "bg-primary text-white"
                                    : step > s.num
                                        ? "bg-success text-white"
                                        : "bg-base-300 text-base-content/50"
                                    }`}
                            >
                                {step > s.num ? "✓" : s.num}
                            </div>
                            <span className={`text-sm font-medium ${step === s.num ? "text-primary" : "text-base-content/50"}`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? "bg-success" : "bg-base-300"}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Payee <span className="text-error">*</span></span>
                        </label>
                        <select
                            name="payeeId"
                            className={`select select-bordered ${errors.payeeId ? "select-error" : ""}`}
                            value={formData.payeeId}
                            onChange={handleChange}
                        >
                            <option value="">Select a payee</option>
                            {payees.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        {errors.payeeId && (
                            <label className="label"><span className="label-text-alt text-error">{errors.payeeId}</span></label>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Fund Source <span className="text-error">*</span></span>
                        </label>
                        <select
                            name="fundSourceId"
                            className={`select select-bordered ${errors.fundSourceId ? "select-error" : ""}`}
                            value={formData.fundSourceId}
                            onChange={handleChange}
                        >
                            <option value="">Select a fund source</option>
                            {funds.map((f) => (
                                <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                            ))}
                        </select>
                        {errors.fundSourceId && (
                            <label className="label"><span className="label-text-alt text-error">{errors.fundSourceId}</span></label>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date Received
                            </span>
                        </label>
                        <input
                            type="date"
                            name="dateReceived"
                            className="input input-bordered"
                            value={formData.dateReceived}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Payment Method</span>
                        </label>
                        <select
                            name="method"
                            className="select select-bordered"
                            value={formData.method}
                            onChange={handleChange}
                        >
                            <option value="MANUAL">Manual (Check)</option>
                            <option value="ONLINE">Online Transfer</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Step 2: Line Items */}
            {step === 2 && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Line Items</h4>
                        <button type="button" onClick={addItem} className="btn btn-ghost btn-sm gap-1">
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>

                    {items.map((item, idx) => (
                        <div key={idx} className="bg-base-200 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-base-content/60">Item {idx + 1}</span>
                                {items.length > 1 && (
                                    <button type="button" onClick={() => removeItem(idx)} className="btn btn-ghost btn-xs text-error">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Description"
                                className="input input-bordered w-full"
                                value={item.description}
                                onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Account Code"
                                    className="input input-bordered input-sm"
                                    value={item.accountCode}
                                    onChange={(e) => handleItemChange(idx, "accountCode", e.target.value)}
                                />
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">₱</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        className="input input-bordered input-sm w-full pl-7"
                                        value={item.amount}
                                        onChange={(e) => handleItemChange(idx, "amount", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {errors.items && (
                        <p className="text-error text-sm">{errors.items}</p>
                    )}

                    {/* Deductions */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Deductions (Optional)</h4>
                            <button type="button" onClick={addDeduction} className="btn btn-ghost btn-sm gap-1">
                                <Plus className="w-4 h-4" /> Add Deduction
                            </button>
                        </div>

                        {deductions.map((deduction, idx) => (
                            <div key={idx} className="bg-error/5 border border-error/20 rounded-xl p-4 mb-3">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Deduction Type"
                                        className="input input-bordered input-sm flex-1"
                                        value={deduction.deductionType}
                                        onChange={(e) => handleDeductionChange(idx, "deductionType", e.target.value)}
                                    />
                                    <div className="relative w-32">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">₱</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            step="0.01"
                                            className="input input-bordered input-sm w-full pl-7"
                                            value={deduction.amount}
                                            onChange={(e) => handleDeductionChange(idx, "amount", e.target.value)}
                                        />
                                    </div>
                                    <button type="button" onClick={() => removeDeduction(idx)} className="btn btn-ghost btn-sm text-error">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-base-100 border border-base-300 rounded-xl p-4 mt-6">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Gross Amount</span>
                                <span className="font-medium">{formatCurrency(grossAmount)}</span>
                            </div>
                            <div className="flex justify-between text-error">
                                <span>Total Deductions</span>
                                <span className="font-medium">-{formatCurrency(totalDeductions)}</span>
                            </div>
                            <div className="divider my-1"></div>
                            <div className="flex justify-between text-lg">
                                <span className="font-semibold">Net Amount</span>
                                <span className="font-bold text-primary">{formatCurrency(netAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: References */}
            {step === 3 && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">DV Number</span></label>
                            <input type="text" name="dvNum" placeholder="DV-XXXX" className="input input-bordered font-mono" value={formData.dvNum} onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">ORS Number</span></label>
                            <input type="text" name="orsNum" placeholder="ORS-XXXX" className="input input-bordered font-mono" value={formData.orsNum} onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">LDDAP Number</span></label>
                            <input type="text" name="lddapNum" className="input input-bordered font-mono" value={formData.lddapNum} onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">ACIC Number</span></label>
                            <input type="text" name="acicNum" className="input input-bordered font-mono" value={formData.acicNum} onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">UACS Code</span></label>
                            <input type="text" name="uacsCode" className="input input-bordered font-mono" value={formData.uacsCode} onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">RESP Code</span></label>
                            <input type="text" name="respCode" className="input input-bordered font-mono" value={formData.respCode} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-medium">Particulars</span></label>
                        <textarea name="particulars" placeholder="Description of the disbursement..." className="textarea textarea-bordered h-24" value={formData.particulars} onChange={handleChange} />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-medium">Age Limit (Days)</span></label>
                        <input type="number" name="ageLimit" min="1" max="30" className="input input-bordered w-24" value={formData.ageLimit} onChange={handleChange} />
                        <label className="label"><span className="label-text-alt text-base-content/50">Days before marked as overdue</span></label>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-base-300">
                {step > 1 ? (
                    <button type="button" onClick={handleBack} className="btn btn-ghost flex-1">
                        Back
                    </button>
                ) : (
                    <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                        <X className="w-4 h-4" /> Cancel
                    </button>
                )}
                {step < 3 ? (
                    <button type="button" onClick={handleNext} className="btn btn-primary flex-1">
                        Next
                    </button>
                ) : (
                    <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
                        {isLoading ? (
                            <><span className="loading loading-spinner loading-sm" /> Saving...</>
                        ) : (
                            <><Save className="w-4 h-4" /> {isEditing ? "Update" : "Create"} Disbursement</>
                        )}
                    </button>
                )}
            </div>
        </form>
    );
};

export default DisbursementForm;
