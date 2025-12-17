// src/pages/Receiver/ReceiverDashboard.tsx — EMOTIONAL & HOPEFUL
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Package, Heart, Calendar, MapPin } from "lucide-react";

interface Donation {
  id: number;
  title: string;
  quantity: number;
  pickup_address: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
}

export default function ReceiverDashboard() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [donationsRes, statsRes] = await Promise.all([
          api.get("/receivers/donations"),
          api.get("/receivers/dashboard-stats"),
        ]);

        const donationsData = donationsRes.data.donations || donationsRes.data.data || [];
        setDonations(Array.isArray(donationsData) ? donationsData : []);
        setStats(statsRes.data);
      } catch (err: any) {
        toast.error("Failed to load your dashboard");
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading your hope...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header with Emotional Image */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden shadow-3xl mb-16 border-8 border-white"
          >
            <img
              src="https://media.gettyimages.com/id/646182948/photo/sri-lankan-family-enjoying-meal-together.jpg?s=612x612&w=gi&k=20&c=IiZBhctxU7aIBE9OWi0fOAgE1jWKTkU693DZA3b1eac="
              alt="Happy Sri Lankan family enjoying a warm meal together"
              className="w-full h-96 md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-center text-white">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                Welcome Home to Hope ❤️
              </h1>
              <p className="text-2xl md:text-3xl opacity-90">
                Every meal received is a gift of kindness
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl border-8 border-orange-200"
            >
              <Package className="w-20 h-20 text-orange-600 mx-auto mb-6" />
              <p className="text-2xl text-gray-700 mb-4">Total Requests</p>
              <p className="text-6xl font-extrabold text-orange-800">{stats.totalRequests}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl border-8 border-green-200"
            >
              <Heart className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <p className="text-2xl text-gray-700 mb-4">Meals Received</p>
              <p className="text-6xl font-extrabold text-green-800">{stats.approvedRequests}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl border-8 border-yellow-200"
            >
              <Calendar className="w-20 h-20 text-yellow-600 mx-auto mb-6" />
              <p className="text-2xl text-gray-700 mb-4">Pending Hope</p>
              <p className="text-6xl font-extrabold text-yellow-800">{stats.pendingRequests}</p>
            </motion.div>
          </div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/90 backdrop-blur rounded-3xl shadow-3xl p-10"
          >
            <h2 className="text-4xl font-bold text-orange-800 mb-10 text-center">
              Your Recent Requests
            </h2>

            {donations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <img
                  src="https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=10166435807063852"
                  alt="Community sharing food with gratitude"
                  className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl mb-10"
                />
                <p className="text-3xl text-orange-800 mb-6">
                  Start Your Journey of Hope
                </p>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                  Browse available donations and request a meal today.<br />
                  Someone's kindness is waiting to reach you ❤️
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {donations.map((donation, i) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-2xl p-8 border-4 border-white"
                  >
                    <h3 className="text-2xl font-bold text-orange-800 mb-4">
                      {donation.title}
                    </h3>

                    <div className="space-y-4 text-gray-700">
                      <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500" />
                        <span className="font-medium">{donation.quantity} servings</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-orange-600" />
                        <span>{donation.pickup_address}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-orange-600" />
                        <span>Requested {new Date(donation.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <span className={`inline-block px-8 py-4 rounded-full text-xl font-bold ${
                        donation.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        donation.status === "approved" ? "bg-green-100 text-green-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {donation.status.toUpperCase()}
                      </span>
                    </div>

                    {donation.status === "approved" && (
                      <p className="text-center text-green-700 italic text-lg mt-6">
                        On its way to you with love ❤️
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 bg-orange-800 text-white rounded-3xl p-16 text-center shadow-2xl"
          >
            <img
              src="https://theperfectcurry.com/wp-content/uploads/2024/10/sri-lankan-rice-and-curry-with-sri-lankan-sides.png"
              alt="Beautiful Sri Lankan rice and curry spread"
              className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl mb-10"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              No one should go hungry when food is shared with love
            </p>
            <p className="text-2xl opacity-80">
              Thank you for trusting us to bring meals to your family
            </p>
            <div className="mt-12 text-8xl">🍲✨🙏</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}