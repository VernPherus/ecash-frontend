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
        limit: 20,
        total: 0,
    },

    // Filters
    filters: {
        userId: null,
        startDate: null,
        endDate: null,
    },

    // Actions
    fetchLogs: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const { page, limit } = get().pagination;
            const { userId, startDate, endDate } = get().filters;

            const response = await axiosInstance.get("/logs", {
                params: {
                    page: params.page || page,
                    limit: params.limit || limit,
                    userId: params.userId || userId,
                    startDate: params.startDate || startDate,
                    endDate: params.endDate || endDate,
                },
            });

            // Handle paginated response: { data: [...], pagination: {...} }
            const logsData = response.data?.data || response.data?.logs || response.data || [];
            set({
                logs: Array.isArray(logsData) ? logsData : [],
                pagination: {
                    ...get().pagination,
                    total: response.data?.pagination?.total || response.data?.total || logsData.length || 0,
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
        set((state) => ({
            pagination: { ...state.pagination, page },
        }));
        get().fetchLogs({ page });
    },

    setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
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
                userId: null,
                startDate: null,
                endDate: null,
            },
        });
        get().fetchLogs({ page: 1 });
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
            userName: log.user
                ? `${log.user.firstName} ${log.user.lastName}`
                : "Unknown",
        };
    },
}));

export default useLogStore;
