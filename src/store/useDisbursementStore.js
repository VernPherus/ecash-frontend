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
    // 1. Check if Paid/Approved (Backend uses lowercase 'approved' in approveRec, check logic)
    const status = disbursement.status?.toLowerCase();

    if (status === "paid" || status === "approved") {
      return {
        status: "approved",
        label: status === "paid" ? "Paid" : "Approved",
        className: "badge-success text-white border-success bg-success",
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
    method = "", // Added
    fundId = "", // Added
  ) => {
    set({ isLoading: true, error: null });
    try {
      // Build Query Parameters
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (search) params.append("search", search);
      if (status && status !== "ALL") params.append("status", status);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      // New Filters based on backend displayRec
      if (method && method !== "ALL") params.append("method", method);
      if (fundId && fundId !== "ALL") params.append("fundId", fundId);

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
      // MAPPING FIX: The backend 'storeRec' expects 'fundsourceId' (lowercase 's')
      // but 'editRec' expects 'fundSourceId'. We ensure payload matches storeRec here.
      const payload = {
        ...disbursementData,
        fundsourceId:
          disbursementData.fundSourceId || disbursementData.fundsourceId,
      };

      const response = await axiosInstance.post("/disbursement/store", payload);
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

      // RESPONSE FIX: Backend returns the object directly: res.status(200).json(updatedRecord);
      // Previously it was looking for response.data.updatedDisbursement
      const updatedDisbursement = response.data;

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
      // Backend returns: { message: "...", data: result }
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
      // Note: Backend endpoint is typically 'removeRec' but routed via /delete/:id or similar.
      // Assuming route is /disbursement/delete/:id based on previous context
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
