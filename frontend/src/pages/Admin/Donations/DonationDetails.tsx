// src/pages/Admin/Donations/DonationDetails.tsx
import { useState } from "react";
import { useParams, useNavigate, useRevalidator } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { ArrowLeft, Check, X, Trash2, AlertCircle, Package } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";

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
      toast.success(action === "approve" ? "Donation Approved!" : "Donation Rejected");
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
    return <AuthenticatedLayout><div className="p-8 text-center">Loading...</div></AuthenticatedLayout>;
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft /> Back to Donations
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Package className="text-rose-600" />
                {donation.title}
              </h1>
              <p className="text-gray-600 mt-2">Donated by <strong>{donation.user.name}</strong></p>
            </div>
            <span className={`px-6 py-3 rounded-full text-white font-bold text-lg ${
              donation.status === "pending" ? "bg-amber-600" :
              donation.status === "approved" ? "bg-blue-600" : "bg-emerald-600"
            }`}>
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-lg">{donation.description || "No description"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-xl font-bold">{donation.quantity} servings</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Address</p>
                <p className="text-xl font-bold">{donation.pickup_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="text-xl font-bold text-red-600">
                  {new Date(donation.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {donation.images.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Food Images</p>
                <div className="grid grid-cols-2 gap-4">
                  {donation.images.map((img) => (
                    <img
                      key={img.image_path}
                      src={`/storage/${img.image_path}`}
                      alt="Food"
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 justify-center">
            {donation.status === "pending" && (
              <>
                <button
                  onClick={() => actionMutation.mutate("approve")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 shadow-lg"
                >
                  <Check size={28} />
                  Approve Donation
                </button>
                <button
                  onClick={() => actionMutation.mutate("reject")}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 shadow-lg"
                >
                  <X size={28} />
                  Reject (Suspicious)
                </button>
              </>
            )}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 shadow-lg"
            >
              <Trash2 size={28} />
              Delete Donation
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteDialog && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowDeleteDialog(false)} />
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-4 border-red-200 text-center">
                  <AlertCircle className="text-red-600 mx-auto mb-6" size={80} />
                  <h3 className="text-3xl font-bold text-red-800 mb-4">Delete This Donation?</h3>
                  <p className="text-gray-700 text-lg mb-8">
                    This will <strong>permanently remove</strong> the donation post.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => setShowDeleteDialog(false)} className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium">
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate()}
                      className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-3"
                    >
                      <Trash2 size={20} />
                      Yes, Delete Forever
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}useRevalidator