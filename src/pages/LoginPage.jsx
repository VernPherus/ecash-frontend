import React, { useState } from "react";
import { Eye, EyeOff, TrendingUp, ArrowRight, Lock, Mail } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
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
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 gradient-mesh opacity-60" />

                {/* Floating Shapes */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">FundWatch</h1>
                            <p className="text-slate-400 text-sm">Financial Tracking System</p>
                        </div>
                    </div>

                    {/* Tagline */}
                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        Always know where
                        <br />
                        <span className="text-primary">the money goes.</span>
                    </h2>

                    <p className="text-slate-400 text-lg max-w-md mb-12">
                        Track fund disbursements, manage payees, and monitor liquidity with precision and ease.
                    </p>

                    {/* Feature List */}
                    <div className="space-y-4">
                        {[
                            "Real-time fund liquidity monitoring",
                            "Automated disbursement tracking",
                            "Comprehensive audit logging",
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 text-slate-300"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="rgba(255,255,255,0.02)"
                        />
                    </svg>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-base-200">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">FundWatch</span>
                    </div>

                    {/* Form Card */}
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
                                <a
                                    href="#"
                                    className="text-sm text-primary hover:text-primary-focus font-medium"
                                >
                                    Forgot password?
                                </a>
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
