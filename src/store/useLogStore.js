import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useLogStore = create((set, get) => ({
  // State
  logs: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20, // Matches the backend default
    total: 0,
    totalPages: 1,
  },

  // Filters
  filters: {
    search: "", // Changed from userId to search to match backend
    startDate: null,
    endDate: null,
  },

  // Actions
  fetchLogs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Get current state values as defaults
      const currentPagination = get().pagination;
      const currentFilters = get().filters;

      // Merge params with current state
      const page = params.page || currentPagination.page;
      const limit = params.limit || currentPagination.limit;
      const search =
        params.search !== undefined ? params.search : currentFilters.search;
      const startDate = params.startDate || currentFilters.startDate;
      const endDate = params.endDate || currentFilters.endDate;

      // Call Backend
      // The backend route is likely mounted at /log or /logs.
      // Based on common conventions and your route file:
      const response = await axiosInstance.get("/logs", {
        params: {
          page,
          limit,
          search,
          startDate,
          endDate,
        },
      });

      // The backend controller returns: { data: logs, pagination: { total, page, totalPages } }
      const { data, pagination } = response.data;

      set({
        logs: data || [],
        pagination: {
          page: pagination?.page || page,
          limit: limit, // Keep the limit consistent
          total: pagination?.total || 0,
          totalPages: pagination?.totalPages || 1,
        },
        isLoading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch logs";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  setPage: (page) => {
    // Update state and fetch new data
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchLogs({ page });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  applyFilters: () => {
    set((state) => ({
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchLogs({ page: 1 });
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        startDate: null,
        endDate: null,
      },
      pagination: {
        ...get().pagination,
        page: 1,
      },
    });
    get().fetchLogs({ page: 1, search: "", startDate: null, endDate: null });
  },

  // Format log entry for display
  formatLogEntry: (log) => {
    return {
      ...log,
      formattedDate: new Date(log.createdAt).toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      // Safely access nested user object
      userId: log.user
        ? `${log.user.firstName} ${log.user.lastName}`
        : "Unknown User",
      activity: log.log, // Map 'log' field to 'activity' if needed by UI, or just use .log
    };
  },
}));

export default useLogStore;
