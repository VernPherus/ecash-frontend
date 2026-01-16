import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isCheckingAuth: true,

            // Actions
            signup: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.post("/auth/signup", userData);
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success("Account created successfully!");
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || "Signup failed";
                    toast.error(message);
                    set({ isLoading: false });
                    return { success: false, error: message };
                }
            },

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.post("/auth/login", credentials);
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success("Welcome back!");
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || "Login failed";
                    toast.error(message);
                    set({ isLoading: false });
                    return { success: false, error: message };
                }
            },

            logout: async () => {
                try {
                    await axiosInstance.post("/auth/logout");
                    set({
                        user: null,
                        isAuthenticated: false,
                    });
                    toast.success("Logged out successfully");
                } catch (error) {
                    console.error("Logout error:", error);
                    // Still clear local state even if API call fails
                    set({
                        user: null,
                        isAuthenticated: false,
                    });
                }
            },

            checkAuth: async () => {
                set({ isCheckingAuth: true });
                try {
                    const response = await axiosInstance.get("/auth/check");
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isCheckingAuth: false,
                    });
                } catch (error) {
                    toast.error(error)
                    set({
                        user: null,
                        isAuthenticated: false,
                        isCheckingAuth: false,
                    });
                }
            },

            // Utility to get current auth state
            getAuthState: () => ({
                user: get().user,
                isAuthenticated: get().isAuthenticated,
            }),
        }),
        {
            name: "fundwatch-auth",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;