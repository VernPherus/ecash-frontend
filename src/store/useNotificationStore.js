// src/store/useNotifStore.js
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useNotifStore = create((set, get) => ({
  notifs: [],
  unreadCount: 0,
  pagination: { total: 0, page: 1, totalPages: 0 },
  isLoading: false,

  // Fetches notifications from /notif/get
  getNotifs: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/notif/get", {
        params: { page, limit },
      });
      const { data, unreadCount, pagination } = response.data; // Matches backend controller structure
      set({
        notifs: data || [],
        unreadCount: unreadCount || 0,
        pagination: pagination || { total: 0, page: 1, totalPages: 0 },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },

  // Marks specific ID as read via /notif/markRead/:id
  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/notif/markRead/${id}`);
      set((state) => ({
        notifs: state.notifs.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  },

  // Marks all via /notif/markAll
  markAllAsRead: async () => {
    try {
      await axiosInstance.put("/notif/markAll");
      set((state) => ({
        notifs: state.notifs.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
      toast.success("All caught up!");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  },

  // Real-time helper for WebSocket integration
  addNotification: (notification) => {
    set((state) => ({
      notifs: [notification, ...state.notifs],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

export default useNotifStore;
