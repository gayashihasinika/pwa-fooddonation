// src/pages/Admin/Claims/ClaimDeliveryDetails.tsx — EMOTIONAL & FULLY RESPONSIVE
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  User,
  HeartHandshake,
  Clock,
  Calendar,
  MapPin,
  Package,
  AlertCircle,
  Heart,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";

interface Claim {
  id: number;
  donation: {
    id: number;
    title: string;
    user: { name: string; email: string };
    pickup_address: string;
    images: { image_path: string }[];
  };
  receiver: { name: string; email: string };
  volunteer?: { name: string } | null;
  status: string;
  notes: string | null;
  claimed_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
}

const fetchClaim = async (id: string): Promise<Claim> => {
  const { data } = await api.get(`/admin/claims/${id}`);
  return data.claim;
};

export default function ClaimDeliveryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: claim, isLoading } = useQuery({
    queryKey: ["admin-claim", id],
    queryFn: () => fetchClaim(id!),
  });

  const queryClientInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-claim", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-claims"] });
  };

  const actionMutation = useMutation({
    mutationFn: (endpoint: string) => api.post(endpoint),
    onSuccess: (_, endpoint) => {
      queryClientInvalidate();
      if (endpoint.includes("picked-up")) toast.success("Marked as picked up! 🚚");
      if (endpoint.includes("delivered")) toast.success("Delivery completed! 🎉❤️");
      if (endpoint.includes("cancel")) toast.success("Claim cancelled");
    },
    onError: () => toast.error("Action failed"),
  });

  const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    pending: { color: "bg-amber-100 text-amber-800 border-amber-300", label: "Pending Review", icon: <Clock className="w-6 h-6" /> },
    accepted: { color: "bg-blue-100 text-blue-800 border-blue-300", label: "Accepted", icon: <HeartHandshake className="w-6 h-6" /> },
    picked_up: { color: "bg-purple-100 text-purple-800 border-purple-300", label: "Picked Up", icon: <Truck className="w-6 h-6" /> },
    delivered: { color: "bg-emerald-100 text-emerald-800 border-emerald-300", label: "Delivered", icon: <Heart className="w-6 h-6" /> },
    cancelled: { color: "bg-gray-100 text-gray-700 border-gray-300", label: "Cancelled", icon: <AlertCircle className="w-6 h-6" /> },
  };

  const currentStatus = statusConfig[claim?.status || "pending"];

  if (isLoading || !claim) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-3xl text-orange-700">Loading delivery details...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-3xl mb-12 border-8 border-white"
          >
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4753-scaled.jpg"
              alt="Volunteer delivering food with love and care"
              className="w-full h-72 sm:h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                Coordinating a Delivery with Kindness ❤️
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl opacity-90">
                {claim.donation.title}
              </p>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8 text-base sm:text-lg"
          >
            <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
            Back to Claims
          </motion.button>

          {/* Status Badge */}
          <div className="flex justify-end mb-8">
            <div className={`inline-flex items-center gap-4 px-8 py-5 rounded-full text-white font-bold text-xl shadow-2xl ${currentStatus.color}`}>
              {currentStatus.icon}
              {currentStatus.label}
            </div>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-3xl overflow-hidden border-8 border-white mb-12"
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-8 sm:p-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-4">
                <Package className="w-12 h-12" />
                Donation Journey
              </h2>
            </div>

            <div className="p-8 sm:p-10 lg:p-12 space-y-12">
              {/* People Involved */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 text-center border-4 border-green-200">
                  <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Generous Donor</p>
                  <p className="text-2xl font-bold text-green-800 mt-2">{claim.donation.user.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{claim.donation.user.email}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 text-center border-4 border-blue-200">
                  <HeartHandshake className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Receiver</p>
                  <p className="text-2xl font-bold text-blue-800 mt-2">{claim.receiver.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{claim.receiver.email}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 text-center border-4 border-purple-200">
                  <Truck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Volunteer</p>
                  <p className="text-2xl font-bold text-purple-800 mt-2">
                    {claim.volunteer?.name || "Not Assigned Yet"}
                  </p>
                  {claim.volunteer && <p className="text-gray-600 text-sm mt-1">{claim.volunteer.email || ""}</p>}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center">Delivery Timeline</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-2xl p-6">
                      <p className="font-medium text-gray-600">Claimed on</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {format(new Date(claim.claimed_at), " MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {claim.picked_up_at && (
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="flex-1 bg-purple-50 rounded-2xl p-6">
                        <p className="font-medium text-gray-600">Picked up on</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {format(new Date(claim.picked_up_at), "dddd, MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  )}

                  {claim.delivered_at && (
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="flex-1 bg-emerald-50 rounded-2xl p-6">
                        <p className="font-medium text-gray-600">Delivered on</p>
                        <p className="text-2xl font-bold text-emerald-800">
                          {format(new Date(claim.delivered_at), "dddd, MMMM d, yyyy")}
                        </p>
                        <p className="text-emerald-700 font-medium mt-3 text-xl">A family received a warm meal ❤️</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup Address */}
              <div className="bg-orange-50 border-4 border-orange-300 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="w-10 h-10 text-orange-600" />
                  <h3 className="text-2xl font-bold text-orange-800">Pickup Location</h3>
                </div>
                <p className="text-xl text-orange-900 font-medium">{claim.donation.pickup_address}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t-4 border-orange-200">
                <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center">Update Delivery Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  {claim.status === "accepted" && (
                    <button
                      onClick={() => actionMutation.mutate(`/admin/claims/${id}/picked-up`)}
                      disabled={actionMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-8 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex flex-col items-center gap-4"
                    >
                      <Truck className="w-16 h-16" />
                      {actionMutation.isPending ? "Updating..." : "Mark as Picked Up"}
                    </button>
                  )}

                  {claim.status === "picked_up" && (
                    <button
                      onClick={() => actionMutation.mutate(`/admin/claims/${id}/delivered`)}
                      disabled={actionMutation.isPending}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-10 py-8 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex flex-col items-center gap-4"
                    >
                      <Heart className="w-16 h-16" />
                      {actionMutation.isPending ? "Completing..." : "Mark as Delivered"}
                    </button>
                  )}

                  <button
                    onClick={() => actionMutation.mutate(`/admin/claims/${id}/cancel`)}
                    disabled={actionMutation.isPending}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-10 py-8 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex flex-col items-center gap-4"
                  >
                    <AlertCircle className="w-16 h-16" />
                    Cancel Claim
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl">
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="A warm meal delivered with love"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">Every Delivery Matters ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              You're helping connect kindness across Sri Lanka
            </p>
            <p className="text-2xl opacity-80">
              Thank you for making sure no meal goes to waste
            </p>
            <div className="mt-12 text-8xl">🚚🍲🙏✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}