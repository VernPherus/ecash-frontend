import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Printer,
    CheckCircle2,
    Clock,
    FileText,
    Users,
    Wallet,
    Receipt,
    Plus,
    Trash2,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    AlertTriangle,
    Check,
    X,
    GripVertical,
    Calculator,
    Calendar,
    Hash,
    Building,
    CreditCard,
    Send,
} from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";
import useFundStore from "../store/useFundStore";
import usePayeeStore from "../store/usePayeeStore";
import DisbursementPrintView from "../components/DisbursementPrintView";

// ============================================
// CONSTANTS & HELPERS
// ============================================
const STEPS = [
    { id: 1, name: "Setup", icon: FileText, description: "Basic information" },
    { id: 2, name: "Line Items", icon: Receipt, description: "Add expenses" },
    { id: 3, name: "Deductions", icon: Calculator, description: "Tax & fees" },
    { id: 4, name: "Review", icon: CheckCircle2, description: "Confirm & submit" },
];

const PAYMENT_METHODS = [
    { value: "MANUAL", label: "Check/Manual", icon: CreditCard },
    { value: "ONLINE", label: "Online Transfer", icon: Send },
];

const DEDUCTION_TYPES = [
    "Withholding Tax",
    "VAT",
    "Retention Fee",
    "Liquidated Damages",
    "Other",
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// ============================================
// MAIN COMPONENT
// ============================================
const DisbursementFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    // Stores
    const { createDisbursement, updateDisbursement, showDisbursement, isLoading } = useDisbursementStore();
    const { funds, fetchFunds } = useFundStore();
    const { payees, fetchPayees } = usePayeeStore();

    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [shakeFields, setShakeFields] = useState({});

    // Form Data
    const [formData, setFormData] = useState({
        payeeId: "",
        fundSourceId: "",
        dateReceived: new Date().toISOString().split("T")[0],
        dvNum: "",
        orsNum: "",
        lddapNum: "",
        acicNum: "",
        uacsCode: "",
        respCode: "",
        particulars: "",
        method: "MANUAL",
        ageLimit: 5,
    });

    const [items, setItems] = useState([
        { description: "", accountCode: "", amount: "" },
    ]);

    const [deductions, setDeductions] = useState([]);

    // Computed values
    const grossAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const netAmount = grossAmount - totalDeductions;

    // Selected entities for preview
    const selectedPayee = payees.find(p => p.id === Number(formData.payeeId));
    const selectedFund = funds.find(f => f.id === Number(formData.fundSourceId));

    // ============================================
    // EFFECTS
    // ============================================
    useEffect(() => {
        fetchFunds();
        fetchPayees();
    }, [fetchFunds, fetchPayees]);

    useEffect(() => {
        const loadExistingDisbursement = async (disbursementId) => {
            const data = await showDisbursement(disbursementId);
            if (data) {
                setFormData({
                    payeeId: data.payeeId || "",
                    fundSourceId: data.fundSourceId || "",
                    dateReceived: data.dateReceived?.split("T")[0] || "",
                    dvNum: data.dvNum || "",
                    orsNum: data.orsNum || "",
                    lddapNum: data.lddapNum || "",
                    acicNum: data.acicNum || "",
                    uacsCode: data.uacsCode || "",
                    respCode: data.respCode || "",
                    particulars: data.particulars || "",
                    method: data.method || "MANUAL",
                    ageLimit: data.ageLimit || 5,
                });
                if (data.items?.length > 0) setItems(data.items);
                if (data.deductions?.length > 0) setDeductions(data.deductions);
            }
        };

        if (isEditing && id) {
            loadExistingDisbursement(id);
        }
    }, [id, isEditing, showDisbursement]);

    // Auto-save draft to localStorage
    useEffect(() => {
        if (!isEditing && !submitSuccess) {
            const draft = { formData, items, deductions, currentStep };
            localStorage.setItem("disbursement_draft", JSON.stringify(draft));
        }
    }, [formData, items, deductions, currentStep, isEditing, submitSuccess]);

    // Load draft on mount
    useEffect(() => {
        if (!isEditing) {
            const saved = localStorage.getItem("disbursement_draft");
            if (saved) {
                try {
                    const draft = JSON.parse(saved);
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    if (draft.formData) setFormData(draft.formData);
                    if (draft.items && draft.items.length > 0) setItems(draft.items);
                    if (draft.deductions) setDeductions(draft.deductions);
                } catch {
                    // Invalid draft, ignore
                }
            }
        }
    }, [isEditing]);

    // ============================================
    // HANDLERS
    // ============================================
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleItemChange = useCallback((index, field, value) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
    }, []);

    const addItem = useCallback(() => {
        setItems(prev => [...prev, { description: "", accountCode: "", amount: "" }]);
    }, []);

    const removeItem = useCallback((index) => {
        if (items.length > 1) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    }, [items.length]);

    const handleDeductionChange = useCallback((index, field, value) => {
        setDeductions(prev => {
            const newDeductions = [...prev];
            newDeductions[index] = { ...newDeductions[index], [field]: value };
            return newDeductions;
        });
    }, []);

    const addDeduction = useCallback(() => {
        setDeductions(prev => [...prev, { deductionType: "", amount: "" }]);
    }, []);

    const removeDeduction = useCallback((index) => {
        setDeductions(prev => prev.filter((_, i) => i !== index));
    }, []);

    // ============================================
    // VALIDATION
    // ============================================
    const validateStep = (stepNum) => {
        const newErrors = {};
        const fieldsToShake = {};

        if (stepNum === 1) {
            if (!formData.payeeId) {
                newErrors.payeeId = "Please select a payee";
                fieldsToShake.payeeId = true;
            }
            if (!formData.fundSourceId) {
                newErrors.fundSourceId = "Please select a fund source";
                fieldsToShake.fundSourceId = true;
            }
            if (!formData.dateReceived) {
                newErrors.dateReceived = "Date is required";
                fieldsToShake.dateReceived = true;
            }
        }

        if (stepNum === 2) {
            const validItems = items.filter(item => item.description && item.amount);
            if (validItems.length === 0) {
                newErrors.items = "At least one line item with description and amount is required";
                fieldsToShake.items = true;
            }
            items.forEach((item, idx) => {
                if (item.description && !item.amount) {
                    newErrors[`item_${idx}_amount`] = "Amount required";
                    fieldsToShake[`item_${idx}`] = true;
                }
                if (item.amount && Number(item.amount) < 0) {
                    newErrors[`item_${idx}_amount`] = "Amount must be positive";
                    fieldsToShake[`item_${idx}`] = true;
                }
            });
        }

        if (stepNum === 3) {
            deductions.forEach((d, idx) => {
                if (d.amount && Number(d.amount) < 0) {
                    newErrors[`deduction_${idx}_amount`] = "Amount must be positive";
                    fieldsToShake[`deduction_${idx}`] = true;
                }
                if (d.amount && !d.deductionType) {
                    newErrors[`deduction_${idx}_type`] = "Please select type";
                    fieldsToShake[`deduction_${idx}`] = true;
                }
            });
        }

        setErrors(newErrors);

        // Trigger shake animation
        if (Object.keys(fieldsToShake).length > 0) {
            setShakeFields(fieldsToShake);
            setTimeout(() => setShakeFields({}), 500);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);

        const payload = {
            ...formData,
            payeeId: Number(formData.payeeId),
            fundSourceId: Number(formData.fundSourceId),
            grossAmount,
            totalDeductions,
            netAmount,
            items: items.filter(i => i.description && i.amount).map(item => ({
                ...item,
                amount: Number(item.amount),
            })),
            deductions: deductions.filter(d => d.deductionType && d.amount).map(d => ({
                ...d,
                amount: Number(d.amount),
            })),
        };

        let result;
        if (isEditing) {
            result = await updateDisbursement(id, payload);
        } else {
            result = await createDisbursement(payload);
        }

        setIsSubmitting(false);

        if (result.success) {
            setSubmitSuccess(true);
            localStorage.removeItem("disbursement_draft");
            setTimeout(() => {
                navigate(`/disbursement/${result.disbursement?.id || id}`);
            }, 2000);
        }
    };

    const clearDraft = () => {
        localStorage.removeItem("disbursement_draft");
        setFormData({
            payeeId: "",
            fundSourceId: "",
            dateReceived: new Date().toISOString().split("T")[0],
            dvNum: "",
            orsNum: "",
            lddapNum: "",
            acicNum: "",
            uacsCode: "",
            respCode: "",
            particulars: "",
            method: "MANUAL",
            ageLimit: 5,
        });
        setItems([{ description: "", accountCode: "", amount: "" }]);
        setDeductions([]);
        setCurrentStep(1);
    };

    // ============================================
    // RENDER HELPERS
    // ============================================
    const getStepStatus = (stepId) => {
        if (stepId < currentStep) return "completed";
        if (stepId === currentStep) return "current";
        return "upcoming";
    };

    // ============================================
    // PRINT PREVIEW
    // ============================================
    if (showPrintPreview) {
        return (
            <DisbursementPrintView
                disbursement={{
                    ...formData,
                    grossAmount,
                    totalDeductions,
                    netAmount,
                    items: items.filter(i => i.description),
                    deductions: deductions.filter(d => d.deductionType),
                    payee: selectedPayee,
                    fundSource: selectedFund,
                }}
                onClose={() => setShowPrintPreview(false)}
            />
        );
    }

    // ============================================
    // SUCCESS STATE
    // ============================================
    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center animate-fade-in-up">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-success animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content mb-2">
                        {isEditing ? "Disbursement Updated!" : "Disbursement Created!"}
                    </h2>
                    <p className="text-base-content/60 mb-4">
                        Redirecting to disbursement details...
                    </p>
                    <span className="loading loading-dots loading-md text-primary"></span>
                </div>
            </div>
        );
    }

    // ============================================
    // MAIN RENDER
    // ============================================
    return (
        <div className="min-h-screen bg-base-200 pb-24">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-6 lg:px-8 py-5 sticky top-0 z-20 shadow-soft">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-ghost btn-sm btn-square hover:bg-base-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-base-content">
                                {isEditing ? "Edit Disbursement" : "New Disbursement"}
                            </h1>
                            <p className="text-sm text-base-content/60 hidden sm:block">
                                {isEditing ? "Update disbursement record" : "Create a new disbursement voucher"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button
                                onClick={clearDraft}
                                className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10"
                            >
                                <X className="w-4 h-4" />
                                <span className="hidden sm:inline">Clear</span>
                            </button>
                        )}
                        <button
                            onClick={() => setShowPrintPreview(true)}
                            className="btn btn-ghost btn-sm gap-2"
                            disabled={!formData.payeeId || items.every(i => !i.description)}
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Preview</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress Steps */}
            <div className="bg-base-100 border-b border-base-300 px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, idx) => {
                            const status = getStepStatus(step.id);
                            const StepIcon = step.icon;
                            return (
                                <React.Fragment key={step.id}>
                                    <button
                                        onClick={() => {
                                            if (status === "completed") setCurrentStep(step.id);
                                        }}
                                        disabled={status === "upcoming"}
                                        className={`flex items-center gap-3 transition-all ${status === "completed" ? "cursor-pointer" : ""
                                            } ${status === "upcoming" ? "opacity-40" : ""}`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === "current"
                                                ? "bg-primary text-white shadow-glow-primary"
                                                : status === "completed"
                                                    ? "bg-success text-white"
                                                    : "bg-base-200 text-base-content/40"
                                                }`}
                                        >
                                            {status === "completed" ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <StepIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <p className={`text-sm font-semibold ${status === "current" ? "text-primary" : "text-base-content"
                                                }`}>
                                                {step.name}
                                            </p>
                                            <p className="text-xs text-base-content/50">{step.description}</p>
                                        </div>
                                    </button>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 lg:mx-4 rounded transition-all ${status === "completed" ? "bg-success" : "bg-base-300"
                                            }`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content - Split Layout */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Panel */}
                    <div className="lg:col-span-2">
                        <div className="card-static p-6 lg:p-8">
                            {/* Step 1: Setup */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Basic Information</h2>
                                            <p className="text-sm text-base-content/60">Set up the disbursement details</p>
                                        </div>
                                    </div>

                                    {/* Validation Error Summary Panel */}
                                    {Object.keys(errors).length > 0 && currentStep === 1 && (
                                        <div className="bg-gradient-to-r from-error/10 via-error/5 to-transparent border border-error/30 rounded-xl p-4 animate-slide-in-up">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0 animate-error-bounce">
                                                    <AlertTriangle className="w-5 h-5 text-error" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-error mb-1">Please fix the following issues:</h4>
                                                    <ul className="text-sm text-base-content/70 space-y-1">
                                                        {errors.payeeId && (
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                                {errors.payeeId}
                                                            </li>
                                                        )}
                                                        {errors.fundSourceId && (
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                                {errors.fundSourceId}
                                                            </li>
                                                        )}
                                                        {errors.dateReceived && (
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                                {errors.dateReceived}
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payee Selection */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                Payee <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <select
                                            name="payeeId"
                                            className={`select select-bordered w-full ${errors.payeeId ? "select-error field-error-glow" : ""} ${shakeFields.payeeId ? "animate-shake" : ""}`}
                                            value={formData.payeeId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a payee...</option>
                                            {payees.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} {p.type ? `(${p.type})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.payeeId && (
                                            <label className="label">
                                                <span className="label-text-alt text-error flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {errors.payeeId}
                                                </span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Fund Source Selection */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-primary" />
                                                Fund Source <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <select
                                            name="fundSourceId"
                                            className={`select select-bordered w-full ${errors.fundSourceId ? "select-error field-error-glow" : ""} ${shakeFields.fundSourceId ? "animate-shake" : ""}`}
                                            value={formData.fundSourceId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a fund source...</option>
                                            {funds.map((f) => (
                                                <option key={f.id} value={f.id}>
                                                    {f.code} - {f.name}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedFund && (
                                            <label className="label">
                                                <span className="label-text-alt text-success flex items-center gap-1">
                                                    Available: {formatCurrency(selectedFund.initialBalance)}
                                                </span>
                                            </label>
                                        )}
                                        {errors.fundSourceId && (
                                            <label className="label">
                                                <span className="label-text-alt text-error flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {errors.fundSourceId}
                                                </span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Date & Method Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    Date Received <span className="text-error">*</span>
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                name="dateReceived"
                                                className={`input input-bordered w-full ${errors.dateReceived ? "input-error field-error-glow" : ""} ${shakeFields.dateReceived ? "animate-shake" : ""}`}
                                                value={formData.dateReceived}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Payment Method</span>
                                            </label>
                                            <div className="flex gap-2">
                                                {PAYMENT_METHODS.map((method) => {
                                                    const MethodIcon = method.icon;
                                                    const isSelected = formData.method === method.value;
                                                    return (
                                                        <button
                                                            key={method.value}
                                                            type="button"
                                                            onClick={() => handleChange({ target: { name: "method", value: method.value } })}
                                                            className={`flex-1 btn ${isSelected ? "btn-primary" : "btn-ghost border border-base-300"} gap-2`}
                                                        >
                                                            <MethodIcon className="w-4 h-4" />
                                                            {method.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Particulars */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Particulars / Description</span>
                                        </label>
                                        <textarea
                                            name="particulars"
                                            placeholder="Brief description of the disbursement purpose..."
                                            className="textarea textarea-bordered h-24 resize-none"
                                            value={formData.particulars}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Line Items */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Receipt className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold">Line Items</h2>
                                                <p className="text-sm text-base-content/60">Add expense items to this disbursement</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="btn btn-primary btn-sm gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Item
                                        </button>
                                    </div>

                                    {errors.items && (
                                        <div className="alert alert-error">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span>{errors.items}</span>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-base-200/50 rounded-xl p-4 border border-base-300 hover:border-primary/30 transition-all"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="pt-2 text-base-content/30 cursor-grab">
                                                        <GripVertical className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-base-content/60">
                                                                Item {idx + 1}
                                                            </span>
                                                            {items.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(idx)}
                                                                    className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Description (e.g., Office Supplies)"
                                                            className="input input-bordered w-full"
                                                            value={item.description}
                                                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                                                        />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Account Code"
                                                                className="input input-bordered input-sm font-mono"
                                                                value={item.accountCode}
                                                                onChange={(e) => handleItemChange(idx, "accountCode", e.target.value)}
                                                            />
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 font-semibold">
                                                                    ₱
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    step="0.01"
                                                                    min="0"
                                                                    className={`input input-bordered input-sm w-full pl-8 font-semibold ${errors[`item_${idx}_amount`] ? "input-error" : ""
                                                                        }`}
                                                                    value={item.amount}
                                                                    onChange={(e) => handleItemChange(idx, "amount", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Items Total */}
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-base-content">Gross Total</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatCurrency(grossAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Deductions */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                                                <Calculator className="w-5 h-5 text-error" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold">Deductions</h2>
                                                <p className="text-sm text-base-content/60">Add taxes, fees, or other deductions (optional)</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addDeduction}
                                            className="btn btn-outline btn-error btn-sm gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Deduction
                                        </button>
                                    </div>

                                    {deductions.length === 0 ? (
                                        <div className="text-center py-12 text-base-content/40">
                                            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                            <p className="font-medium">No deductions added</p>
                                            <p className="text-sm">Click "Add Deduction" to include taxes or fees</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {deductions.map((deduction, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-error/5 border border-error/20 rounded-xl p-4"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1">
                                                            <select
                                                                className={`select select-bordered select-sm w-full ${errors[`deduction_${idx}_type`] ? "select-error" : ""
                                                                    }`}
                                                                value={deduction.deductionType}
                                                                onChange={(e) => handleDeductionChange(idx, "deductionType", e.target.value)}
                                                            >
                                                                <option value="">Select type...</option>
                                                                {DEDUCTION_TYPES.map(type => (
                                                                    <option key={type} value={type}>{type}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="relative w-36">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-error/70 font-semibold">
                                                                -₱
                                                            </span>
                                                            <input
                                                                type="number"
                                                                placeholder="0.00"
                                                                step="0.01"
                                                                min="0"
                                                                className="input input-bordered input-sm w-full pl-10 text-error font-semibold"
                                                                value={deduction.amount}
                                                                onChange={(e) => handleDeductionChange(idx, "amount", e.target.value)}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDeduction(idx)}
                                                            className="btn btn-ghost btn-sm btn-square text-error"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Deductions Summary */}
                                    <div className="bg-base-100 border border-base-300 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Gross Amount</span>
                                            <span className="font-medium">{formatCurrency(grossAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-error">Total Deductions</span>
                                            <span className="font-medium text-error">-{formatCurrency(totalDeductions)}</span>
                                        </div>
                                        <div className="divider my-1"></div>
                                        <div className="flex justify-between">
                                            <span className="font-bold">Net Amount</span>
                                            <span className="text-xl font-bold text-primary">{formatCurrency(netAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-success" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Review & Submit</h2>
                                            <p className="text-sm text-base-content/60">Confirm all details before submitting</p>
                                        </div>
                                    </div>

                                    {/* Reference Codes */}
                                    <div className="bg-base-200/50 rounded-xl p-6 space-y-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-primary" />
                                            Reference Codes (Optional)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="form-control">
                                                <label className="label py-1">
                                                    <span className="label-text text-xs">DV Number</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="dvNum"
                                                    placeholder="DV-XXXX"
                                                    className="input input-bordered input-sm font-mono"
                                                    value={formData.dvNum}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label py-1">
                                                    <span className="label-text text-xs">ORS Number</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="orsNum"
                                                    placeholder="ORS-XXXX"
                                                    className="input input-bordered input-sm font-mono"
                                                    value={formData.orsNum}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label py-1">
                                                    <span className="label-text text-xs">LDDAP Number</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lddapNum"
                                                    className="input input-bordered input-sm font-mono"
                                                    value={formData.lddapNum}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label py-1">
                                                    <span className="label-text text-xs">ACIC Number</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="acicNum"
                                                    className="input input-bordered input-sm font-mono"
                                                    value={formData.acicNum}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label py-1">
                                                    <span className="label-text text-xs">UACS Code</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="uacsCode"
                                                    className="input input-bordered input-sm font-mono"
                                                    value={formData.uacsCode}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label py-1">
                                                    <span className="label-text text-xs">RESP Code</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="respCode"
                                                    className="input input-bordered input-sm font-mono"
                                                    value={formData.respCode}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Table */}
                                    <div className="bg-base-200/50 rounded-xl overflow-hidden">
                                        <div className="px-6 py-4 border-b border-base-300">
                                            <h3 className="font-semibold">Items Summary</h3>
                                        </div>
                                        <table className="table-modern">
                                            <thead>
                                                <tr>
                                                    <th>Description</th>
                                                    <th>Account</th>
                                                    <th className="text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.filter(i => i.description).map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.description}</td>
                                                        <td className="font-mono text-sm">{item.accountCode || "—"}</td>
                                                        <td className="text-right font-semibold">{formatCurrency(item.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Final Amount Card */}
                                    <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white/70 text-sm mb-1">Net Amount to Disburse</p>
                                                <p className="text-3xl font-bold">{formatCurrency(netAmount)}</p>
                                            </div>
                                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-white/80" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel (Sidebar) */}
                    <div className="lg:col-span-1">
                        <div className="card-static p-6 sticky top-36">
                            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Live Preview
                            </h3>

                            <div className="space-y-4">
                                {/* Payee */}
                                <div className="bg-base-200/50 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Payee</p>
                                    <p className="font-semibold truncate">
                                        {selectedPayee?.name || <span className="text-base-content/30">Not selected</span>}
                                    </p>
                                </div>

                                {/* Fund Source */}
                                <div className="bg-base-200/50 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Fund Source</p>
                                    <p className="font-semibold truncate">
                                        {selectedFund ? (
                                            <>
                                                <span className="text-primary">{selectedFund.code}</span>
                                                <span className="text-base-content/60 ml-1">• {selectedFund.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-base-content/30">Not selected</span>
                                        )}
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="bg-base-200/50 rounded-lg p-3">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Date Received</p>
                                    <p className="font-semibold">
                                        {formData.dateReceived ? formatDate(formData.dateReceived) : <span className="text-base-content/30">Not set</span>}
                                    </p>
                                </div>

                                <div className="divider my-2"></div>

                                {/* Amounts */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-base-content/60">Items ({items.filter(i => i.description).length})</span>
                                        <span className="font-medium">{formatCurrency(grossAmount)}</span>
                                    </div>
                                    {totalDeductions > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-error">Deductions</span>
                                            <span className="font-medium text-error">-{formatCurrency(totalDeductions)}</span>
                                        </div>
                                    )}
                                    <div className="divider my-1"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">Net Amount</span>
                                        <span className="text-xl font-bold text-primary">{formatCurrency(netAmount)}</span>
                                    </div>
                                </div>

                                {/* Warning if exceeds fund */}
                                {selectedFund && netAmount > Number(selectedFund.initialBalance) && (
                                    <div className="alert alert-warning text-xs p-3">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Amount exceeds fund balance!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 px-6 lg:px-8 py-4 shadow-elevated z-20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-sm text-base-content/60">
                        Step {currentStep} of {STEPS.length}
                    </div>
                    <div className="flex gap-3">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="btn btn-ghost gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn btn-primary gap-2"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || isLoading}
                                className="btn btn-primary gap-2 min-w-[160px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        {isEditing ? "Update" : "Create"} Disbursement
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisbursementFormPage;
