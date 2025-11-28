// src/pages/Admin/Users/UserList.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Ban,
  Edit3,
  Users,
  Filter,
  ChevronDown,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { User } from "@/types/index";
import api from "@/lib/api";

const fetchUsers = async ({ search = "", role = "" }) => {
  const { data } = await api.get("/admin/users", {
    params: { search: search || undefined, role: role || undefined },
  });
  return data;
};

export default function UserList() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, roleFilter],
    queryFn: () => fetchUsers({ search, role: roleFilter }),
  });

  const users: User[] = data?.data || [];

  const stats = {
    total: users.length,
    donors: users.filter((u) => u.role === "donor").length,
    receivers: users.filter((u) => u.role === "receiver").length,
    volunteers: users.filter((u) => u.role === "volunteer").length,
    verifiedNGOs: users.filter((u) => u.role === "receiver" && u.is_verified).length,
    pendingNGOs: users.filter((u) => u.role === "receiver" && !u.is_verified).length,
    suspended: users.filter((u) => u.is_suspended).length,
  };

  return (
    <AuthenticatedLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Users className="text-rose-500" />
              User Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Manage donors, NGOs, volunteers & admins
            </p>
          </div>

          <Link
            to="/admin/users/create"
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:shadow-xl text-sm md:text-base"
          >
            <UserPlus size={20} />
            Add User
          </Link>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
          {[
            { label: "Total", value: stats.total, color: "text-gray-800" },
            { label: "Donors", value: stats.donors, color: "text-green-600" },
            { label: "NGOs", value: stats.receivers, color: "text-blue-600" },
            { label: "Volunteers", value: stats.volunteers, color: "text-orange-600" },
            { label: "Verified", value: stats.verifiedNGOs, color: "text-emerald-600", icon: <ShieldCheck size={14} /> },
            { label: "Pending", value: stats.pendingNGOs, color: "text-amber-600", icon: <AlertCircle size={14} /> },
            { label: "Suspended", value: stats.suspended, color: "text-red-600", icon: <Ban size={14} /> },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                {stat.icon} {stat.label}
              </p>
              <p className={`text-2xl md:text-3xl font-bold mt-2 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Filter - Mobile Dropdown */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl bg-white"
              >
                <span className="flex items-center gap-2">
                  <Filter size={18} />
                  {roleFilter ? roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1) : "All Roles"}
                </span>
                <ChevronDown size={18} className={`transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileFilterOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                  {["", "admin", "donor", "receiver", "volunteer"].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setMobileFilterOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      {role ? role.charAt(0).toUpperCase() + role.slice(1) : "All Roles"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="hidden lg:block px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 min-w-[180px]"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="donor">Donor</option>
              <option value="receiver">Receiver (NGO)</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
        </div>

        {/* Users List - Card on Mobile, Table on Desktop */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users found</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Org</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Verification</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin" ? "bg-purple-100 text-purple-800" :
                              user.role === "donor" ? "bg-green-100 text-green-800" :
                              user.role === "receiver" ? "bg-blue-100 text-blue-800" :
                              "bg-orange-100 text-orange-800"
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{user.organization || "—"}</td>
                          <td className="px-6 py-4">
                            {user.is_suspended ? (
                              <span className="text-red-600 text-xs font-semibold flex items-center gap-1">
                                <Ban size={14} /> Suspended
                              </span>
                            ) : (
                              <span className="text-green-600 text-xs font-semibold">Active</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {user.role === "receiver" && (
                              user.is_verified ? (
                                <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                                  <ShieldCheck size={14} /> Verified
                                </span>
                              ) : (
                                <span className="text-amber-600 text-xs font-semibold flex items-center gap-1">
                                  <AlertCircle size={14} /> Pending
                                </span>
                              )
                            )}
                            {user.role !== "receiver" && "—"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/admin/users/${user.id}/edit`}
                              className="text-rose-600 hover:text-rose-700 font-medium flex items-center justify-end gap-1"
                            >
                              <Edit3 size={16} /> Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-white rounded-2xl shadow-md p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-500 mt-1">{user.phone}</p>}
                      </div>
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="text-rose-600 font-medium text-sm"
                      >
                        Manage →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Role:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" :
                          user.role === "donor" ? "bg-green-100 text-green-800" :
                          user.role === "receiver" ? "bg-blue-100 text-blue-800" :
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 ${user.is_suspended ? "text-red-600" : "text-green-600"} font-medium`}>
                          {user.is_suspended ? "Suspended" : "Active"}
                        </span>
                      </div>
                    </div>

                    {user.organization && (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-500">Org:</span>
                        <span className="ml-2 font-medium">{user.organization}</span>
                      </div>
                    )}

                    {user.role === "receiver" && (
                      <div className="mt-3 flex items-center gap-2">
                        {user.is_verified ? (
                          <>
                            <ShieldCheck size={18} className="text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Verified NGO</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={18} className="text-amber-600" />
                            <span className="text-amber-600 font-medium">Pending Verification</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}