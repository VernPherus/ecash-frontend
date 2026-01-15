import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Store
import useAuthStore from "./store/useAuthStore";
import useThemeStore from "./store/useThemeStore";

// Layout Components
import Sidebar from "./components/Sidebar";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FundManagerPage from "./pages/FundManagerPage";
import PayeeManagerPage from "./pages/PayeeManagerPage";
import DisbursementViewPage from "./pages/DisbursementViewPage";
import DisbursementFormPage from "./pages/DisbursementFormPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Admin Pages
import UserManagerPage from "./pages/admin/UserManagerPage";
import LogsPage from "./pages/admin/LogsPage";
import SignUpPage from "./pages/admin/SignUpPage";

// Loading Spinner Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-200">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-base-content/60 font-medium">Loading FundWatch...</p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Auth Route (redirect if already logged in)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main Layout with Sidebar
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

// App Component
const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
    checkAuth();
  }, [checkAuth, initializeTheme]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-medium)",
            padding: "16px",
            border: "1px solid var(--color-base-300)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* Management */}
          <Route path="/funds" element={<FundManagerPage />} />
          <Route path="/payees" element={<PayeeManagerPage />} />
          <Route path="/disbursement/new" element={<DisbursementFormPage />} />
          <Route path="/disbursement/edit/:id" element={<DisbursementFormPage />} />
          <Route path="/disbursement/:id" element={<DisbursementViewPage />} />

          {/* User */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/users" element={<UserManagerPage />} />
          <Route path="/admin/logs" element={<LogsPage />} />
          <Route path="/admin/signup" element={<SignUpPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
