import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useReportStore = create((set, get) => ({
  isLoading: false,
  error: null,

  /**
   * Internal Helper: Handles file download logic for Blob responses.
   * Parses errors if the blob is actually a JSON error message.
   */
  _handleDownload: async (url, params, fallbackFilename) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(url, {
        params,
        responseType: "blob", // Important: Treat response as binary
        withCredentials: true,
      });

      // Check if the response is actually an error (some backends return JSON errors as blobs)
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        // This is actually an error response disguised as a blob
        const text = await response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.message || "Failed to download report.");
      }

      // Extract filename from Content-Disposition header if present
      let fileName = fallbackFilename;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          disposition,
        );
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      }

      // Create download link
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      set({ isLoading: false });
      toast.success("Report downloaded successfully!");
      return { success: true };
    } catch (error) {
      console.error(`Download failed for ${url}:`, error);

      // Handle Blob Errors (Axios returns Blob even for 400/500 errors when responseType is 'blob')
      let errorMessage = "Failed to download report.";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch (e) {
          errorMessage = "Failed to download report. Please try again.";
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Download Debit Report (ADA)
   * GET /api/reports/debit
   */
  downloadDebitReport: async (year, month, fundId, fundCode) => {
    // Validate required parameters
    if (!year || !month || !fundId) {
      const errorMessage = "Missing required parameters for debit report.";
      toast.error(errorMessage);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }

    const fallbackName = `DebitReport-${fundCode || "Unknown"}-${year}-${String(month).padStart(2, "0")}.xlsx`;
    return get()._handleDownload(
      "/reports/debit",
      { year, month, fundId },
      fallbackName,
    );
  },

  /**
   * Download Check Report (RCI)
   * GET /api/reports/check
   */
  downloadCheckReport: async (year, month, fundId, fundCode) => {
    // Validate required parameters
    if (!year || !month || !fundId) {
      const errorMessage = "Missing required parameters for check report.";
      toast.error(errorMessage);
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }

    const fallbackName = `CheckReport-${fundCode || "Unknown"}-${year}-${String(month).padStart(2, "0")}.xlsx`;
    return get()._handleDownload(
      "/reports/check",
      { year, month, fundId },
      fallbackName,
    );
  },

  clearError: () => set({ error: null }),
}));

export default useReportStore;
