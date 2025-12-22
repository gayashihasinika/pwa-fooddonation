// src/pages/Donors/Claims/ClaimDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Heart, 
  Calendar, 
  Users, 
  Sparkles, 
  Package, 
  CheckCircle 
} from "lucide-react";
import { toast } from "react-hot-toast";
import impactImage from "@/assets/images/impact-hands.jpg";
import { format } from "date-fns";

interface Claim {
  id: number;
  status: "pending" | "accepted" | "completed";
  claimed_at: string;
  donation: {
    id: number;
    title: string;
    images: { image_path: string }[];
  };
  receiver: {
    name: string;
  };
}

export default function DonorClaimDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: claim, isLoading } = useQuery<Claim>({
    queryKey: ["donor-claim", id],
    queryFn: async () => {
      const res = await api.get(`/donors/claims/${id}`);
      return res.data.claim;
    },
    enabled: !!id,
  });

  const approveMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await api.post(`/donors/claims/${id}/approve`);
    },
    onSuccess: () => {
      toast.success("Claim approved! The receiver can now pick up the donation ❤️");
      queryClient.invalidateQueries({ queryKey: ["donor-claim", id] });
      queryClient.invalidateQueries({ queryKey: ["donor-claims"] });
    },
    onError: () => {
      toast.error("Failed to approve claim");
    },
  });

  if (isLoading) return (
    <AuthenticatedLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <p className="text-2xl text-orange-700">Loading claim details...</p>
      </div>
    </AuthenticatedLayout>
  );

  if (!claim) return (
    <AuthenticatedLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 px-4 text-center">
        <p className="text-2xl text-orange-700">Claim not found or unauthorized</p>
      </div>
    </AuthenticatedLayout>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "from-yellow-400 to-yellow-600";
      case "accepted": return "from-emerald-500 to-green-600";
      case "completed": return "from-blue-500 to-indigo-600";
      default: return "from-gray-400 to-gray-500";
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 sm:gap-3 text-orange-700 hover:text-orange-800 font-medium mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            Back to Claims
          </motion.button>

          {/* Title & Receiver */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12 px-2"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-orange-800 mb-4 sm:mb-6 break-words">
              {claim.donation.title}
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700">
              Your kindness reached <span className="font-bold text-orange-600">{claim.receiver.name}</span>
            </p>
          </motion.div>

          {/* Main Image & Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-3xl mb-6 sm:mb-10 border-4 sm:border-8 border-white"
          >
            {claim.donation.images.length > 0 ? (
              <img
                src={`http://127.0.0.1:8001/storage/${claim.donation.images[0].image_path}`}
                alt={claim.donation.title}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
              />
            ) : (
              <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <Package className="w-20 h-20 sm:w-32 sm:h-32 text-orange-400" />
              </div>
            )}

            <motion.div
              animate={claim.status === "pending" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ repeat: claim.status === "pending" ? Infinity : 0, duration: 1.2 }}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg md:text-2xl shadow-2xl flex items-center gap-2 sm:gap-3 text-white bg-gradient-to-r ${getStatusColor(claim.status)} ring-2 ring-white z-20`}
            >
              {claim.status === "pending" && <Sparkles className="w-5 h-5 sm:w-6 md:w-8" />}
              {claim.status === "accepted" && <CheckCircle className="w-5 h-5 sm:w-6 md:w-8" />}
              {claim.status === "completed" && <Heart className="w-5 h-5 sm:w-6 md:w-8" />}
              {claim.status.toUpperCase()}
            </motion.div>
          </motion.div>

          {/* APPROVE BUTTON */}
          {claim.status === "pending" && (
            <motion.div className="text-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 sm:px-16 py-4 sm:py-6 rounded-full text-lg sm:text-2xl md:text-3xl font-extrabold shadow-2xl hover:shadow-3xl transition flex items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10" />
                {approveMutation.isPending ? "Approving..." : "Approve This Claim"}
              </motion.button>
              <p className="text-sm sm:text-lg text-gray-700 mt-4 sm:mt-6">
                Let {claim.receiver.name} know they can pick up the donation ❤️
              </p>
            </motion.div>
          )}

          {/* Accepted / Completed Messages */}
          {claim.status === "accepted" && (
            <motion.div className="text-center mb-12">
              <CheckCircle className="w-24 sm:w-32 h-24 sm:h-32 text-emerald-600 mx-auto mb-4 sm:mb-6" />
              <p className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-2 sm:mb-4">Claim Approved! 🎉</p>
              <p className="text-lg sm:text-2xl text-gray-700">
                {claim.receiver.name} has been notified and can now collect the donation.
              </p>
            </motion.div>
          )}

          {claim.status === "completed" && (
            <motion.div className="text-center mb-12">
              <Heart className="w-24 sm:w-32 h-24 sm:h-32 text-red-600 mx-auto mb-4 sm:mb-6" />
              <p className="text-3xl sm:text-4xl font-bold text-green-800 mb-2 sm:mb-4">Delivery Completed ❤️</p>
              <p className="text-lg sm:text-2xl text-gray-700">
                Thank you — your donation brought joy to {claim.receiver.name}'s family.
              </p>
            </motion.div>
          )}

          {/* Narrative Story */}
          <motion.div className="bg-white/80 backdrop-blur rounded-3xl p-6 sm:p-10 shadow-2xl mb-12 text-center">
            <p className="text-base sm:text-xl text-gray-800 leading-relaxed max-w-3xl mx-auto">
              This donation is on its way to <span className="font-bold text-orange-700">{claim.receiver.name}</span> and their family.<br />
              <span className="text-orange-700 font-medium">Your kindness is bringing warmth and hope to someone in need.</span>
            </p>
          </motion.div>

          {/* Impact Image */}
          <motion.div className="rounded-3xl overflow-hidden shadow-2xl mb-12">
            <img
              src={impactImage}
              alt="Hands receiving donated food"
              className="w-full h-60 sm:h-72 md:h-96 object-cover"
            />
          </motion.div>

          {/* Journey Indicator */}
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 sm:p-10 shadow-2xl mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-6 sm:mb-8 text-center">Journey of Your Donation</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="text-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                </div>
                <p className="font-bold text-orange-700 text-sm sm:text-base">Donated</p>
              </div>

              <div className="flex-1 h-2 bg-gray-300 relative hidden md:block">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: claim.status === "pending" ? "50%" : claim.status === "accepted" ? "75%" : "100%",
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                />
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <p className="font-bold text-green-700 text-sm sm:text-base">Claimed</p>
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <p className="font-bold text-blue-700 text-sm sm:text-base">Delivered</p>
              </div>
            </div>
          </div>

          {/* Claim Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-orange-100">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600 mx-auto mb-2 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base mb-1">Claimed on</p>
              <p className="text-xl sm:text-3xl font-bold text-orange-800">{format(new Date(claim.claimed_at), "dd MMM yyyy")}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-orange-100">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600 mx-auto mb-2 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base mb-1">Received by</p>
              <p className="text-xl sm:text-3xl font-bold text-orange-800">{claim.receiver.name}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-orange-100">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600 mx-auto mb-2 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base mb-1">Your Impact</p>
              <p className="text-xl sm:text-3xl font-bold text-orange-800">Helped a family today ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
