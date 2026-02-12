// src/pages/Admin/Claims/ClaimDeliveryList.tsx
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Truck, Calendar, User, Heart, Package, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Claim {
  id: number;
  donation: {
    id: number;
    title: string;
    user?: { name: string };
    images: { image_path: string }[];
  };
  receiver?: { name: string };
  volunteer?: { name: string } | null;
  status: string;
  notes: string | null;
  claimed_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
}

export default function ClaimDeliveryList() {
  const { data: claims = [], isLoading, isError } = useQuery<Claim[]>({
    queryKey: ["admin-claims"],
    queryFn: async () => {
      const { data } = await api.get("/admin/claims");
      return data.claims ?? [];
    },
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      accepted: "bg-blue-100 text-blue-800 border-blue-300",
      picked_up: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
      cancelled: "bg-gray-100 text-gray-800 border-gray-300",
      disputed: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) =>
    status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

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
              alt="Volunteer delivering food with kindness"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4742-scaled.jpg"
              alt="Grateful family receiving meal"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="Warm meal ready to be delivered"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          {/* Hero Text */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Coordinating Deliveries with Love ❤️
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Ensuring every donation reaches a family in need ({claims.length} active claims)
            </p>
          </div>

          {/* Loading/Error/Empty States */}
          {isLoading ? (
            <div className="text-center py-32">
              <Truck className="w-32 h-32 text-orange-300 mx-auto mb-8 animate-pulse" />
              <p className="text-3xl text-orange-700">Loading claims...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-32 bg-white/90 rounded-3xl shadow-2xl">
              <p className="text-3xl text-red-600">Failed to load claims</p>
            </div>
          ) : claims.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Truck className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Claims Yet</p>
              <p className="text-2xl text-gray-700 px-8">
                Claims will appear here once receivers accept donations and volunteers step in.
              </p>
              <p className="text-xl text-orange-600 mt-8">Every delivery starts with kindness 🙏</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-2xl overflow-hidden">
                <table className="w-full table-auto">
                  <thead className="bg-gradient-to-r from-orange-100 to-amber-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-lg font-bold text-orange-800">Donation</th>
                      <th className="px-6 py-4 text-left text-lg font-bold text-orange-800">From → To</th>
                      <th className="px-6 py-4 text-left text-lg font-bold text-orange-800">Volunteer</th>
                      <th className="px-6 py-4 text-left text-lg font-bold text-orange-800">Timeline</th>
                      <th className="px-6 py-4 text-left text-lg font-bold text-orange-800">Status</th>
                      <th className="px-6 py-4 text-right text-lg font-bold text-orange-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-orange-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {claim.donation.images.length > 0 ? (
                              <img
                                src={`http://127.0.0.1:8001/storage/${claim.donation.images[0].image_path}`}
                                alt={claim.donation.title}
                                className="w-16 h-16 object-cover rounded-xl shadow-md"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Package className="w-8 h-8 text-orange-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-xl">{claim.donation.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-700">
                            Donor: {claim.donation.user?.name || "Unknown"}
                          </p>
                          <p className="font-medium text-gray-700 mt-1">
                            Receiver: {claim.receiver?.name || "Unknown"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {claim.volunteer ? (
                            <p className="font-bold text-lg text-orange-700">{claim.volunteer.name}</p>
                          ) : (
                            <p className="text-gray-500 italic">No volunteer assigned</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-5 h-5" />
                            Claimed: {format(new Date(claim.claimed_at), "dd MMM yyyy")}
                          </p>
                          {claim.picked_up_at && (
                            <p className="flex items-center gap-2 text-gray-700 mt-2">
                              <Clock className="w-5 h-5" />
                              Picked up: {format(new Date(claim.picked_up_at), "dd MMM yyyy")}
                            </p>
                          )}
                          {claim.delivered_at && (
                            <p className="flex items-center gap-2 text-emerald-700 mt-2 font-medium">
                              <Heart className="w-5 h-5" />
                              Delivered: {format(new Date(claim.delivered_at), "dd MMM yyyy")}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-4 py-2 rounded-full text-lg font-bold border-2 ${getStatusBadge(
                              claim.status
                            )}`}
                          >
                            {getStatusText(claim.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/claims/${claim.id}`}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 py-3 rounded-2xl font-bold shadow hover:shadow-lg transition"
                          >
                            Manage Claim
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-8">
                {claims.map((claim) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 sm:border-8 border-orange-100"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        {claim.donation.images.length > 0 ? (
                          <img
                            src={`http://127.0.0.1:8001/storage/${claim.donation.images[0].image_path}`}
                            alt={claim.donation.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl shadow-md"
                          />
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-orange-800">
                            {claim.donation.title}
                          </h3>
                          <p className="text-gray-700 mt-1 text-base sm:text-lg">
                            Donor → Receiver: <strong>{claim.donation.user?.name || "Unknown"} → {claim.receiver?.name || "Unknown"}</strong>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-lg font-bold border-2 ${getStatusBadge(
                          claim.status
                        )}`}
                      >
                        {getStatusText(claim.status)}
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-base sm:text-lg">
                      {claim.volunteer && (
                        <p className="flex items-center gap-3">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                          <span className="font-medium">Volunteer: {claim.volunteer.name}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                        <span>Claimed: {format(new Date(claim.claimed_at), "dd MMM yyyy")}</span>
                      </p>
                      {claim.picked_up_at && (
                        <p className="flex items-center gap-3">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                          <span>Picked up: {format(new Date(claim.picked_up_at), "dd MMM yyyy")}</span>
                        </p>
                      )}
                      {claim.delivered_at && (
                        <p className="flex items-center gap-3 text-emerald-700 font-bold">
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span>Delivered: {format(new Date(claim.delivered_at), "dd MMM yyyy")}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-6 sm:mt-8 text-center">
                      <Link
                        to={`/admin/claims/${claim.id}`}
                        className="inline-flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 sm:px-12 py-3 sm:py-6 rounded-3xl font-bold text-lg sm:text-2xl shadow hover:shadow-xl transition"
                      >
                        Manage Claim
                      </Link>
                    </div>
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
