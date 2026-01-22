import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useReportStore = create((set) => ({
  isLoading: false,
  error: null,

  /**
   * Downloads the SPV Excel report for a specific fund and date
   * @param {string|number} year - e.g., 2025
   * @param {string|number} month - e.g., 9 (September)
   * @param {number} fundId - The ID of the fund source
   * @param {string} fundCode - Used for the filename (e.g., "GF-101")
   */
  downloadSPV: async (year, month, fundId, fundCode) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get(`/reports/spv`, {
        params: { year, month, fundId },
        responseType: "blob", // IMPORTANT: Forces response to be treated as a binary file
        withCredentials: true, // If you need cookies for auth
      });

      // --- Create a virtual link to trigger the browser download ---

      // 1. Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 2. Create a hidden <a> tag
      const link = document.createElement("a");
      link.href = url;

      // 3. Set the filename (e.g., "SPV-2025-09-GF-101.xlsx")
      const fileName = `SPV-${year}-${month
        .toString()
        .padStart(2, "0")}-${fundCode}.xlsx`;
      link.setAttribute("download", fileName);

      // 4. Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5. Cleanup the URL object to free memory
      window.URL.revokeObjectURL(url);

      set({ isLoading: false });
      return true; // Indicate success
    } catch (error) {
      console.error("Download failed:", error);

      // Helper to read the error message from a Blob response (tricky part of axios blobs)
      let errorMessage = "Failed to download report.";
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch (error) {
          toast.error(error.message)
        }
      }

      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));