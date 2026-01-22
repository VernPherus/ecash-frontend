import { create } from "zustand";

// Mock notification data for frontend display
const mockNotifications = [
    {
        id: "1",
        type: "success",
        title: "Disbursement Approved",
        message: "DV-2026-0045 has been approved and is ready for processing.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        isRead: false,
        link: "/disbursement/45",
    },
    {
        id: "2",
        type: "warning",
        title: "Fund Balance Low",
        message: "General Fund balance is below 20%. Consider requesting additional allocation.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        link: "/funds",
    },
    {
        id: "3",
        type: "info",
        title: "New Payee Added",
        message: "ABC Construction Inc. has been added to the payee list.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        isRead: true,
        link: "/payees",
    },
    {
        id: "4",
        type: "error",
        title: "Processing Failed",
        message: "DV-2026-0042 failed validation. Please review and resubmit.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        link: "/disbursement/42",
    },
    {
        id: "5",
        type: "info",
        title: "System Update",
        message: "FundWatch will undergo maintenance on Sunday 2AM-4AM.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        isRead: true,
    },
];

const useNotificationStore = create((set, get) => ({
    // State
    notifications: mockNotifications,
    isLoading: false,

    // Computed
    get unreadCount() {
        return get().notifications.filter((n) => !n.isRead).length;
    },

    // Actions
    getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
    },

    markAsRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
    },

    addNotification: (notification) => {
        const newNotification = {
            id: Date.now().toString(),
            createdAt: new Date(),
            isRead: false,
            ...notification,
        };
        set((state) => ({
            notifications: [newNotification, ...state.notifications],
        }));
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    clearAllNotifications: () => {
        set({ notifications: [] });
    },

    // Future: API integration placeholder
    // fetchNotifications: async () => {
    //     set({ isLoading: true });
    //     try {
    //         const response = await axiosInstance.get("/notifications");
    //         set({ notifications: response.data, isLoading: false });
    //     } catch (error) {
    //         set({ isLoading: false });
    //     }
    // },
}));

export default useNotificationStore;
