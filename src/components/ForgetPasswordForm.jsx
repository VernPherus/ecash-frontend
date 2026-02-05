import React, { useState } from "react";
import { Mail, Lock, Key, ArrowLeft } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const ForgetPasswordForm = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { requestPasswordResetOtp, confirmPasswordReset, isLoading } =
    useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const result = await requestPasswordResetOtp(formData.email);
    if (result.success) setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      // You can use a toast here if available, or simple alert
      return alert("Passwords do not match");
    }

    const result = await confirmPasswordReset({
      email: formData.email,
      otp: formData.otp,
      newPass: formData.newPassword,
      confPass: formData.confirmPassword,
    });

    if (result.success) {
      onBackToLogin();
    }
  };

  return (
    <div className="card-static p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          {step === 1 ? "Reset Password" : "Verify OTP"}
        </h2>
        <p className="text-base-content/60">
          {step === 1
            ? "Enter your email to receive a password reset code"
            : `We sent a code to ${formData.email}`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full h-12"
          >
            {isLoading ? (
              <span className="loading loading-spinner" />
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">OTP Code</span>
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit code"
                className="input input-bordered w-full pl-12 h-12"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">New Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                className="input input-bordered w-full pl-12 h-12"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Confirm New Password
              </span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="input input-bordered w-full pl-12 h-12"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full h-12"
          >
            {isLoading ? (
              <span className="loading loading-spinner" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-base-300 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-primary hover:text-primary-focus font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
