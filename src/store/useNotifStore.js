import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useNotifStore = create((set, get) => ({
  // --- State ---
  notifs: [],
  unreadCount: 0,
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  // --- Actions ---
  getNotifs: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/notif/get", {
        params: { page, limit },
      });

      const data = response.data ?? {};
      set({
        notifs: Array.isArray(data.data) ? data.data : [],
        unreadCount: data.unreadCount ?? 0,
        pagination: data.pagination ?? { total: 0, page: 1, totalPages: 0 },
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get notifications";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  markAsRead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/notif/markRead/${id}`);

      const updatedNotifs = get().notifs.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      );

      const newUnreadCount = updatedNotifs.filter(
        (notif) => !notif.isRead,
      ).length;

      set({
        notifs: updatedNotifs,
        unreadCount: newUnreadCount,
        isLoading: false,
      });

      toast.success("Notification marked as read");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to mark as read";
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  markAllAsRead: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put("/notif/markAll");

      // Update all notifications to read
      const updatedNotifs = get().notifs.map((notif) => ({
        ...notif,
        isRead: true,
      }));

      set({
        notifs: updatedNotifs,
        unreadCount: 0,
        isLoading: false,
      });

      toast.success("All notifications marked as read");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to mark all as read";
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  // Helper to add a new notification (useful for real-time updates via WebSocket)
  addNotification: (notification) => {
    set((state) => ({
      notifs: [notification, ...state.notifs],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Helper to clear all notifications from state
  clearNotifications: () => {
    set({ notifs: [], unreadCount: 0 });
  },
}));

export default useNotifStore;
