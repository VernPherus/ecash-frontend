import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    ArrowLeft,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Shield,
    Check,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const SignUpPage = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const { confirmPassword, ...userData } = formData;
        const result = await signup(userData);

        if (result.success) {
            navigate("/admin/users");
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="flex items-center gap-4 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost btn-sm btn-square"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-primary" />
                            </div>
                            Add New User
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            Create a new user account
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="card-static p-8 space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    First Name
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="John"
                                className={`input input-bordered ${errors.firstName ? "input-error" : ""}`}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.firstName}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Last Name
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Doe"
                                className={`input input-bordered ${errors.lastName ? "input-error" : ""}`}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.lastName}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Username */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Username
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="johndoe"
                            className={`input input-bordered ${errors.username ? "input-error" : ""}`}
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.username}</span>
                            </label>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                Email Address
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john.doe@example.com"
                            className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.email}</span>
                            </label>
                        )}
                    </div>

                    {/* Role */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                Role
                            </span>
                        </label>
                        <select
                            name="role"
                            className="select select-bordered"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="USER">User</option>
                            <option value="STAFF">Staff (Approver)</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                        <label className="label">
                            <span className="label-text-alt text-base-content/50">
                                Admins have full access, Staff can approve disbursements
                            </span>
                        </label>
                    </div>

                    <div className="divider">Security</div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                Password
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Minimum 6 characters"
                                className={`input input-bordered w-full pr-12 ${errors.password ? "input-error" : ""}`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.password}</span>
                            </label>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Confirm Password
                                <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Repeat password"
                            className={`input input-bordered ${errors.confirmPassword ? "input-error" : ""}`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                            </label>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-ghost flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary flex-1 gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
