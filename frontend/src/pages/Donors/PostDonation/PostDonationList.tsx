// src/pages/Donors/PostDonation/PostDonationList.tsx 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Calendar, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface Donation {
  id: number;
  title: string;
  description?: string;
  quantity?: number;
  expiry_date?: string;
  status: string;
  pickup_address?: string;
  preferred_pickup_time?: string;
  images?: { id: number; image_path: string }[];
}

export default function PostDonationList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donors/my-donations");
        setDonations(res.data || []);
      } catch (err: any) {
        toast.error("Failed to load donations");
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/donors/post-donation/post-donation-edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this donation permanently?")) return;
    try {
      await api.delete(`/donors/donations/${id}`);
      toast.success("Donation deleted");
      setDonations(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "expired": return <XCircle className="w-6 h-6 text-red-600" />;
      case "claimed": return <Package className="w-6 h-6 text-blue-600" />;
      default: return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-50 border-green-300 text-green-800";
      case "expired": return "bg-red-50 border-red-300 text-red-800";
      case "claimed": return "bg-blue-50 border-blue-300 text-blue-800";
      default: return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl text-gray-600">Loading your donations...</div>
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
          {/* Hero Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-600 bg-clip-text text-transparent mb-4"
            >
              My Donations
            </motion.h1>
            <p className="text-xl text-gray-700">Track and manage all your generous contributions</p>
          </div>

          {/* Add Button */}
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/donors/post-donation/post-donation-add")}
              className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl flex items-center gap-4 mx-auto"
            >
              <Plus className="w-10 h-10" />
              Post New Donation
            </motion.button>
          </div>

          {/* Donations Grid */}
          {donations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/80 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Package className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <p className="text-3xl text-gray-600 mb-4">No donations yet</p>
              <p className="text-xl text-gray-500">Your kindness starts with one donation</p>
            </motion.div>
          ) : (
            <div className="grid gap-8">
              <AnimatePresence>
                {donations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-orange-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                    <div className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 ${getStatusColor(donation.status)}`}>
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>

                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Left: Image + Title */}
                          <div className="flex items-start gap-6">
                            <div className="relative">
                              <img
                                src={
                                  donation.images?.[0]
                                    ? `http://127.0.0.1:8001/storage/${donation.images[0].image_path}`
                                    : "https://via.placeholder.com/120x120/rose-100/ffffff?text=Food"
                                }
                                alt={donation.title}
                                className="w-32 h-32 object-cover rounded-2xl shadow-lg border-4 border-white"
                              />
                              <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-xl">
                                {getStatusIcon(donation.status)}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-3xl font-bold text-gray-800 mb-2">{donation.title}</h3>
                              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Package className="w-5 h-5" />
                                  <span className="font-medium">{donation.quantity || "—"} servings</span>
                                </div>
                                {donation.expiry_date && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>{new Date(donation.expiry_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Center: Details */}
                          <div className="space-y-4">
                            {donation.description && (
                              <p className="text-gray-700 leading-relaxed">{donation.description}</p>
                            )}
                            {donation.pickup_address && (
                              <div className="flex items-start gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                <span>{donation.pickup_address}</span>
                              </div>
                            )}
                            {donation.preferred_pickup_time && (
                              <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span>Preferred: {donation.preferred_pickup_time}</span>
                              </div>
                            )}
                          </div>

                          {/* Right: Actions */}
                          <div className="flex flex-col justify-center items-end gap-4">
                            <div className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg ${getStatusColor(donation.status)}`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </div>

                            <div className="flex gap-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(donation.id)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-3"
                              >
                                <Edit className="w-6 h-6" />
                                Edit
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(donation.id)}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-3"
                              >
                                <Trash2 className="w-6 h-6" />
                                Delete
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}