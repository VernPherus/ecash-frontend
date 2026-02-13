import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Check,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import FloatingNotification from "../../components/FloatingNotification";

// 1. Defined outside the main component
const InputField = ({
  label,
  name,
  type = "text",
  icon: Icon,
  placeholder,
  error,
  value,
  onChange,
}) => (
  <div className="form-control w-full">
    <label className="label pb-1">
      <span className="label-text font-medium">
        {label} <span className="text-error">*</span>
      </span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-base-content/40" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`input input-bordered w-full pl-10 ${error ? "input-error" : ""}`}
        value={value}
        onChange={onChange}
      />
    </div>
    {error && (
      <label className="label py-1">
        <span className="label-text-alt text-error flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      </label>
    )}
  </div>
);

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
    userRole: "USER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.username.trim()) newErrors.username = "Username required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password required";
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Min 6 characters";
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
    if (result.success) navigate("/admin/users");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <FloatingNotification />

      <div className="card bg-base-100 shadow-xl w-full max-w-4xl">
        <div className="card-body p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 border-b border-base-200 pb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create User</h2>
              <p className="text-base-content/60 text-sm">
                Add a new account to the system
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN: Identity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-base-content/50 mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Passed value and onChange explicitly */}
                  <InputField
                    label="First Name"
                    name="firstName"
                    icon={User}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    icon={User}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>

                <InputField
                  label="Username"
                  name="username"
                  icon={User}
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              {/* RIGHT COLUMN: Security & Role */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-base-content/50 mb-4">
                  Access & Security
                </h3>

                {/* Role Select */}
                <div className="form-control w-full">
                  <label className="label pb-1">
                    <span className="label-text font-medium">Role</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-base-content/40" />
                    </div>
                    <select
                    type="text"
                      name="userRole"
                      className="select select-bordered w-full pl-10"
                      value={formData.userRole}
                      onChange={handleChange}
                    >
                      <option value="USER">User</option>
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  <label className="label py-1">
                    <span className="label-text-alt text-base-content/50">
                      Determines system permission levels
                    </span>
                  </label>
                </div>

                {/* Password Field */}
                <div className="form-control w-full">
                  <label className="label pb-1">
                    <span className="label-text font-medium">
                      Password <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Minimum 6 characters"
                      className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <label className="label py-1">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.password}
                      </span>
                    </label>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-control w-full">
                  <label className="label pb-1">
                    <span className="label-text font-medium">
                      Confirm Password <span className="text-error">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat password"
                      className={`input input-bordered w-full pl-10 ${errors.confirmPassword ? "input-error" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <label className="label py-1">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.confirmPassword}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-action mt-8 pt-4 border-t border-base-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary min-w-[150px]"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
