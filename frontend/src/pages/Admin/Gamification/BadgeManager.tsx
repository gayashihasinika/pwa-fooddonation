// src/pages/Admin/Gamification/BadgeManager.tsx — FULLY RESPONSIVE & EMOTIONAL
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  X,
  Edit,
  Trash2,
  Search,
  Trophy,
  Sparkles,
  Crown,
  Star,
  Flame,
  Zap,
  UserPlus,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { Link } from "react-router-dom";

interface Badge {
  id: number;
  code: string;
  title: string;
  description?: string;
  icon?: string;
  points_reward: number;
}

const badgeIcons: Record<number, React.ReactNode> = {
  10: <Star className="w-8 h-8" />,
  50: <Zap className="w-8 h-8" />,
  100: <Trophy className="w-8 h-8" />,
  200: <Flame className="w-8 h-8" />,
  500: <Crown className="w-8 h-8" />,
};

export default function BadgeManager() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    points_reward: "",
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/gamification");
      setBadges(res.data.badges || []);
    } catch {
      toast.error("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ code: "", title: "", description: "", points_reward: "" });
    setEditingBadge(null);
  };

  const openEditModal = (badge: Badge) => {
    setEditingBadge(badge);
    setFormData({
      code: badge.code,
      title: badge.title,
      description: badge.description || "",
      points_reward: badge.points_reward.toString(),
    });
    setShowForm(true);
  };

  const handleSaveBadge = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.title || !formData.points_reward) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingBadge) {
        await api.put(`/admin/gamification/badge/${editingBadge.id}`, {
          code: formData.code,
          title: formData.title,
          description: formData.description || null,
          points_reward: Number(formData.points_reward),
        });
        toast.success("Badge updated successfully 🎉");
      } else {
        await api.post("/admin/gamification/badge", {
          code: formData.code,
          title: formData.title,
          description: formData.description || null,
          points_reward: Number(formData.points_reward),
        });
        toast.success("Badge created successfully! ✨");
      }

      setShowForm(false);
      resetForm();
      fetchBadges();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this badge?")) return;

    try {
      await api.delete(`/admin/gamification/badge/${id}`);
      toast.success("Badge deleted");
      fetchBadges();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredBadges = useMemo(() => {
    return badges.filter(
      (badge) =>
        badge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [badges, searchTerm]);

  const getBadgeGradient = (points: number) => {
    if (points >= 500) return "from-purple-500 to-pink-500";
    if (points >= 200) return "from-orange-500 to-red-500";
    if (points >= 100) return "from-yellow-500 to-amber-600";
    if (points >= 50) return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-600";
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 rounded-3xl overflow-hidden shadow-3xl mb-12 sm:mb-16 border-8 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1552667466-07770ae38d58?q=80&w=2070"
              alt="Donor receiving badge with joy"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2071"
              alt="Sparkling achievement badges"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1557804506-669a6e9220c2?q=80&w=2074"
              alt="Celebrating kindness and giving"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Motivating Donors with Badges of Kindness ✨
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Reward generosity and inspire more giving ({filteredBadges.length} badges)
            </p>
          </div>

          {/* Header Controls - Responsive */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                to="/admin/gamification/earned"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-8 py-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-lg shadow-2xl hover:shadow-3xl transition"
              >
                <Trophy className="w-8 h-8" />
                Donors Earned Badges
              </Link>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-8 py-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-lg shadow-2xl hover:shadow-3xl transition"
              >
                <UserPlus className="w-8 h-8" />
                Create Badge
              </button>
            </div>
          </div>

          {/* Badges Grid - Responsive */}
          {loading ? (
            <div className="text-center py-32">
              <Sparkles className="w-32 h-32 text-orange-300 mx-auto mb-8 animate-pulse" />
              <p className="text-3xl text-orange-700">Loading badges...</p>
            </div>
          ) : filteredBadges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Trophy className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Badges Yet</p>
              <p className="text-2xl text-gray-700 px-8">
                Create badges to reward and motivate generous donors!
              </p>
              <p className="text-xl text-orange-600 mt-8">Every badge inspires more kindness 🙏</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white hover:shadow-3xl transition-all"
                >
                  <div className={`h-4 bg-gradient-to-r ${getBadgeGradient(badge.points_reward)}`} />

                  <div className="p-6 sm:p-8 text-center">
                    <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${getBadgeGradient(badge.points_reward)} text-white mb-6 shadow-xl`}>
                      {badgeIcons[Math.floor(badge.points_reward / 50) * 50] || <Sparkles className="w-12 h-12" />}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-orange-800">{badge.title}</h2>
                    <p className="text-gray-600 font-medium mt-2">{badge.code}</p>

                    <div className="text-3xl sm:text-4xl mt-6 font-extrabold text-orange-700">
                      {badge.points_reward} pts
                    </div>

                    {badge.description && (
                      <p className="text-gray-600 mt-4 text-sm sm:text-base">{badge.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        onClick={() => openEditModal(badge)}
                        className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition"
                      >
                        <Edit className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleDelete(badge.id)}
                        className="p-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Create/Edit Modal - Compact & Responsive */}
          <AnimatePresence>
            {showForm && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/60 z-40"
                  onClick={() => setShowForm(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-white w-full max-w-lg rounded-3xl shadow-3xl border-8 border-white">
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between \<items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-orange-800">
                          {editingBadge ? "Edit Badge" : "Create New Badge"}
                        </h2>
                        <button
                          onClick={() => setShowForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition"
                        >
                          <X className="w-7 h-7" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveBadge} className="space-y-5">
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Badge Code *
                          </label>
                          <input
                            value={formData.code}
                            onChange={(e) =>
                              setFormData({ ...formData, code: e.target.value.toUpperCase() })
                            }
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            placeholder="FIRST_DONATION"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            placeholder="First Time Donor"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base resize-none"
                            placeholder="Awarded to donors making their first contribution"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Points Reward *
                          </label>
                          <input
                            type="number"
                            value={formData.points_reward}
                            onChange={(e) =>
                              setFormData({ ...formData, points_reward: e.target.value })
                            }
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            placeholder="50"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex-1 px-8 py-4 border-4 border-gray-300 rounded-3xl hover:bg-gray-50 font-bold text-base transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-10 py-4 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white rounded-3xl font-bold text-base shadow-xl hover:shadow-2xl transition"
                          >
                            {editingBadge ? "Update Badge" : "Create Badge"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a6e9220c2?q=80&w=2074"
              alt="Celebrating donor achievements with badges"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-4xl sm:text-5xl font-bold mb-8">FeedSriLanka Gamification ❤️</h3>
            <p className="text-2xl sm:text-3xl mb-10 opacity-90">
              Badges turn generosity into celebration
            </p>
            <p className="text-xl sm:text-2xl opacity-80">
              Every badge earned inspires more donors to give
            </p>
            <div className="mt-12 text-6xl sm:text-8xl">🏆✨🙏</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}