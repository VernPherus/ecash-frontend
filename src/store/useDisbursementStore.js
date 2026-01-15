import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useDisbursementStore = create((set, get) => ({
    // State
    disbursements: [],
    selectedDisbursement: null,
    isLoading: false,
    error: null,

    // Stats computed from disbursements
    getStats: () => {
        const disbursements = get().disbursements || [];
        if (!Array.isArray(disbursements)) return { pendingCount: 0, approvedCount: 0, overdueCount: 0, totalDisbursed: 0 };
        const pending = disbursements.filter((d) => d.status === "pending");
        const approved = disbursements.filter((d) => d.status === "approved");

        // Calculate overdue based on age (days since received > ageLimit)
        const overdue = disbursements.filter((d) => {
            if (d.status !== "pending") return false;
            const daysSinceReceived = d.dateReceived
                ? Math.floor(
                    (new Date() - new Date(d.dateReceived)) / (1000 * 60 * 60 * 24)
                )
                : 0;
            return daysSinceReceived > (d.ageLimit || 5);
        });

        const totalDisbursed = approved.reduce(
            (sum, d) => sum + Number(d.netAmount || 0),
            0
        );

        return {
            pendingCount: pending.length,
            approvedCount: approved.length,
            overdueCount: overdue.length,
            totalDisbursed,
        };
    },

    // Get disbursement status with age calculation
    getDisbursementStatus: (disbursement) => {
        if (disbursement.status === "approved") {
            return { status: "approved", label: "Approved", className: "badge-approved" };
        }

        const daysSinceReceived = disbursement.dateReceived
            ? Math.floor(
                (new Date() - new Date(disbursement.dateReceived)) / (1000 * 60 * 60 * 24)
            )
            : 0;

        if (daysSinceReceived > (disbursement.ageLimit || 5)) {
            return {
                status: "overdue",
                label: `${daysSinceReceived} Days`,
                className: "badge-overdue",
                days: daysSinceReceived,
            };
        }

        return {
            status: "pending",
            label: `${daysSinceReceived} Days`,
            className: "badge-pending",
            days: daysSinceReceived,
        };
    },

    // Actions
    fetchDisbursements: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/disbursement/display");
            // Handle paginated response: { data: [...], pagination: {...} }
            const disbursements = response.data?.data || response.data || [];
            set({ disbursements: Array.isArray(disbursements) ? disbursements : [], isLoading: false });
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch disbursements";
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    createDisbursement: async (disbursementData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post(
                "/disbursement/store",
                disbursementData
            );
            const newDisbursement = response.data.savedDisbursement;

            set((state) => ({
                disbursements: [newDisbursement, ...state.disbursements],
                isLoading: false,
            }));

            toast.success("Disbursement created successfully!");
            return { success: true, disbursement: newDisbursement };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to create disbursement";
            set({ isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },

    showDisbursement: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/disbursement/show/${id}`);
            set({ selectedDisbursement: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to load disbursement";
            set({ isLoading: false });
            toast.error(message);
            return null;
        }
    },

    updateDisbursement: async (id, updateData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.put(
                `/disbursement/editRec/${id}`,
                updateData
            );
            const updatedDisbursement = response.data.updatedDisbursement;

            set((state) => ({
                disbursements: state.disbursements.map((d) =>
                    d.id === id ? updatedDisbursement : d
                ),
                selectedDisbursement:
                    state.selectedDisbursement?.id === id
                        ? updatedDisbursement
                        : state.selectedDisbursement,
                isLoading: false,
            }));

            toast.success("Disbursement updated successfully!");
            return { success: true, disbursement: updatedDisbursement };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to update disbursement";
            set({ isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },

    approveDisbursement: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.put(`/disbursement/approve/${id}`);
            const approvedDisbursement = response.data.approvedDisbursement;

            set((state) => ({
                disbursements: state.disbursements.map((d) =>
                    d.id === id ? approvedDisbursement : d
                ),
                selectedDisbursement:
                    state.selectedDisbursement?.id === id
                        ? approvedDisbursement
                        : state.selectedDisbursement,
                isLoading: false,
            }));

            toast.success("Disbursement approved!");
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to approve disbursement";
            set({ isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },

    setSelectedDisbursement: (disbursement) => {
        set({ selectedDisbursement: disbursement });
    },

    clearSelectedDisbursement: () => {
        set({ selectedDisbursement: null });
    },

    // Get recent disbursements (last 10)
    getRecentDisbursements: () => {
        return get()
            .disbursements
            .slice(0, 10);
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    },
}));

export default useDisbursementStore;
