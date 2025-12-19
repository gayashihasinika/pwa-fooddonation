// src/pages/Donors/StreakDashboard.tsx
import { useEffect, useState } from "react";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import { Flame, Heart, Sparkles, Award, Calendar, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";

interface StreakInfo {
  current_streak?: number;
  longest_streak?: number;
  monthly_streak?: number;
  last_action_date?: string;
}

export default function DonorStreak() {
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/donors/streak");
      setStreak(data.streak || {});
      setPoints(data.points || 0);
    } catch {
      toast.error("Failed to load your streak");
    } finally {
      setLoading(false);
    }
  };

  const processStreak = async () => {
    try {
      await api.post("/donors/streaks/process", { donation_at: new Date().toISOString() });
      toast.success("Streak updated! Keep the kindness going ❤️");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
      loadStreak();
    } catch {
      toast.error("Failed to update streak");
    }
  };

  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const monthlyStreak = streak?.monthly_streak || 0;

  const sevenDayProgress = Math.min(100, (currentStreak / 7) * 100);
  const monthlyProgress = Math.min(100, (monthlyStreak / 28) * 100);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading your streak...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.08} />}

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 mb-8">
              Your Daily Kindness Streak
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-orange-700 max-w-4xl mx-auto px-4">
              Every day you donate, a family eats. Keep the flame alive ❤️
            </p>
          </motion.div>

          {/* Current Streak - Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl shadow-3xl p-8 sm:p-12 mb-16 border-8 border-orange-300 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex p-10 sm:p-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-3xl mb-8"
            >
              <Flame className="w-20 h-20 sm:w-28 sm:h-28" />
            </motion.div>

            <p className="text-2xl sm:text-3xl text-orange-800 mb-4">Current Streak</p>
            <p className="text-6xl sm:text-8xl font-extrabold text-orange-800 mb-6">
              {currentStreak} <span className="text-3xl sm:text-5xl font-medium">days</span>
            </p>

            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-8 sm:h-10 overflow-hidden shadow-inner mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sevenDayProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              />
            </div>

            <p className="text-lg sm:text-xl text-orange-700">
              {currentStreak < 7
                ? `Just ${7 - currentStreak} more days to earn 50 bonus points!`
                : "Amazing! You're on fire 🔥"}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 10, y: 40 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-200"
            >
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-5xl font-extrabold text-orange-800">{longestStreak}</p>
              <p className="text-xl text-gray-700 mt-2">Longest Streak</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 10, y: 40 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-200"
            >
              <Calendar className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <p className="text-5xl font-extrabold text-orange-800">{monthlyStreak}</p>
              <p className="text-xl text-gray-700 mt-2">This Month</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 10, y: 40 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-200"
            >
              <Sparkles className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <p className="text-5xl font-extrabold text-orange-800">{points}</p>
              <p className="text-xl text-gray-700 mt-2">Total Points</p>
            </motion.div>
          </div>

          {/* Rewards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-3xl shadow-2xl p-8 sm:p-12 mb-16 border-8 border-rose-300"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-rose-800 text-center mb-10 flex items-center justify-center gap-4">
              <Award className="w-12 h-12 text-rose-600" />
              Streak Rewards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* 7-Day Reward */}
              <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-orange-300">
                <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-2xl mb-6">
                  <Zap className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold text-orange-800 mb-4">7-Day Giving Streak</h3>
                <p className="text-lg text-gray-700 mb-6">
                  Donate 7 days in a row and earn:
                </p>
                <p className="text-4xl font-extrabold text-orange-700 mb-4">
                  +50 Points
                </p>
                <p className="text-xl text-orange-600 italic">
                  ≈ Feeds 5 people 🍲
                </p>
                <div className="mt-6 w-full bg-gray-200 rounded-full h-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sevenDayProgress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full relative overflow-hidden"
                  >
                    <motion.span
                      className="absolute -right-2 top-0 w-4 h-4 bg-yellow-200 rounded-full"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                  </motion.div>

                </div>
              </div>

              {/* Monthly Reward */}
              <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-purple-300">
                <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl mb-6">
                  <Award className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-4">Monthly Champion</h3>
                <p className="text-lg text-gray-700 mb-6">
                  Donate 28+ days in a month:
                </p>
                <p className="text-4xl font-extrabold text-purple-700 mb-4">
                  +200 Points
                </p>
                <p className="text-xl text-purple-600 italic">
                  ≈ Feeds 20 people 🍲
                </p>
                <div className="mt-6 w-full bg-gray-200 rounded-full h-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${monthlyProgress}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                  >
                    <motion.span
                      className="absolute -right-2 top-0 w-4 h-4 bg-blue-700 rounded-full"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />

                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <div className="text-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={processStreak}
              className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-16 py-8 rounded-full text-2xl sm:text-3xl font-bold shadow-3xl flex items-center gap-6 mx-auto"
            >
              <Sparkles className="w-10 h-10" />
              Update My Streak
            </motion.button>
            <p className="text-gray-600 mt-4 text-lg">
              Streaks update automatically when you donate. Use this to check manually.
            </p>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl"
          >
            <h3 className="text-4xl font-bold mb-6">Every Day Matters</h3>
            <p className="text-2xl mb-8 opacity-90">
              Consistent kindness creates the biggest impact
            </p>
            <p className="text-xl opacity-80">
              Your daily donation helps reduce food waste and feed families across Sri Lanka
            </p>
            <div className="mt-10 text-7xl">🍲❤️🔥</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}