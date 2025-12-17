// src/pages/Donors/ViewDonation.tsx — A STORY OF KINDNESS
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, MapPin, Calendar, Heart, Users, Sparkles } from "lucide-react";

interface DonationImage {
  id: number;
  image_path: string;
}

interface Donation {
  id: number;
  title: string;
  description: string;
  quantity: number;
  pickup_address: string;
  expiry_date: string | null;
  status: "pending" | "approved" | "completed";
  images: DonationImage[];
}

export default function ViewDonation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("Please log in");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://127.0.0.1:8001/api/donors/donations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonation(res.data);
        // Show thank you banner after load
        setTimeout(() => setShowThankYou(true), 1000);
        setTimeout(() => setShowThankYou(false), 6000);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load donation");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id, navigate]);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading your donation...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!donation) return null;

  const getStatusAnimation = (status: string) => {
    switch (status) {
      case "pending":
        return "animate-pulse";
      case "approved":
        return "animate-heartbeat";
      case "completed":
        return "animate-[sparkle_2s_ease-in-out]";
      default:
        return "";
    }
  };

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to My Donations
          </motion.button>

          {/* Thank You Banner */}
          <AnimatePresence>
            {showThankYou && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl p-8 mb-12 text-center shadow-2xl border-4 border-orange-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  ❤️
                </motion.div>
                <p className="text-3xl font-bold text-orange-800">
                  Thank you for being someone's reason to smile today
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-orange-800 mb-6">
              {donation.title}
            </h1>
            <p className="text-2xl text-orange-700 italic">
              Prepared with care. Shared with love.
            </p>
          </motion.div>

          {/* Narrative Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-2xl mb-16 text-center"
          >
            <p className="text-2xl text-gray-800 leading-relaxed max-w-3xl mx-auto">
              This food will soon reach someone who truly needs it.<br />
              <span className="font-bold text-orange-700">
                Your small action today becomes someone’s warm meal tonight.
              </span>
            </p>
          </motion.div>

          {/* Main Image */}
          {donation.images.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden shadow-3xl mb-12 border-8 border-white"
            >
              <motion.img
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                alt={donation.title}
                className="w-full h-96 md:h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Animated Status Badge */}
              <motion.div
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-10 py-5 rounded-full font-bold text-2xl shadow-2xl flex items-center gap-4 text-white ${getStatusAnimation(donation.status)}`}
                style={{
                  background: donation.status === "pending" ? "linear-gradient(to right, #f59e0b, #eab308)" :
                              donation.status === "approved" ? "linear-gradient(to right, #10b981, #059669)" :
                              "linear-gradient(to right, #3b82f6, #1d4ed8)"
                }}
              >
                <Heart className="w-8 h-8" />
                {donation.status.toUpperCase()}
                {donation.status === "completed" && <Sparkles className="w-8 h-8 ml-2" />}
              </motion.div>
            </motion.div>
          ) : (
            <div className="h-96 md:h-[550px] bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl shadow-3xl flex items-center justify-center mb-12">
              <Package className="w-32 h-32 text-orange-400" />
            </div>
          )}

          {/* Additional Images */}
          {donation.images.length > 1 && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center">
                More Moments of Care
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {donation.images.slice(1).map((img) => (
                  <motion.div
                    key={img.id}
                    whileHover={{ scale: 1.08, y: -8 }}
                    className="rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                      alt="Additional view"
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {donation.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-2xl mb-16"
            >
              <h3 className="text-3xl font-bold text-orange-800 mb-6 text-center">
                A Note from Your Heart
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed italic text-center max-w-3xl mx-auto">
                "{donation.description}"
              </p>
            </motion.div>
          )}

          {/* Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl border-8 border-orange-100"
            >
              <Heart className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <p className="text-gray-600 mb-3 text-lg">Meals Shared</p>
              <p className="text-5xl font-extrabold text-orange-800">{donation.quantity}</p>
              <p className="text-gray-600 mt-4">Enough warmth for a family</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl border-8 border-orange-100"
            >
              <MapPin className="w-20 h-20 text-orange-600 mx-auto mb-6" />
              <p className="text-gray-600 mb-3 text-lg">Where Kindness Will Be Collected</p>
              <p className="text-lg font-medium text-gray-800">{donation.pickup_address}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl border-8 border-orange-100"
            >
              <Users className="w-20 h-20 text-orange-600 mx-auto mb-6" />
              <p className="text-gray-600 mb-3 text-lg">Lives Touched</p>
              <p className="text-5xl font-extrabold text-orange-800">{donation.quantity}</p>
              <p className="text-gray-600 mt-4">People will smile because of you ❤️</p>
            </motion.div>
          </div>

          {/* Expiry */}
          {donation.expiry_date && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-10 text-center shadow-2xl mb-16"
            >
              <Calendar className="w-16 h-16 text-orange-700 mx-auto mb-6" />
              <p className="text-2xl text-gray-700">Best enjoyed before</p>
              <p className="text-4xl font-bold text-orange-800">
                {new Date(donation.expiry_date).toLocaleDateString()}
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl"
          >
            <h3 className="text-4xl font-bold mb-6">FeedSriLanka ❤️</h3>
            <p className="text-2xl mb-8 opacity-90">
              We connect surplus food with those who need it most
            </p>
            <p className="text-xl opacity-80">
              Together we've saved thousands of meals from waste<br />
              and brought warmth to families across Sri Lanka
            </p>
            <div className="mt-8 text-6xl">🍲✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}