// src/pages/Admin/Dashboard.tsx — PROFESSIONAL & EMOTIONAL IMPACT OVERVIEW
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ← FIXED: Import motion
import {
  Users,
  Package,
  Truck,
  TrendingUp,
  Trophy,
  Clock,
  Heart,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Stats {
  totalUsers: number;
  totalDonors: number;
  totalVolunteers: number;
  totalReceivers: number;
  totalDonations: number;
  pendingDonations: number;
  claimedDonations: number;
  deliveredDonations: number;
  wastedDonations: number;
  todayDonations: number;
}

interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
  type: "donation" | "claim" | "delivery" | "user";
}

interface TopDonor {
  rank: number;
  name: string;
  donations: number;
  points: number;
}

// FIXED: Allow arbitrary keys for Recharts compatibility
interface RoleDistribution {
  [key: string]: any; // name, value, color
}

interface DonationTrend {
  name: string;
  donations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [donationTrend, setDonationTrend] = useState<DonationTrend[]>([]);
  const [roleDistribution, setRoleDistribution] = useState<RoleDistribution[]>([]);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/dashboard");
        const data = res.data;

        setStats(data.stats);
        setDonationTrend(data.donationTrend);
        setRoleDistribution(data.roleDistribution);
        setTopDonors(data.topDonors);
        setRecentActivity(data.recentActivity);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading impact overview...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Images */}
          {/* Hero Images — Updated & Beautiful */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl overflow-hidden shadow-3xl mb-16 border-8 border-white"
          >
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4753-scaled.jpg"
              alt="Volunteer delivering food packages to a grateful family in Sri Lanka"
              className="w-full h-80 object-cover"
            />
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4742-scaled.jpg"
              alt="Community members receiving essential food aid with smiles"
              className="w-full h-80 object-cover"
            />
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="Vibrant and delicious traditional Sri Lankan rice and curry spread"
              className="w-full h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-orange-800 mb-6">
              Impact You're Creating Today ❤️
            </h1>
            <p className="text-2xl text-orange-700">
              Every donation, every delivery — changing lives across Sri Lanka
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-rose-200">
              <Users className="w-20 h-20 text-rose-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Total Users</p>
              <p className="text-5xl font-extrabold text-rose-800">{stats?.totalUsers || 0}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-orange-200">
              <Package className="w-20 h-20 text-orange-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Total Donations</p>
              <p className="text-5xl font-extrabold text-orange-800">{stats?.totalDonations || 0}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-green-200">
              <Truck className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Delivered Meals</p>
              <p className="text-5xl font-extrabold text-green-800">{stats?.deliveredDonations || 0}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-8 border-amber-200">
              <TrendingUp className="w-20 h-20 text-amber-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700 mb-2">Today's Donations</p>
              <p className="text-5xl font-extrabold text-amber-800">{stats?.todayDonations || 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center">
                Donation Trend (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="donations" stroke="#f43f5e" strokeWidth={4} dot={{ fill: '#f43f5e', r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center">
                Community Role Distribution
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Donors & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center flex items-center justify-center gap-4">
                <Trophy className="w-12 h-12 text-amber-600" />
                Top Kindness Champions
              </h3>
              <div className="space-y-6">
                {topDonors.map((donor) => (
                  <div key={donor.rank} className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${donor.rank === 1 ? "bg-amber-500" :
                          donor.rank === 2 ? "bg-gray-400" :
                            "bg-orange-600"
                        }`}>
                        {donor.rank}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-800">{donor.name}</p>
                        <p className="text-lg text-gray-700">{donor.donations} donations</p>
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-rose-600">{donor.points} pts</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-3xl font-bold text-orange-800 mb-8 text-center flex items-center justify-center gap-4">
                <Clock className="w-12 h-12 text-orange-600" />
                Recent Kindness Acts
              </h3>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-6 p-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl shadow-lg">
                    <Heart className={`w-10 h-10 mt-1 ${activity.type === "donation" ? "text-rose-600" :
                        activity.type === "claim" ? "text-orange-600" :
                          activity.type === "delivery" ? "text-green-600" :
                            "text-blue-600"
                      }`} />
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-800">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.div className="bg-orange-800 text-white rounded-3xl p-16 text-center shadow-2xl">
            <img
              src="https://i0.wp.com/theperfectcurry.com/wp-content/uploads/2024/10/sri-lankan-rice-and-curry-with-sri-lankan-sides.png"
              alt="Beautiful Sri Lankan rice and curry — shared with love"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              Together, we're reducing food waste and feeding families across Sri Lanka
            </p>
            <p className="text-2xl opacity-80">
              Every donation, every delivery — a story of kindness
            </p>
            <div className="mt-12 text-8xl">🍲🙏✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}