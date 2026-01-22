import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useDisbursementStore = create((set, get) => ({
  // --- State ---
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
  disbursements: [],
  selectedDisbursement: null,
  isLoading: false,
  error: null,

  // --- UI Helpers ---

  // Calculate status and age for UI badges
  getDisbursementStatus: (disbursement) => {
    // 1. Check if Paid/Approved
    if (disbursement.status === "PAID" || disbursement.status === "APPROVED") {
      return {
        status: "approved",
        label: "Paid",
        className: "badge-success text-white border-success bg-success", // Tailwind/DaisyUI classes
      };
    }

    // 2. Calculate Age (Days since received)
    const daysSinceReceived = disbursement.dateReceived
      ? Math.floor(
          (new Date() - new Date(disbursement.dateReceived)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    // 3. Check Overdue (Default limit 5 days if not set)
    const limit = disbursement.ageLimit || 5;

    if (daysSinceReceived > limit) {
      return {
        status: "overdue",
        label: `${daysSinceReceived} Days (Overdue)`,
        className: "badge-error text-white border-error bg-error",
        days: daysSinceReceived,
      };
    }

    // 4. Pending / In Progress
    return {
      status: "pending",
      label: `${daysSinceReceived} Days`,
      className: "badge-warning text-warning-content border-warning bg-warning",
      days: daysSinceReceived,
    };
  },

  // --- API Actions ---

  /**
   * Fetch Records with Pagination & Filters
   * GET /api/disbursement/display
   */
  fetchDisbursements: async (
    page = 1,
    limit = 10,
    search = "",
    status = "",
    startDate = "",
    endDate = "",
  ) => {
    set({ isLoading: true, error: null });
    try {
      // Build Query Parameters
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (search) params.append("search", search);
      // Backend controller checks `if (status && status !== "all")`
      if (status && status !== "ALL") params.append("status", status);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axiosInstance.get(
        `/disbursement/display?${params.toString()}`,
      );

      const { data, pagination } = response.data;

      set({
        disbursements: Array.isArray(data) ? data : [],
        pagination: pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        },
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch disbursements";
      set({ error: message, isLoading: false, disbursements: [] });
      toast.error(message);
    }
  },

  /**
   * Create Record
   * POST /api/disbursement/store
   */
  createDisbursement: async (disbursementData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(
        "/disbursement/store",
        disbursementData,
      );
      const newDisbursement = response.data;

      // Optimistic update: Add to top of list
      set((state) => ({
        disbursements: [newDisbursement, ...state.disbursements],
        isLoading: false,
      }));

      toast.success("Disbursement created successfully!");
      return { success: true, disbursement: newDisbursement };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create disbursement";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Show Single Record
   * GET /api/disbursement/show/:id
   */
  showDisbursement: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/disbursement/show/${id}`);
      set({ selectedDisbursement: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load disbursement";
      set({ isLoading: false });
      toast.error(message);
      return null;
    }
  },

  /**
   * Update Record
   * PUT /api/disbursement/editRec/:id
   */
  updateDisbursement: async (id, updateData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(
        `/disbursement/editRec/${id}`,
        updateData,
      );
      // Access specific data structure from backend response
      const updatedDisbursement = response.data.updatedDisbursement;

      set((state) => ({
        disbursements: state.disbursements.map((d) =>
          d.id === Number(id) ? updatedDisbursement : d,
        ),
        selectedDisbursement:
          state.selectedDisbursement?.id === Number(id)
            ? updatedDisbursement
            : state.selectedDisbursement,
        isLoading: false,
      }));

      toast.success("Disbursement updated successfully!");
      return { success: true, disbursement: updatedDisbursement };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update disbursement";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Approve Record
   * PUT /api/disbursement/approve/:id
   */
  approveDisbursement: async (id, remarks = "") => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/disbursement/approve/${id}`, {
        remarks,
      });
      const approvedDisbursement = response.data.data;

      set((state) => ({
        disbursements: state.disbursements.map((d) =>
          d.id === Number(id) ? approvedDisbursement : d,
        ),
        selectedDisbursement:
          state.selectedDisbursement?.id === Number(id)
            ? approvedDisbursement
            : state.selectedDisbursement,
        isLoading: false,
      }));

      toast.success("Disbursement approved!");
      return { success: true, data: approvedDisbursement };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to approve disbursement";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  /**
   * Delete Record (Soft Delete)
   * PUT /api/disbursement/delete/:id
   */
  deleteDisbursement: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/disbursement/delete/${id}`);

      set((state) => ({
        disbursements: state.disbursements.filter((d) => d.id !== Number(id)),
        selectedDisbursement:
          state.selectedDisbursement?.id === Number(id)
            ? null
            : state.selectedDisbursement,
        isLoading: false,
      }));

      toast.success("Disbursement removed successfully.");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete disbursement";
      set({ isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // --- State Setters ---
  setSelectedDisbursement: (disbursement) => {
    set({ selectedDisbursement: disbursement });
  },

  clearSelectedDisbursement: () => {
    set({ selectedDisbursement: null });
  },
}));

export default useDisbursementStore;
