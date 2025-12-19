// src/pages/Admin/Donations/DonationDetails.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  AlertCircle,
  Package,
  Calendar,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import donationdetailsImg from '@/assets/images/donationdetails.jpg';

interface Donation {
  id: number;
  title: string;
  description: string;
  quantity: number;
  pickup_address: string;
  expiry_date: string;
  status: "pending" | "approved" | "completed";
  created_at: string;
  user: { name: string; email: string; phone?: string };
  images: { image_path: string }[];
}

const fetchDonation = async (id: string): Promise<Donation> => {
  const { data } = await api.get(`/admin/donations/${id}`);
  return data.donation || data;
};

export default function DonationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: donation, isLoading } = useQuery({
    queryKey: ["admin-donation", id],
    queryFn: () => fetchDonation(id!),
  });

  const actionMutation = useMutation({
    mutationFn: (action: "approve" | "reject") =>
      api.post(`/admin/donations/${id}/${action}`),
    onSuccess: (_data, action) => {
      queryClient.invalidateQueries({ queryKey: ["admin-donation", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      toast.success(action === "approve" ? "🎉 Donation Approved!" : "Donation Rejected");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/donations/${id}`),
    onSuccess: () => {
      toast.success("Donation deleted");
      navigate("/admin/donations");
    },
  });

  if (isLoading || !donation) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-3xl text-orange-700">Loading donation details...</p>
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
              src={donationdetailsImg}
              alt="A kind donor sharing food with the community"
              className="w-full h-72 sm:h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                Reviewing a Kind Donation ❤️
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl opacity-90">
                {donation.title}
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
            Back to Donations
          </motion.button>

          {/* Status Badge */}
          <div className="flex justify-end mb-8">
            <span className={`px-8 py-4 rounded-full text-white font-bold text-lg sm:text-xl shadow-2xl ${donation.status === "pending" ? "bg-amber-600" :
                donation.status === "approved" ? "bg-blue-600" : "bg-emerald-600"
              }`}>
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
            </span>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-3xl p-6 sm:p-8 lg:p-12 mb-12 border-8 border-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-4 flex items-center gap-3">
                    <Package className="w-10 h-10 text-orange-600" />
                    Donation Details
                  </h2>
                  <div className="space-y-6 text-lg">
                    <div>
                      <p className="text-gray-600 font-medium">Description</p>
                      <p className="mt-2 text-gray-800">{donation.description || "No description provided"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Users className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-gray-600 font-medium">Quantity</p>
                        <p className="text-2xl font-bold text-orange-900">{donation.quantity} servings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-gray-600 font-medium">Pickup Address</p>
                        <p className="text-xl font-bold text-orange-900">{donation.pickup_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-gray-600 font-medium">Expiry Date</p>
                        <p className="text-2xl font-bold text-red-600">
                          {new Date(donation.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-gray-600 font-medium">Posted On</p>
                        <p className="text-xl font-bold text-orange-900">
                          {new Date(donation.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <h3 className="text-xl font-bold text-orange-800 mb-4">Donor Information</h3>
                  <div className="space-y-4 text-lg">
                    <p><span className="font-medium text-gray-600">Name:</span> {donation.user.name}</p>
                    <p><span className="font-medium text-gray-600">Email:</span> {donation.user.email}</p>
                    {donation.user.phone && <p><span className="font-medium text-gray-600">Phone:</span> {donation.user.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Right: Images */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-6 flex items-center gap-3">
                  <Package className="w-10 h-10 text-orange-600" />
                  Food Images
                </h2>
                {donation.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {donation.images.map((img, index) => (
                      <motion.img
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        src={`/storage/${img.image_path}`}
                        alt={`Food donation ${index + 1}`}
                        className="w-full h-64 sm:h-72 object-cover rounded-3xl shadow-2xl"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-orange-50 border-4 border-dashed border-orange-300 rounded-3xl p-16 text-center">
                    <Package className="w-24 h-24 text-orange-400 mx-auto mb-6" />
                    <p className="text-xl text-orange-700 font-medium">No images uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t-4 border-orange-200">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {donation.status === "pending" && (
                  <>
                    <button
                      onClick={() => actionMutation.mutate("approve")}
                      disabled={actionMutation.isPending}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4"
                    >
                      <Check className="w-10 h-10" />
                      {actionMutation.isPending ? "Approving..." : "Approve Donation"}
                    </button>
                    <button
                      onClick={() => actionMutation.mutate("reject")}
                      disabled={actionMutation.isPending}
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4"
                    >
                      <X className="w-10 h-10" />
                      Reject Donation
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4"
                >
                  <Trash2 className="w-10 h-10" />
                  Delete Donation
                </button>
              </div>
            </div>
          </motion.div>

          {/* Delete Dialog */}
          <AnimatePresence>
            {showDeleteDialog && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowDeleteDialog(false)} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl shadow-3xl max-w-lg w-full p-10 border-8 border-red-200 text-center">
                    <AlertCircle className="w-24 h-24 text-red-600 mx-auto mb-8" />
                    <h3 className="text-4xl font-bold text-red-800 mb-6">Delete This Donation?</h3>
                    <p className="text-xl text-gray-700 mb-10">
                      This will <strong className="text-red-600">permanently remove</strong> the donation from the system.
                    </p>
                    <div className="flex gap-6 justify-center">
                      <button onClick={() => setShowDeleteDialog(false)} className="px-10 py-5 border-4 border-gray-300 rounded-3xl hover:bg-gray-50 font-bold text-xl transition">
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                        className="px-12 py-5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition flex items-center gap-4"
                      >
                        <Trash2 className="w-8 h-8" />
                        {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Forever"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}