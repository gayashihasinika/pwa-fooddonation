// src/pages/Donors/BadgeDashboard.tsx — A CELEBRATION OF KINDNESS
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Crown, 
  Flame, 
  Zap, 
  Award,
  RefreshCw,
  Heart
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface Badge {
  id: number;
  code: string;
  title: string;
  description?: string;
  points_reward: number;
  earned: boolean;
}

export default function BadgeDashboard() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/donors/gamification");
      setBadges(data.badges || []);
      setPoints(data.points || 0);
    } catch (err: any) {
      toast.error("Failed to load your achievements");
    } finally {
      setLoading(false);
    }
  };

  const checkAndAssignBadges = async () => {
    setChecking(true);
    try {
      const { data } = await api.post("/donors/gamification/check-and-assign");
      
      if (data.awarded_badges && data.awarded_badges.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
        toast.success(`🎉 Congratulations! You earned ${data.awarded_badges.length} new badge(s)!`);
        fetchGamificationData();
      } else {
        toast("No new badges yet — keep donating! ❤️");
      }
    } catch (err: any) {
      toast.error("Failed to check badges");
    } finally {
      setChecking(false);
    }
  };

  // Calculate progress
  const earnedBadges = badges.filter(b => b.earned).length;
  const totalBadges = badges.length;
  const nextBadge = badges.find(b => !b.earned);

  const getBadgeIcon = (points: number, earned: boolean) => {
    if (points >= 500) return <Crown className={`w-20 h-20 ${earned ? "text-purple-600" : "text-gray-400"}`} />;
    if (points >= 200) return <Flame className={`w-20 h-20 ${earned ? "text-red-600" : "text-gray-400"}`} />;
    if (points >= 100) return <Trophy className={`w-20 h-20 ${earned ? "text-yellow-600" : "text-gray-400"}`} />;
    if (points >= 50) return <Zap className={`w-20 h-20 ${earned ? "text-blue-600" : "text-gray-400"}`} />;
    return <Star className={`w-20 h-20 ${earned ? "text-green-600" : "text-gray-400"}`} />;
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading your achievements...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.05} />}

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 mb-8">
              Your Journey of Kindness
            </h1>
            <p className="text-2xl md:text-3xl text-orange-700 max-w-4xl mx-auto">
              Every badge tells a story of hope. Every point brings a meal to someone in need ❤️
            </p>
          </motion.div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl shadow-2xl p-10 mb-16 text-center border-8 border-orange-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Heart className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <p className="text-5xl font-extrabold text-orange-800">{points}</p>
                <p className="text-2xl text-orange-700 mt-2">Points Earned</p>
              </div>
              <div>
                <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <p className="text-5xl font-extrabold text-orange-800">{earnedBadges}</p>
                <p className="text-2xl text-orange-700 mt-2">Badges Unlocked</p>
              </div>
              <div>
                <Sparkles className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                <p className="text-5xl font-extrabold text-orange-800">{totalBadges}</p>
                <p className="text-2xl text-orange-700 mt-2">Total Achievements</p>
              </div>
            </div>
          </motion.div>

          {/* Next Badge Highlight */}
          {nextBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl shadow-2xl p-10 mb-16 text-center border-8 border-purple-300"
            >
              <h3 className="text-3xl font-bold text-purple-800 mb-4">
                Next Badge: {nextBadge.title}
              </h3>
              <p className="text-xl text-purple-700 mb-6">
                {nextBadge.description || "Keep donating to unlock this achievement!"}
              </p>
              <div className="text-5xl font-bold text-purple-800">
                {nextBadge.points_reward} points needed
              </div>
              <p className="text-lg text-purple-600 mt-4">
                You're almost there! Just {nextBadge.points_reward - points} more points ❤️
              </p>
            </motion.div>
          )}

          {/* Check Badges Button */}
          <div className="text-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAndAssignBadges}
              disabled={checking}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-16 py-8 rounded-full text-3xl font-bold shadow-3xl flex items-center gap-6 mx-auto disabled:opacity-70"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-12 h-12 animate-spin" />
                  Checking for New Badges...
                </>
              ) : (
                <>
                  <Sparkles className="w-12 h-12" />
                  Check for New Achievements
                </>
              )}
            </motion.button>
          </div>

          {/* Badges Grid */}
          {badges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white/80 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Award className="w-40 h-40 text-orange-300 mx-auto mb-12" />
              <h2 className="text-5xl font-bold text-orange-800 mb-8">
                Your Journey Begins Here
              </h2>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto px-8">
                Every donation earns points and unlocks beautiful badges.<br />
                Your first achievement is waiting — start sharing food today! ❤️
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -20, scale: 1.08 }}
                    className="group relative"
                  >
                    {/* Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/50 to-orange-300/50 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className={`relative bg-white rounded-3xl shadow-3xl p-10 text-center border-8 ${badge.earned ? 'border-yellow-400' : 'border-gray-200'} overflow-hidden`}>
                      {/* Golden Ribbon for Earned */}
                      {badge.earned && (
                        <motion.div
                          initial={{ rotate: -45, x: -100 }}
                          animate={{ rotate: -30, x: 0 }}
                          className="absolute -top-4 -left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-12 py-3 rounded-full font-bold text-lg shadow-2xl"
                        >
                          EARNED! ✨
                        </motion.div>
                      )}

                      {/* Badge Icon with Pulse */}
                      <motion.div
                        animate={badge.earned ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: badge.earned ? Infinity : 0, duration: 2 }}
                        className="mb-8"
                      >
                        <div className={`inline-flex p-10 rounded-full bg-gradient-to-br ${badge.earned ? 'from-yellow-400 to-amber-500' : 'from-gray-300 to-gray-400'} text-white shadow-3xl`}>
                          {getBadgeIcon(badge.points_reward, badge.earned)}
                        </div>
                      </motion.div>

                      <h3 className={`text-3xl font-bold mb-4 ${badge.earned ? 'text-orange-800' : 'text-gray-400'}`}>
                        {badge.title}
                      </h3>

                      {badge.description && (
                        <p className={`text-lg mb-8 px-4 leading-relaxed ${badge.earned ? 'text-gray-700' : 'text-gray-400'}`}>
                          {badge.description}
                        </p>
                      )}

                      <div className="mb-8">
                        <p className={`text-5xl font-extrabold ${badge.earned ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600' : 'text-gray-400'}`}>
                          +{badge.points_reward}
                        </p>
                        <p className="text-xl text-gray-600">points</p>
                      </div>

                      <div className={`px-8 py-4 rounded-full font-bold text-xl ${badge.earned ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {badge.earned ? "Earned with love ❤️" : "Keep going!"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}