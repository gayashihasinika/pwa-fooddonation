// src/pages/Donors/PostDonation/PostDonationList.tsx — ALL ERRORS FIXED & WORKING
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
  XCircle,
  Search,
  Heart,
  Share2,
  Copy,
  X,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { format } from "date-fns";

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
  const [shareDonation, setShareDonation] = useState<Donation | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donors/my-donations");
        const data = res.data || [];
        setDonations(data);
        setFilteredDonations(data);
      } catch (err: any) {
        toast.error("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  useEffect(() => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter(d => d.status === activeFilter);
    }

    setFilteredDonations(filtered);
  }, [donations, searchTerm, activeFilter]);

  const handleEdit = (id: number) => {
    navigate(`/donors/post-donation/post-donation-edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id); // Open confirmation modal
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/donors/donations/${deleteId}`);
      toast.success("Donation removed successfully ❤️");
      setDonations(prev => prev.filter(d => d.id !== deleteId));
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete donation");
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const totalMealsThisMonth = donations
    .filter(d => d.expiry_date && new Date(d.expiry_date) > new Date())
    .reduce((sum, d) => sum + (d.quantity || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return { bg: "bg-emerald-100", text: "text-emerald-800", icon: <CheckCircle className="w-5 h-5" />, label: "Active" };
      case "claimed": return { bg: "bg-blue-100", text: "text-blue-800", icon: <Package className="w-5 h-5" />, label: "Claimed" };
      case "expired": return { bg: "bg-red-100", text: "text-red-800", icon: <XCircle className="w-5 h-5" />, label: "Expired" };
      default: return { bg: "bg-gray-100", text: "text-gray-800", icon: null, label: status };
    }
  };

  const openShareModal = (donation: Donation) => {
    setShareDonation(donation);
  };

  const closeShareModal = () => {
    setShareDonation(null);
  };

  const fullShareLink = shareDonation
    ? `https://${window.location.host}/donations/${shareDonation.id}`
    : "";

  const shareLink = shareDonation ? `${window.location.origin}/donations/${shareDonation.id}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-3xl text-orange-700">Loading your donations...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Analytics Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl shadow-2xl p-8 mb-12 text-center border-8 border-white"
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              My Donations
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/donors/post-donation/post-donation-add")}
              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-700 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transition flex items-center justify-center gap-4 mx-auto"
            >
              <Plus className="w-10 h-10" />
              Post New Donation
            </motion.button>
          </div>

          {/* Search + Filters */}
          <div className="mb-12 space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-8 h-8" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg rounded-full border-4 border-orange-200 focus:border-orange-500 focus:outline-none shadow-xl bg-white"
              />
            </div>

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
                  className={`px-8 py-4 rounded-full text-lg font-bold transition-all ${activeFilter === filter.key
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
            <div className="text-center py-20 bg-white/90 rounded-3xl shadow-2xl">
              <Package className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Donations Found</p>
              <p className="text-2xl text-gray-700 px-8">
                {searchTerm || activeFilter !== "all" ? "Try adjusting your search or filters" : "You haven't posted any donations yet"}
              </p>
              {!searchTerm && activeFilter === "all" && (
                <p className="text-xl text-orange-600 mt-8">Start by posting your first donation 🙏</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredDonations.map((donation) => {
                const status = getStatusBadge(donation.status);
                return (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white hover:shadow-3xl transition-all"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {donation.images?.[0] ? (
                        <img
                          src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                          alt={donation.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          <Package className="w-32 h-32 text-orange-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute top-4 right-4 ${status.bg} ${status.text} px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-orange-800 mb-4">{donation.title}</h3>

                      <div className="space-y-4 mb-6">
                        {donation.quantity && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Heart className="w-6 h-6 text-red-500" />
                            <span className="font-medium text-lg">{donation.quantity} servings</span>
                          </div>
                        )}
                        {donation.expiry_date && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Calendar className="w-6 h-6 text-orange-600" />
                            <span className="text-lg">Expires {format(new Date(donation.expiry_date), "dd MMM yyyy")}</span>
                          </div>
                        )}
                        {donation.pickup_address && (
                          <div className="flex items-start gap-3 text-gray-700">
                            <MapPin className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                            <span className="text-base">{donation.pickup_address}</span>
                          </div>
                        )}
                      </div>

                      {donation.description && (
                        <p className="text-gray-600 italic mb-6 line-clamp-3">"{donation.description}"</p>
                      )}

                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleEdit(donation.id)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:shadow-2xl transition"
                          >
                            <Edit className="w-5 h-5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(donation.id)} // ← Changed to open modal
                            className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:shadow-2xl transition"
                          >
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => openShareModal(donation)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:shadow-2xl transition"
                        >
                          <Share2 className="w-5 h-5" />
                          Share Donation
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Share Modal - NOW FULLY FIXED */}
        <AnimatePresence>
          {shareDonation && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={closeShareModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white rounded-3xl shadow-3xl p-8 w-full max-w-md border-8 border-white">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-orange-800">Share This Donation ❤️</h3>
                    <button onClick={closeShareModal} className="p-2 hover:bg-gray-100 rounded-xl transition">
                      <X className="w-8 h-8" />
                    </button>
                  </div>

                  <p className="text-center text-gray-700 mb-8 text-lg">
                    Help this food reach a family in need — share with kindness!
                  </p>

                  <div className="space-y-4">
                    {/* FIXED: Full https link + on its own line for perfect preview */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `A generous food donation is available on FeedSriLanka!\n\n` +
                        `"${shareDonation.title}"\n` +
                        `${shareDonation.quantity ? shareDonation.quantity + " servings\n" : ""}` +
                        `${shareDonation.description ? shareDonation.description + "\n\n" : "\n"}` +
                        `View & Claim Here:\n${fullShareLink}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-bold text-center shadow-xl transition text-xl flex items-center justify-center gap-3"
                    >
                      <Share2 className="w-8 h-8" />
                      Share on WhatsApp
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-center shadow-xl transition text-xl"
                    >
                      Share on Facebook
                    </a>

                    <button
                      onClick={copyLink}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-5 rounded-2xl font-bold shadow-xl transition text-xl flex items-center justify-center gap-3"
                    >
                      <Copy className="w-6 h-6" />
                      Copy Link
                    </button>
                  </div>

                  <button
                    onClick={closeShareModal}
                    className="mt-8 text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* CUSTOM DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
          {deleteId !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
              onClick={cancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-8 text-center border-8 border-orange-200"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl mb-6"
                >
                  ⚠️
                </motion.div>

                <h3 className="text-3xl font-extrabold text-orange-800 mb-4">
                  Are You Sure?
                </h3>

                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  This donation will be <span className="font-bold text-red-600">permanently removed</span>.<br />
                  Once deleted, it cannot be recovered.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={confirmDelete}
                    className="px-10 py-6 text-xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-3xl shadow-xl transition"
                  >
                    Yes, Delete It
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-10 py-6 text-xl font-bold border-4 border-orange-600 text-orange-700 hover:bg-orange-50 rounded-3xl transition"
                  >
                    No, Keep It
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-8">
                  Thank you for your kindness ❤️
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}