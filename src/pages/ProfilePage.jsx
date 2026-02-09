import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Lock,
  Send,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, requestPasswordResetOtp, confirmPasswordReset, isLoading } =
    useAuthStore();

  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [otpTimer, setOtpTimer] = useState(0); // Timer in seconds
  const [canResend, setCanResend] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: authUser?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!canResend) {
      toast.error("Please wait before requesting a new OTP.");
      return;
    }

    const result = await requestPasswordResetOtp(formData.email);

    if (result.success) {
      setStep(2);
      setOtpTimer(600); // 10 minutes = 600 seconds
      setCanResend(false);
      toast.success("OTP sent to your email!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      toast.error("Please enter the OTP code.");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const result = await confirmPasswordReset({
      email: formData.email,
      otp: formData.otp,
      newPass: formData.newPassword,
      confPass: formData.confirmPassword,
    });

    if (result.success) {
      // Reset form and step
      setFormData({
        email: authUser?.email || "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStep(1);
      setOtpTimer(0);
      setCanResend(true);
      toast.success("Password reset successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* --- Header Section --- */}
        <div className="bg-linear-to-r from-primary/10 to-transparent p-6 rounded-xl border border-primary/20 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {authUser?.firstName?.[0]}
            {authUser?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              {authUser?.firstName} {authUser?.lastName}
            </h1>
            <p className="text-base-content/60 font-mono text-sm">
              @{authUser?.username}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Read-Only Personal Info --- */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm h-full">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Info
              </h2>

              <div className="space-y-4">
                <div className="p-3 bg-base-200/50 rounded-lg">
                  <span className="text-xs text-base-content/50 uppercase font-bold tracking-wider">
                    Full Name
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-base-content">
                    <span className="font-medium">
                      {authUser?.firstName} {authUser?.lastName}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-base-200/50 rounded-lg">
                  <span className="text-xs text-base-content/50 uppercase font-bold tracking-wider">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-base-content">
                    <Mail className="w-4 h-4 opacity-50" />
                    <span className="font-medium truncate">
                      {authUser?.email}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-base-200/50 rounded-lg">
                  <span className="text-xs text-base-content/50 uppercase font-bold tracking-wider">
                    System Role
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-base-content">
                    <Shield className="w-4 h-4 opacity-50" />
                    <span className="badge badge-primary badge-outline font-bold">
                      {authUser?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Password Reset Form --- */}
          <div className="md:col-span-2">
            <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Security Settings
              </h2>

              {step === 1 ? (
                // Step 1: Request OTP
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="alert alert-info bg-base-200 border-none text-base-content/70 text-sm">
                    <KeyRound className="w-4 h-4" />
                    <span>
                      Click below to receive a one-time password reset code via
                      email.
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Your email"
                      className="input input-bordered focus:input-primary transition-all"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary gap-2"
                      disabled={isLoading || !canResend}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {canResend
                        ? "Request OTP"
                        : `Resend in ${formatTimer(otpTimer)}`}
                    </button>
                  </div>
                </form>
              ) : (
                // Step 2: Reset Password with OTP
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="alert alert-success bg-base-200 border-none text-base-content/70 text-sm">
                    <KeyRound className="w-4 h-4" />
                    <span>
                      OTP sent! Check your email and enter the code below.
                      {otpTimer > 0 && (
                        <span className="font-semibold ml-1">
                          (Expires in {formatTimer(otpTimer)})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">OTP Code</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="input input-bordered focus:input-primary transition-all"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          otp: e.target.value,
                        })
                      }
                      maxLength={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          New Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="input input-bordered focus:input-primary transition-all w-full pr-10"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Confirm New Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          className="input input-bordered focus:input-primary transition-all w-full pr-10"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      className="btn btn-ghost gap-2"
                      onClick={handleRequestOtp}
                      disabled={isLoading || !canResend}
                    >
                      {canResend
                        ? "Resend OTP"
                        : `Wait ${formatTimer(otpTimer)}`}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      Reset Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
