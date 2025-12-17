// src/pages/Donors/PostDonation/PostDonationList.tsx — EXAMINER-IMPRESSING VERSION
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
  MapPin,
  CheckCircle,
  Package as PackageIcon,
  XCircle,
  Search,
  Heart
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface Donation {
  id: number;
  title: string;
  description?: string;
  quantity?: number;
  expiry_date?: string;
  status: "active" | "claimed" | "expired";
  pickup_address?: string;
  preferred_pickup_time?: string;
  images?: { id: number; image_path: string }[];
}

export default function PostDonationList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "claimed" | "expired">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donors/my-donations");
        setDonations(res.data || []);
        setFilteredDonations(res.data || []);
      } catch (err: any) {
        toast.error("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = donations;

    // Search by title
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(d => d.status === activeFilter);
    }

    setFilteredDonations(filtered);
  }, [donations, searchTerm, activeFilter]);

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

  const totalMealsThisMonth = donations
  .filter(d => d.expiry_date && new Date(d.expiry_date) > new Date())
  .reduce((sum, d) => sum + (d.quantity || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="w-5 h-5" />, label: "Active" };
      case "claimed": return { bg: "bg-blue-100", text: "text-blue-800", icon: <PackageIcon className="w-5 h-5" />, label: "Claimed" };
      case "expired": return { bg: "bg-red-100", text: "text-red-800", icon: <XCircle className="w-5 h-5" />, label: "Expired" };
      default: return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: status };
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

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Analytics Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl shadow-2xl p-8 mb-12 text-center border-4 border-orange-300"
          >
            <p className="text-3xl md:text-4xl font-extrabold text-orange-800">
              You’ve donated <span className="text-5xl md:text-6xl text-red-600">{totalMealsThisMonth}</span> meals this month ❤️
            </p>
            <p className="text-xl md:text-2xl text-orange-700 mt-4">
              Thank you for feeding families and reducing food waste!
            </p>
          </motion.div>

          {/* Hero + Add Button */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-orange-800 mb-6">
              My Donations
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/donors/post-donation/post-donation-add")}
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-12 py-6 rounded-full text-2xl md:text-3xl font-bold shadow-2xl hover:shadow-3xl transition w-full max-w-lg"
            >
              <Plus className="w-10 h-10 md:w-12 md:h-12 inline mr-4" />
              Post New Donation
            </motion.button>
          </div>

          {/* Search + Filters */}
          <div className="mb-12 space-y-6">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-8 h-8" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg rounded-full border-4 border-orange-200 focus:border-orange-500 focus:outline-none shadow-xl"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { key: "all", label: "All Donations" },
                { key: "active", label: "Active" },
                { key: "claimed", label: "Claimed" },
                { key: "expired", label: "Expired" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`px-8 py-4 rounded-full text-lg font-bold transition-all ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xl"
                      : "bg-white text-orange-700 border-4 border-orange-200 hover:border-orange-400 shadow-lg"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Donations Grid */}
          {filteredDonations.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-32 h-32 text-orange-300 mx-auto mb-8" />
              <p className="text-3xl text-orange-700">No matching donations</p>
              <p className="text-xl text-gray-600 mt-4">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {filteredDonations.map((donation, index) => {
                  const status = getStatusBadge(donation.status);
                  return (
                    <motion.div
                      key={donation.id}
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white hover:shadow-3xl transition-all"
                    >
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        {donation.images?.[0] ? (
                          <img
                            src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                            alt={donation.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                            <Package className="w-24 h-24 text-orange-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className={`absolute top-4 right-4 ${status.bg} ${status.text} px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg`}>
                          {status.icon}
                          {status.label}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-orange-800 mb-4 line-clamp-2">{donation.title}</h3>

                        <div className="space-y-4 mb-6">
                          {donation.quantity && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <Heart className="w-6 h-6 text-red-500" />
                              <span className="font-medium">{donation.quantity} servings</span>
                            </div>
                          )}
                          {donation.expiry_date && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <Calendar className="w-6 h-6 text-orange-600" />
                              <span>Expires {new Date(donation.expiry_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {donation.pickup_address && (
                            <div className="flex items-start gap-3 text-gray-700">
                              <MapPin className="w-6 h-6 text-orange-600 mt-1" />
                              <span className="text-sm">{donation.pickup_address}</span>
                            </div>
                          )}
                        </div>

                        {donation.description && (
                          <p className="text-gray-600 italic line-clamp-3 mb-6">"{donation.description}"</p>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(donation.id)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"
                          >
                            <Edit className="w-5 h-5" />
                            Edit
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(donation.id)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}