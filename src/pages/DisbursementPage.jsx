import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Printer,
    CheckCircle2,
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
    CreditCard,
    Send,
} from "lucide-react";
import useDisbursementStore from "../store/useDisbursementStore";
import useFundStore from "../store/useFundStore";
import usePayeeStore from "../store/usePayeeStore";
import DisbursementPrintView from "../components/DisbursementPrintView";
import { formatCurrency } from "../lib/formatters";


const DisbursementPage = () => {

    return (
        <div>Disbusrement page</div>
    )
};

export default DisbursementPage;
