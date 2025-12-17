// src/pages/Admin/Gamification/DonorsEarned.tsx — EMOTIONAL & FULLY RESPONSIVE
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Trophy, Calendar, Star, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface EarnedBadge {
  id: number;
  donor_name: string;
  badge_title: string;
  points: number;
  earned_at: string;
}

export default function DonorsEarned() {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/gamification/earned")
      .then((res) => setEarnedBadges(res.data.earned_badges || []))
      .catch(() => setEarnedBadges([]))
      .finally(() => setLoading(false));
  }, []);

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
              alt="Donor celebrating badge"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2071"
              alt="Achievement badges sparkling"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1557804506-669a6e9220c2?q=80&w=2074"
              alt="Community celebrating generosity"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Celebrating Our Generous Donors ✨
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Every badge earned is a story of kindness ({earnedBadges.length} achievements)
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-32">
              <Sparkles className="w-32 h-32 text-orange-300 mx-auto mb-8 animate-pulse" />
              <p className="text-3xl text-orange-700">Loading achievements...</p>
            </div>
          ) : earnedBadges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Trophy className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Badges Earned Yet</p>
              <p className="text-2xl text-gray-700 px-8">
                As donors give more, their achievements will shine here!
              </p>
              <p className="text-xl text-orange-600 mt-8">Every donation starts the journey 🙏</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-100 to-amber-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Donor</th>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Badge Earned</th>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Points</th>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Earned On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {earnedBadges.map((b) => (
                      <tr key={b.id} className="hover:bg-orange-50 transition">
                        <td className="px-8 py-6">
                          <p className="font-bold text-xl text-orange-900">{b.donor_name}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-xl text-orange-800 flex items-center gap-3">
                            <Star className="w-8 h-8 text-yellow-500" />
                            {b.badge_title}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-3xl font-extrabold text-orange-700">{b.points}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="flex items-center gap-3 text-gray-700">
                            <Calendar className="w-6 h-6" />
                            {format(new Date(b.earned_at), "dd MMM yyyy")}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-8">
                {earnedBadges.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-orange-100"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-6 shadow-xl">
                        <Trophy className="w-16 h-16" />
                      </div>
                      <h3 className="text-3xl font-bold text-orange-800">{b.badge_title}</h3>
                    </div>

                    <div className="space-y-6 text-lg">
                      <div className="text-center">
                        <p className="text-gray-600 font-medium">Celebrating Donor</p>
                        <p className="text-2xl font-bold text-orange-900 mt-2">{b.donor_name}</p>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <Star className="w-10 h-10 text-yellow-500" />
                        <div>
                          <p className="text-gray-600 font-medium">Points Earned</p>
                          <p className="text-4xl font-extrabold text-orange-700">{b.points}</p>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <Calendar className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-gray-600 font-medium">Earned On</p>
                          <p className="text-xl font-bold text-orange-800">
                            {format(new Date(b.earned_at), "dd MMMM yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a6e9220c2?q=80&w=2074"
              alt="Community celebrating donor achievements"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka Achievements ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              Every badge celebrates a donor's kindness
            </p>
            <p className="text-2xl opacity-80">
              Together, we're inspiring more generosity
            </p>
            <div className="mt-12 text-8xl">🏆✨🙏</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}