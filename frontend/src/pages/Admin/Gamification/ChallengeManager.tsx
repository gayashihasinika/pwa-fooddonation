// src/pages/Admin/Gamification/ChallengeManager.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { X, Edit, Trash2, Trophy, Calendar, Zap, CheckCircle } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

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
    } catch (error: any) {
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
        toast.success("Challenge updated!");
      } else {
        await api.post("/admin/gamification/challenge", {
          title: formData.title,
          description: formData.description || null,
          points_reward: parseInt(formData.points_reward),
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          active: formData.active,
        });
        toast.success("Challenge created!");
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-100 py-8 px-4">
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
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 mb-4"
            >
              Challenges & Events
            </motion.h1>
            <p className="text-xl text-gray-700">
              Create exciting challenges to boost donor engagement
            </p>
          </div>

          {/* Create Button */}
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl flex items-center gap-4 mx-auto"
            >
              Create New Challenge
            </motion.button>

            <div className="text-center mb-6">
  <button
    onClick={() => window.location.href = "/admin/gamification/challenges/completed"}
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition"
  >
    View Completed Challenges
  </button>
</div>

          </div>

          {/* Challenges Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-rose-500 border-t-transparent"></div>
            </div>
          ) : challenges.length === 0 ? (
            <motion.div className="text-center py-20">
              <Zap className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-2xl text-gray-500">No challenges yet</p>
              <p className="text-gray-400 mt-2">Create your first challenge to motivate donors!</p>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-4 border-white overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                      <div className="text-center">
                        <div className="mb-6">
                          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl">
                            <Trophy className="w-12 h-12" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{challenge.title}</h3>

                        {challenge.description && (
                          <p className="text-gray-600 text-sm mb-6 line-clamp-3">{challenge.description}</p>
                        )}

                        <div className="mb-6">
                          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            {challenge.points_reward}
                          </div>
                          <p className="text-gray-600">points reward</p>
                        </div>

                        {challenge.start_date && challenge.end_date && (
                          <div className="mb-6 text-sm text-gray-600 flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(challenge.start_date).toLocaleDateString()} → {new Date(challenge.end_date).toLocaleDateString()}
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-3 mb-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${challenge.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                            {challenge.active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex gap-3 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(challenge)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleActive(challenge)}
                            className={`${challenge.active ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-white p-4 rounded-2xl shadow-lg`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(challenge.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
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

      {/* MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-3 hover:bg-gray-100 rounded-2xl">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <form onSubmit={handleSaveChallenge} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3">Challenge Title *</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                    placeholder="Ramadan Donation Drive"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition resize-none"
                    placeholder="Donate during Ramadan and earn double points!"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold mb-3">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-3">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Points Reward *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.points_reward}
                    onChange={(e) => setFormData({ ...formData, points_reward: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                    placeholder="200"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-6 h-6 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <label htmlFor="active" className="text-lg font-medium text-gray-700">
                    Challenge is Active
                  </label>
                </div>

                <div className="flex gap-4 justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-semibold hover:bg-gray-50 transition text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white rounded-2xl font-bold text-lg shadow-2xl transition"
                  >
                    {editingChallenge ? "Update Challenge" : "Create Challenge"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthenticatedLayout>
  );
}