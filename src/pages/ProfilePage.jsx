import React, { useState } from "react";
import {
    User,
    Mail,
    Shield,
    Save,
    Key,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/useAuthStore";

const ProfilePage = () => {
    const { authUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: authUser?.firstName || "",
        lastName: authUser?.lastName || "",
        email: authUser?.email || "",
        username: authUser?.username || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        // TODO: Implement profile update API
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        // TODO: Implement password change API
        toast.success("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordSection(false);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "ADMIN":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "STAFF":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        My Profile
                    </h1>
                    <p className="text-sm text-base-content/60 mt-1">
                        Manage your account information
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                {/* Profile Card */}
                <div className="card-static p-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-primary to-emerald-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                    {authUser?.firstName?.[0] || "U"}
                                    {authUser?.lastName?.[0] || ""}
                                </div>
                            </div>
                            <span className={`mt-4 inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(authUser?.role)}`}>
                                {authUser?.role || "USER"}
                            </span>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 w-full">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">First Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className="input input-bordered"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Last Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="input input-bordered"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Username</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="input input-bordered"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Email Address</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="input input-bordered"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-base-content/50">Email cannot be changed</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveProfile} className="btn btn-primary gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">
                                            {authUser?.firstName} {authUser?.lastName}
                                        </h2>
                                        <p className="text-base-content/60">@{authUser?.username || "username"}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-base-content/70">
                                            <Mail className="w-5 h-5 text-base-content/40" />
                                            <span>{authUser?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-base-content/70">
                                            <Shield className="w-5 h-5 text-base-content/40" />
                                            <span>Role: {authUser?.role || "User"}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => setIsEditing(true)} className="btn btn-primary gap-2">
                                        <User className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="card-static p-8">
                    <h3 className="text-lg font-bold text-base-content mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        Security
                    </h3>

                    {showPasswordSection ? (
                        <div className="space-y-4 max-w-md">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Current Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        className="input input-bordered w-full pr-12"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">New Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        className="input input-bordered w-full pr-12"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Confirm New Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input input-bordered w-full"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowPasswordSection(false)} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button onClick={handleChangePassword} className="btn btn-primary gap-2">
                                    <Check className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-base-content/60">Last changed 30 days ago</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordSection(true)}
                                className="btn btn-ghost btn-sm"
                            >
                                Change Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
