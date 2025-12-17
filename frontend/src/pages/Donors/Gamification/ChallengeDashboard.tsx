// src/pages/Donors/ChallengeDashboard.tsx — FULLY RESPONSIVE & EMOTIONAL
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame, Lock, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Challenge {
  id: number;
  title: string;
  description: string;
  points_reward: number;
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "upcoming" | "expired";
  completed: boolean;
  user_points_earned?: number;
}

export default function ChallengeDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const res = await api.get("/donors/challenges");
      setChallenges(res.data.challenges || []);
    } catch (err) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (id: number) => {
    try {
      await api.post(`/donors/challenges/${id}/complete`);
      toast.success("🎉 Challenge completed! Amazing work!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
      loadChallenges();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete challenge");
    }
  };

  const activeChallenges = challenges.filter(c => c.status === "active");
  const completedChallenges = challenges.filter(c => c.status === "completed");
  const totalPointsEarned = completedChallenges.reduce((sum, c) => sum + c.points_reward, 0);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active": return { 
        gradient: "from-orange-400 to-amber-500", 
        border: "border-orange-500",
        text: "text-orange-700",
        message: "On its way to making a difference"
      };
      case "completed": return { 
        gradient: "from-green-400 to-emerald-500", 
        border: "border-green-500",
        text: "text-green-800",
        message: "Completed with love ❤️"
      };
      case "upcoming": return { 
        gradient: "from-gray-300 to-gray-400", 
        border: "border-gray-400",
        text: "text-gray-600",
        message: "Coming soon"
      };
      default: return { gradient: "from-gray-200 to-gray-300", border: "border-gray-300", text: "text-gray-500", message: "Expired" };
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading your challenges...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} gravity={0.08} />}

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 mb-6">
              Rise to the Challenge
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-orange-700 max-w-4xl mx-auto px-4">
              Complete missions, earn points, and feed more families across Sri Lanka ❤️
            </p>
          </motion.div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl shadow-2xl p-6 sm:p-10 mb-12 sm:mb-16 text-center border-8 border-orange-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              <div>
                <Flame className="w-16 h-16 sm:w-20 sm:h-20 text-orange-600 mx-auto mb-4" />
                <p className="text-4xl sm:text-6xl font-extrabold text-orange-800">{activeChallenges.length}</p>
                <p className="text-lg sm:text-2xl text-orange-700 mt-3">Active Challenges</p>
              </div>
              <div>
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mx-auto mb-4" />
                <p className="text-4xl sm:text-6xl font-extrabold text-orange-800">{completedChallenges.length}</p>
                <p className="text-lg sm:text-2xl text-orange-700 mt-3">Completed</p>
              </div>
              <div>
                <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-amber-600 mx-auto mb-4" />
                <p className="text-4xl sm:text-6xl font-extrabold text-orange-800">{totalPointsEarned}</p>
                <p className="text-lg sm:text-2xl text-orange-700 mt-3">Points Earned</p>
              </div>
            </div>
          </motion.div>

          {/* Active Challenges */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-800 mb-8 sm:mb-10 text-center flex items-center justify-center gap-4">
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
              Active Challenges
            </h2>

            {activeChallenges.length === 0 ? (
              <motion.div className="text-center py-16 sm:py-20 bg-white/80 backdrop-blur rounded-3xl shadow-2xl">
                <Flame className="w-24 h-24 sm:w-32 sm:h-32 text-orange-300 mx-auto mb-8" />
                <p className="text-2xl sm:text-3xl text-orange-800 mb-4">No Active Challenges</p>
                <p className="text-lg sm:text-xl text-gray-700 px-4">New challenges coming soon — stay ready!</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {activeChallenges.map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-300/40 to-amber-300/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <Card className="relative rounded-3xl shadow-2xl border-8 border-orange-400 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 bg-gradient-to-r from-orange-500 to-amber-500" />

                      <CardContent className="p-6 sm:p-10 text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="inline-flex p-6 sm:p-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-3xl mb-6 sm:mb-8"
                        >
                          <Flame className="w-12 h-12 sm:w-20 sm:h-20" />
                        </motion.div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-4 sm:mb-6">
                          {challenge.title}
                        </h3>

                        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed px-2">
                          {challenge.description}
                        </p>

                        <div className="bg-orange-100 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                          <p className="text-4xl sm:text-5xl font-extrabold text-orange-700">
                            +{challenge.points_reward}
                          </p>
                          <p className="text-lg sm:text-xl text-orange-800 mt-2">Points Reward</p>
                        </div>

                        <p className="text-orange-700 italic text-sm sm:text-base mb-6 sm:mb-8">
                          {getStatusConfig(challenge.status).message}
                        </p>

                        <button
                          onClick={() => completeChallenge(challenge.id)}
                          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white py-4 sm:py-6 rounded-2xl text-lg sm:text-2xl font-bold shadow-2xl hover:shadow-3xl transition transform hover:scale-105"
                        >
                          Complete Challenge
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Challenges */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-8 sm:mb-10 text-center flex items-center justify-center gap-4">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              Completed Challenges
            </h2>

            {completedChallenges.length === 0 ? (
              <p className="text-center text-lg sm:text-xl text-gray-600">No completed challenges yet — your first victory awaits!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {completedChallenges.map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="rounded-3xl shadow-2xl border-8 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardContent className="p-6 sm:p-10 text-center">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="inline-flex p-6 sm:p-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-3xl mb-6 sm:mb-8"
                        >
                          <CheckCircle className="w-12 h-12 sm:w-20 sm:h-20" />
                        </motion.div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4 sm:mb-6">
                          {challenge.title}
                        </h3>

                        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                          {challenge.description}
                        </p>

                        <div className="bg-green-100 rounded-2xl p-4 sm:p-6">
                          <p className="text-4xl sm:text-5xl font-extrabold text-green-700">
                            +{challenge.points_reward}
                          </p>
                          <p className="text-lg sm:text-xl text-green-800 mt-2">Points Earned!</p>
                        </div>

                        <p className="text-green-700 italic text-sm sm:text-xl mt-6 sm:mt-8">
                          {getStatusConfig(challenge.status).message}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Challenges */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-8 sm:mb-10 text-center flex items-center justify-center gap-4">
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
              Upcoming Challenges
            </h2>

            {challenges.filter(c => c.status === "upcoming").length === 0 ? (
              <p className="text-center text-lg sm:text-xl text-gray-600">New challenges coming soon — stay excited!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {challenges.filter(c => c.status === "upcoming").map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="rounded-3xl shadow-2xl border-8 border-gray-300 bg-gray-50">
                      <CardContent className="p-6 sm:p-10 text-center">
                        <div className="inline-flex p-6 sm:p-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-3xl mb-6 sm:mb-8">
                          <Lock className="w-12 h-12 sm:w-20 sm:h-20" />
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4 sm:mb-6">
                          {challenge.title}
                        </h3>

                        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                          {challenge.description}
                        </p>

                        <p className="text-xl sm:text-2xl font-bold text-gray-700">
                          +{challenge.points_reward} points
                        </p>

                        <p className="text-gray-500 italic text-sm sm:text-base mt-4 sm:mt-6">
                          Starts soon
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}