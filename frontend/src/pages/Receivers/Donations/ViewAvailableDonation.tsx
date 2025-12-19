// src/pages/Receivers/Donations/ViewAvailableDonation.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import Confetti from "react-confetti";
import { Heart, MapPin, Package, Calendar, Clock, ArrowLeft } from "lucide-react";

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
  preferred_pickup_time?: string;
  images: DonationImage[];
  status: string;
}

export default function ViewAvailableDonation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  useEffect(() => {
    api
      .get(`/receivers/donations/${id}`)
      .then((res) => {
        setDonation(res.data.donation);
        setAlreadyClaimed(res.data.already_claimed);
        setClaimStatus(res.data.claim_status);
      })
      .catch(() => toast.error("Failed to load donation"))
      .finally(() => setLoading(false));
  }, [id]);

  // Live countdown - FIXED TypeScript error
  useEffect(() => {
    if (!donation?.expiry_date) {
      setTimeLeft("No expiry");
      return;
    }

    const updateCountdown = () => {
      const expiry = new Date(donation.expiry_date!).getTime(); // ! tells TS it's not null here
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} day${days > 1 ? "s" : ""} left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes} minutes left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [donation]);

  const claimDonation = async () => {
    try {
      await api.post(`/receivers/donations/${id}/claim`);
      setShowConfetti(true);
      setShowThankYouModal(true);
      setTimeout(() => setShowConfetti(false), 8000);
      toast.success("Donation claimed successfully! ❤️");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Claim failed");
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading this gift of kindness...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!donation) return null;

  return (
    <AuthenticatedLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.08} />}

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8"
          >
            <ArrowLeft className="w-8 h-8" />
            Back to Available Donations
          </motion.button>

          {/* Hero Image */}
          <motion.div className="rounded-3xl overflow-hidden shadow-3xl mb-12 border-8 border-white">
            {donation.images?.length > 0 ? (
              <div className="relative">
                <img
                  src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                  alt={donation.title}
                  className="w-full h-80 sm:h-96 lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                    {donation.title}
                  </h1>
                  <p className="text-xl sm:text-2xl lg:text-3xl opacity-90">
                    This meal is shared with love, just for you ❤️
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-80 sm:h-96 lg:h-[600px] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <Package className="w-32 h-32 text-orange-400" />
              </div>
            )}
          </motion.div>

          {/* Description */}
          {donation.description && (
            <motion.div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl mb-12 text-center">
              <p className="text-xl sm:text-2xl text-gray-700 italic leading-relaxed">
                "{donation.description}"
              </p>
            </motion.div>
          )}

          {/* Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <motion.div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-orange-200">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Servings</p>
              <p className="text-5xl font-extrabold text-orange-800">{donation.quantity}</p>
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-orange-200">
              <MapPin className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Pickup Location</p>
              <p className="text-2xl font-bold text-orange-800">{donation.pickup_address}</p>
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-yellow-200">
              <Calendar className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Expiry Date</p>
              <p className="text-4xl font-extrabold text-yellow-800">
                {donation.expiry_date ? new Date(donation.expiry_date).toLocaleDateString() : "No expiry"}
              </p>
            </motion.div>

            <motion.div className={`rounded-3xl p-8 text-center shadow-2xl border-8 ${timeLeft === "Expired" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
              <motion.div
                animate={timeLeft !== "Expired" && timeLeft !== "No expiry" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Clock className={`w-16 h-16 mx-auto mb-4 ${timeLeft === "Expired" ? "text-red-600" : "text-green-600"}`} />
              </motion.div>
              <p className="text-xl text-gray-700 mb-2">Time Remaining</p>
              <p className={`text-4xl font-extrabold ${timeLeft === "Expired" ? "text-red-800" : "text-green-800"}`}>
                {timeLeft}
              </p>
            </motion.div>
          </div>

          {/* Claim Button */}
          {alreadyClaimed ? (
            <div className="text-center mb-16">
              <div className="inline-block bg-gray-100 text-gray-600 px-12 py-8 rounded-3xl text-2xl font-bold">
                Already claimed ({claimStatus})
              </div>
            </div>
          ) : (
            <motion.div className="text-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirmModal(true)}
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-16 py-10 rounded-full text-3xl sm:text-4xl font-extrabold shadow-3xl"
              >
                Accept This Gift of Kindness ❤️
              </motion.button>
              <p className="text-xl text-gray-700 mt-6">
                This meal will be reserved for you and your family
              </p>
            </motion.div>
          )}

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="bg-white rounded-3xl shadow-3xl max-w-lg w-full p-10 text-center border-8 border-orange-300"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-8xl mb-8"
                  >
                    ❤️
                  </motion.div>

                  <h2 className="text-4xl font-extrabold text-orange-800 mb-6">
                    Accept This Gift?
                  </h2>

                  <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                    This beautiful meal will be reserved just for you and your family.<br />
                    Are you ready to accept this kindness?
                  </p>

                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="px-10 py-4 bg-gray-200 text-gray-700 rounded-2xl text-xl font-bold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmModal(false);
                        claimDonation();
                      }}
                      className="px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition"
                    >
                      Yes, Accept ❤️
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thank You Modal After Claim — PERFECT SIZE ON ALL DEVICES */}
          <AnimatePresence>
            {showThankYouModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-white rounded-3xl shadow-3xl w-full max-w-md mx-4 my-8 p-8 text-center border-8 border-green-300"
                >
                  {/* Responsive Heart */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-7xl sm:text-8xl mb-6"
                  >
                    ❤️
                  </motion.div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-6 leading-tight">
                    Thank You for Accepting This Gift!
                  </h2>

                  <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
                    This warm meal is now reserved for you.<br />
                    Someone's kindness has reached your family today.
                  </p>

                  <p className="text-base sm:text-lg text-gray-600 mb-8">
                    You can view it in your claims
                  </p>

                  <button
                    onClick={() => {
                      setShowThankYouModal(false);
                      navigate("/receivers/claims");
                    }}
                    className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-xl sm:text-2xl font-bold shadow-2xl hover:shadow-3xl transition"
                  >
                    Go to My Claims
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}