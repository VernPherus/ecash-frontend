import React, { useRef } from "react";
import {
    X,
    Printer,
    Download,
    Building,
    Calendar,
    Hash,
    FileText,
} from "lucide-react";

// ============================================
// HELPERS
// ============================================
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// ============================================
// MAIN COMPONENT
// ============================================
const DisbursementPrintView = ({ disbursement, onClose }) => {
    const printRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    if (!disbursement) return null;

    return (
        <div className="min-h-screen bg-base-200">
            {/* Screen-only Controls */}
            <div className="print:hidden bg-base-100 border-b border-base-300 px-6 py-4 sticky top-0 z-20 shadow-soft">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-sm btn-square"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold">Print Preview</h1>
                            <p className="text-sm text-base-content/60">Disbursement Voucher</p>
                        </div>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="btn btn-primary gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Print Document
                    </button>
                </div>
            </div>

            {/* Printable Document */}
            <div className="print:p-0 p-8">
                <div
                    ref={printRef}
                    className="bg-white max-w-4xl mx-auto shadow-elevated print:shadow-none print:max-w-none"
                    style={{
                        /* Letter size: 8.5" x 11" */
                        minHeight: "11in",
                        padding: "0.75in",
                    }}
                >
                    {/* Document Header */}
                    <header className="text-center mb-8 pb-6 border-b-2 border-gray-800">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center print:border print:border-gray-300">
                                <Building className="w-8 h-8 text-gray-600" />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold uppercase tracking-wider text-gray-800 mb-1">
                            Republic of the Philippines
                        </h1>
                        <h2 className="text-lg font-semibold text-gray-700 mb-1">
                            Department / Agency Name
                        </h2>
                        <p className="text-sm text-gray-500">
                            Office Address, City, Province
                        </p>
                        <div className="mt-6">
                            <h3 className="text-2xl font-bold uppercase tracking-widest text-gray-900 border-b-4 border-gray-800 inline-block pb-1">
                                DISBURSEMENT VOUCHER
                            </h3>
                        </div>
                    </header>

                    {/* Reference Section */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">DV No.:</span>
                                <span className="font-mono font-bold text-gray-900 border-b border-gray-400 flex-1 pb-1">
                                    {disbursement.dvNum || "________________"}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">ORS No.:</span>
                                <span className="font-mono font-bold text-gray-900 border-b border-gray-400 flex-1 pb-1">
                                    {disbursement.orsNum || "________________"}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">LDDAP No.:</span>
                                <span className="font-mono font-bold text-gray-900 border-b border-gray-400 flex-1 pb-1">
                                    {disbursement.lddapNum || "________________"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">Date:</span>
                                <span className="font-semibold text-gray-900 border-b border-gray-400 flex-1 pb-1">
                                    {formatDate(disbursement.dateReceived)}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">Fund Cluster:</span>
                                <span className="font-semibold text-gray-900 border-b border-gray-400 flex-1 pb-1">
                                    {disbursement.fundSource?.code || "________________"}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">Mode of Payment:</span>
                                <span className="font-semibold text-gray-900 border-b border-gray-400 flex-1 pb-1">
                                    {disbursement.method === "ONLINE" ? "ADA/Online" : "Check"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payee Section */}
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payee</span>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    {disbursement.payee?.name || "________________"}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TIN / ID</span>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    {disbursement.payee?.tin || "________________"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Particulars */}
                    {disbursement.particulars && (
                        <div className="mb-6">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Particulars</span>
                            <p className="text-sm text-gray-800 mt-2 p-3 bg-gray-50 border border-gray-200 rounded whitespace-pre-wrap">
                                {disbursement.particulars}
                            </p>
                        </div>
                    )}

                    {/* Line Items Table */}
                    <div className="mb-6">
                        <table className="w-full border-collapse border border-gray-400">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                                        Account Code
                                    </th>
                                    <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                                        Particulars / Description
                                    </th>
                                    <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase w-36">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {disbursement.items?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-gray-400 px-3 py-2 font-mono text-sm text-gray-700">
                                            {item.accountCode || "—"}
                                        </td>
                                        <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">
                                            {item.description}
                                        </td>
                                        <td className="border border-gray-400 px-3 py-2 text-right font-semibold text-gray-900">
                                            {formatCurrency(item.amount)}
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty rows for manual entries */}
                                {(!disbursement.items || disbursement.items.length < 5) &&
                                    [...Array(Math.max(0, 5 - (disbursement.items?.length || 0)))].map((_, idx) => (
                                        <tr key={`empty-${idx}`}>
                                            <td className="border border-gray-400 px-3 py-3">&nbsp;</td>
                                            <td className="border border-gray-400 px-3 py-3">&nbsp;</td>
                                            <td className="border border-gray-400 px-3 py-3">&nbsp;</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Deductions Section */}
                    {disbursement.deductions && disbursement.deductions.length > 0 && (
                        <div className="mb-6">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Deductions</span>
                            <table className="w-full border-collapse border border-gray-400">
                                <thead>
                                    <tr className="bg-red-50">
                                        <th className="border border-gray-400 px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                                            Type
                                        </th>
                                        <th className="border border-gray-400 px-3 py-2 text-right text-xs font-bold text-gray-700 uppercase w-36">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disbursement.deductions.map((deduction, idx) => (
                                        <tr key={idx}>
                                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">
                                                {deduction.deductionType}
                                            </td>
                                            <td className="border border-gray-400 px-3 py-2 text-right font-semibold text-red-600">
                                                ({formatCurrency(deduction.amount)})
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Amount Summary Box */}
                    <div className="border-2 border-gray-800 rounded-lg overflow-hidden mb-8">
                        <div className="grid grid-cols-3">
                            <div className="bg-gray-100 p-4 border-r border-gray-400 text-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Gross Amount</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(disbursement.grossAmount)}
                                </span>
                            </div>
                            <div className="bg-red-50 p-4 border-r border-gray-400 text-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Deductions</span>
                                <span className="text-lg font-bold text-red-600">
                                    ({formatCurrency(disbursement.totalDeductions || 0)})
                                </span>
                            </div>
                            <div className="bg-green-50 p-4 text-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Net Amount</span>
                                <span className="text-xl font-bold text-green-700">
                                    {formatCurrency(disbursement.netAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Amount in Words */}
                    <div className="mb-8 bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount in Words</span>
                        <p className="text-sm font-semibold text-gray-900 mt-1 italic">
                            {numberToWords(disbursement.netAmount)} Pesos Only
                        </p>
                    </div>

                    {/* Signature Section */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {/* Prepared By */}
                        <div className="text-center">
                            <div className="border-t-2 border-gray-800 pt-2 mt-16">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Prepared By
                                </p>
                                <div className="h-8 border-b border-gray-400 mb-1"></div>
                                <p className="text-xs text-gray-500">Signature over Printed Name</p>
                                <div className="h-6 border-b border-gray-400 mt-3 mb-1"></div>
                                <p className="text-xs text-gray-500">Position / Designation</p>
                                <div className="h-6 border-b border-gray-400 mt-3 mb-1"></div>
                                <p className="text-xs text-gray-500">Date</p>
                            </div>
                        </div>

                        {/* Certified By */}
                        <div className="text-center">
                            <div className="border-t-2 border-gray-800 pt-2 mt-16">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Certified By
                                </p>
                                <div className="h-8 border-b border-gray-400 mb-1"></div>
                                <p className="text-xs text-gray-500">Signature over Printed Name</p>
                                <div className="h-6 border-b border-gray-400 mt-3 mb-1"></div>
                                <p className="text-xs text-gray-500">Position / Designation</p>
                                <div className="h-6 border-b border-gray-400 mt-3 mb-1"></div>
                                <p className="text-xs text-gray-500">Date</p>
                            </div>
                        </div>

                        {/* Approved By */}
                        <div className="text-center">
                            <div className="border-t-2 border-gray-800 pt-2 mt-16">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Approved By
                                </p>
                                <div className="h-8 border-b border-gray-400 mb-1"></div>
                                <p className="text-xs text-gray-500">Signature over Printed Name</p>
                                <div className="h-6 border-b border-gray-400 mt-3 mb-1"></div>
                                <p className="text-xs text-gray-500">Position / Designation</p>
                                <div className="h-6 border-b border-gray-400 mt-3 mb-1"></div>
                                <p className="text-xs text-gray-500">Date</p>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Section */}
                    <div className="border-t-2 border-gray-800 pt-6">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                            Official Receipt / Acknowledgment
                        </h4>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Check/ADA No.:</p>
                                <div className="h-6 border-b border-gray-400"></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Date:</p>
                                <div className="h-6 border-b border-gray-400"></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bank Name:</p>
                                <div className="h-6 border-b border-gray-400"></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Account Number:</p>
                                <div className="h-6 border-b border-gray-400"></div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500 mb-3">Received payment in full</p>
                            <div className="w-64 mx-auto">
                                <div className="h-8 border-b border-gray-400 mb-1"></div>
                                <p className="text-xs text-gray-500">Payee's Signature / Date</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                        <p>
                            Printed on {new Date().toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })} • FundWatch System
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

// ============================================
// HELPER: Convert number to words
// ============================================
function numberToWords(num) {
    if (num === 0) return "Zero";
    if (!num) return "—";

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const numString = Math.floor(num).toString();

    if (numString.length > 12) return "Number too large";

    const n = ("000000000000" + numString).substr(-12).match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
    if (!n) return "";

    let str = "";

    const convertHundreds = (num) => {
        const n = parseInt(num);
        if (n === 0) return "";
        const h = Math.floor(n / 100);
        const t = n % 100;
        let result = "";
        if (h > 0) result += ones[h] + " Hundred ";
        if (t > 0) {
            if (t < 20) result += ones[t];
            else result += tens[Math.floor(t / 10)] + " " + ones[t % 10];
        }
        return result.trim();
    };

    const billions = convertHundreds(n[1]);
    const millions = convertHundreds(n[2]);
    const thousands = convertHundreds(n[3]);
    const hundreds = convertHundreds(n[4]);

    if (billions) str += billions + " Billion ";
    if (millions) str += millions + " Million ";
    if (thousands) str += thousands + " Thousand ";
    if (hundreds) str += hundreds;

    // Add cents
    const cents = Math.round((num % 1) * 100);
    if (cents > 0) {
        str += ` and ${cents}/100`;
    }

    return str.trim() || "Zero";
}

export default DisbursementPrintView;
