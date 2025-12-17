// src/pages/Admin/Donations/DonationList.tsx — PERFECT TABLE, MANAGE BUTTON FIXED
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  Eye,
  Search,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Donation {
  id: number;
  user_id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  expiry_date: string;
  status: "pending" | "approved" | "completed" | "rejected";
  created_at: string;
  user: { name: string; email: string };
  images: { image_path: string }[];
}

export default function DonationList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  const { data: donations } = useQuery<Donation[]>({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data } = await api.get("/admin/donations");
      return data.donations || data;
    },
  });

  const filteredDonations = useMemo(() => {
    if (!donations) return [];

    return donations.filter((donation) => {
      const matchesSearch =
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.pickup_address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || donation.status === statusFilter;

      const isExpired = new Date(donation.expiry_date) < new Date();
      const matchesExpiry = !showExpiredOnly || isExpired;

      return matchesSearch && matchesStatus && matchesExpiry;
    });
  }, [donations, searchTerm, statusFilter, showExpiredOnly]);

  const isExpired = (date: string) => new Date(date) < new Date();

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      approved: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 rounded-3xl overflow-hidden shadow-3xl mb-12 sm:mb-16 border-8 border-white"
          >
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4753-scaled.jpg"
              alt="Volunteers sharing food with love"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4742-scaled.jpg"
              alt="Grateful families receiving donations"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="Beautiful rice and curry ready to be shared"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Managing Food Shared with Love ❤️
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Review and approve donations to reach families in need ({filteredDonations.length} donations)
            </p>
          </div>

          {/* Filters */}
          <motion.div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search title, donor, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-8 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 text-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="completed">Delivered</option>
                <option value="rejected">Rejected</option>
              </select>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showExpiredOnly}
                  onChange={(e) => setShowExpiredOnly(e.target.checked)}
                  className="w-8 h-8 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-lg font-medium text-gray-700 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  Show Expired Only
                </span>
              </label>
            </div>
          </motion.div>

          {/* Desktop Table — CLEAN & PERFECT */}
          <div className="hidden lg:block bg-white rounded-3xl shadow-2xl">
            <div className="overflow-hidden">
              <table className="w-full table-fixed">
                <thead className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <tr>
                    <th className="w-[28%] px-6 py-5 text-left text-base font-bold text-orange-800">Donation</th>
                    <th className="w-[18%] px-6 py-5 text-left text-base font-bold text-orange-800">Donor</th>
                    <th className="w-[22%] px-6 py-5 text-left text-base font-bold text-orange-800">Pickup Location</th>
                    <th className="w-[12%] px-6 py-5 text-left text-base font-bold text-orange-800">Expiry Date</th>
                    <th className="w-[12%] px-6 py-5 text-left text-base font-bold text-orange-800">Status</th>
                    <th className="w-[18%] px-6 py-5 text-right text-base font-bold text-orange-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-24 text-gray-500 text-2xl">
                        No donations found
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((donation) => (
                      <tr key={donation.id} className={`hover:bg-orange-50 transition ${isExpired(donation.expiry_date) ? "bg-red-50" : ""}`}>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-5">
                            {donation.images.length > 0 ? (
                              <img
                                src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                                alt={donation.title}
                                className="w-20 h-20 object-cover rounded-2xl shadow-md flex-shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Package className="w-10 h-10 text-orange-600" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xl text-orange-900 truncate">{donation.title}</p>
                              <p className="text-gray-600 mt-1">{donation.quantity} servings</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <p className="font-bold text-lg truncate">{donation.user.name}</p>
                          <p className="text-gray-600 text-sm truncate">{donation.user.email}</p>
                        </td>
                        <td className="px-6 py-6">
                          <p className="flex items-center gap-3 text-gray-700 break-words">
                            <MapPin className="w-5 h-5 flex-shrink-0" />
                            <span className="break-words">{donation.pickup_address}</span>
                          </p>
                        </td>
                        <td className="px-6 py-6">
                          <p className={`font-bold text-lg ${isExpired(donation.expiry_date) ? "text-red-600" : "text-gray-800"}`}>
                            {format(new Date(donation.expiry_date), "dd MMM yyyy")}
                          </p>
                          {isExpired(donation.expiry_date) && (
                            <p className="text-red-600 font-medium flex items-center gap-2 mt-2">
                              <AlertTriangle className="w-5 h-5" />
                              Expired
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-block px-6 py-3 rounded-full text-base font-bold border-2 ${getStatusBadge(donation.status)}`}>
                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <Link
                            to={`/admin/donations/${donation.id}`}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition whitespace-nowrap flex-shrink-0"
                          >
                            <Eye className="w-6 h-6" />
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-8">
            {filteredDonations.length === 0 ? (
              <motion.div className="text-center py-20 bg-white/90 backdrop-blur rounded-3xl shadow-2xl">
                <Package className="w-32 h-32 text-orange-300 mx-auto mb-8" />
                <p className="text-4xl font-bold text-orange-800 mb-6">No Donations Found</p>
                <p className="text-2xl text-gray-700">Try adjusting your filters</p>
              </motion.div>
            ) : (
              filteredDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-3xl shadow-2xl p-8 border-8 ${isExpired(donation.expiry_date) ? "border-red-300" : "border-orange-100"}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {donation.images.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                          alt={donation.title}
                          className="w-20 h-20 object-cover rounded-2xl shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center">
                          <Package className="w-10 h-10 text-orange-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-orange-800">{donation.title}</h3>
                        <p className="text-gray-700 font-medium">
                          by {donation.user.name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-6 py-3 rounded-full text-lg font-bold border-2 ${getStatusBadge(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-4 text-lg">
                    <p className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-gray-600" />
                      <span className="font-medium">{donation.quantity} servings</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-gray-600" />
                      <span>{donation.pickup_address}</span>
                    </p>
                    <p className={`flex items-center gap-3 font-bold ${isExpired(donation.expiry_date) ? "text-red-600" : ""}`}>
                      <Calendar className="w-6 h-6" />
                      {format(new Date(donation.expiry_date), "dd MMM yyyy")}
                      {isExpired(donation.expiry_date) && " (Expired)"}
                    </p>
                  </div>

                  <div className="mt-8 text-center">
                    <Link
                      to={`/admin/donations/${donation.id}`}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition"
                    >
                      <Eye className="w-8 h-8" />
                      Manage Donation
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl">
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="Beautiful Sri Lankan rice and curry — shared with love"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              Every approved donation becomes a warm meal for a family
            </p>
            <p className="text-2xl opacity-80">
              Thank you for helping reduce waste and spread kindness
            </p>
            <div className="mt-12 text-8xl">🍲🙏✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}