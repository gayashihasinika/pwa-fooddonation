// src/pages/Admin/Users/UserList.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  AlertCircle,
  Ban,
  Edit3,
  Users,
  Package,
  Truck,
  Heart,
  UserPlus,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { User } from "@/types/index";
import api from "@/lib/api";
import userListImg1 from '@/assets/images/user1.jpg';
import userListImg2 from '@/assets/images/user2.jpg';
import userListImg3 from '@/assets/images/user3.jpg';

const fetchUsers = async ({ search = "", role = "" }) => {
  const { data } = await api.get("/admin/users", {
    params: { search: search || undefined, role: role || undefined },
  });
  return data;
};

export default function UserList() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Images — Responsive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 rounded-3xl overflow-hidden shadow-3xl mb-12 sm:mb-16 border-8 border-white"
          >
            <img
              src={userListImg1}
              alt="Volunteers distributing food packages with gratitude"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src={userListImg2}
              alt="Community receiving food donations with warm smiles"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src={userListImg3}
              alt="Beautiful traditional Sri Lankan rice and curry spread"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          {/* Header with Add New User Button */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 sm:mb-16">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-4">
                Our Growing Community of Kindness ❤️
              </h1>
              <p className="text-xl sm:text-2xl text-orange-700 px-4 lg:px-0">
                Donors, NGOs, volunteers — all working together to feed Sri Lanka
              </p>
            </div>

            {/* Add New User Button */}
            <Link
              to="/admin/users/create"
              className="w-full lg:w-auto bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-8 py-5 rounded-3xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4"
            >
              <UserPlus className="w-8 h-8" />
              Add New User
            </Link>
          </div>

          {/* Stats Cards — Fully Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {[
              { label: "Total Users", value: stats.total, color: "border-gray-300", icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" /> },
              { label: "Donors", value: stats.donors, color: "border-green-300", icon: <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" /> },
              { label: "Receivers", value: stats.receivers, color: "border-blue-300", icon: <Package className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" /> },
              { label: "Volunteers", value: stats.volunteers, color: "border-orange-300", icon: <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" /> },
              { label: "Verified NGOs", value: stats.verifiedNGOs, color: "border-emerald-300", icon: <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" /> },
              { label: "Pending Verification", value: stats.pendingNGOs, color: "border-amber-300", icon: <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" /> },
              { label: "Suspended", value: stats.suspended, color: "border-red-300", icon: <Ban className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" /> },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-8 ${stat.color}`}
              >
                {stat.icon}
                <p className="text-base sm:text-xl text-gray-700 mt-4 mb-2">{stat.label}</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-orange-800">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter — Responsive */}
          <motion.div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-4 sm:p-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-6 py-4 sm:py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base sm:text-lg"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full lg:w-64 px-6 sm:px-8 py-4 sm:py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 text-base sm:text-lg"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="donor">Donor</option>
                <option value="receiver">NGO / Receiver</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </motion.div>

          {/* Users List */}
          {isLoading ? (
            <div className="text-center py-20 text-gray-600 text-xl sm:text-2xl">Loading community members...</div>
          ) : users.length === 0 ? (
            <motion.div className="text-center py-20 bg-white/90 backdrop-blur rounded-3xl shadow-2xl">
              <Users className="w-24 h-24 sm:w-32 sm:h-32 text-orange-300 mx-auto mb-8" />
              <p className="text-3xl sm:text-4xl font-bold text-orange-800 mb-6">No Users Found</p>
              <p className="text-xl sm:text-2xl text-gray-700 px-4">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table — Safe, No Overflow */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-2xl">
                <div className="overflow-x-auto"> {/* Only needed for very wide screens */}
                  <table className="w-full min-w-[900px]"> {/* Prevents squishing */}
                    <thead className="bg-gradient-to-r from-orange-100 to-amber-100">
                      <tr>
                        <th className="px-6 py-5 text-left text-base font-bold text-orange-800">User</th>
                        <th className="px-6 py-5 text-left text-base font-bold text-orange-800">Role</th>
                        <th className="px-6 py-5 text-left text-base font-bold text-orange-800">Organization</th>
                        <th className="px-6 py-5 text-left text-base font-bold text-orange-800">Status</th>
                        <th className="px-6 py-5 text-right text-base font-bold text-orange-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-orange-50 transition">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center text-2xl font-bold text-orange-800">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-lg">{user.name}</p>
                                <p className="text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-6 py-3 rounded-full text-base font-bold ${user.role === "admin" ? "bg-purple-100 text-purple-800" :
                              user.role === "donor" ? "bg-green-100 text-green-800" :
                                user.role === "receiver" ? "bg-blue-100 text-blue-800" :
                                  "bg-orange-100 text-orange-800"
                              }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-base">{user.organization || "—"}</td>
                          <td className="px-6 py-5">
                            {user.is_suspended ? (
                              <span className="flex items-center gap-2 text-red-600 font-bold">
                                <Ban className="w-5 h-5" /> Suspended
                              </span>
                            ) : (
                              <span className="text-green-600 font-bold">Active</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Link
                              to={`/admin/users/${user.id}/edit`}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition"
                            >
                              <Edit3 className="w-5 h-5" />
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile & Tablet Cards */}
              <div className="lg:hidden space-y-6 sm:space-y-8">
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-8 border-orange-100"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center text-3xl font-bold text-orange-800">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-orange-800">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 py-4 rounded-2xl font-bold shadow-xl"
                      >
                        Manage
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-lg">
                      <div>
                        <p className="text-gray-600">Role</p>
                        <p className={`mt-2 px-4 py-2 rounded-full font-bold inline-block text-base ${user.role === "admin" ? "bg-purple-100 text-purple-800" :
                          user.role === "donor" ? "bg-green-100 text-green-800" :
                            user.role === "receiver" ? "bg-blue-100 text-blue-800" :
                              "bg-orange-100 text-orange-800"
                          }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className={`mt-2 font-bold ${user.is_suspended ? "text-red-600" : "text-green-600"}`}>
                          {user.is_suspended ? "Suspended" : "Active"}
                        </p>
                      </div>
                    </div>

                    {user.organization && (
                      <div className="mt-6">
                        <p className="text-gray-600">Organization</p>
                        <p className="text-xl font-bold text-orange-800">{user.organization}</p>
                      </div>
                    )}

                    {user.role === "receiver" && (
                      <div className="mt-6 flex items-center gap-3">
                        {user.is_verified ? (
                          <>
                            <ShieldCheck className="w-10 h-10 text-emerald-600" />
                            <p className="text-2xl font-bold text-emerald-800">Verified NGO</p>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-10 h-10 text-amber-600" />
                            <p className="text-2xl font-bold text-amber-800">Pending Verification</p>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}