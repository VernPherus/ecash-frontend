import { useState } from "react";
import { User, Mail, Shield, Lock, Save, KeyRound } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateUser, isLoading } = useAuthStore();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    // Call the store action to update only the password
    const result = await updateUser(authUser.id, {
      password: passwords.newPassword,
    });

    if (result.success) {
      setPasswords({ newPassword: "", confirmPassword: "" });
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

          {/* --- Password Update Form --- */}
          <div className="md:col-span-2">
            <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Security Settings
              </h2>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="alert alert-info bg-base-200 border-none text-base-content/70 text-sm">
                  <KeyRound className="w-4 h-4" />
                  <span>Update your password to keep your account secure.</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        New Password
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="input input-bordered focus:input-primary transition-all"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Confirm New Password
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      className="input input-bordered focus:input-primary transition-all"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
