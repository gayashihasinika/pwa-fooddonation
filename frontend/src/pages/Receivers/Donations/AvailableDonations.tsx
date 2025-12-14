// src/pages/Receivers/Donations/AvailableDonations.tsx — FINAL & PERFECT
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  Search
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api"; // ← NOW USING YOUR GLOBAL API HELPER!

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
  food_category: string;
  status: "pending" | "approved" | "completed" | "claimed";
  images: DonationImage[];
}

export default function AvailableDonations() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/receivers/donations", {
          params: filters,
        });

        setDonations(res.data.data || []);
      } catch (err: any) {
        console.error("Failed to fetch donations:", err);
        toast.error("Failed to load available donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-300";
      case "claimed": return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl text-gray-600">Finding food near you...</div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4"
            >
              Available Food Donations
            </motion.h1>
            <p className="text-xl text-gray-700">Help reduce waste • Feed someone in need</p>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search food, location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                >
                  <option value="">All Categories</option>
                  <option value="rice">Rice & Curry</option>
                  <option value="bread">Bread</option>
                  <option value="packaged">Packaged</option>
                  <option value="event_food">Event Food</option>
                  <option value="curry">Curry</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Donations Grid */}
          {donations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/80 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Package className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <p className="text-3xl text-gray-600 mb-4">No food available right now</p>
              <p className="text-xl text-gray-500">Check back soon — new donations appear daily!</p>
            </motion.div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                    {/* Image */}
                    <div className="h-64 relative">
                      {donation.images.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                          alt={donation.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
                          <Package className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                      <div className={`absolute top-4 left-4 px-4 py-2 rounded-full font-bold text-sm shadow-lg ${getStatusColor(donation.status)}`}>
                        {donation.status.toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{donation.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-2">{donation.description || "No description"}</p>

                      <div className="space-y-3 text-gray-700">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-rose-600" />
                          <span className="font-medium">{donation.quantity} servings</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-rose-600" />
                          <span>{donation.pickup_address}</span>
                        </div>
                        {donation.expiry_date && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-rose-600" />
                            <span>{new Date(donation.expiry_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {donation.preferred_pickup_time && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-rose-600" />
                            <span>{donation.preferred_pickup_time}</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/receivers/donations/${donation.id}`)}
                        className="mt-8 w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition"
                      >
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}