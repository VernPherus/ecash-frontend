import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useFundStore = create((set, get) => ({
  // State
  funds: [], // For the main list
  dashboard: {
    funds: [], // For the card display with utilization rates
    totals: null, // For global totalBudget, totalSpent, etc.
  },
  entries: [], // For the entry history list
  currentFund: null, // For the "Show Fund" single view
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
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

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/fund/displayDashboard");

      // Backend returns { funds: [...], totals: {...} }
      set({
        dashboard: {
          funds: response.data.funds,
          totals: response.data.totals,
        },
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load dashboard";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchEntries: async (page = 1, limit = 10, fundId = null) => {
    set({ isLoading: true, error: null });
    try {
      // If fundId is provided, it fetches entries for that specific fund
      const params = { page, limit };
      if (fundId) params.fundId = fundId;

      const response = await axiosInstance.get("/fund/displayEntry", {
        params,
      });

      set({
        entries: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch entries";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchFundDetails: async (id) => {
    set({ isLoading: true, error: null, currentFund: null }); // Clear previous view
    try {
      // WARNING: Ensure your route is /showfund/:id
      const response = await axiosInstance.get(`/fund/showfund/${id}`);

      set({
        currentFund: response.data,
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Fund not found";
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
      "badge-accent",
      "badge-primary",
      "badge-secondary",
      "badge-info",
      "badge-success",
      "badge-warning",
    ];

    return colors[index % colors.length];
  },
}));

export default useFundStore;
