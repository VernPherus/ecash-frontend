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

  // Computed: Get filtered payees (defensive: skip invalid entries, safe access)
  getFilteredPayees: () => {
    const { payees, searchQuery, filterType } = get();
    if (!Array.isArray(payees)) return [];
    const q = (searchQuery ?? "").toLowerCase();
    return payees.filter((payee) => {
      // More defensive checks: ensure payee exists and is an object
      if (!payee || typeof payee !== "object" || payee === null) return false;

      // Safely access properties with fallbacks
      const name = payee?.name ? String(payee.name).toLowerCase() : "";
      const email = payee?.email ? String(payee.email).toLowerCase() : "";
      const tinNum = payee?.tinNum ? String(payee.tinNum) : "";
      const type = payee?.type ? String(payee.type) : "";

      const matchesSearch =
        name.includes(q) ||
        email.includes(q) ||
        tinNum.includes(searchQuery ?? "");

      const matchesType = filterType === "all" || type === filterType;

      return matchesSearch && matchesType;
    });
  },

  // Actions
  fetchPayees: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/payee/listPayee");
      const data = response?.data;
      // Filter out any invalid entries and ensure all payees have required fields
      const validPayees = Array.isArray(data)
        ? data.filter(
            (p) =>
              p && typeof p === "object" && p !== null && p.id !== undefined,
          )
        : [];
      set({
        payees: validPayees,
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch payees";
      set({ error: message, isLoading: false, payees: [] });
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
      const message = error.response?.data?.message || "Failed to create payee";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  updatePayee: async (id, payeeData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(
        `/payee/editPayee/${id}`,
        payeeData,
      );
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
      const message = error.response?.data?.message || "Failed to update payee";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  deletePayee: async (id) => {
    set({ isLoading: true });
    try {
      // Assuming endpoint follows standard pattern
      await axiosInstance.put(`/payee/deletePayee/${id}`);

      set((state) => ({
        // Remove from list or mark inactive
        payees: state.payees.filter((p) => p.id !== Number(id)),
        selectedPayee:
          state.selectedPayee?.id === Number(id) ? null : state.selectedPayee,
        isLoading: false,
      }));

      toast.success("Payee deactivated successfully");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete payee";
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
    const payees = get().payees;
    if (!Array.isArray(payees)) return ["all"];
    const types = new Set(
      payees
        .filter((p) => p && typeof p === "object")
        .map((p) => p.type)
        .filter(Boolean),
    );
    return ["all", ...Array.from(types)];
  },
}));

export default usePayeeStore;
