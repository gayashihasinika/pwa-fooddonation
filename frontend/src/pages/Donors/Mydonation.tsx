// src/pages/Donors/MyDonation.tsx — WARM, EMOTIONAL & STUNNING
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Heart } from "lucide-react";

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

export default function MyDonation() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          toast.error("Please log in to view your donations");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://127.0.0.1:8001/api/donors/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonations(res.data || []);
      } catch (err) {
        toast.error("Failed to load your donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [navigate]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-white";
      case "approved":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "completed":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading your donations...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (donations.length === 0) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl"
          >
            <Package className="w-32 h-32 text-orange-300 mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-orange-800 mb-6">
              No Donations Yet
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Your kindness starts with one donation ❤️<br />
              Share surplus food and feed a family today
            </p>
            <button
              onClick={() => navigate("/donors/post-donation/post-donation-add")}
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transition transform hover:scale-105"
            >
              Post Your First Donation
            </button>
          </motion.div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-orange-800 mb-6">
              My Donations ❤️
            </h1>
            <p className="text-2xl text-orange-700">
              Thank you for your generosity — every meal makes a difference
            </p>
          </motion.div>

          {/* Donations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {donations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white hover:shadow-3xl transition-all duration-500"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Images */}
                {donation.images.length > 0 ? (
                  <div className="relative h-64 overflow-hidden">
                    {donation.images.map((img, i) => (
                      <img
                        key={img.id}
                        src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                        alt={donation.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === 0 ? "opacity-100" : "opacity-0"} group-hover:opacity-0`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <Package className="w-24 h-24 text-orange-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 ${getStatusStyle(donation.status)} px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2`}>
                  <Heart className="w-5 h-5" />
                  {donation.status.toUpperCase()}
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-orange-800 mb-4 line-clamp-2">
                    {donation.title}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {donation.description || "Shared with love from your kitchen"}
                  </p>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-red-500" />
                      <span className="font-medium">{donation.quantity} servings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-orange-600" />
                      <span className="text-sm">{donation.pickup_address}</span>
                    </div>
                    {donation.expiry_date && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <span className="text-sm">
                          Best before {new Date(donation.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/donors/view-donation/${donation.id}`)}
                    className="mt-8 w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition transform hover:scale-105"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}