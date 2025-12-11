// src/pages/Admin/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Truck,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Calendar,
  Clock,
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

interface RoleDistribution {
  name: string;
  value: number;
  color: string;
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

  // Fetch dashboard data from backend
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
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in Feed SriLanka today.</p>
        </div>

        {/* Stats Grid */}
        {loading || !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-rose-500" />
            <StatCard icon={Package} label="Total Donations" value={stats.totalDonations} color="bg-orange-500" />
            <StatCard icon={Truck} label="Successful Deliveries" value={stats.deliveredDonations} color="bg-amber-500" />
            <StatCard icon={TrendingUp} label="Today's Donations" value={stats.todayDonations} color="bg-green-500" />

            <StatCard icon={Users} label="Active Donors" value={stats.totalDonors} color="bg-pink-500" />
            <StatCard icon={Users} label="Volunteers" value={stats.totalVolunteers} color="bg-yellow-600" />
            <StatCard icon={AlertTriangle} label="Pending Approval" value={stats.pendingDonations} color="bg-red-500" />
            <StatCard icon={Trophy} label="Food Saved (kg)" value="1,240" color="bg-emerald-500" />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donation Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-rose-500" />
              Donation Trend (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="donations" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Role Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">User Role Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
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

        {/* Bottom Row: Top Donors + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Donors */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="text-amber-500" />
              Top Donors This Month
            </h3>
            <div className="space-y-4">
              {topDonors.map((donor) => (
                <div key={donor.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        donor.rank === 1 ? "bg-amber-500" :
                        donor.rank === 2 ? "bg-gray-400" :
                        "bg-orange-600"
                      }`}
                    >
                      {donor.rank}
                    </div>
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-gray-500">{donor.donations} donations</p>
                    </div>
                  </div>
                  <p className="font-bold text-rose-600">{donor.points} pts</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-rose-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "donation" ? "bg-rose-500" :
                      activity.type === "claim" ? "bg-orange-500" :
                      activity.type === "delivery" ? "bg-green-500" :
                      "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
