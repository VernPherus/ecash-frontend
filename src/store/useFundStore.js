import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useFundStore = create((set, get) => ({
  // --- State ---
  funds: [],
  dashboard: {
    funds: [],
    totals: null,
  },
  entries: [],
  selectedFund: null,
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Fetch Funds (Paginated)
   * GET /api/fund/displayfund
   */
  fetchFunds: async (page = 1, limit = 10, search = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/fund/displayfund", {
        params: { page, limit, search },
      });

      const data = response.data ?? {};
      set({
        funds: Array.isArray(data.data) ? data.data : [],
        pagination: data.pagination ?? {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
        },
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch funds";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  /**
   * Fetch Dashboard Data
   * GET /api/fund/displayDashboard
   */
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/fund/displayDashboard");

      // Expecting { funds: [...], totals: {...} }
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

  /**
   * Fetch Specific Fund Details
   * GET /api/fund/showfund?id=...
   */
  fetchFundDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Route is /showfund, implies query param since no :id in route path
      const response = await axiosInstance.get("/fund/showfund", {
        params: { id },
      });

      set({
        selectedFund: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Fund not found";
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },

  /**
   * Create New Fund
   * POST /api/fund/newfund
   * Refetches funds after success so totals and list stay in sync.
   */
  createFund: async (fundData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/fund/newfund", fundData);
      const data = response?.data ?? {};
      const newFund = data.savedFund ?? data.data ?? data.fund;

      if (!newFund || typeof newFund !== "object") {
        set({ isLoading: false });
        toast.error("Invalid response from server");
        return { success: false, error: "Invalid response" };
      }

      set({ isLoading: false });
      toast.success("Fund source created successfully!");
      await get().fetchFunds();
      return { success: true, fund: newFund };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create fund source";
      set({ isLoading: false, error: message });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Update Fund
   * PUT /api/fund/editfund/:id
   * Backend returns { data: updatedFundSource }. Refetches funds after success.
   */
  updateFund: async (id, fundData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        `/fund/editfund/${id}`,
        fundData,
      );
      const data = response?.data ?? {};
      const updatedFund =
        data.data ?? data.updatedFundSource ?? data.updatedFund;

      if (!updatedFund || typeof updatedFund !== "object") {
        set({ isLoading: false });
        toast.error("Invalid response from server");
        return { success: false, error: "Invalid response" };
      }

      set((state) => ({
        funds: state.funds.map((f) =>
          Number(f?.id) === Number(id) ? updatedFund : f,
        ),
        selectedFund:
          Number(state.selectedFund?.id) === Number(id)
            ? updatedFund
            : state.selectedFund,
        isLoading: false,
      }));

      toast.success("Fund source updated successfully!");
      await get().fetchFunds();
      return { success: true, fund: updatedFund };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update fund source";
      set({ isLoading: false, error: message });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Deactivate Fund (Soft Delete)
   * PUT /api/fund/deactivatefund/:id
   */
  deactivateFund: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/fund/deactivatefund/${id}`);

      set((state) => ({
        // Remove from list or mark as inactive depending on UI needs
        funds: state.funds.filter((f) => f.id !== id),
        selectedFund: state.selectedFund?.id === id ? null : state.selectedFund,
        isLoading: false,
      }));

      toast.success("Fund deactivated successfully");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to deactivate fund";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Reset All Funds (Danger Zone)
   * PUT /api/fund/reset
   */
  resetFund: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.put("/fund/reset");
      set({
        funds: [],
        dashboard: { funds: [], totals: null },
        isLoading: false,
      });
      toast.success("All funds have been reset");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to reset funds";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // --- Entry / Ledger Actions ---

  /**
   * Create New Entry (Allotment/Expense)
   * POST /api/fund/newEntry
   */
  createEntry: async (entryData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/fund/newEntry", entryData);
      const newEntry = response.data.savedEntry;

      if (entryData.fundId) {
        get().fetchFundDetails(entryData.fundId);
      }

      set((state) => ({
        entries: [newEntry, ...state.entries],
        isLoading: false,
      }));

      toast.success("Entry recorded successfully!");
      return { success: true, entry: newEntry };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create entry";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Fetch Entries (Paginated)
   * GET /api/fund/displayEntry
   */
  fetchEntries: async (page = 1, limit = 10, fundId = null) => {
    set({ isLoading: true, error: null });
    try {
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

  /**
   * Delete Entry
   * PUT /api/fund/deleteEntry
   */
  deleteEntry: async (id) => {
    set({ isLoading: true });
    try {
      // Assuming ID is passed in body based on PUT method usage for delete
      await axiosInstance.put("/fund/deleteEntry", { id });

      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
        isLoading: false,
      }));

      // Refresh fund stats if an entry was deleted
      if (get().selectedFund) {
        get().fetchFundDetails(get().selectedFund.id);
      }

      toast.success("Entry removed successfully");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete entry";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // --- Helpers ---

  setSelectedFund: (fund) => {
    set({ selectedFund: fund });
  },

  clearSelectedFund: () => {
    set({ selectedFund: null });
  },

  getFundColor: (index) => {
    const colors = [
      "badge-primary",
      "badge-secondary",
      "badge-accent",
      "badge-info",
      "badge-success",
      "badge-warning",
      "badge-error",
    ];
    return colors[index % colors.length];
  },
}));

export default useFundStore;
