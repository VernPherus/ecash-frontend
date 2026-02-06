import { useEffect, useState, useMemo } from "react";
import {
  Shield,
  Search,
  Edit2,
  Trash2,
  User,
  Mail,
  Calendar,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

import FloatingNotification from "../../components/FloatingNotification";
import DataTable from "../../components/DataTable";
import useAuthStore from "../../store/useAuthStore";

const UserManagerPage = () => {
  const navigate = useNavigate();
  const { deactivateUser } = useAuthStore();

  // Data State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/auth/showUsers");
      setUsers(response.data.allUsers || []);
    } catch (_error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---

  const handleGrantAdmin = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to grant Admin privileges to this user?",
      )
    )
      return;

    try {
      await axiosInstance.put("/auth/grantAdmin/" + userId);
      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  // Correction: The original file had a different call signature.
  // Based on your backend files provided: router.put("/grantAdmin/:id", ...)
  // I will use: axiosInstance.put(`/auth/grantAdmin/${userId}`)

  const handleDeactivate = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this user? They will no longer be able to log in.",
      )
    )
      return;

    const result = await deactivateUser(userId);
    if (result.success) {
      fetchUsers();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRole("ALL");
    setCurrentPage(1);
  };

  // --- Filtering & Pagination Logic ---

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = filterRole === "ALL" || user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // --- Table Configuration ---

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

  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-bold shadow-sm">
              {row.firstName?.[0] || "U"}
              {row.lastName?.[0] || ""}
            </div>
            <div>
              <p className="font-semibold text-base-content">
                {row.firstName} {row.lastName}
              </p>
              <p className="text-xs text-base-content/50 font-mono">
                @{row.username || "unknown"}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "email",
        header: "Email",
        render: (row) => (
          <div className="flex items-center gap-2 text-base-content/70">
            <Mail className="w-4 h-4 opacity-50" />
            <span>{row.email}</span>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        headerAlign: "text-center",
        align: "text-center",
        render: (row) => (
          <div className="flex justify-center">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getRoleColor(row.role)}`}
            >
              {row.role || "USER"}
            </span>
          </div>
        ),
      },
      {
        key: "joined",
        header: "Joined",
        headerAlign: "text-center",
        align: "text-center",
        render: (row) => (
          <div className="flex items-center justify-center gap-2 text-base-content/60 text-sm">
            <Calendar className="w-4 h-4 opacity-50" />
            {new Date(row.createdAt).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        headerAlign: "text-center",
        align: "text-center",
        render: (row) => (
          <div className="flex items-center justify-center gap-1">
            <button
              className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-primary tooltip tooltip-top"
              data-tip="Edit User"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {row.role !== "ADMIN" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGrantAdmin(row.id);
                }}
                className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-blue-600 tooltip tooltip-top"
                data-tip="Grant Admin"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeactivate(row.id);
              }}
              className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-error tooltip tooltip-top"
              data-tip="Deactivate"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const filterOptions = [
    { value: "ALL", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "STAFF", label: "Staff" },
    { value: "USER", label: "User" },
  ];

  return (
    <div className="min-h-screen bg-base-200/50 pb-20 font-sans">
      <FloatingNotification />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* --- Toolbar --- */}
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email..."
              className="input input-bordered w-full pl-10 h-10 text-sm bg-base-200/50 focus:bg-base-100 transition-colors"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
            />
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterRole !== "ALL") && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost btn-sm gap-2 text-base-content/50 hover:text-error"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* --- Data Table --- */}
        <DataTable
          data={paginatedUsers}
          isLoading={isLoading}
          columns={columns}
          pagination={{
            currentPage,
            totalPages,
          }}
          onPageChange={setCurrentPage}
          filters={filterOptions}
          activeFilter={filterRole}
          onFilterChange={(role) => {
            setFilterRole(role);
            setCurrentPage(1);
          }}
          emptyState={{
            icon: User,
            title: "No users found",
            description: searchQuery
              ? "Try adjusting your search query."
              : "No users exist in the system.",
          }}
        />
      </main>
    </div>
  );
};

export default UserManagerPage;
