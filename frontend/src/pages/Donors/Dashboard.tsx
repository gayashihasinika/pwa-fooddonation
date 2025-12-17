// frontend/src/pages/Donors/Dashboard.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { toast } from "react-hot-toast";
import {
  Plus, Trophy, Flame, Crown, Award, Package, Heart
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import api from "@/lib/api";

interface User { id: number; name: string | null; email: string; }
interface Donation {
  id: number;
  title: string;
  expiry_date: string;
  status: "active" | "expired" | "claimed";
  images?: { image_path: string }[];
}
interface Badge { id: number; title: string; unlocked: boolean; threshold: number; }
interface TrackerData {
  streakDays: number;
  badges: Badge[];
  points: number;
  rank: number;
  totalDonations: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [tracker, setTracker] = useState<TrackerData>({
    streakDays: 0, badges: [], points: 0, rank: 0, totalDonations: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userRes = await api.get("/users/me");
        setCurrentUser(userRes.data);

        const [donationsRes, dashboardRes] = await Promise.all([
          api.get("/donors/my-donations"),
          api.get("/donors/dashboard")
        ]);

        setDonations(donationsRes.data || []);
        setTracker({
          streakDays: dashboardRes.data.streakDays || 0,
          badges: dashboardRes.data.badges || [],
          points: dashboardRes.data.points || 0,
          rank: dashboardRes.data.rank || 0,
          totalDonations: donationsRes.data.length || 0,
        });

        if (dashboardRes.data.newBadgeUnlocked) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        }
      } catch (err) {
        toast.error("Failed to load dashboard");
      }
    };
    fetchAll();
  }, []);

  const activeDonations = donations.filter(d => d.status === "active");
  const completedDonations = donations.filter(d => d.status !== "active");
  const nextBadge = tracker.badges.find(b => !b.unlocked);
  const progress = nextBadge ? (tracker.points / nextBadge.threshold) * 100 : 100;

  if (!currentUser) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-gray-600">Loading your dashboard...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Hero Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-orange-800 mb-4 md:mb-6">
              Welcome back,<br className="sm:hidden" /> {currentUser.name?.split(" ")[0] || "Kind Hero"}! ❤️
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-orange-700 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              Your kindness is feeding families today
              {tracker.streakDays > 0 && (
                <span className="flex items-center gap-2 mt-3 sm:mt-0">
                  <Flame className="w-8 h-8 md:w-10 md:h-10 text-red-500 animate-pulse" />
                  <span className="font-bold text-base sm:text-lg md:text-xl">
                    {tracker.streakDays}-day streak!
                  </span>
                </span>
              )}
            </p>
          </motion.div>

          {/* Quick Action */}
          <div className="text-center mb-10 md:mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/donors/post-donation/post-donation-add")}
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white w-full max-w-sm sm:max-w-md px-10 py-6 sm:px-14 sm:py-8 rounded-full text-xl sm:text-2xl md:text-3xl font-bold shadow-2xl hover:shadow-3xl transition transform"
            >
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 inline mr-3 md:mr-4" />
              Post New Donation
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 md:mb-20">
            {/* Total Donations */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-white"
            >
              <div className="inline-flex p-4 md:p-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-xl mb-4">
                <Heart className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
                <CountUp end={tracker.totalDonations} duration={2.5} />
              </div>
              <p className="text-sm sm:text-base md:text-xl text-gray-700 font-medium">Total Donations</p>
            </motion.div>

            {/* Points Earned */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-white"
            >
              <div className="inline-flex p-4 md:p-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-xl mb-4">
                <Trophy className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
                <CountUp end={tracker.points} duration={2.5} />
              </div>
              <p className="text-sm sm:text-base md:text-xl text-gray-700 font-medium">Points Earned</p>
            </motion.div>

            {/* Your Rank */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-white"
            >
              <div className="inline-flex p-4 md:p-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-xl mb-4">
                <Crown className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
                <span className="text-2xl md:text-4xl">#</span>
                <CountUp end={tracker.rank} duration={2.5} />
              </div>
              <p className="text-sm sm:text-base md:text-xl text-gray-700 font-medium">Your Rank</p>
            </motion.div>

            {/* Badges Unlocked */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-white"
            >
              <div className="inline-flex p-4 md:p-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl mb-4">
                <Award className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
                <CountUp end={tracker.badges.filter(b => b.unlocked).length} duration={2.5} />
              </div>
              <p className="text-sm sm:text-base md:text-xl text-gray-700 font-medium">Badges Unlocked</p>
            </motion.div>
          </div>

          {/* Next Badge Progress */}
          {nextBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-3xl shadow-2xl p-6 md:p-12 mb-12 md:mb-20 border-8 border-yellow-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-amber-800">Next Badge: {nextBadge.title}</h3>
                  <p className="text-base md:text-xl text-gray-700 mt-2">You're almost there!</p>
                </div>
                <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-600 animate-bounce" />
              </div>
              <div className="bg-gray-200 rounded-full h-8 md:h-12 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-inner"
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between mt-4 text-base md:text-xl gap-4 text-center md:text-left">
                <span className="font-bold text-gray-800">{tracker.points} points earned</span>
                <span className="font-bold text-amber-700">{nextBadge.threshold - tracker.points} more needed</span>
              </div>
            </motion.div>
          )}

          {/* My Donations */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-8 md:mb-12 text-center flex items-center justify-center gap-4">
              <Package className="w-10 h-10 md:w-12 md:h-12" />
              My Donations
            </h2>

            {activeDonations.length === 0 && completedDonations.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-24 h-24 md:w-32 md:h-32 text-gray-300 mx-auto mb-8" />
                <p className="text-xl md:text-2xl text-gray-600">No donations yet</p>
                <p className="text-base md:text-xl text-gray-500 mt-4">Your first donation will appear here!</p>
              </div>
            ) : (
              <>
                {/* Active Donations */}
                {activeDonations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
                    {activeDonations.map((donation) => (
                      <motion.div
                        key={donation.id}
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl overflow-hidden shadow-xl border-4 border-orange-200"
                      >
                        {donation.images?.[0] ? (
                          <img
                            src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                            alt={donation.title}
                            className="w-full h-48 md:h-64 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 md:h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                            <Package className="w-20 h-20 md:w-24 md:h-24 text-orange-400" />
                          </div>
                        )}
                        <div className="p-6 md:p-8">
                          <h3 className="text-lg md:text-2xl font-bold text-orange-800 mb-3 line-clamp-2">{donation.title}</h3>
                          <p className="text-gray-700 mb-4 text-sm md:text-base">
                            Expires: {new Date(donation.expiry_date).toLocaleDateString()}
                          </p>
                          <div className="bg-green-100 text-green-800 px-4 py-2 md:px-6 md:py-3 rounded-full text-center font-bold text-sm md:text-base">
                            Active & Available
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Completed Donations */}
                {completedDonations.length > 0 && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 text-center">
                      Completed Donations ❤️
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {completedDonations.map((donation) => (
                        <div key={donation.id} className="bg-gray-100 rounded-3xl p-6 md:p-8 text-center opacity-90 shadow-lg">
                          <Package className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
                          <p className="text-base md:text-xl font-bold text-gray-700 mb-2 line-clamp-2">{donation.title}</p>
                          <p className="text-green-600 font-semibold text-sm md:text-lg">
                            Successfully Delivered ❤️
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Badges Showcase — PERFECTLY RESPONSIVE & BEAUTIFUL */}
          <div className="relative bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 overflow-hidden">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-800 flex items-center justify-center gap-3 md:gap-4">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-500 animate-pulse" />
                Your Achievement Badges
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-purple-700 mt-3 md:mt-4">
                Celebrate every milestone on your kindness journey!
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {tracker.badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.08, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative text-center p-4 sm:p-6 md:p-8 rounded-3xl transition-all duration-500 overflow-hidden
           min-h-[260px] sm:min-h-[300px] md:min-h-[340px]
           flex flex-col justify-between ${badge.unlocked
                      ? "bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 shadow-2xl"
                      : "bg-gray-100/80 shadow-inner opacity-70"
                    }`}
                >
                  {/* Golden Sparkle Corner */}
                  {badge.unlocked && (
                    <div className="absolute -top-3 -right-3">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-xl opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl md:text-4xl">✨</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Badge Icon with gentle bounce */}
                    <motion.div
                      animate={badge.unlocked ? { y: [0, -6, 0] } : {}}
                      transition={{ repeat: badge.unlocked ? Infinity : 0, duration: 2 }}
                      className="mb-4 md:mb-6"
                    >
                      <Award
                        className={`mx-auto drop-shadow-lg ${badge.unlocked
                            ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-yellow-600"
                            : "w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 text-gray-400"
                          }`}
                      />
                    </motion.div>

                    {/* Title */}
                    <h4 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2
               line-clamp-2 break-words px-2">
                      {badge.title}
                    </h4>


                    {/* Points */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4">
                      {badge.threshold} points
                    </p>
                  </div>

                  {/* Status — RESPONSIVE TEXT SIZE */}
                  {badge.unlocked ? (
                    <div className="mt-3 md:mt-4">
                      <p className="font-extrabold text-green-600 animate-pulse
              text-base sm:text-lg md:text-xl lg:text-2xl
              tracking-wide">
                        UNLOCKED
                      </p>

                      <p className="text-2xl sm:text-3xl md:text-4xl mt-1 md:mt-2">🎉✨</p>
                    </div>
                  ) : (
                    <div className="mt-3 md:mt-4 border-2 border-dashed border-gray-400 rounded-2xl py-3 px-2">
                      <p className="text-gray-500 font-medium
              text-[11px] sm:text-sm md:text-base
              leading-snug sm:leading-relaxed
              break-words">
                        Keep donating!<br />
                        <span className="block mt-1 text-orange-600 font-bold text-sm sm:text-base">
                          {badge.threshold - tracker.points} points needed
                        </span>

                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Subtle Background Sparkles */}
            <div className="absolute inset-0 pointer-events-none opacity-15">
              <div className="absolute top-8 left-8 text-5xl sm:text-6xl">✨</div>
              <div className="absolute bottom-12 right-12 text-4xl sm:text-5xl">🌟</div>
              <div className="absolute top-1/2 left-1/4 text-4xl">💫</div>
              <div className="absolute bottom-1/3 right-1/3 text-3xl sm:text-4xl">⭐</div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}