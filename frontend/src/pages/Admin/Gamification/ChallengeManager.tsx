// src/pages/Admin/Gamification/ChallengeManager.tsx — POPUP FORM PERFECTLY FIXED & RESPONSIVE
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  X,
  Edit,
  Trash2,
  Trophy,
  Calendar,
  Zap,
  CheckCircle,
  Plus,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { format } from "date-fns";

interface Challenge {
  id: number;
  title: string;
  description?: string;
  points_reward: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

export default function ChallengeManager() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points_reward: "",
    start_date: "",
    end_date: "",
    active: true,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/gamification");
      setChallenges(data.challenges || []);
    } catch {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      points_reward: "",
      start_date: "",
      end_date: "",
      active: true,
    });
    setEditingChallenge(null);
  };

  const openEditModal = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description || "",
      points_reward: challenge.points_reward.toString(),
      start_date: challenge.start_date || "",
      end_date: challenge.end_date || "",
      active: challenge.active,
    });
    setShowForm(true);
  };

  const handleSaveChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.points_reward) {
      toast.error("Title and points are required");
      return;
    }

    try {
      if (editingChallenge) {
        await api.put(`/admin/gamification/challenge/${editingChallenge.id}`, {
          title: formData.title,
          description: formData.description || null,
          points_reward: parseInt(formData.points_reward),
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          active: formData.active,
        });
        toast.success("Challenge updated! 🎉");
      } else {
        await api.post("/admin/gamification/challenge", {
          title: formData.title,
          description: formData.description || null,
          points_reward: parseInt(formData.points_reward),
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          active: formData.active,
        });
        toast.success("Challenge created! ✨");
      }
      setShowForm(false);
      resetForm();
      fetchChallenges();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this challenge permanently?")) return;
    try {
      await api.delete(`/admin/gamification/challenge/${id}`);
      toast.success("Challenge deleted");
      fetchChallenges();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (challenge: Challenge) => {
    try {
      await api.put(`/admin/gamification/challenge/${challenge.id}`, {
        ...challenge,
        active: !challenge.active,
      });
      toast.success(`Challenge ${!challenge.active ? "activated" : "deactivated"}`);
      fetchChallenges();
    } catch {
      toast.error("Failed to update status");
    }
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
              src="https://tzuchi-en-backend.storage.googleapis.com/content/images/2024/10/2-800-6.jpg"
              alt="Volunteers delivering food to families"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://www.zakat.org/img/asset/cHVibGljLzIwMjUvMDIvc3JpbGFua2EtanVtYm90cm9uLWNvcHkuanBn/srilanka-jumbotron-copy.jpg?w=960&h=540&fit=crop-45-26-1&fm=webp&q=60&filt=0&s=ba1f8600c7004d733f9060e4179fcf1a"
              alt="Charity food distribution in Sri Lanka"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://thumbs.dreamstime.com/b/traditional-sri-lankan-rice-curry-delight-lanka-food-photography-vibrant-colors-close-up-culinary-art-plate-showcases-367913327.jpg"
              alt="Traditional Sri Lankan rice and curry"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Create Challenges to Inspire Giving ❤️
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Motivate donors with special events and rewards ({challenges.length} challenges)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-6 rounded-3xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition"
            >
              <Plus className="w-8 h-8" />
              Create New Challenge
            </motion.button>

            <button
              onClick={() => window.location.href = "/admin/gamification/challenges/completed"}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-6 rounded-3xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition"
            >
              <Trophy className="w-8 h-8" />
              View Completed Challenges
            </button>
          </div>

          {/* Challenges Grid */}
          {loading ? (
            <div className="text-center py-32">
              <Zap className="w-32 h-32 text-orange-300 mx-auto mb-8 animate-pulse" />
              <p className="text-3xl text-orange-700">Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Trophy className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Challenges Yet</p>
              <p className="text-2xl text-gray-700 px-8">
                Create exciting challenges to boost donations during special times!
              </p>
              <p className="text-xl text-orange-600 mt-8">Every challenge brings more meals to families 🙏</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white hover:shadow-3xl transition-all"
                >
                  <div className="h-4 bg-gradient-to-r from-orange-500 to-amber-600" />

                  <div className="p-8 text-center">
                    <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white mb-6 shadow-xl">
                      <Trophy className="w-12 h-12" />
                    </div>

                    <h3 className="text-2xl font-bold text-orange-800 mb-4">{challenge.title}</h3>

                    {challenge.description && (
                      <p className="text-gray-600 mb-6 text-base">{challenge.description}</p>
                    )}

                    <div className="text-5xl font-extrabold text-orange-700 mb-4">
                      {challenge.points_reward} pts
                    </div>

                    <p className="text-gray-600 mb-6">Reward for completing</p>

                    {challenge.start_date && challenge.end_date && (
                      <div className="flex items-center justify-center gap-3 text-gray-700 mb-6">
                        <Calendar className="w-6 h-6" />
                        <span className="text-base">
                          {format(new Date(challenge.start_date), "dd MMM")} → {format(new Date(challenge.end_date), "dd MMM yyyy")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-center mb-8">
                      <span className={`px-6 py-3 rounded-full text-lg font-bold border-2 ${challenge.active ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-gray-100 text-gray-600 border-gray-300"}`}>
                        {challenge.active ? "Active Now" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openEditModal(challenge)}
                        className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition"
                      >
                        <Edit className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => toggleActive(challenge)}
                        className={`p-4 ${challenge.active ? "bg-yellow-500 hover:bg-yellow-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white rounded-2xl shadow-xl hover:shadow-2xl transition`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleDelete(challenge.id)}
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

          {/* FINAL FIXED POPUP FORM */}
          <AnimatePresence>
            {showForm && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/70 z-40"
                  onClick={() => setShowForm(false)}
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
                  <div className="bg-white w-full max-w-md rounded-3xl shadow-3xl border-8 border-white max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white rounded-t-3xl">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">
                          {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
                        </h2>
                        <button
                          onClick={() => setShowForm(false)}
                          className="p-2 hover:bg-white/20 rounded-xl transition"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <form onSubmit={handleSaveChallenge} className="space-y-5">
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Challenge Title *
                          </label>
                          <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            placeholder="Vesak Donation Challenge"
                          />
                        </div>

                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base resize-none"
                            placeholder="Double points for donations during Vesak!"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-base font-bold text-gray-700 mb-2">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={formData.start_date}
                              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-base font-bold text-gray-700 mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={formData.end_date}
                              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-2">
                            Points Reward *
                          </label>
                          <input
                            required
                            type="number"
                            min="1"
                            value={formData.points_reward}
                            onChange={(e) => setFormData({ ...formData, points_reward: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-base"
                            placeholder="200"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <label htmlFor="active" className="text-base font-medium text-gray-700">
                            Make this challenge active
                          </label>
                        </div>
                      </form>
                    </div>

                    {/* Fixed Footer Buttons */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-2xl hover:bg-gray-100 font-bold text-base transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          onClick={handleSaveChallenge}
                          className="flex-1 px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition"
                        >
                          {editingChallenge ? "Update" : "Create"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl">
            <img
              src="https://c8.alamy.com/comp/G5JP7N/rice-and-curry-sri-lankan-cuisine-G5JP7N.jpg"
              alt="Traditional Sri Lankan rice and curry shared with love"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka Challenges ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              Special events bring extra generosity
            </p>
            <p className="text-2xl opacity-80">
              Thank you for inspiring donors during important times
            </p>
            <div className="mt-12 text-8xl">🍲🙏✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}