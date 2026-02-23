import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle specific error codes
    if (response) {
      switch (response.status) {
        case 401: {
          // Skip redirect for /auth/check – handled by checkAuth (avoids reload loop)
          const url = error.config?.url ?? "";
          const isAuthCheck = String(url).includes("/auth/check");
          if (!isAuthCheck && !window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;
        }
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access denied: Insufficient permissions");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error occurred");
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error: Please check your connection");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
