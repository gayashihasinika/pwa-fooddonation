// src/pages/Admin/Gamification/CompletedChallenges.tsx — EMOTIONAL & FULLY RESPONSIVE
import { useEffect, useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Trophy, Calendar, Users, Search, Award, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface CompletedChallenge {
  id: number;
  donor_name: string;
  challenge_title: string;
  points_reward: number;
  completed_at: string;
}

export default function CompletedChallenges() {
  const [items, setItems] = useState<CompletedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDonor, setFilterDonor] = useState("");

  useEffect(() => {
    api
      .get("/admin/challenge-progress")
      .then((res) => setItems(res.data.completed_challenges || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const donors = [...new Set(items.map((i) => i.donor_name))];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.challenge_title.toLowerCase().includes(search.toLowerCase()) ||
        item.donor_name.toLowerCase().includes(search.toLowerCase());

      const matchesDonor = filterDonor ? item.donor_name === filterDonor : true;

      return matchesSearch && matchesDonor;
    });
  }, [items, search, filterDonor]);

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
              alt="Donor celebrating achievement"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://www.zakat.org/img/asset/cHVibGljLzIwMjUvMDIvc3JpbGFua2EtanVtYm90cm9uLWNvcHkuanBn/srilanka-jumbotron-copy.jpg?w=960&h=540&fit=crop-45-26-1&fm=webp&q=60&filt=0&s=ba1f8600c7004d733f9060e4179fcf1a"
              alt="Food distribution celebration"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src="https://thumbs.dreamstime.com/b/traditional-sri-lankan-rice-curry-delight-lanka-food-photography-vibrant-colors-close-up-culinary-art-plate-showcases-367913327.jpg"
              alt="Traditional Sri Lankan meal"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Celebrating Donor Achievements ❤️
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Every completed challenge brings more meals to families ({filteredItems.length} achievements)
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center border-8 border-white"
            >
              <Award className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <p className="text-5xl font-extrabold text-orange-700">{items.length}</p>
              <p className="text-xl text-gray-700 mt-2">Completed Challenges</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center border-8 border-white"
            >
              <Users className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <p className="text-5xl font-extrabold text-amber-700">{donors.length}</p>
              <p className="text-xl text-gray-700 mt-2">Generous Donors</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center border-8 border-white"
            >
              <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-5xl font-extrabold text-yellow-700">
                {items.reduce((sum, i) => sum + i.points_reward, 0)}
              </p>
              <p className="text-xl text-gray-700 mt-2">Total Points Awarded</p>
            </motion.div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-12 border-8 border-white">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search by donor or challenge..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                />
              </div>

              <select
                value={filterDonor}
                onChange={(e) => setFilterDonor(e.target.value)}
                className="px-8 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-orange-500 text-lg"
              >
                <option value="">All Donors</option>
                {donors.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-32">
              <Sparkles className="w-32 h-32 text-orange-300 mx-auto mb-8 animate-pulse" />
              <p className="text-3xl text-orange-700">Loading achievements...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Trophy className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Achievements Yet</p>
              <p className="text-2xl text-gray-700 px-8">
                When donors complete challenges, their achievements will shine here!
              </p>
              <p className="text-xl text-orange-600 mt-8">Every completion feeds a family 🙏</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-100 to-amber-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Donor</th>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Challenge Completed</th>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Points Earned</th>
                      <th className="px-8 py-6 text-left text-lg font-bold text-orange-800">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems.map((c) => (
                      <tr key={c.id} className="hover:bg-orange-50 transition">
                        <td className="px-8 py-6">
                          <p className="font-bold text-xl text-orange-900">{c.donor_name}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-xl text-orange-800 flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                            {c.challenge_title}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-3xl font-extrabold text-orange-700">{c.points_reward} pts</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="flex items-center gap-3 text-gray-700">
                            <Calendar className="w-6 h-6" />
                            {format(new Date(c.completed_at), "dd MMM yyyy")}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-8">
                {filteredItems.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-orange-100"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-6 shadow-xl">
                        <Trophy className="w-16 h-16" />
                      </div>
                      <h3 className="text-3xl font-bold text-orange-800">{c.challenge_title}</h3>
                    </div>

                    <div className="space-y-6 text-lg">
                      <div className="text-center">
                        <p className="text-gray-600 font-medium">Celebrating Donor</p>
                        <p className="text-2xl font-bold text-orange-900 mt-2">{c.donor_name}</p>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <Award className="w-10 h-10 text-yellow-600" />
                        <div>
                          <p className="text-gray-600 font-medium">Points Earned</p>
                          <p className="text-4xl font-extrabold text-orange-700">{c.points_reward}</p>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <Calendar className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-gray-600 font-medium">Completed On</p>
                          <p className="text-xl font-bold text-orange-800">
                            {format(new Date(c.completed_at), "dd MMMM yyyy")}
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
              src="https://c8.alamy.com/comp/G5JP7N/rice-and-curry-sri-lankan-cuisine-G5JP7N.jpg"
              alt="Traditional Sri Lankan rice and curry shared with love"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka Achievements ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              Every completed challenge feeds more families
            </p>
            <p className="text-2xl opacity-80">
              Thank you for celebrating donor dedication
            </p>
            <div className="mt-12 text-8xl">🏆🍲🙏</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}