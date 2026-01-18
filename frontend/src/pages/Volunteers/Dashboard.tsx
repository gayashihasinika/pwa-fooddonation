import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Truck, Users, Leaf, Package, Award } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* Mock Data */
const deliveryData = [
  { week: "Week 1", deliveries: 5 },
  { week: "Week 2", deliveries: 8 },
  { week: "Week 3", deliveries: 6 },
  { week: "Week 4", deliveries: 10 },
];

const leaderboard = [
  { name: "Gayashi", deliveries: 24 },
  { name: "Nimal", deliveries: 19 },
  { name: "Kavindu", deliveries: 15 },
];

export default function VolunteerDashboard() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-orange-800">
          Volunteer Dashboard
        </h1>

        {/* Motivation Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold">
            Thank you for making a difference ❤️
          </h2>
          <p className="mt-2 text-sm opacity-90">
            Your efforts reduce food waste and uplift communities across Sri Lanka.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Truck />} title="Deliveries Completed" value="24" />
          <StatCard icon={<Package />} title="Food Rescued" value="120 meals" />
          <StatCard icon={<Users />} title="People Helped" value="85" />
          <StatCard icon={<Leaf />} title="CO₂ Saved" value="48 kg" />
        </div>

        {/* Charts + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">
              Monthly Delivery Activity
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#EA580C" /* orange-600 */
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">
              Monthly Summary
            </h3>
            <ul className="space-y-3 text-orange-800">
              <li>✅ 24 successful deliveries</li>
              <li>🍱 120 meals delivered</li>
              <li>👨‍👩‍👧‍👦 85 people supported</li>
              <li>🌍 48 kg CO₂ emissions saved</li>
            </ul>
          </div>
        </div>

        {/* Badges + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badges */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" />
              Your Badges
            </h3>

            <div className="flex gap-4 flex-wrap">
              <Badge label="First Delivery" />
              <Badge label="10+ Deliveries" />
              <Badge label="Eco Hero" />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">
              Volunteer Leaderboard
            </h3>

            <ul className="space-y-3">
              {leaderboard.map((v, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-orange-50 p-3 rounded-xl"
                >
                  <span className="font-medium text-orange-800">
                    {index + 1}. {v.name}
                  </span>
                  <span className="text-orange-700 font-bold">
                    {v.deliveries} deliveries
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

/* Stat Card */
function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition">
      <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-orange-600">{title}</p>
        <p className="text-2xl font-bold text-orange-800">{value}</p>
      </div>
    </div>
  );
}

/* Badge */
function Badge({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold text-sm">
      🏅 {label}
    </span>
  );
}
