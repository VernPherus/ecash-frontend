import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useFundStore = create((set, get) => ({
  // State
  funds: [],
  selectedFund: null,
  isLoading: false,
  error: null,

  // Computed values
  get totalBudget() {
    return get().funds.reduce(
      (sum, fund) => sum + Number(fund.initialBalance || 0),
      0,
    );
  },

  // GET FUNDS
  fetchFunds: async (page = 1, limit = 10, search = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/fund/displayfund", {
        params: { page, limit, search },
      });

      set({
        funds: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch funds";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  createFund: async (fundData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/fund/newfund", fundData);
      const newFund = response.data.savedFund;

      set((state) => ({
        funds: [...state.funds, newFund],
        isLoading: false,
      }));

      toast.success("Fund source created successfully!");
      return { success: true, fund: newFund };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create fund source";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  updateFund: async (id, fundData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/fund/editfund`, {
        id,
        ...fundData,
      });
      const updatedFund = response.data.updatedFundSource;

      set((state) => ({
        funds: state.funds.map((f) => (f.id === id ? updatedFund : f)),
        selectedFund:
          state.selectedFund?.id === id ? updatedFund : state.selectedFund,
        isLoading: false,
      }));

      toast.success("Fund source updated successfully!");
      return { success: true, fund: updatedFund };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update fund source";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  setSelectedFund: (fund) => {
    set({ selectedFund: fund });
  },

  clearSelectedFund: () => {
    set({ selectedFund: null });
  },

  // Get fund by ID
  getFundById: (id) => {
    return get().funds.find((f) => f.id === id);
  },

  // Get fund colors based on index
  getFundColor: (index) => {
    const colors = [
      "fund-badge-emerald",
      "fund-badge-blue",
      "fund-badge-indigo",
      "fund-badge-purple",
      "fund-badge-amber",
      "fund-badge-rose",
    ];
    return colors[index % colors.length];
  },
}));

export default useFundStore;
