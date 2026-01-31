import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useSystemStore = create((set) => ({
  isLoading: false,
  error: null,
  time: {
    currentDate: null,
    year: null,
    month: null,
    quarter: null,
    timeStamp: null,
    isStartOfMonth: null,
    isStartOfQuarter: null,
    isStartOfYear: null,
  },

  // --- Actions ---

  getTime: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/system/getTime");

      const data = response.data;
      set({
        time: {
          currentDate: data.currentDate,
          year: data.year,
          month: data.month,
          quarter: data.quarter,
          timeStamp: data.timeStamp,
          isStartOfMonth: data.isStartOfMonth,
          isStartOfQuarter: data.isStartOfQuarter,
          isStartOfYear: data.isStartOfYear,
        },
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data.message || "Failed to fetch time";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },
}));

export default useSystemStore;
