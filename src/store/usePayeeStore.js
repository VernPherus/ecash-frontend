import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const usePayeeStore = create((set, get) => ({
    // State
    payees: [],
    selectedPayee: null,
    isLoading: false,
    error: null,
    searchQuery: "",
    filterType: "all",

    // Computed: Get filtered payees
    getFilteredPayees: () => {
        const { payees, searchQuery, filterType } = get();
        return payees.filter((payee) => {
            const matchesSearch =
                payee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payee.tinNum?.includes(searchQuery);

            const matchesType = filterType === "all" || payee.type === filterType;

            return matchesSearch && matchesType;
        });
    },

    // Actions
    fetchPayees: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/payee/listPayee");
            set({ payees: response.data, isLoading: false });
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch payees";
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    createPayee: async (payeeData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post("/payee/newPayee", payeeData);
            const newPayee = response.data.savedPayee;

            set((state) => ({
                payees: [...state.payees, newPayee],
                isLoading: false,
            }));

            toast.success("Payee created successfully!");
            return { success: true, payee: newPayee };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to create payee";
            set({ isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },

    updatePayee: async (id, payeeData) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.put(`/payee/editPayee`, {
                id,
                ...payeeData,
            });
            const updatedPayee = response.data.updatedPayee;

            set((state) => ({
                payees: state.payees.map((p) => (p.id === id ? updatedPayee : p)),
                selectedPayee:
                    state.selectedPayee?.id === id ? updatedPayee : state.selectedPayee,
                isLoading: false,
            }));

            toast.success("Payee updated successfully!");
            return { success: true, payee: updatedPayee };
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to update payee";
            set({ isLoading: false });
            toast.error(message);
            return { success: false, error: message };
        }
    },

    showPayee: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(`/payee/showPayee/${id}`);
            set({ selectedPayee: response.data.payee, isLoading: false });
            return response.data.payee;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to load payee";
            set({ isLoading: false });
            toast.error(message);
            return null;
        }
    },

    setSelectedPayee: (payee) => {
        set({ selectedPayee: payee });
    },

    clearSelectedPayee: () => {
        set({ selectedPayee: null });
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
    },

    setFilterType: (type) => {
        set({ filterType: type });
    },

    // Get payee by ID from local state
    getPayeeById: (id) => {
        return get().payees.find((p) => p.id === id);
    },

    // Get unique payee types for filter dropdown
    getPayeeTypes: () => {
        const types = new Set(get().payees.map((p) => p.type).filter(Boolean));
        return ["all", ...Array.from(types)];
    },
}));

export default usePayeeStore;
