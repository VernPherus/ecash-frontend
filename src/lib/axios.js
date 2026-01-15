import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Required for cookies/JWT
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if using token-based auth
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
        case 401:
          // Unauthorized - clear auth state and redirect to login
          localStorage.removeItem("auth_token");
          // Only redirect if not already on login page
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;
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
