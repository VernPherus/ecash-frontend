import React, { useState } from "react";
import { Eye, EyeOff, TrendingUp, ArrowRight, Lock, Mail } from "lucide-react";
import LoginLeftPanel from "../components/LoginLeftPanel";
import ForgetPasswordForm from "../components/ForgetPasswordForm";
import useAuthStore from "../store/useAuthStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false); // State to toggle forms

  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex">
      <LoginLeftPanel />
      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-base-200">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">eCash</span>
          </div>

          {/* Conditional Rendering: Forgot Password Form or Login Form */}
          {isForgotMode ? (
            <ForgetPasswordForm onBackToLogin={() => setIsForgotMode(false)} />
          ) : (
            <div className="card-static p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  Welcome back
                </h2>
                <p className="text-base-content/60">
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full pl-12 h-12"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full pl-12 pr-12 h-12"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <span className="label-text">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-sm text-primary hover:text-primary-focus font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full h-12 text-base font-semibold gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-base-300 text-center">
                <p className="text-sm text-base-content/60">
                  Don't have access?{" "}
                  <span className="text-base-content font-medium">
                    Contact your administrator
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Copyright */}
          <p className="text-center text-xs text-base-content/40 mt-8">
            © {new Date().getFullYear()} FundWatch. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
