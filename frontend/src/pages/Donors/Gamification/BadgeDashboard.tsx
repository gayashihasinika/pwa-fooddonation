// src/pages/Donors/BadgeDashboard.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Crown, 
  Flame, 
  Zap, 
  Award,
  RefreshCw 
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
      console.error("Failed to load gamification data:", err);
      toast.error("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  const checkAndAssignBadges = async () => {
    setChecking(true);
    try {
      const { data } = await api.post("/donors/gamification/check-and-assign");
      
      if (data.awarded_badges && data.awarded_badges.length > 0) {
        toast.success(`New badge(s) earned!`);
        fetchGamificationData(); // Refresh with new badges
      } else {
        toast("No new badges earned yet");
      }
    } catch (err: any) {
      toast.error("Failed to check badges");
    } finally {
      setChecking(false);
    }
  };

  const getBadgeIcon = (points: number) => {
    if (points >= 500) return <Crown className="w-16 h-16" />;
    if (points >= 200) return <Flame className="w-16 h-16" />;
    if (points >= 100) return <Trophy className="w-16 h-16" />;
    if (points >= 50) return <Zap className="w-16 h-16" />;
    if (points >= 20) return <Star className="w-16 h-16" />;
    return <Sparkles className="w-16 h-16" />;
  };

  const getBadgeColor = (earned: boolean, points: number) => {
    if (!earned) return "from-gray-400 to-gray-600";
    if (points >= 500) return "from-purple-500 to-pink-500";
    if (points >= 200) return "from-orange-500 to-red-500";
    if (points >= 100) return "from-yellow-500 to-amber-600";
    if (points >= 50) return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-600";
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
              My Badges & Points
            </motion.h1>
            <p className="text-xl text-gray-700 mt-4">
              Earn points by donating • Unlock achievements • Become a top donor!
            </p>
          </div>

          {/* Points Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center mb-12"
          >
            <div className="inline-flex flex-col items-center bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border-4 border-white">
              <Award className="w-20 h-20 text-yellow-500 mb-4" />
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">
                {points}
              </div>
              <p className="text-2xl text-gray-700 mt-3">Total Points Earned</p>
            </div>
          </motion.div>

          {/* Check Badges Button */}
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAndAssignBadges}
              disabled={checking}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl flex items-center gap-4 mx-auto disabled:opacity-70"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Trophy className="w-8 h-8" />
                  Check for New Badges
                </>
              )}
            </motion.button>
          </div>

          {/* Badges Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-rose-500 border-t-transparent"></div>
            </div>
          ) : badges.length === 0 ? (
            <motion.div className="text-center py-20">
              <Trophy className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <p className="text-3xl text-gray-600">No badges yet</p>
              <p className="text-xl text-gray-500 mt-4">Start donating to earn your first badge!</p>
            </motion.div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 to-orange-400/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                    <div className={`relative bg-white rounded-3xl shadow-2xl p-10 text-center border-4 ${badge.earned ? 'border-yellow-400' : 'border-gray-200'} overflow-hidden`}>
                      {/* Top Gradient Bar */}
                      <div className={`absolute top-0 left-0 right-0 h-4 bg-gradient-to-r ${getBadgeColor(badge.earned, badge.points_reward)}`}></div>

                      {/* Badge Icon */}
                      <div className="mb-8">
                        <div className={`inline-flex p-8 rounded-full bg-gradient-to-br ${getBadgeColor(badge.earned, badge.points_reward)} text-white shadow-2xl ${badge.earned ? 'animate-pulse' : 'opacity-60'}`}>
                          {getBadgeIcon(badge.points_reward)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold mb-3 ${badge.earned ? 'text-gray-800' : 'text-gray-400'}`}>
                        {badge.title}
                      </h3>

                      {/* Description */}
                      {badge.description && (
                        <p className={`text-sm mb-6 px-4 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                          {badge.description}
                        </p>
                      )}

                      {/* Points */}
                      <div className="mb-6">
                        <div className={`text-4xl font-bold ${badge.earned ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600' : 'text-gray-400'}`}>
                          {badge.points_reward}
                        </div>
                        <p className="text-lg text-gray-600">points</p>
                      </div>

                      {/* Status */}
                      <div className={`px-6 py-3 rounded-full font-bold text-lg ${badge.earned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {badge.earned ? "Earned" : "Locked"}
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