import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Store
import useAuthStore from "./store/useAuthStore";
import useThemeStore from "./store/useThemeStore";

// Layout Components
import Sidebar from "./components/Sidebar";
import LoadingScreen from "./components/LoadingScreen";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FundManagerPage from "./pages/FundManagerPage";
import PayeeManagerPage from "./pages/PayeeManagerPage";
import DisbursementViewPage from "./pages/DisbursementViewPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Admin Pages
import UserManagerPage from "./pages/admin/UserManagerPage";
import LogsPage from "./pages/admin/LogsPage";
import SignUpPage from "./pages/admin/SignUpPage";

import DisbursementPage from "./pages/DisbursementPage";
import Check from "./components/disbursement_components/Check";
import Lddap from "./components/disbursement_components/LDDAP";
import FundViewPage from "./pages/FundViewPage";
import PayeeViewPage from "./pages/PayeeViewPage";

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
    <div>
      <Toaster position="top-center" />
      <BrowserRouter>
        {/* Toast Notifications */}

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
            <Route path="/funds/:id" element={<FundViewPage />} />
            <Route path="/payees" element={<PayeeManagerPage />} />
            <Route path="/payees/:id" element={<PayeeViewPage />} />
            <Route path="/disbursement/new" element={<DisbursementPage />} />
            <Route
              path="/disbursement/edit/:id"
              element={<DisbursementPage />}
            />
            <Route
              path="/disbursement/:id"
              element={<DisbursementViewPage />}
            />

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

        {/* Sidebar - THIS ALWAYS STAYS */}
        <aside className="w-64 bg-slate-900">
          {/* Your sidebar content */}
        </aside>

        {/* Main Content - ONLY THIS CHANGES */}
        <Routes>
          <Route path="/disbursement/check" element={<Check />} />
          <Route path="/disbursement/lddap" element={<Lddap />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
