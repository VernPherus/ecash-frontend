import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useLedgerStore = create((set, get) => ({
  // --- State ---
  isLoading: false,
  error: null,
  ledgers: [],

  // --- Actions ---
  getLedgers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/ledger/get");
      const data = response.data;

      set({
        ledgers: Array.isArray(data.data) ? data.data : [],
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get ledgers";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  createLedger: async (ledgerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/ledger/create", ledgerData);

      await get().getLedgers();

      toast.success("Ledger created successfully");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create ledger";
      set({ isLoading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  updateLedger: async (id) => {
    set({ isLoading: true, error: false });
    try {
      const response = await axiosInstance.put(`ledger/update/${id}`);

      await get().getLedgers();
      toast.success("Ledger updated successfully");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update ledger";
      set({ isLoading: false, error: message });
      toast.error(message);
      throw error;
    }
  },
}));

export default useLedgerStore;
