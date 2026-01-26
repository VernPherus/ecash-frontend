import { create } from "zustand";
import { persist } from "zustand/middleware";

import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      authUser: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: true,

      //* Signup
      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("/auth/signup", userData);
          set({
            authUser: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success("Account created successfully!");
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Signup failed";
          toast.error(message);
          return { success: false, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      //* Login
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("/auth/login", credentials);
          set({
            authUser: response.data,
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

      //* Logout
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({
            authUser: null,
            isAuthenticated: false,
          });
          toast.success("Logged out successfully");

          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        } catch (error) {
          console.error("Logout error:", error);
          set({
            authUser: null,
            isAuthenticated: false,
          });
        }
      },

      //* Reset password
      requestPasswordResetOtp: async (email) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("/auth/reset-password", {
            email,
          });

          set({ isLoading: false });
          toast.success(response.data.message || "OTP sent to your email.");
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Failed to sent OTP";
          set({ error: message, isLoading: false });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      confirmPasswordReset: async (credentials) => {
        try {
          const response = await axiosInstance.post(
            "/auth/reset-password",
            credentials,
          );

          set({ isLoading: false });
          toast.success(
            response.data.message || "Password updated successfully!",
          );
          return { success: true };
        } catch (error) {
          const message =
            error.response?.data?.message || "Failed to reset password";
          set({ error: message, isLoading: false });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      //* Check auth
      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const response = await axiosInstance.get("/auth/check");
          set({
            authUser: response.data,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
        } catch (error) {
          const status = error.response?.status;
          if (status !== 401) {
            toast.error(error.response?.data?.message || "Auth check failed");
          }
          set({
            authUser: null,
            isAuthenticated: false,
            isCheckingAuth: false,
          });
        }
      },

      // Utility to get current auth state
      getAuthState: () => ({
        authUser: get().authUser,
        isAuthenticated: get().isAuthenticated,
      }),
    }),
    {
      name: "fundwatch-auth",
      partialize: (state) => ({
        authUser: state.authUser,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
