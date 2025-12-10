import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Plus, X, Edit, Trash2, Search, Trophy, Sparkles, Crown, Star, Flame, Zap } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface Badge {
  id: number;
  code: string;
  title: string;
  description?: string;
  icon?: string;
  points_reward: number;
}

const badgeIcons: Record<number, React.ReactNode> = {
  10: <Star className="w-6 h-6" />,
  50: <Zap className="w-6 h-6" />,
  100: <Trophy className="w-6 h-6" />,
  200: <Flame className="w-6 h-6" />,
  500: <Crown className="w-6 h-6" />,
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

  // ------------------ FETCH BADGES ------------------
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

  // ------------------ CRUD HANDLERS ------------------
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
        toast.success("Badge updated successfully");
      } else {
        await api.post("/admin/gamification/badge", {
          code: formData.code,
          title: formData.title,
          description: formData.description || null,
          points_reward: Number(formData.points_reward),
        });
        toast.success("Badge created successfully");
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

  // ------------------ FILTER ------------------
  const filteredBadges = useMemo(() => {
    return badges.filter(
      (b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [badges, searchTerm]);

  const getBadgeGradient = (points: number) => {
    if (points >= 500) return "from-purple-500 to-pink-500";
    if (points >= 200) return "from-orange-500 to-red-500";
    if (points >= 100) return "from-yellow-500 to-amber-600";
    if (points >= 50) return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-600";
  };

  // ==============================================================
  return (
    <AuthenticatedLayout>
      <div className="p-6 min-h-screen">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Badge Management</h1>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl flex gap-2 items-center font-semibold shadow-lg"
          >
            <Plus /> Create Badge
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 border rounded-xl"
            />
          </div>
        </div>

        {/* BADGES GRID */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            No badges created yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <div key={badge.id} className="bg-white shadow-xl p-6 rounded-2xl border">
                <div className={`h-2 rounded-full mb-4 bg-gradient-to-r ${getBadgeGradient(badge.points_reward)}`} />

                <div className="text-center">
                  <div className="mb-4 inline-flex p-4 rounded-full bg-gray-100">
                    {badgeIcons[Math.floor(badge.points_reward / 50) * 50] || <Sparkles />}
                  </div>

                  <h2 className="text-xl font-bold">{badge.title}</h2>
                  <p className="text-gray-500 text-sm">{badge.code}</p>

                  <div className="text-3xl mt-4 font-bold text-rose-600">
                    {badge.points_reward} pts
                  </div>

                  <p className="text-gray-600 mt-3 text-sm">{badge.description}</p>

                  {/* ACTIONS */}
                  <div className="flex justify-center gap-3 mt-6">
                    <button
                      onClick={() => openEditModal(badge)}
                      className="p-3 bg-blue-600 text-white rounded-xl"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(badge.id)}
                      className="p-3 bg-red-600 text-white rounded-xl"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
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
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-2xl">
                  <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">
                      {editingBadge ? "Edit Badge" : "Create Badge"}
                    </h2>
                    <X onClick={() => setShowForm(false)} className="cursor-pointer" />
                  </div>

                  <form onSubmit={handleSaveBadge} className="mt-6 space-y-6">
                    <div>
                      <label className="font-semibold">Badge Code *</label>
                      <input
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value.toUpperCase() })
                        }
                        className="w-full p-3 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Title *</label>
                      <input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-3 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full p-3 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-semibold">Points Reward *</label>
                      <input
                        type="number"
                        value={formData.points_reward}
                        onChange={(e) =>
                          setFormData({ ...formData, points_reward: e.target.value })
                        }
                        className="w-full p-3 border rounded-xl"
                      />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-3 border rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-rose-600 text-white rounded-xl"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}
