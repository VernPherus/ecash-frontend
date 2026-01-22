import React, { useEffect, useState } from "react";
import {
    Shield,
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    User,
    Check,
    X,
    UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

const UserManagerPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("all");

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

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

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

    const handleGrantAdmin = async (userId) => {
        try {
            await axiosInstance.put("/auth/grantAdmin", { userId });
            toast.success("User role updated");
            fetchUsers();
        } catch (_error) {
            toast.error("Failed to update user role");
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="bg-base-100 border-b border-base-300 px-8 py-5 sticky top-0 z-10 shadow-soft">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-purple-500" />
                            </div>
                            User Management
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            Manage system users and permissions
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/signup")}
                        className="btn btn-primary gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-base-content">{users.length}</p>
                        <p className="text-sm text-base-content/60">Total Users</p>
                    </div>
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {users.filter((u) => u.role === "ADMIN").length}
                        </p>
                        <p className="text-sm text-base-content/60">Admins</p>
                    </div>
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {users.filter((u) => u.role === "STAFF").length}
                        </p>
                        <p className="text-sm text-base-content/60">Staff</p>
                    </div>
                    <div className="card-static p-4 text-center">
                        <p className="text-2xl font-bold text-gray-600">
                            {users.filter((u) => u.role === "USER" || !u.role).length}
                        </p>
                        <p className="text-sm text-base-content/60">Users</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-static p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="input input-bordered w-full pl-11 bg-base-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="select select-bordered bg-base-200"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="STAFF">Staff</option>
                                <option value="USER">User</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="card-static overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="mt-4 text-base-content/60">Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <User className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                            <h3 className="text-lg font-semibold text-base-content/60 mb-2">No Users Found</h3>
                            <p className="text-sm text-base-content/40">
                                {searchQuery ? "Try adjusting your search" : "No users in the system"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th className="text-center">Role</th>
                                        <th className="text-center">Joined</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-bold">
                                                        {user.firstName?.[0] || "U"}
                                                        {user.lastName?.[0] || ""}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-base-content/70">{user.email}</td>
                                            <td className="text-base-content/60">@{user.username || "—"}</td>
                                            <td className="text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                    {user.role || "USER"}
                                                </span>
                                            </td>
                                            <td className="text-center text-base-content/60">
                                                {new Date(user.createdAt).toLocaleDateString("en-PH", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="text-center">
                                                <div className="dropdown dropdown-end">
                                                    <label tabIndex={0} className="btn btn-ghost btn-sm btn-square">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </label>
                                                    <ul
                                                        tabIndex={0}
                                                        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-48 border border-base-300"
                                                    >
                                                        <li>
                                                            <button>
                                                                <Edit2 className="w-4 h-4" /> Edit User
                                                            </button>
                                                        </li>
                                                        {user.role !== "ADMIN" && (
                                                            <li>
                                                                <button onClick={() => handleGrantAdmin(user.id)}>
                                                                    <Shield className="w-4 h-4" /> Grant Admin
                                                                </button>
                                                            </li>
                                                        )}
                                                        <li>
                                                            <button className="text-error">
                                                                <Trash2 className="w-4 h-4" /> Deactivate
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagerPage;
